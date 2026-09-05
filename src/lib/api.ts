import {
  Message,
  LineItem,
  Contingency,
  BriefFieldEntry,
  Quote,
  QuoteStatus,
  AuditEvent,
  AuditEventType,
  Job,
} from '@/app/dashboard/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3005';

export interface CreateJobParams {
  businessId: string;
  businessType: 'event_vendor' | 'caterer' | 'tailor';
}

export interface CreateJobResult {
  id: string;
  businessId: string;
  businessType: string;
  state: string;
}

export async function createJob(params: CreateJobParams): Promise<CreateJobResult> {
  const res = await fetch(`${API_BASE_URL}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      business_id: params.businessId,
      business_type: params.businessType,
    }),
  });

  if (!res.ok) {
    throw new Error(`createJob failed: ${res.status}`);
  }

  const json = await res.json();
  const job = json.data;

  // Backend sends job_id, frontend types.ts expects id — rename here.
  return {
    id: job.job_id,
    businessId: job.business_id,
    businessType: job.business_type,
    state: job.state,
  };
}

function mapMessage(msg: any): Message {
  return {
    id: msg.message_id,
    sender: msg.sender,
    text: msg.text,
    timestamp: msg.created_at,
  };
}

function mapLineItem(item: any): LineItem {
  return {
    id: item.label ?? item.name ?? '',
    name: item.name ?? item.label ?? '',
    // Backend doesn't currently send quantity/unit_price — default to 1
    // and the total itself, so the UI still shows a sane number rather
    // than crashing on undefined.
    quantity: item.quantity ?? 1,
    unit_price: item.unit_price ?? item.total ?? 0,
    total: item.total ?? 0,
  };
}

function mapContingency(item: any): Contingency {
  return {
    id: item.label ?? item.name ?? '',
    label: item.label ?? item.name ?? '',
    // Backend never sends the rate that produced this amount, only the
    // final computed number — null is honest here, not a guess.
    rate: item.rate ?? null,
    amount: item.amount ?? 0,
  };
}

const FIELD_LABELS: Record<string, string> = {
  event_type: 'Event Type',
  guest_count: 'Guests',
  event_date: 'Date',
  venue_location: 'Location',
  budget_range: 'Budget',
};

function mapExtractedFields(
  extractedFields: Record<string, any>,
  missingFields: string[]
): BriefFieldEntry[] {
  // Backend has no concept of a "warning" status — only present vs missing.
  const allKeys = new Set([...Object.keys(extractedFields), ...missingFields]);

  return Array.from(allKeys).map((key) => {
    const isMissing = missingFields.includes(key);
    return {
      key,
      label: FIELD_LABELS[key] ?? key,
      value: isMissing ? '' : String(extractedFields[key] ?? ''),
      status: isMissing ? 'missing' : 'confirmed',
    };
  });
}

function mapQuote(jobId: string, quote: any): Quote | undefined {
  if (!quote) return undefined;

  // Backend uses uppercase DRAFT/SENT; frontend expects lowercase.
  // Backend has no equivalent of awaiting_approval/expired, so those
  // two frontend states simply never occur from real data right now.
  const statusMap: Record<string, QuoteStatus> = {
    DRAFT: 'draft',
    SENT: 'sent',
  };

  return {
    id: jobId, // backend quotes have no separate id — reuse job id
    job_id: jobId,
    line_items: (quote.line_items ?? []).map(mapLineItem),
    contingencies: (quote.contingencies ?? []).map(mapContingency),
    subtotal: quote.subtotal ?? 0,
    total: quote.total ?? 0,
    status: statusMap[quote.status] ?? 'draft',
    created_at: quote.created_at ?? new Date().toISOString(),
    updated_at: quote.updated_at ?? new Date().toISOString(),
  };
}

function mapAuditEvent(event: any): AuditEvent {
  // Backend has many granular event_type values (TOOL_STARTED,
  // CLARIFICATION_SENT, QUOTE_APPROVED, etc). Frontend only wants who
  // acted (agent/client/sme/system), so we derive that from `actor`
  // rather than trying to map each specific event_type 1:1.
  const actorMap: Record<string, AuditEventType> = {
    system: 'system',
    sme: 'sme',
    client: 'client',
  };

  return {
    id: event.event_id,
    job_id: event.job_id,
    type: actorMap[event.actor] ?? 'agent',
    label: event.event_type,
    detail: event.details ? JSON.stringify(event.details) : undefined,
    timestamp: event.created_at,
  };
}

function mapJob(backendJob: any): Job {
  return {
    id: backendJob.job_id,
    business_id: backendJob.business_id,
    business_type: backendJob.business_type,
    state: backendJob.state,
    messages: (backendJob.messages ?? []).map(mapMessage),
    extracted_fields: mapExtractedFields(
      backendJob.extracted_fields ?? {},
      backendJob.missing_required_fields ?? []
    ),
    missing_fields: backendJob.missing_required_fields ?? [],
    quote: mapQuote(backendJob.job_id, backendJob.quote),
    audit_events: [], // backend doesn't return audit trail on the job object itself — see getAuditTrail below
    created_at: backendJob.created_at,
    updated_at: backendJob.updated_at,
  };
}

export async function getJob(id: string): Promise<Job> {
  const res = await fetch(`${API_BASE_URL}/jobs/${id}`);

  if (!res.ok) {
    throw new Error(`getJob failed: ${res.status}`);
  }

  const json = await res.json();
  return mapJob(json.data);
}

export async function sendMessage(id: string, text: string): Promise<Job> {
  const res = await fetch(`${API_BASE_URL}/jobs/${id}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message_text: text,
      received_at: new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    throw new Error(`sendMessage failed: ${res.status}`);
  }

  const json = await res.json();
  return mapJob(json.data);
}

export async function getQuote(id: string): Promise<Quote | undefined> {
  const res = await fetch(`${API_BASE_URL}/jobs/${id}/quote`);

  if (!res.ok) {
    throw new Error(`getQuote failed: ${res.status}`);
  }

  const json = await res.json();
  return mapQuote(id, json.data);
}

export async function editQuote(
  id: string,
  lineItems: LineItem[],
  notes?: string
): Promise<Quote | undefined> {
  const res = await fetch(`${API_BASE_URL}/jobs/${id}/quote`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      line_items: lineItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.total,
      })),
      notes,
    }),
  });

  if (!res.ok) {
    throw new Error(`editQuote failed: ${res.status}`);
  }

  const json = await res.json();
  return mapQuote(id, json.data.quote ?? json.data);
}

export interface ApproveQuoteResult {
  id: string;
  state: string;
  quoteStatus: string;
  sentAt: string;
}

export async function approveQuote(
  id: string,
  approvedBy: string
): Promise<ApproveQuoteResult> {
  const res = await fetch(`${API_BASE_URL}/jobs/${id}/approve_quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ approved_by: approvedBy }),
  });

  if (!res.ok) {
    throw new Error(`approveQuote failed: ${res.status}`);
  }

  const json = await res.json();
  const data = json.data;

  return {
    id: data.job_id,
    state: data.state,
    quoteStatus: data.quote_status,
    sentAt: data.sent_at,
  };
}

export interface MissingFieldsResult {
  missingFields: string[];
  summary?: string;
}

export async function getMissingFields(id: string): Promise<MissingFieldsResult> {
  const res = await fetch(`${API_BASE_URL}/jobs/${id}/missing_fields`);

  if (!res.ok) {
    throw new Error(`getMissingFields failed: ${res.status}`);
  }

  const json = await res.json();
  return {
    missingFields: json.data.missing_fields ?? [],
    summary: json.data.summary,
  };
}

export async function submitManualInput(
  id: string,
  suppliedFields: Record<string, any>,
  source?: string
): Promise<Job> {
  const res = await fetch(`${API_BASE_URL}/jobs/${id}/manual_input`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ supplied_fields: suppliedFields, source }),
  });

  if (!res.ok) {
    throw new Error(`submitManualInput failed: ${res.status}`);
  }

  const json = await res.json();
  return mapJob(json.data);
}

export async function retryJob(id: string): Promise<Job> {
  const res = await fetch(`${API_BASE_URL}/jobs/${id}/retry`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error(`retryJob failed: ${res.status}`);
  }

  const json = await res.json();
  return mapJob(json.data);
}