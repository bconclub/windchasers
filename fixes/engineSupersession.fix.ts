/**
 * REFERENCE IMPLEMENTATION: Agent engine supersession awareness
 * 
 * This shows how to make the booking flow aware of superseded turns
 * and abort early when the user's intent has changed.
 * 
 * Original file: core/src/lib/agent/engine.ts
 */

import { createClient } from '@supabase/supabase-js';
import { hasNewerMessage } from './whatsappTurnRace.fix';
import { storeBooking } from './bookingManager.fix';

interface Lead {
  lead_id: string;
  phone_number: string;
  name: string;
  lead_stage: string;
}

interface TurnContext {
  leadId: string;
  phoneNumber: string;
  timestamp: number;
  supabase: ReturnType<typeof createClient>;
  
  // Helper to check if this turn has been superseded
  checkSuperseded: () => Promise<boolean>;
}

interface BookingDetails {
  leadId: string;
  bookingDate: string;
  bookingTime: string;
  googleEventId?: string | null;
  customerName: string;
  phoneNumber: string;
}

/**
 * Handle booking time input (e.g. "Today", "1am", "4:00 PM").
 * 
 * ADDED: Supersession checks before expensive operations.
 */
export async function handleBookingTimeInput(
  lead: Lead,
  input: string,
  context: TurnContext
): Promise<{ message: string; needsFollowup: boolean } | null> {
  
  console.log('[engine] Handling booking time input:', {
    lead_id: lead.lead_id,
    input: input.substring(0, 30)
  });
  
  // ───────────────────────────────────────────────────────────────────────
  // Parse time input
  // ───────────────────────────────────────────────────────────────────────
  const parsedTime = parseBookingTime(input);
  
  // ───────────────────────────────────────────────────────────────────────
  // SUPERSESSION CHECK: Before validation logic
  // ───────────────────────────────────────────────────────────────────────
  if (await context.checkSuperseded()) {
    console.log('[engine] Turn superseded during time parsing, aborting');
    return null; // Don't send any response
  }
  
  // ───────────────────────────────────────────────────────────────────────
  // Validate early-time inputs (1am, 2am, etc.)
  // ───────────────────────────────────────────────────────────────────────
  if (parsedTime.isRelative && !isValidBookingTime(parsedTime)) {
    // SUPERSESSION CHECK before sending refusal
    if (await context.checkSuperseded()) {
      console.log('[engine] Turn superseded during early-time validation, aborting');
      return null;
    }
    
    // Send refusal for times outside session window
    return {
      message: "Our sessions start at 11:00 AM. Please pick 3pm, 4pm, or 5pm for today.",
      needsFollowup: true
    };
  }
  
  // ───────────────────────────────────────────────────────────────────────
  // SUPERSESSION CHECK: Before expensive slot menu generation
  // ───────────────────────────────────────────────────────────────────────
  // This is important because generateSlotMenu might query Google Calendar,
  // check availability, format response, etc. If user already sent a newer
  // message, don't waste resources on stale menu.
  
  if (await context.checkSuperseded()) {
    console.log('[engine] Turn superseded before slot menu generation, aborting');
    return null;
  }
  
  // ───────────────────────────────────────────────────────────────────────
  // Generate and return slot menu
  // ───────────────────────────────────────────────────────────────────────
  const slotMenu = await generateSlotMenu(parsedTime.date, context.supabase);
  
  return {
    message: slotMenu,
    needsFollowup: true
  };
}

/**
 * Confirm booking and persist to database.
 * 
 * CHANGED: Wrapped in try/catch, fail closed if persist fails.
 */
export async function confirmBooking(
  lead: Lead,
  details: BookingDetails,
  context: TurnContext
): Promise<{ message: string; success: boolean; error?: string } | null> {
  
  console.log('[engine] Confirming booking:', {
    lead_id: lead.lead_id,
    booking_date: details.bookingDate,
    booking_time: details.bookingTime
  });
  
  // ───────────────────────────────────────────────────────────────────────
  // SUPERSESSION CHECK: Before persist
  // ───────────────────────────────────────────────────────────────────────
  if (await context.checkSuperseded()) {
    console.log('[engine] Turn superseded before booking persist, aborting');
    return null;
  }
  
  // ───────────────────────────────────────────────────────────────────────
  // Create Google Calendar event (if applicable)
  // ───────────────────────────────────────────────────────────────────────
  let googleEventId: string | null = null;
  
  try {
    googleEventId = await createGoogleCalendarEvent(details);
    console.log('[engine] Google Calendar event created:', googleEventId);
  } catch (gcalError) {
    console.error('[engine] Google Calendar event creation failed:', gcalError);
    // Non-fatal - we can still book without gcal
  }
  
  // ───────────────────────────────────────────────────────────────────────
  // SUPERSESSION CHECK: After gcal, before DB persist
  // ───────────────────────────────────────────────────────────────────────
  if (await context.checkSuperseded()) {
    console.log('[engine] Turn superseded after gcal, before persist, aborting');
    // TODO: Consider deleting the gcal event if created
    return null;
  }
  
  // ───────────────────────────────────────────────────────────────────────
  // Persist booking to database
  // ───────────────────────────────────────────────────────────────────────
  try {
    await storeBooking(context.supabase, {
      ...details,
      googleEventId
    });
    
    console.log('[engine] Booking persisted successfully');
    
    // SUCCESS - booking is saved, stage is updated
    return {
      message: `You're booked for ${details.bookingTime} on ${formatDate(details.bookingDate)}! We'll send you a confirmation on WhatsApp shortly.`,
      success: true
    };
    
  } catch (bookingError) {
    // FAIL CLOSED - persist failed, tell customer to retry
    console.error('[engine] Booking persistence failed:', bookingError);
    
    return {
      message: "I couldn't save your booking just now. Please try again in a moment, or call us directly at +91-XXXXXXXXXX.",
      success: false,
      error: 'booking_persist_failed'
    };
  }
}

/**
 * Create a TurnContext for supersession checking.
 */
export function createTurnContext(
  leadId: string,
  phoneNumber: string,
  timestamp: number,
  supabase: ReturnType<typeof createClient>
): TurnContext {
  return {
    leadId,
    phoneNumber,
    timestamp,
    supabase,
    
    checkSuperseded: async () => {
      return hasNewerMessage(supabase, phoneNumber, timestamp);
    }
  };
}

// ═════════════════════════════════════════════════════════════════════════
// Helper functions (stubs - implement based on your actual code)
// ═════════════════════════════════════════════════════════════════════════

interface ParsedTime {
  date: string;        // ISO date
  time?: string;       // "4:00 PM"
  isRelative: boolean; // true for "Today", "1am", false for "2024-09-15"
}

function parseBookingTime(input: string): ParsedTime {
  // Example implementation - adapt to your actual parsing logic
  const lower = input.toLowerCase().trim();
  
  if (lower === 'today') {
    return {
      date: new Date().toISOString().split('T')[0],
      isRelative: true
    };
  }
  
  // Parse relative times like "1am", "4:00 PM"
  const timeMatch = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (timeMatch) {
    const hour = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] || '00';
    const meridiem = timeMatch[3]?.toLowerCase() || 'am';
    
    return {
      date: new Date().toISOString().split('T')[0],
      time: `${hour}:${minutes} ${meridiem}`,
      isRelative: true
    };
  }
  
  // Default: treat as date string
  return {
    date: input,
    isRelative: false
  };
}

function isValidBookingTime(parsed: ParsedTime): boolean {
  // Example: sessions start at 11 AM, end at 5 PM
  if (!parsed.time) return true; // No time specified = valid (show menu)
  
  const hour = parseInt(parsed.time.split(':')[0]);
  const isPM = parsed.time.toLowerCase().includes('pm');
  
  const hour24 = isPM ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour);
  
  // Reject times before 11 AM or after 5 PM
  return hour24 >= 11 && hour24 <= 17;
}

async function generateSlotMenu(
  date: string,
  supabase: ReturnType<typeof createClient>
): Promise<string> {
  // Query available slots from your calendar/database
  // Format as user-friendly message
  
  return `Here's what's available on ${formatDate(date)}:\n\n3:00 PM ✓\n4:00 PM ✓\n5:00 PM ✓\n\nWhich time works for you?`;
}

async function createGoogleCalendarEvent(details: BookingDetails): Promise<string> {
  // Call Google Calendar API to create event
  // Return event ID
  
  // Stub implementation
  return `gcal_${Date.now()}`;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// ═════════════════════════════════════════════════════════════════════════
// Usage Example
// ═════════════════════════════════════════════════════════════════════════

/*
// In your WhatsApp webhook handler (after lease acquired):

const context = createTurnContext(
  lead.lead_id,
  message.from,
  message.timestamp,
  supabase
);

// Handle booking time input
const response = await handleBookingTimeInput(lead, message.text, context);

if (response === null) {
  console.log('[webhook] Response suppressed (superseded)');
  return; // Don't send anything to WhatsApp
}

// Send WhatsApp message
await sendWhatsAppMessage(lead.phone_number, response.message);

// If booking confirmed, response.success will be true
if (response.success) {
  console.log('[webhook] Booking confirmed and persisted');
}
*/
