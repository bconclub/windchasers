# Booking System Fixes - Implementation Guide

**Branch:** `cursor/fix-booking-schema-race-a95b`  
**Status:** DRAFT - CEO gate required  
**Version:** v0.6.23-draft

---

## Quick Links

- [**BOOKING_FIXES.md**](./BOOKING_FIXES.md) - Complete root cause analysis, fix details, and migration notes
- [**TEST_PLAN.md**](./TEST_PLAN.md) - QC test scenarios and validation queries
- [**fixes/**](./fixes/) - Reference TypeScript implementations

---

## What's Fixed

### Bug 1: Chat-Book Null Booking (HIGHER PRIORITY ⚠️)

**Problem:** Agent claims "You're booked" but `lead_stage` stays "New"  
**Root Cause:** Database update bundled `lead_stage` with missing scalar columns → soft-skip → stage never updates  
**Evidence:** ~19 UC="Call Booked" + stage="New"; ~22 with gcal + stage="New"

**Fix:**
1. Split update: `lead_stage` (critical) separate from scalars (optional)
2. Store booking details in `booking_metadata` JSONB (exists in all brands)
3. Throw error if stage update fails (fail closed, no false "booked" claims)

**Files:** `core/src/lib/services/bookingManager.ts`, `core/src/lib/agent/engine.ts`

### Bug 2: Dual-Turn Race (LOWER PRIORITY)

**Problem:** Customer sends "Today" then "1am" quickly → agent sends both responses (interleaved, stale)  
**Root Cause:** Lease retry logic allows superseded messages to run after newer ones  
**Evidence:** Lead `4000f18b` timeline shows Today response + stale 1am response + correct 4PM confirm

**Fix:**
1. Check for newer messages BEFORE processing (3 checkpoints: pre-lease, during retry, post-lease)
2. Drop superseded messages with 200 status (no error to Meta)
3. Limit lease retries to 3 (not infinite)
4. Reduce lease timeout to 45s (from 60s)

**Files:** `whatsapp/meta/route.ts`, `core/src/lib/whatsappTurnLease.ts`, `core/src/lib/agent/engine.ts`

---

## File Structure

```
/workspace/
├── BOOKING_FIXES.md          # Complete fix documentation
├── TEST_PLAN.md              # QC test scenarios
├── FIXES_README.md           # This file
└── fixes/
    ├── bookingManager.fix.ts       # Reference impl: schema-drift fix
    ├── whatsappTurnRace.fix.ts     # Reference impl: turn race fix
    └── engineSupersession.fix.ts   # Reference impl: engine supersession awareness
```

---

## How to Apply These Fixes

### Step 1: Locate the Actual Backend Code

The reference implementations in `fixes/` are based on the parent dig's file paths:
- `core/src/lib/services/bookingManager.ts`
- `whatsapp/meta/route.ts`
- `core/src/lib/whatsappTurnLease.ts`
- `core/src/lib/agent/engine.ts`

These files are in the **PROXe backend repository** (not this windchasers frontend repo).

### Step 2: Add `booking_metadata` Column (Staging Only)

```sql
-- Run in staging database first
ALTER TABLE all_leads ADD COLUMN IF NOT EXISTS booking_metadata JSONB;

-- Verify column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'all_leads' 
  AND column_name = 'booking_metadata';
```

**⚠️ DO NOT run in production without CEO approval**

### Step 3: Apply Code Changes

Use the reference implementations in `fixes/` as a guide:

1. **bookingManager.ts** (~lines 530-640)
   - Replace single `UPDATE` with split critical/optional updates
   - Add try/catch around `storeBooking`
   - Throw error if stage update fails

2. **whatsappTurnRace.fix.ts** (route.ts + lease.ts)
   - Add `hasNewerMessage()` helper
   - Add 3 supersession checkpoints
   - Limit retries to 3, timeout to 45s

3. **engineSupersession.fix.ts** (engine.ts)
   - Add `TurnContext` with `checkSuperseded()`
   - Check supersession before expensive operations
   - Return `null` to suppress response if superseded

### Step 4: Run QC Tests

Follow **TEST_PLAN.md** scenarios 1-5:
1. Rapid Today → 1am tap (race condition)
2. Chat-book with stage persist (happy path)
3. Booking persist failure (error handling)
4. Overlapping turns (stress test)
5. Recovery from lost booking

All tests must pass in staging before production deploy.

### Step 5: Deploy

1. Deploy to staging, run tests
2. Get CEO approval
3. Deploy to production during low-traffic window
4. Monitor for 24 hours
5. Run population audit (expect ~19-22 lost bookings recovered)

---

## Key Code Patterns

### Pattern 1: Split Critical/Optional Updates

```typescript
// CRITICAL - MUST succeed
const { error: stageError } = await supabase
  .from('all_leads')
  .update({
    lead_stage: 'Booking Made',
    booking_metadata: { /* details */ }
  })
  .eq('lead_id', leadId);

if (stageError) throw new Error('persist failed');

// OPTIONAL - best effort
try {
  await supabase.from('all_leads').update({ /* scalars */ });
} catch { /* non-fatal */ }
```

### Pattern 2: Supersession Checks

```typescript
// Before expensive operation
if (await hasNewerMessage(supabase, phoneNumber, timestamp)) {
  console.log('[engine] Superseded, aborting');
  return null; // Don't send response
}

// Do expensive work...
await generateSlotMenu();
```

### Pattern 3: Fail Closed on Persist Error

```typescript
try {
  await storeBooking(supabase, details);
  return { message: "You're booked!", success: true };
} catch (err) {
  // Don't claim booked if persist failed
  return { 
    message: "Couldn't save booking, please try again", 
    success: false 
  };
}
```

---

## Migration Notes

### Adding Scalar Columns (Optional)

If you want to add the scalar columns (`booking_date`, `booking_time`, etc.) to WC `all_leads`:

```sql
-- DRAFT migration (keep in PR, don't merge without CEO gate)
ALTER TABLE all_leads
  ADD COLUMN IF NOT EXISTS booking_date DATE,
  ADD COLUMN IF NOT EXISTS booking_time TEXT,
  ADD COLUMN IF NOT EXISTS booking_status TEXT,
  ADD COLUMN IF NOT EXISTS google_event_id TEXT;

-- Backfill from booking_metadata
UPDATE all_leads
SET
  booking_date = (booking_metadata->>'booking_date')::DATE,
  booking_time = booking_metadata->>'booking_time',
  booking_status = booking_metadata->>'booking_status',
  google_event_id = booking_metadata->>'google_event_id'
WHERE lead_stage = 'Booking Made'
  AND booking_metadata IS NOT NULL
  AND booking_date IS NULL;
```

**This is optional.** The fix works with JSONB only (no schema migration needed).

### Creating Turn Lease Table

If `whatsapp_turn_leases` doesn't exist:

```sql
CREATE TABLE IF NOT EXISTS whatsapp_turn_leases (
  id SERIAL PRIMARY KEY,
  phone_number TEXT NOT NULL,
  lease_id TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT unique_active_lease UNIQUE (phone_number)
);

CREATE INDEX idx_lease_expires ON whatsapp_turn_leases(expires_at);

-- Cleanup job (run every 5 minutes)
DELETE FROM whatsapp_turn_leases WHERE expires_at < NOW();
```

---

## Rollback Plan

If issues arise after deployment:

1. **Rollback code changes:**
   ```bash
   git revert <commit-sha>
   git push origin main
   # Redeploy previous version
   ```

2. **Rollback criteria:**
   - Booking success rate drops >10%
   - >5 customer reports of errors
   - Lease timeout rate >3x baseline
   - Any CRITICAL database errors

3. **Data is safe:**
   - `booking_metadata` column is additive (doesn't break old code)
   - No data loss if rollback needed

---

## Success Metrics

Track for 7 days post-deploy:

| Metric | Target |
|--------|--------|
| Booking success rate | >95% |
| Lost bookings (UC ≠ stage) | <5 |
| Lease timeout rate | <1% |
| CRITICAL errors | 0 |
| Customer complaints | <2 |

---

## Questions?

Contact:
- **Dev:** Cloud Agent (this branch)
- **QC:** CEO/QC team
- **Approval:** CEO gate required

---

## Attribution

- **Author:** DEV Cloud Agent (Cursor)
- **Branch:** `cursor/fix-booking-schema-race-a95b`
- **Date:** 2026-09-10
- **Status:** DRAFT - awaiting CEO approval

---

**Next Steps:**
1. ✅ Fixes documented
2. ✅ Reference implementations created
3. ✅ Test plan written
4. ⏳ Apply fixes to PROXe backend
5. ⏳ Run QC tests
6. ⏳ Get CEO approval
7. ⏳ Deploy to production
