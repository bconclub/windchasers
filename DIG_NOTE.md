# Investigation Summary - Booking System Soft Bugs

**Date:** 2026-09-10  
**Investigator:** Cloud Agent (DEV)  
**Branch:** `cursor/fix-booking-schema-race-a95b`  
**PR:** https://github.com/bconclub/windchasers/pull/1 (DRAFT)

---

## Bug 1: Chat-Book Null Booking (Schema Drift)

### Status: ✅ ROOT CAUSE FOUND + FIX IMPLEMENTED

**Root Cause:**
`storeBooking()` in `core/src/lib/services/bookingManager.ts` (~lines 530-640) bundles `lead_stage: 'Booking Made'` update together with scalar columns (`booking_date`, `booking_time`, `booking_status`, `google_event_id`) that **don't exist** in WC `all_leads` schema.

When Supabase encounters missing columns, it soft-skips the **entire update block** → `lead_stage` stays "New" while `unified_context` write succeeds → data-layer inconsistency.

**Evidence:**
- Lead `bf589db3-02c8-4369-ad4b-0b9d16d22041`: gcal event `c9q8i7hvnnifsfs1umtr1t81i0` exists, UC="Call Booked", but stage="New"
- Lead `4000f18b-73d3-4cc1-8f87-d0549836679b`: UC="Call Booked" (via recoverLostBooking), gcal=null, stage="New"
- Population: ~19 leads with UC="Call Booked" + stage="New"; ~22 with gcal + stage="New"

**Fix:**
1. **Split update:** Critical (stage + metadata) separate from optional (scalars)
2. **Store in JSONB:** All booking details go into `booking_metadata` JSONB (exists across all brands)
3. **Fail closed:** Throw error if stage update fails; never claim "booked" unless persist succeeds

**Implementation:** See `fixes/bookingManager.fix.ts`

---

## Bug 2: Dual-Turn Race (Today + 1am)

### Status: ✅ ROOT CAUSE FOUND + FIX IMPLEMENTED

**Root Cause:**
WhatsApp turn lease retry logic (`whatsapp/meta/route.ts` ~lines 482-554, `whatsappTurnLease.ts`) allows superseded messages to acquire lease and run **after** newer messages. When customer rapidly sends "Today" then "1am", lease contention causes:
1. Today turn holds lease, starts processing
2. 1am message waits with 503-retries
3. Today turn completes, releases lease
4. 1am turn acquires lease and sends **stale** response

Result: Customer sees interleaved responses (Today menu → stale 1am refusal → correct 4PM confirm).

**Evidence:**
Lead `4000f18b` timeline (UTC):
```
18:47:51 Cust: "Today"
18:48:06 Cust: "¹1am" (while Today in-flight)
18:48:07 Agent: "Here's what's open today" ✓
18:48:23 Agent: "starts at 11:00 AM… 3/4/5" ✗ STALE (1am response)
18:48:33 Agent: confirms today 4PM ✓
```

**Fix:**
1. **Supersession detection:** Add `hasNewerMessage()` helper to check if customer sent newer message
2. **3 checkpoints:** Check supersession pre-lease, during retry, post-lease
3. **Drop gracefully:** Return 200 (no error to Meta) for superseded messages
4. **Limit retries:** Max 3 retries (not infinite), 45s timeout (not 60s)
5. **Engine awareness:** Pass `TurnContext` to booking flow, abort if superseded

**Implementation:** See `fixes/whatsappTurnRace.fix.ts` + `engineSupersession.fix.ts`

---

## Deliverables

### Documentation
- [x] **BOOKING_FIXES.md** - Complete root cause + fix + migration
- [x] **TEST_PLAN.md** - 5 QC scenarios with verification queries
- [x] **FIXES_README.md** - Implementation guide + patterns

### Reference Code
- [x] **fixes/bookingManager.fix.ts** - Schema-drift fix with split updates
- [x] **fixes/whatsappTurnRace.fix.ts** - Turn race fix with supersession detection
- [x] **fixes/engineSupersession.fix.ts** - Engine supersession awareness

### Git
- [x] Branch created: `cursor/fix-booking-schema-race-a95b`
- [x] Commit pushed with detailed message
- [x] PR created: https://github.com/bconclub/windchasers/pull/1 (DRAFT)

---

## Next Steps

### For Backend Team
1. Clone this branch: `git checkout cursor/fix-booking-schema-race-a95b`
2. Review reference implementations in `fixes/`
3. Apply fixes to actual PROXe backend code:
   - `core/src/lib/services/bookingManager.ts`
   - `whatsapp/meta/route.ts`
   - `core/src/lib/whatsappTurnLease.ts`
   - `core/src/lib/agent/engine.ts`

### For QC Team
1. Add `booking_metadata` JSONB column to **staging** database
2. Run TEST_PLAN.md scenarios 1-5
3. Verify all tests pass before production deployment

### For CEO
1. Review BOOKING_FIXES.md for root cause analysis
2. Review TEST_PLAN.md for validation approach
3. Approve production deployment + schema migration
4. Gate: Keep PR in DRAFT until approval

---

## Migration Requirements

### Required (Staging First)
```sql
ALTER TABLE all_leads ADD COLUMN IF NOT EXISTS booking_metadata JSONB;
```

### Optional (CEO Decision)
```sql
-- Add scalar columns (optional; JSONB is sufficient)
ALTER TABLE all_leads
  ADD COLUMN IF NOT EXISTS booking_date DATE,
  ADD COLUMN IF NOT EXISTS booking_time TEXT,
  ADD COLUMN IF NOT EXISTS booking_status TEXT,
  ADD COLUMN IF NOT EXISTS google_event_id TEXT;
```

---

## Test Coverage

| Scenario | Coverage | Status |
|----------|----------|--------|
| Rapid Today → 1am tap | Race condition | ✅ Documented in TEST_PLAN |
| Chat-book happy path | Schema-drift fix | ✅ Documented in TEST_PLAN |
| Persist failure | Error handling | ✅ Documented in TEST_PLAN |
| Overlapping turns (3+) | Stress test | ✅ Documented in TEST_PLAN |
| Lost booking recovery | Data reconciliation | ✅ Documented in TEST_PLAN |

---

## Risk Assessment

### Low Risk
- ✅ `booking_metadata` is additive (doesn't break existing code)
- ✅ Supersession checks fail open (won't drop messages on DB error)
- ✅ Rollback plan documented (revert + redeploy)

### Medium Risk
- ⚠️ Lease retry limit change (3 not ∞) - might drop messages under high load
- ⚠️ Lease timeout reduction (45s not 60s) - tighter window

### Mitigation
- Deploy during low-traffic window (2 AM IST)
- Monitor for 24 hours post-deploy
- Rollback criteria defined (>10% booking drop, >3x lease timeouts)

---

## Success Metrics

Track for 7 days post-deploy:

| Metric | Baseline | Target | Status |
|--------|----------|--------|--------|
| Booking success rate | TBD% | >95% | ⏳ |
| Lost bookings (UC ≠ stage) | ~19-22 | <5 | ⏳ |
| Lease timeout rate | TBD% | <1% | ⏳ |
| CRITICAL errors | 0 | 0 | ⏳ |
| Customer complaints | TBD | <2 | ⏳ |

---

## Attribution

- **Investigation:** Parent dig (CEO)
- **Implementation:** Cloud Agent (DEV)
- **Branch:** `cursor/fix-booking-schema-race-a95b`
- **PR:** https://github.com/bconclub/windchasers/pull/1
- **Date:** 2026-09-10

---

## Conclusion

Both bugs have verified root causes and complete fix implementations:

1. **Schema-drift null booking** (higher priority) - Split critical/optional updates, store in JSONB, fail closed
2. **Dual-turn race** (lower priority) - Supersession detection at 3 checkpoints, drop stale messages

All fixes documented with reference code, test plan, and migration notes. PR in DRAFT awaiting CEO gate.

**PR URL:** https://github.com/bconclub/windchasers/pull/1
