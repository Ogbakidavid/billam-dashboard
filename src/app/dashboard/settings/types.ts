/**
 * BillAm V2 Settings Types
 * Knowledge Base and Availability capability statuses.
 * These are NOT Job states — they are data/capability statuses only.
 */

// ── Knowledge Base ─────────────────────────────────────────────────────────────
export type KnowledgeStatus = 'UPLOADING' | 'PROCESSING' | 'READY' | 'FAILED';

export interface KnowledgeEntry {
  id: string;
  title: string;
  description: string;
  /** Category tag for grouping */
  category: 'pricing' | 'services' | 'policies' | 'faq' | 'general';
  status: KnowledgeStatus;
  /** ISO 8601 */
  created_at: string;
  /** ISO 8601 — when status last changed */
  updated_at: string;
  /** Only present when status === 'FAILED' */
  error_message?: string;
  /** Approximate word count of the entry content */
  word_count?: number;
}

// ── Availability ───────────────────────────────────────────────────────────────
export type AvailabilityStatus = 'AVAILABLE' | 'CONFLICT' | 'UNKNOWN';

export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export interface WorkingHours {
  day: DayOfWeek;
  enabled: boolean;
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
}

export interface BlockedDate {
  id: string;
  date: string; // "YYYY-MM-DD"
  reason: string;
  status: AvailabilityStatus;
}

export interface AvailabilityConfig {
  working_hours: WorkingHours[];
  blocked_dates: BlockedDate[];
  /** Lead time in days before an event the vendor needs */
  lead_time_days: number;
  /** Max concurrent bookings */
  max_concurrent_bookings: number;
}

// ── Business Profile ───────────────────────────────────────────────────────────
export interface BusinessProfile {
  business_name: string;
  business_type: string;
  contact_email: string;
  contact_phone: string;
  location: string;
  description: string;
  website?: string;
}
