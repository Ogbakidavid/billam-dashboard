import { Message, LineItem, Contingency, BriefFieldEntry } from '@/app/dashboard/types';

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
    id: item.label ?? item.name ?? "",
    name: item.name ?? item.label ?? "",
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
    id: item.label ?? item.name ?? "",
    label: item.label ?? item.name ?? "",
    // Backend never sends the rate that produced this amount, only the
    // final computed number — null is honest here, not a guess.
    rate: item.rate ?? null,
    amount: item.amount ?? 0,
  };
}

const FIELD_LABELS: Record<string, string> = {
  event_type: "Event Type",
  guest_count: "Guests",
  event_date: "Date",
  venue_location: "Location",
  budget_range: "Budget",
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
      value: isMissing ? "" : String(extractedFields[key] ?? ""),
      status: isMissing ? "missing" : "confirmed",
    };
  });
}