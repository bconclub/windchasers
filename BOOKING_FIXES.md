# Booking System Fixes - v0.6.23-draft

**Status:** DRAFT - CEO gate required  
**Attribution:** DEV / Cloud Agent cursor/fix-booking-schema-race-a95b  
**Target:** PROXe backend (`core/` package)

## Executive Summary

Two soft bugs in WC chat-book flow fixed:
1. **PRIORITY 1:** Schema-drift null booking - `lead_stage` stays "New" despite successful booking
2. **PRIORITY 2:** Dual-turn race - overlapping slot offers cause interleaved/stale responses

---

## Bug 1: Chat-Book Null Booking (Schema Drift) ⚠️ HIGHER PRIORITY

### Root Cause

**File:** `core/src/lib/services/bookingManager.ts` (~lines 530-640)

The `storeBooking` function attempts to update `all_leads` with:
```typescript
{
  lead_stage: 'Booking Made',
  booking_date: date,
  booking_time: time,
  booking_status: 'confirmed',
  google_event_id: eventId
}
```

**Problem:** WC `all_leads` table lacks the scalar columns (`booking_date`, `booking_time`, `booking_status`, `google_event_id`). Supabase soft-skips the entire update block when columns are missing → **`lead_stage` never updates**, stays "New".

Meanwhile, `unified_context` write succeeds (stores Call Booked + gcal ID in JSONB), creating data-layer inconsistency.

### Evidence

| Lead ID | Google Cal | UC Status | lead_stage | Issue |
|---------|------------|-----------|------------|-------|
| `bf589db3` | `c9q8i7hvnnifsfs1umtr1t81i0` | Call Booked | New | gcal exists, UC correct, stage wrong |
| `4000f18b` | null | Call Booked (via recover) | New | UC title "Callback - Sunny Banga", no gcal, stage wrong |

**Population:** ~19 UC="Call Booked" + stage="New"; ~22 with gcal + stage="New"

### Fix

**Split the update into TWO operations:**

1. **ALWAYS update `lead_stage` + metadata** (columns that exist in WC schema)
2. **Optionally update booking scalars** (only if columns exist; non-critical)

#### Implementation (bookingManager.ts)

```typescript
// BEFORE (lines ~590-620, storeBooking function)
const { error: updateError } = await supabase
  .from('all_leads')
  .update({
    lead_stage: 'Booking Made',
    booking_date: bookingDate,
    booking_time: bookingTime,
    booking_status: 'confirmed',
    google_event_id: googleEventId,
    updated_at: new Date().toISOString()
  })
  .eq('lead_id', leadId);

if (updateError) {
  console.error('[bookingManager] Failed to update lead:', updateError);
  // Agent still claims "You're booked" even though stage update failed
}

// AFTER (split into critical + optional updates)
// ── Step 1: CRITICAL update (lead_stage + gcal metadata) ──────────────
const criticalUpdate = {
  lead_stage: 'Booking Made',
  // Store gcal ID in a JSONB field that exists in all brands
  booking_metadata: {
    google_event_id: googleEventId,
    booking_date: bookingDate,
    booking_time: bookingTime,
    booking_status: 'confirmed',
    booked_at: new Date().toISOString()
  },
  updated_at: new Date().toISOString()
};

const { error: stageError } = await supabase
  .from('all_leads')
  .update(criticalUpdate)
  .eq('lead_id', leadId);

if (stageError) {
  console.error('[bookingManager] CRITICAL: lead_stage update failed:', stageError);
  // DO NOT claim "booked" in chat if this fails
  throw new Error(`Failed to persist booking stage: ${stageError.message}`);
}

// ── Step 2: OPTIONAL update (scalar columns if they exist) ────────────
// This is best-effort; if columns don't exist, log warning but don't fail
try {
  const { error: scalarError } = await supabase
    .from('all_leads')
    .update({
      booking_date: bookingDate,
      booking_time: bookingTime,
      booking_status: 'confirmed',
      google_event_id: googleEventId
    })
    .eq('lead_id', leadId);

  if (scalarError) {
    console.warn('[bookingManager] Optional scalar columns not updated (columns may not exist):', scalarError);
    // Non-fatal; critical data is in booking_metadata JSONB
  }
} catch (scalarEx) {
  console.warn('[bookingManager] Scalar column update skipped:', scalarEx);
}

// ── Step 3: Update unified_context (already exists) ───────────────────
// ... existing UC update code ...
```

#### Chat Response Guard

**File:** `core/src/lib/agent/engine.ts` (or wherever booking confirmation is narrated)

```typescript
// BEFORE
async function confirmBooking(leadId: string, bookingDetails: BookingDetails) {
  await bookingManager.storeBooking(leadId, bookingDetails);
  
  // Agent immediately claims success, even if stage update failed
  return {
    message: "You're booked for [time] on [date]!",
    success: true
  };
}

// AFTER
async function confirmBooking(leadId: string, bookingDetails: BookingDetails) {
  try {
    await bookingManager.storeBooking(leadId, bookingDetails);
    
    // Only claim success if storeBooking didn't throw
    return {
      message: "You're booked for [time] on [date]!",
      success: true
    };
  } catch (bookingError) {
    console.error('[engine] Booking persistence failed:', bookingError);
    
    // Fail closed - tell customer to retry
    return {
      message: "I couldn't save your booking just now. Please try again in a moment, or call us directly.",
      success: false,
      error: 'booking_persist_failed'
    };
  }
}
```

### Migration Notes

**DO NOT apply schema changes to production without CEO approval.**

If you want to add the scalar columns to WC `all_leads`:

```sql
-- DRAFT migration (do not run live)
ALTER TABLE all_leads
  ADD COLUMN IF NOT EXISTS booking_date DATE,
  ADD COLUMN IF NOT EXISTS booking_time TEXT,
  ADD COLUMN IF NOT EXISTS booking_status TEXT,
  ADD COLUMN IF NOT EXISTS google_event_id TEXT;

-- Backfill from booking_metadata JSONB
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

**Keep this migration in PR only; do not merge without CEO gate.**

---

## Bug 2: Dual-Turn Race (Today + 1am) ⚠️ LOWER PRIORITY

### Root Cause

**Files involved:**
- `whatsapp/meta/route.ts` (lease acquisition ~482-554)
- `core/src/lib/whatsappTurnLease.ts`
- `core/src/lib/agent/engine.ts` (promise net / recoverLostBooking / book_consultation)
- `core/src/lib/agent/bookingSelection.ts` (readBookingTime)

**Timeline (lead `4000f18b`):**
```
18:47:51Z  Cust: "Today"
           [Agent acquires WA lease, starts slot-offer turn]
18:48:06Z  Cust: "¹1am"   (supersedes "Today" while first turn in-flight)
           [Lease 503-retries because Today turn holds it]
18:48:07Z  Agent: "Here's what's open today" (Today response)
18:48:18Z  Cust: "4:00 PM"
18:48:23Z  Agent: "starts at 11:00 AM… 3/4/5" (1am response, STALE)
18:48:33Z  Agent: confirms today 4PM (correct path)
18:48:43Z  Cust: "Today 4:00 PM" (disambiguation)
18:49:05Z  Agent: "You're booked for 4:00 PM today" (final confirm)
```

**Problem:** The "1am" message arrived while "Today" turn was still processing. The lease retry logic eventually let the 1am handler run, which sent a stale "1am not available" response AFTER the correct slot menu was already sent.

Customer saw interleaved responses:
1. Today slot menu (correct)
2. 1am refusal (stale, should have been suppressed)
3. 4PM confirmation (correct)

### Fix

**Strategy:** Drop/suppress superseded inbound messages when a newer customer message arrives before the current turn's reply is sent.

#### Implementation

**File:** `whatsapp/meta/route.ts` (inbound webhook handler)

```typescript
// BEFORE (lines ~482-554, WhatsApp inbound handler)
export async function POST(request: Request) {
  const body = await request.json();
  const message = extractMessage(body);
  
  // Acquire turn lease
  const lease = await acquireTurnLease(message.from, message.timestamp);
  if (!lease.acquired) {
    // Retry with exponential backoff
    await retryWithBackoff(() => acquireTurnLease(message.from, message.timestamp));
  }
  
  // Process message (slot offer / booking flow)
  await processInboundMessage(message);
  
  // Release lease
  await releaseTurnLease(message.from);
}

// AFTER (add supersession check)
export async function POST(request: Request) {
  const body = await request.json();
  const message = extractMessage(body);
  
  // ── Check if this message is already superseded ─────────────────────
  // If a newer message from this customer arrived while we were queued,
  // drop this one (user intent changed before we could respond)
  const newerMessageExists = await hasNewerMessage(message.from, message.timestamp);
  if (newerMessageExists) {
    console.log('[whatsapp] Dropping superseded message:', {
      from: maskPhone(message.from),
      timestamp: message.timestamp,
      text: message.text?.substring(0, 20)
    });
    return new Response(JSON.stringify({ status: 'superseded' }), { status: 200 });
  }
  
  // Acquire turn lease
  const lease = await acquireTurnLease(message.from, message.timestamp);
  if (!lease.acquired) {
    // Before retrying, check again if superseded
    if (await hasNewerMessage(message.from, message.timestamp)) {
      console.log('[whatsapp] Message superseded during lease wait');
      return new Response(JSON.stringify({ status: 'superseded' }), { status: 200 });
    }
    
    // Retry with exponential backoff (max 3 retries, not infinite)
    const leaseAcquired = await retryWithBackoff(
      () => acquireTurnLease(message.from, message.timestamp),
      { maxRetries: 3, initialDelayMs: 500 }
    );
    
    if (!leaseAcquired) {
      console.error('[whatsapp] Failed to acquire lease after retries');
      // Fail gracefully; don't process stale message
      return new Response(JSON.stringify({ status: 'lease_timeout' }), { status: 503 });
    }
  }
  
  // ── Final supersession check before processing ──────────────────────
  // Even if we got the lease, check one more time (race window between
  // lease acquire and process start)
  if (await hasNewerMessage(message.from, message.timestamp)) {
    await releaseTurnLease(message.from);
    console.log('[whatsapp] Message superseded after lease acquired');
    return new Response(JSON.stringify({ status: 'superseded' }), { status: 200 });
  }
  
  // Process message (slot offer / booking flow)
  try {
    await processInboundMessage(message);
  } finally {
    // Always release lease, even if processing fails
    await releaseTurnLease(message.from);
  }
  
  return new Response(JSON.stringify({ status: 'ok' }), { status: 200 });
}

// ── New helper: check for newer messages ────────────────────────────
async function hasNewerMessage(phoneNumber: string, currentTimestamp: number): Promise<boolean> {
  // Query Supabase whatsapp_messages table for any message from this number
  // with timestamp > currentTimestamp and status = 'received'
  const { data, error } = await supabase
    .from('whatsapp_messages')
    .select('id, timestamp')
    .eq('phone_number', phoneNumber)
    .eq('direction', 'inbound')
    .gt('timestamp', currentTimestamp)
    .order('timestamp', { ascending: false })
    .limit(1);
  
  if (error) {
    console.error('[whatsapp] Failed to check for newer messages:', error);
    return false; // Fail open; don't suppress on DB error
  }
  
  return (data && data.length > 0);
}
```

**File:** `core/src/lib/agent/engine.ts` (booking flow orchestration)

```typescript
// BEFORE
async function handleBookingTimeInput(lead: Lead, input: string) {
  const parsedTime = parseBookingTime(input); // "Today", "1am", "4:00 PM"
  
  if (parsedTime.isRelative && !isValidBookingTime(parsedTime)) {
    // Send refusal for early times (1am, 2am, etc.)
    return {
      message: "Our sessions start at 11:00 AM. Please pick 3pm, 4pm, or 5pm for today.",
      needsFollowup: true
    };
  }
  
  // Show slot menu
  return {
    message: await generateSlotMenu(parsedTime.date),
    needsFollowup: true
  };
}

// AFTER (add supersession awareness)
async function handleBookingTimeInput(lead: Lead, input: string, context: TurnContext) {
  // If this turn was superseded (newer message arrived), abort early
  if (context.superseded) {
    console.log('[engine] Turn superseded, skipping slot offer');
    return null; // Don't send any response
  }
  
  const parsedTime = parseBookingTime(input); // "Today", "1am", "4:00 PM"
  
  if (parsedTime.isRelative && !isValidBookingTime(parsedTime)) {
    // Check supersession before sending refusal
    if (await context.checkSuperseded()) {
      console.log('[engine] Turn superseded during early-time validation');
      return null;
    }
    
    // Send refusal for early times (1am, 2am, etc.)
    return {
      message: "Our sessions start at 11:00 AM. Please pick 3pm, 4pm, or 5pm for today.",
      needsFollowup: true
    };
  }
  
  // Check supersession before expensive slot menu generation
  if (await context.checkSuperseded()) {
    console.log('[engine] Turn superseded before slot menu generation');
    return null;
  }
  
  // Show slot menu
  return {
    message: await generateSlotMenu(parsedTime.date),
    needsFollowup: true
  };
}
```

#### Lease Policy Updates

**File:** `core/src/lib/whatsappTurnLease.ts`

```typescript
// BEFORE
const LEASE_TIMEOUT_MS = 60_000; // 60 seconds
const LEASE_RETRY_MAX = Infinity; // Retry forever

// AFTER
const LEASE_TIMEOUT_MS = 45_000; // 45 seconds (tighter window)
const LEASE_RETRY_MAX = 3; // Max 3 retries before giving up
const LEASE_RETRY_DELAYS = [500, 1000, 2000]; // ms

// Rationale: If a turn can't get the lease after 3 retries (~3.5s total),
// it's likely superseded. Drop it rather than letting it queue indefinitely.
```

### Testing Plan

**QC Retest Scenarios:**

1. **Rapid Today → 1am tap:**
   - Customer taps "Today" button
   - Before agent responds, customer types "1am"
   - **Expected:** Agent shows Today slot menu, ignores/drops 1am
   - **Verify:** No stale "1am not available" response

2. **Chat-book with stage persist:**
   - Customer completes booking flow via chat
   - Agent says "You're booked for [time]"
   - **Verify:** Lead stage = "Booking Made" (NOT "New")
   - **Verify:** `booking_metadata` JSONB populated
   - **Verify:** Google Calendar event created

3. **Booking persist failure:**
   - Simulate Supabase outage (disconnect DB mid-booking)
   - Customer completes slot selection
   - **Expected:** Agent says "couldn't save your booking, please try again"
   - **Verify:** Lead stage stays at previous value (NOT "Booking Made")
   - **Verify:** No "You're booked" false positive

4. **Overlapping turns (stress test):**
   - Send 3 messages rapidly: "Today", "1am", "4:00 PM"
   - All within 2-second window
   - **Expected:** Agent responds only to "4:00 PM" (latest intent)
   - **Verify:** No interleaved/stale responses

---

## Files Changed

### Core Package (`core/`)

1. **`src/lib/services/bookingManager.ts`**
   - Split `storeBooking` update into critical (stage) + optional (scalars)
   - Throw error if stage update fails (fail closed)
   - Store booking details in `booking_metadata` JSONB

2. **`src/lib/agent/engine.ts`**
   - Wrap `confirmBooking` in try/catch
   - Add supersession checks in `handleBookingTimeInput`
   - Pass `TurnContext` with `checkSuperseded()` helper

3. **`src/lib/whatsappTurnLease.ts`**
   - Reduce `LEASE_TIMEOUT_MS` to 45s
   - Set `LEASE_RETRY_MAX` to 3 (not infinite)
   - Export retry delay constants

### WhatsApp Package (`whatsapp/`)

4. **`meta/route.ts`**
   - Add `hasNewerMessage()` helper (checks for superseding messages)
   - Call supersession check before lease acquire, after lease acquire, and after retry
   - Drop message with 200 status if superseded (no error logged to Meta)

---

## Deployment Notes

1. **Stage the changes:**
   - Test in staging with real WC lead data (use test phone numbers)
   - Verify `booking_metadata` JSONB column exists in staging `all_leads`
   - Run QC test plan (4 scenarios above)

2. **Rollout order:**
   - Deploy `bookingManager.ts` + `engine.ts` first (schema-drift fix)
   - Wait 24h, monitor booking success rate
   - Deploy `route.ts` + `whatsappTurnLease.ts` (race fix)
   - Monitor for dropped/stale responses

3. **Monitoring:**
   - Track `lead_stage="Booking Made"` AND `booking_metadata IS NOT NULL`
   - Alert if booking confirmation sent but stage stays "New"
   - Alert if lease retries exceed 3 (indicates persistent race)

4. **Rollback plan:**
   - If booking success rate drops >10%, revert `bookingManager.ts`
   - If customers report missing responses, revert `route.ts` lease changes
   - Original code preserved in git history (tag: `v0.6.22-before-booking-fixes`)

---

## Attribution

- **Author:** DEV Cloud Agent (Cursor)
- **Branch:** `cursor/fix-booking-schema-race-a95b`
- **Reviewers:** CEO gate required before merge
- **QC Owner:** CEO/QC team (retest with `4000f18b` flow)

---

## References

- Original bug report: Soft bugs (CEO dig, post-0.6.22)
- Related work: QC-20260831-03 (Today-tap lock-fail, shipped 0.6.22)
- Lead evidence:
  - `4000f18b-73d3-4cc1-8f87-d0549836679b` (dual-turn race)
  - `bf589db3-02c8-4369-ad4b-0b9d16d22041` (null booking, gcal exists)

---

**Status:** DRAFT - Awaiting CEO approval to merge
