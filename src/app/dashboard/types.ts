/**
 * BillAm Canonical Frontend Types
 * Aligned with the backend contract. These are the single source of truth.
 * Do NOT create duplicate domain/UI models.
 */

// ── Job State ──────────────────────────────────────────────────────────────────
export type JobState =
  | 'IDLE' |'INGESTING' |'REASONING' |'CLARIFYING' |'NEEDS_SME_INPUT' |'AWAITING_HUMAN_APPROVAL' |'EXECUTED' |'FAILED_RETRY';

/** Map canonical JobState → human-readable UI label */
export const JOB_STATE_LABELS: Record<JobState, string> = {
  IDLE:                     'Idle',
  INGESTING:                'Ingesting',
  REASONING:                'In Progress',
  CLARIFYING:               'Clarifying',
  NEEDS_SME_INPUT:          'Needs your input',
  AWAITING_HUMAN_APPROVAL:  'Awaiting approval',
  EXECUTED:                 'Executed',
  FAILED_RETRY:             'Failed / Retry',
};

// ── Quote Status ───────────────────────────────────────────────────────────────
export type QuoteStatus = 'draft' | 'awaiting_approval' | 'sent' | 'expired';

// ── Business Type ──────────────────────────────────────────────────────────────
export type BusinessType =
  | 'event_vendor'
  | 'caterer' |'tailor' |'photographer' |'event_planner' |'equipment_rental';

// ── Message ────────────────────────────────────────────────────────────────────
export type MessageSender = 'client' | 'agent' | 'sme' | 'system';

export interface Message {
  id: string;
  sender: MessageSender;
  text: string;
  /** ISO 8601 timestamp string, e.g. "2026-09-01T10:02:00Z" */
  timestamp: string;
}

// ── Quote Line Item ────────────────────────────────────────────────────────────
export interface LineItem {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

// ── Quote Contingency ──────────────────────────────────────────────────────────
export interface Contingency {
  id: string;
  label: string;
  /** Rate as a decimal (e.g. 0.05 = 5%) or null if fixed amount */
  rate: number | null;
  /** Absolute amount in NGN (numeric) */
  amount: number;
}

// ── Quote ──────────────────────────────────────────────────────────────────────
export interface Quote {
  id: string;
  job_id: string;
  line_items: LineItem[];
  contingencies: Contingency[];
  /** Numeric NGN — format only at render time */
  subtotal: number;
  /** Numeric NGN — format only at render time */
  total: number;
  status: QuoteStatus;
  created_at: string;
  updated_at: string;
}

// ── Brief Fields ───────────────────────────────────────────────────────────────
export type BriefFieldStatus = 'confirmed' | 'warning' | 'missing';

export interface BriefFieldEntry {
  key: string;
  label: string;
  value: string;
  status: BriefFieldStatus;
}

// ── Audit Event ────────────────────────────────────────────────────────────────
export type AuditEventType = 'agent' | 'client' | 'sme' | 'system';

export interface AuditEvent {
  id: string;
  job_id?: string;
  type: AuditEventType;
  label: string;
  detail?: string;
  /** ISO 8601 timestamp string */
  timestamp: string;
}

// ── Job ────────────────────────────────────────────────────────────────────────
export interface Job {
  /** UUID string */
  id: string;
  business_id: string;
  business_type: BusinessType;
  state: JobState;
  messages: Message[];
  extracted_fields: BriefFieldEntry[];
  missing_fields: string[];
  quote?: Quote;
  audit_events: AuditEvent[];
  created_at: string;
  updated_at: string;
  /** Display helpers — populated from conversation context */
  client_name?: string;
  client_phone?: string;
  service?: string;
  job_title?: string;
}
