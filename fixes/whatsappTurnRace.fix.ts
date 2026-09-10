/**
 * REFERENCE IMPLEMENTATION: WhatsApp turn race fix
 * 
 * This shows how to detect and suppress superseded messages in the
 * WhatsApp inbound webhook handler.
 * 
 * Original files:
 * - whatsapp/meta/route.ts (~lines 482-554)
 * - core/src/lib/whatsappTurnLease.ts
 */

import { createClient } from '@supabase/supabase-js';

interface InboundMessage {
  from: string;        // E.164 phone number
  timestamp: number;   // Unix timestamp (seconds or ms, depending on Meta API)
  messageId: string;   // Meta message ID
  text?: string;
  type: 'text' | 'button' | 'interactive';
}

interface TurnLease {
  acquired: boolean;
  leaseId?: string;
  expiresAt?: number;
}

// ═════════════════════════════════════════════════════════════════════════
// Configuration
// ═════════════════════════════════════════════════════════════════════════
const LEASE_TIMEOUT_MS = 45_000;  // 45 seconds (down from 60s)
const LEASE_RETRY_MAX = 3;        // Max retries (down from Infinity)
const LEASE_RETRY_DELAYS = [500, 1000, 2000]; // Exponential backoff (ms)

/**
 * Check if a newer message exists from the same customer.
 * 
 * This is the core supersession detection. If a customer sends multiple
 * messages quickly (e.g. "Today" then "1am"), we want to process only
 * the latest one and drop the earlier ones.
 */
export async function hasNewerMessage(
  supabase: ReturnType<typeof createClient>,
  phoneNumber: string,
  currentTimestamp: number
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('whatsapp_messages')
      .select('id, timestamp, text')
      .eq('phone_number', phoneNumber)
      .eq('direction', 'inbound')
      .eq('status', 'received')
      .gt('timestamp', currentTimestamp)
      .order('timestamp', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('[supersession] Failed to check for newer messages:', {
        phone: maskPhone(phoneNumber),
        error: error.message
      });
      // FAIL OPEN - if we can't check, assume no newer message (don't drop)
      return false;
    }
    
    if (data && data.length > 0) {
      console.log('[supersession] Newer message detected:', {
        phone: maskPhone(phoneNumber),
        current_ts: currentTimestamp,
        newer_ts: data[0].timestamp,
        newer_text: data[0].text?.substring(0, 30)
      });
      return true;
    }
    
    return false;
  } catch (ex) {
    console.error('[supersession] Exception checking for newer messages:', ex);
    // FAIL OPEN - don't drop on unexpected errors
    return false;
  }
}

/**
 * Acquire a turn lease for this customer.
 * 
 * This ensures only one turn can process messages from a given phone number
 * at a time (prevents parallel turn race).
 */
export async function acquireTurnLease(
  supabase: ReturnType<typeof createClient>,
  phoneNumber: string,
  timestamp: number
): Promise<TurnLease> {
  const leaseId = `${phoneNumber}:${timestamp}`;
  const expiresAt = Date.now() + LEASE_TIMEOUT_MS;
  
  try {
    // Try to insert a lease row (unique constraint on phone_number + active=true)
    const { data, error } = await supabase
      .from('whatsapp_turn_leases')
      .insert({
        phone_number: phoneNumber,
        lease_id: leaseId,
        expires_at: new Date(expiresAt).toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation - another turn already holds the lease
        console.log('[lease] Lease already held:', maskPhone(phoneNumber));
        return { acquired: false };
      }
      
      console.error('[lease] Failed to acquire lease:', error);
      return { acquired: false };
    }
    
    console.log('[lease] Acquired:', { phone: maskPhone(phoneNumber), lease_id: leaseId });
    return { acquired: true, leaseId, expiresAt };
    
  } catch (ex) {
    console.error('[lease] Exception acquiring lease:', ex);
    return { acquired: false };
  }
}

/**
 * Release a turn lease.
 */
export async function releaseTurnLease(
  supabase: ReturnType<typeof createClient>,
  phoneNumber: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('whatsapp_turn_leases')
      .delete()
      .eq('phone_number', phoneNumber);
    
    if (error) {
      console.error('[lease] Failed to release lease:', error);
    } else {
      console.log('[lease] Released:', maskPhone(phoneNumber));
    }
  } catch (ex) {
    console.error('[lease] Exception releasing lease:', ex);
  }
}

/**
 * Retry lease acquisition with exponential backoff.
 * 
 * CHANGED: Now has max retries (3) instead of infinite retries.
 */
async function retryLease(
  supabase: ReturnType<typeof createClient>,
  phoneNumber: string,
  timestamp: number
): Promise<TurnLease> {
  for (let attempt = 0; attempt < LEASE_RETRY_MAX; attempt++) {
    const delay = LEASE_RETRY_DELAYS[attempt] || LEASE_RETRY_DELAYS[LEASE_RETRY_DELAYS.length - 1];
    
    console.log(`[lease] Retry ${attempt + 1}/${LEASE_RETRY_MAX} after ${delay}ms`);
    await sleep(delay);
    
    const lease = await acquireTurnLease(supabase, phoneNumber, timestamp);
    if (lease.acquired) {
      return lease;
    }
  }
  
  console.warn('[lease] Max retries reached, giving up');
  return { acquired: false };
}

/**
 * Main webhook handler (Next.js API route).
 * 
 * This is the WhatsApp inbound message handler with supersession checks.
 */
export async function handleWhatsAppWebhook(
  supabase: ReturnType<typeof createClient>,
  message: InboundMessage
): Promise<{ status: string; code: number }> {
  
  console.log('[whatsapp] Inbound message:', {
    from: maskPhone(message.from),
    timestamp: message.timestamp,
    type: message.type,
    text: message.text?.substring(0, 50)
  });
  
  // ═════════════════════════════════════════════════════════════════════
  // SUPERSESSION CHECK #1: Before lease acquisition
  // ═════════════════════════════════════════════════════════════════════
  // Drop immediately if superseded (don't even try to get the lease)
  
  if (await hasNewerMessage(supabase, message.from, message.timestamp)) {
    console.log('[whatsapp] Message superseded (pre-lease), dropping');
    return { status: 'superseded', code: 200 };
  }
  
  // ═════════════════════════════════════════════════════════════════════
  // Acquire turn lease
  // ═════════════════════════════════════════════════════════════════════
  
  let lease = await acquireTurnLease(supabase, message.from, message.timestamp);
  
  if (!lease.acquired) {
    // ─────────────────────────────────────────────────────────────────────
    // SUPERSESSION CHECK #2: Before retrying lease
    // ─────────────────────────────────────────────────────────────────────
    // If superseded during wait, don't retry (user intent changed)
    
    if (await hasNewerMessage(supabase, message.from, message.timestamp)) {
      console.log('[whatsapp] Message superseded during lease wait, dropping');
      return { status: 'superseded', code: 200 };
    }
    
    // Not superseded yet - try to acquire lease with backoff
    lease = await retryLease(supabase, message.from, message.timestamp);
    
    if (!lease.acquired) {
      // Max retries exhausted - likely superseded or persistent contention
      console.warn('[whatsapp] Failed to acquire lease after retries');
      return { status: 'lease_timeout', code: 503 };
    }
  }
  
  // ═════════════════════════════════════════════════════════════════════
  // SUPERSESSION CHECK #3: After lease acquired, before processing
  // ═════════════════════════════════════════════════════════════════════
  // Final check in case a newer message arrived during lease retry
  
  if (await hasNewerMessage(supabase, message.from, message.timestamp)) {
    await releaseTurnLease(supabase, message.from);
    console.log('[whatsapp] Message superseded after lease acquired, dropping');
    return { status: 'superseded', code: 200 };
  }
  
  // ═════════════════════════════════════════════════════════════════════
  // Process the message (call your booking flow / agent engine)
  // ═════════════════════════════════════════════════════════════════════
  
  try {
    await processMessage(supabase, message);
    return { status: 'ok', code: 200 };
    
  } catch (error) {
    console.error('[whatsapp] Message processing failed:', error);
    return { status: 'error', code: 500 };
    
  } finally {
    // ALWAYS release lease, even if processing fails
    await releaseTurnLease(supabase, message.from);
  }
}

/**
 * Process the message (stub - replace with your actual engine.ts logic).
 */
async function processMessage(
  supabase: ReturnType<typeof createClient>,
  message: InboundMessage
): Promise<void> {
  // This is where you'd call your agent engine:
  // - Parse intent (slot selection, booking confirm, etc.)
  // - Generate response
  // - Send WhatsApp reply
  // - Update lead state
  
  console.log('[engine] Processing message:', message.text);
  
  // Example: check supersession during long operations
  // if (await hasNewerMessage(supabase, message.from, message.timestamp)) {
  //   console.log('[engine] Superseded during processing, aborting');
  //   return; // Don't send response
  // }
  
  // ... your booking flow logic here ...
}

// ═════════════════════════════════════════════════════════════════════════
// Helpers
// ═════════════════════════════════════════════════════════════════════════

function maskPhone(phone: string): string {
  if (!phone || phone.length < 7) return phone;
  return phone.slice(0, 3) + 'xxxxxx' + phone.slice(-4);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ═════════════════════════════════════════════════════════════════════════
// Database Schema (for reference)
// ═════════════════════════════════════════════════════════════════════════

/*
CREATE TABLE IF NOT EXISTS whatsapp_turn_leases (
  id SERIAL PRIMARY KEY,
  phone_number TEXT NOT NULL,
  lease_id TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Only one active lease per phone number
  CONSTRAINT unique_active_lease UNIQUE (phone_number)
);

-- Index for expired lease cleanup (run periodically)
CREATE INDEX idx_lease_expires ON whatsapp_turn_leases(expires_at);

-- Cleanup query (run every 5 minutes):
DELETE FROM whatsapp_turn_leases WHERE expires_at < NOW();
*/
