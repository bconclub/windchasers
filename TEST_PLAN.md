# Test Plan: Booking System Fixes

**Version:** v0.6.23-draft  
**Branch:** `cursor/fix-booking-schema-race-a95b`  
**Status:** Ready for QC

---

## Pre-Test Setup

### 1. Environment Preparation

- [ ] Deploy fixes to **staging environment** (not production)
- [ ] Verify `booking_metadata` JSONB column exists:
  ```sql
  SELECT column_name, data_type 
  FROM information_schema.columns 
  WHERE table_name = 'all_leads' 
    AND column_name = 'booking_metadata';
  ```
- [ ] If missing, add it:
  ```sql
  ALTER TABLE all_leads ADD COLUMN booking_metadata JSONB;
  ```

### 2. Test Phone Numbers

Use **test phone numbers** that won't affect real customers:
- Test number 1: `+91-9999900001` (for scenario 1-3)
- Test number 2: `+91-9999900002` (for scenario 4)

### 3. Monitoring Setup

Before testing, open these monitoring views:
- [ ] Database query console (to verify lead_stage updates)
- [ ] Server logs (to watch for CRITICAL errors)
- [ ] WhatsApp Business API logs (to see message flow)

---

## Test Scenario 1: Rapid Today → 1am Tap (Race Condition)

**Goal:** Verify that superseded messages are dropped, no stale responses sent.

### Steps

1. **Send "Today" message**
   - Action: Customer taps "Today" button in WhatsApp
   - Expected: Agent starts processing (lease acquired)

2. **IMMEDIATELY send "1am" message** (within 2 seconds)
   - Action: Customer types "1am" and sends before agent responds
   - Expected: 
     - "1am" message waits for lease (Today turn holds it)
     - "1am" message detects it's superseded (Today response sent)
     - "1am" message is dropped, no response sent

3. **Verify agent responses**
   - ✅ ONE response: "Here's what's available today: 3pm, 4pm, 5pm"
   - ❌ NO second response about "1am not available"

### Success Criteria

| Check | Expected | Actual | Pass/Fail |
|-------|----------|--------|-----------|
| Today slot menu sent | ✅ Yes | | |
| 1am refusal sent | ❌ No | | |
| Responses in order | ✅ Only Today menu | | |
| Lease released | ✅ Yes | | |
| No errors in logs | ✅ Clean | | |

### Verification Queries

```sql
-- Check message flow
SELECT timestamp, direction, text, status
FROM whatsapp_messages
WHERE phone_number = '+919999900001'
  AND timestamp > NOW() - INTERVAL '5 minutes'
ORDER BY timestamp ASC;

-- Check lease history
SELECT phone_number, lease_id, created_at, expires_at
FROM whatsapp_turn_leases
WHERE phone_number = '+919999900001'
ORDER BY created_at DESC
LIMIT 5;
```

---

## Test Scenario 2: Chat-Book with Stage Persist

**Goal:** Verify booking successfully persists with `lead_stage = 'Booking Made'`.

### Steps

1. **Start booking flow**
   - Action: Customer says "I want to book a demo"
   - Expected: Agent asks for preferred date/time

2. **Select "Today"**
   - Action: Customer taps "Today" button
   - Expected: Agent shows slot menu (3pm, 4pm, 5pm)

3. **Select "4:00 PM"**
   - Action: Customer taps "4:00 PM" button
   - Expected: Agent confirms booking details, asks for final confirmation

4. **Confirm booking**
   - Action: Customer taps "Confirm" button
   - Expected:
     - ✅ Agent says "You're booked for 4:00 PM today!"
     - ✅ Google Calendar event created
     - ✅ Database updated

5. **Verify database state**

### Success Criteria

| Check | Expected | Actual | Pass/Fail |
|-------|----------|--------|-----------|
| lead_stage updated | `'Booking Made'` | | |
| booking_metadata populated | ✅ JSONB with booking details | | |
| google_event_id present | ✅ Non-null in metadata | | |
| unified_context updated | `'Call Booked'` status | | |
| No CRITICAL errors | ✅ Clean logs | | |

### Verification Queries

```sql
-- Check lead state
SELECT 
  lead_id,
  lead_stage,
  booking_metadata,
  updated_at
FROM all_leads
WHERE phone_number = '+919999900001'
ORDER BY updated_at DESC
LIMIT 1;

-- Verify booking metadata structure
SELECT 
  lead_id,
  booking_metadata->>'booking_date' AS booking_date,
  booking_metadata->>'booking_time' AS booking_time,
  booking_metadata->>'google_event_id' AS google_event_id,
  booking_metadata->>'booking_status' AS booking_status
FROM all_leads
WHERE phone_number = '+919999900001';

-- Check unified_context
SELECT 
  lead_id,
  context->>'booking_status' AS uc_status,
  context->>'booking_time' AS uc_time,
  context->>'google_event_id' AS uc_gcal
FROM unified_context
WHERE lead_id = (SELECT lead_id FROM all_leads WHERE phone_number = '+919999900001');
```

### Expected Data

```json
{
  "lead_stage": "Booking Made",
  "booking_metadata": {
    "google_event_id": "c9q8i7hvnnifsfs1umtr1t81i0",
    "booking_date": "2026-09-10",
    "booking_time": "4:00 PM",
    "booking_status": "confirmed",
    "booked_at": "2026-09-10T15:30:00.000Z",
    "source": "chat_booking",
    "version": "0.6.23"
  }
}
```

---

## Test Scenario 3: Booking Persist Failure (Simulated)

**Goal:** Verify agent doesn't claim "booked" if database update fails.

### Steps

1. **Simulate database outage**
   - Action: Temporarily disconnect Supabase client OR set invalid credentials
   - **⚠️ DO THIS IN STAGING ONLY**

2. **Attempt booking**
   - Action: Customer completes booking flow (Today → 4:00 PM → Confirm)
   - Expected:
     - ❌ Agent DOES NOT say "You're booked"
     - ✅ Agent says "couldn't save your booking, please try again"

3. **Verify database state**
   - Expected: lead_stage is NOT "Booking Made" (stays at previous value)

4. **Restore database connection**
   - Action: Reconnect Supabase client
   - Expected: System recovers, subsequent bookings work

### Success Criteria

| Check | Expected | Actual | Pass/Fail |
|-------|----------|--------|-----------|
| Error message sent | ✅ "couldn't save..." | | |
| No false "booked" claim | ❌ Not sent | | |
| lead_stage unchanged | ✅ Still "New" or previous | | |
| CRITICAL error logged | ✅ Yes, with details | | |

### Verification

```sql
-- Verify lead_stage did NOT change to "Booking Made"
SELECT lead_id, lead_stage, updated_at
FROM all_leads
WHERE phone_number = '+919999900001'
ORDER BY updated_at DESC
LIMIT 1;

-- Should NOT be "Booking Made"
```

---

## Test Scenario 4: Overlapping Turns (Stress Test)

**Goal:** Verify system handles 3+ rapid messages, processes only the latest.

### Steps

1. **Send 3 messages rapidly** (all within 2 seconds)
   - Message 1: "Today" (tap button)
   - Message 2: "1am" (type and send)
   - Message 3: "4:00 PM" (tap button)

2. **Observe agent responses**
   - Expected:
     - ✅ ONE response: confirming 4:00 PM (or showing menu with 4pm)
     - ❌ NO response about "Today" slot menu
     - ❌ NO response about "1am not available"

3. **Verify turn lease behavior**
   - Expected: Max 1-2 leases acquired (not 3)
   - Expected: Messages 1 and 2 dropped as superseded

### Success Criteria

| Check | Expected | Actual | Pass/Fail |
|-------|----------|--------|-----------|
| Only 1 response sent | ✅ For "4:00 PM" | | |
| No stale responses | ❌ None | | |
| Lease retries ≤ 3 | ✅ Per message | | |
| No leaked leases | ✅ All released | | |

### Verification Queries

```sql
-- Count responses sent (should be 1)
SELECT COUNT(*) AS response_count
FROM whatsapp_messages
WHERE phone_number = '+919999900002'
  AND direction = 'outbound'
  AND timestamp > NOW() - INTERVAL '5 minutes';

-- Check lease activity
SELECT phone_number, lease_id, created_at
FROM whatsapp_turn_leases
WHERE phone_number = '+919999900002'
ORDER BY created_at DESC;

-- Should show ≤ 2 lease attempts, all released
```

---

## Test Scenario 5: Recovery from Lost Booking

**Goal:** Verify `recoverLostBooking` syncs lead_stage from unified_context.

### Pre-Condition

Create a "lost booking" state in staging:
```sql
-- Simulate a lost booking (UC says booked, but stage is New)
UPDATE all_leads
SET lead_stage = 'New'
WHERE lead_id = 'TEST_LEAD_001';

-- Ensure UC shows Call Booked
-- (This would normally exist from the original booking attempt)
INSERT INTO unified_context (lead_id, context)
VALUES ('TEST_LEAD_001', '{
  "booking_status": "Call Booked",
  "booking_time": "4:00 PM",
  "booking_date": "2026-09-10",
  "google_event_id": "c9q8i7hvnnifsfs1umtr1t81i0"
}'::jsonb)
ON CONFLICT (lead_id) DO UPDATE
SET context = EXCLUDED.context;
```

### Steps

1. **Trigger recovery**
   - Action: Call `recoverLostBooking('TEST_LEAD_001', ucContext)` from admin panel or CLI
   - Expected: Function succeeds without error

2. **Verify recovery**

### Success Criteria

| Check | Expected | Actual | Pass/Fail |
|-------|----------|--------|-----------|
| lead_stage synced | `'Booking Made'` | | |
| booking_metadata created | ✅ From UC data | | |
| Recovery logged | ✅ "Booking recovered" | | |

### Verification Queries

```sql
-- After recovery
SELECT 
  lead_id,
  lead_stage,
  booking_metadata->>'google_event_id' AS gcal,
  booking_metadata->>'source' AS source
FROM all_leads
WHERE lead_id = 'TEST_LEAD_001';

-- Expected: lead_stage = 'Booking Made', source = 'recovery'
```

---

## Post-Test Validation

After all scenarios pass:

### 1. Population Audit

Check for pre-existing lost bookings in production (read-only):

```sql
-- Count UC "Call Booked" + stage "New" discrepancies
SELECT COUNT(*) AS lost_bookings
FROM all_leads al
JOIN unified_context uc ON al.lead_id = uc.lead_id
WHERE uc.context->>'booking_status' = 'Call Booked'
  AND al.lead_stage = 'New';

-- Count gcal exists + stage "New" discrepancies  
SELECT COUNT(*) AS lost_bookings_with_gcal
FROM all_leads
WHERE booking_metadata->>'google_event_id' IS NOT NULL
  AND lead_stage = 'New';
```

### 2. Metrics Baseline

Capture pre-deploy metrics:
- Total bookings per day (last 7 days average)
- Booking success rate (stage="Booking Made" / total attempts)
- Lease retry rate (retries / total messages)

### 3. Rollout Plan

- [ ] Fixes pass all 5 test scenarios in staging
- [ ] CEO approval obtained
- [ ] Deploy during low-traffic window (e.g. 2 AM IST)
- [ ] Monitor for 24 hours
- [ ] Run population audit again (expect ~19-22 recoveries)

---

## Rollback Criteria

Rollback immediately if:
- ❌ Booking success rate drops >10% within 4 hours
- ❌ >5 customer reports of "couldn't save booking" errors
- ❌ Lease timeouts increase >3x baseline
- ❌ Any CRITICAL database errors in logs

Rollback command:
```bash
git revert <commit-sha>
git push origin main
# Redeploy previous version
```

---

## Success Metrics (Post-Deploy)

Track for 7 days after deploy:

| Metric | Baseline | Target | Actual (Day 7) |
|--------|----------|--------|----------------|
| Booking success rate | TBD% | >95% | |
| Lost bookings (UC ≠ stage) | ~19-22 | <5 | |
| Lease timeout rate | TBD% | <1% | |
| CRITICAL errors | 0 | 0 | |
| Customer complaints | TBD | <2 | |

---

## Test Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QC Lead | | | |
| Dev (Cloud Agent) | cursor/fix-booking-schema-race-a95b | 2026-09-10 | ✓ |
| CEO | | | |

---

**Notes:**
- All tests must pass before production deployment
- CEO gate required for schema changes (booking_metadata column)
- Keep this PR in DRAFT until CEO approval
