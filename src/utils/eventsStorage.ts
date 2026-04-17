// Events RSVP storage management

export interface RSVPEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  rsvpedAt: number;
}

const RSVP_EVENTS_KEY = 'msu_buddy_rsvp_events';

// Get all RSVP events for a user
export function getUserRSVPEvents(userId: string): RSVPEvent[] {
  if (typeof window === 'undefined') return [];
  const allRSVPs = localStorage.getItem(RSVP_EVENTS_KEY);
  const rsvpData: Record<string, RSVPEvent[]> = allRSVPs ? JSON.parse(allRSVPs) : {};
  return rsvpData[userId] || [];
}

// Add RSVP event for a user
export function addRSVPEvent(userId: string, event: Omit<RSVPEvent, 'rsvpedAt'>): void {
  if (typeof window === 'undefined') return;
  
  const allRSVPs = localStorage.getItem(RSVP_EVENTS_KEY);
  const rsvpData: Record<string, RSVPEvent[]> = allRSVPs ? JSON.parse(allRSVPs) : {};
  
  if (!rsvpData[userId]) {
    rsvpData[userId] = [];
  }
  
  // Check if already RSVP'd to this event
  const existingIndex = rsvpData[userId].findIndex(e => e.id === event.id);
  
  if (existingIndex === -1) {
    // Add new RSVP
    rsvpData[userId].push({
      ...event,
      rsvpedAt: Date.now(),
    });
    
    localStorage.setItem(RSVP_EVENTS_KEY, JSON.stringify(rsvpData));
  }
}

// Remove RSVP event for a user
export function removeRSVPEvent(userId: string, eventId: string): void {
  if (typeof window === 'undefined') return;
  
  const allRSVPs = localStorage.getItem(RSVP_EVENTS_KEY);
  const rsvpData: Record<string, RSVPEvent[]> = allRSVPs ? JSON.parse(allRSVPs) : {};
  
  if (rsvpData[userId]) {
    rsvpData[userId] = rsvpData[userId].filter(e => e.id !== eventId);
    localStorage.setItem(RSVP_EVENTS_KEY, JSON.stringify(rsvpData));
  }
}

// Check if user has RSVP'd to an event
export function hasRSVPed(userId: string, eventId: string): boolean {
  const events = getUserRSVPEvents(userId);
  return events.some(e => e.id === eventId);
}

// Get RSVP count for achievements
export function getRSVPCount(userId: string): number {
  return getUserRSVPEvents(userId).length;
}
