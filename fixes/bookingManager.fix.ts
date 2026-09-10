/**
 * REFERENCE IMPLEMENTATION: bookingManager.ts fix
 * 
 * This is a reference implementation showing the fix for the schema-drift
 * null booking bug. Adapt this to the actual PROXe backend code.
 * 
 * Original file: core/src/lib/services/bookingManager.ts (~lines 530-640)
 */

import { createClient } from '@supabase/supabase-js';

interface BookingDetails {
  leadId: string;
  bookingDate: string;  // ISO date string
  bookingTime: string;  // "4:00 PM"
  googleEventId?: string | null;
  customerName: string;
  phoneNumber: string;
}

/**
 * Store booking in database.
 * 
 * CRITICAL FIX: Split update into two parts:
 * 1. ALWAYS update lead_stage + metadata (fail-closed)
 * 2. OPTIONALLY update scalar columns (best-effort)
 * 
 * Throws if critical update fails.
 */
export async function storeBooking(
  supabase: ReturnType<typeof createClient>,
  details: BookingDetails
): Promise<void> {
  const { leadId, bookingDate, bookingTime, googleEventId } = details;
  
  // ═══════════════════════════════════════════════════════════════════════
  // STEP 1: CRITICAL UPDATE - lead_stage + metadata
  // ═══════════════════════════════════════════════════════════════════════
  // This MUST succeed for booking to be considered valid.
  // Store all booking details in JSONB field that exists across all brands.
  
  const bookingMetadata = {
    google_event_id: googleEventId,
    booking_date: bookingDate,
    booking_time: bookingTime,
    booking_status: 'confirmed',
    booked_at: new Date().toISOString(),
    // Include any other booking context you need
    source: 'chat_booking',
    version: '0.6.23'
  };
  
  const criticalUpdate = {
    lead_stage: 'Booking Made',
    booking_metadata: bookingMetadata,
    updated_at: new Date().toISOString()
  };
  
  console.log('[bookingManager] Updating lead_stage for', leadId);
  
  const { error: stageError } = await supabase
    .from('all_leads')
    .update(criticalUpdate)
    .eq('lead_id', leadId);
  
  if (stageError) {
    console.error('[bookingManager] CRITICAL: lead_stage update failed:', {
      lead_id: leadId,
      error: stageError.message,
      code: stageError.code,
      details: stageError.details
    });
    
    // FAIL CLOSED - throw error so caller knows booking didn't persist
    throw new Error(
      `Failed to persist booking stage for ${leadId}: ${stageError.message}`
    );
  }
  
  console.log('[bookingManager] lead_stage updated successfully:', leadId);
  
  // ═══════════════════════════════════════════════════════════════════════
  // STEP 2: OPTIONAL UPDATE - scalar columns (if they exist)
  // ═══════════════════════════════════════════════════════════════════════
  // This is best-effort. If columns don't exist in the schema, log warning
  // but don't fail the booking. Critical data is already in booking_metadata.
  
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
      // Log warning but don't throw - this is optional
      console.warn('[bookingManager] Optional scalar columns not updated:', {
        lead_id: leadId,
        error: scalarError.message,
        note: 'Columns may not exist in this brand schema; data is safe in booking_metadata'
      });
    } else {
      console.log('[bookingManager] Scalar columns updated (bonus):', leadId);
    }
  } catch (scalarEx) {
    // Catch any unexpected errors (column type mismatch, etc.)
    console.warn('[bookingManager] Scalar column update threw exception:', {
      lead_id: leadId,
      error: scalarEx instanceof Error ? scalarEx.message : String(scalarEx),
      note: 'Non-fatal; critical data is in booking_metadata'
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // STEP 3: Update unified_context (if you're using it)
  // ═══════════════════════════════════════════════════════════════════════
  // This is the existing unified_context update that was already working.
  // Keep this as-is.
  
  try {
    const ucUpdate = {
      booking_status: 'Call Booked',
      booking_time: bookingTime,
      booking_date: bookingDate,
      google_event_id: googleEventId,
      last_interaction: new Date().toISOString()
    };
    
    const { error: ucError } = await supabase
      .from('unified_context')
      .upsert({
        lead_id: leadId,
        context: ucUpdate
      });
    
    if (ucError) {
      console.warn('[bookingManager] unified_context update failed:', ucError);
      // Non-fatal; lead_stage is the source of truth
    }
  } catch (ucEx) {
    console.warn('[bookingManager] unified_context update threw:', ucEx);
  }
  
  // Success - booking persisted, stage updated
  console.log('[bookingManager] Booking stored successfully:', {
    lead_id: leadId,
    booking_date: bookingDate,
    booking_time: bookingTime,
    google_event_id: googleEventId || 'none'
  });
}

/**
 * Recover a lost booking (recoverLostBooking equivalent).
 * 
 * This is called when unified_context shows "Call Booked" but lead_stage
 * is still "New". It syncs the stage to match the UC state.
 */
export async function recoverLostBooking(
  supabase: ReturnType<typeof createClient>,
  leadId: string,
  ucContext: {
    booking_time?: string;
    booking_date?: string;
    google_event_id?: string;
  }
): Promise<void> {
  console.log('[bookingManager] Recovering lost booking for', leadId);
  
  // Build metadata from unified_context
  const bookingMetadata = {
    google_event_id: ucContext.google_event_id || null,
    booking_date: ucContext.booking_date || null,
    booking_time: ucContext.booking_time || null,
    booking_status: 'confirmed',
    booked_at: new Date().toISOString(),
    source: 'recovery',
    recovered_at: new Date().toISOString()
  };
  
  const { error } = await supabase
    .from('all_leads')
    .update({
      lead_stage: 'Booking Made',
      booking_metadata: bookingMetadata,
      updated_at: new Date().toISOString()
    })
    .eq('lead_id', leadId);
  
  if (error) {
    console.error('[bookingManager] Recovery failed:', error);
    throw new Error(`Failed to recover booking for ${leadId}: ${error.message}`);
  }
  
  console.log('[bookingManager] Booking recovered:', leadId);
}

/**
 * Check if booking metadata column exists.
 * Run this once at startup to validate schema.
 */
export async function validateBookingSchema(
  supabase: ReturnType<typeof createClient>
): Promise<{ valid: boolean; missing: string[] }> {
  const missing: string[] = [];
  
  // Check if booking_metadata column exists by attempting a safe read
  try {
    const { error } = await supabase
      .from('all_leads')
      .select('booking_metadata')
      .limit(1);
    
    if (error && error.message.includes('column "booking_metadata" does not exist')) {
      missing.push('booking_metadata');
      console.error('[bookingManager] CRITICAL: booking_metadata column missing!');
      console.error('[bookingManager] Add it with: ALTER TABLE all_leads ADD COLUMN booking_metadata JSONB;');
    }
  } catch (ex) {
    console.warn('[bookingManager] Schema validation error:', ex);
  }
  
  return {
    valid: missing.length === 0,
    missing
  };
}
