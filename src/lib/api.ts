/**
 * BillAm Agent API Client
 * Connects the Next.js Frontend (billam) to the Express Backend (BillAm-agent)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const data = await response.json();
  if (!response.ok || data.success === false) {
    const errorMsg = data.error?.message || data.error || `HTTP ${response.status}`;
    throw new Error(errorMsg);
  }

  return data.data;
}

export interface ApiJob {
  job_id: string;
  business_id: string;
  business_type: string;
  state: string;
  clarification_round: number;
  messages: Array<{
    message_id: string;
    job_id: string;
    sender: 'client' | 'agent' | 'sme';
    message_type: string;
    text: string;
    created_at: string;
  }>;
  extracted_fields: Record<string, string>;
  missing_required_fields: string[];
  quote: {
    id: string;
    job_id: string;
    line_items: Array<{
      id: string;
      name: string;
      quantity: number;
      unit_price: number;
      total: number;
    }>;
    contingencies: Array<{
      id: string;
      label: string;
      rate: number | null;
      amount: number;
    }>;
    subtotal: number;
    total: number;
    status: string;
    created_at: string;
    updated_at: string;
  } | null;
  error_message?: string | null;
  audit_events: Array<{
    id: string;
    job_id: string;
    type: string;
    label: string;
    detail?: string;
    timestamp: string;
  }>;
  created_at: string;
  updated_at: string;
}

/** List all jobs */
export async function getJobs(businessId?: string): Promise<{ jobs: ApiJob[] }> {
  const query = businessId ? `?business_id=${businessId}` : '';
  return fetchApi<{ jobs: ApiJob[] }>(`/jobs${query}`);
}

/** Get a single job by ID */
export async function getJob(jobId: string): Promise<ApiJob> {
  return fetchApi<ApiJob>(`/jobs/${jobId}`);
}

/** Create a new job */
export async function createJob(payload: {
  business_id: string;
  business_type: string;
  client_message: string;
}): Promise<ApiJob> {
  return fetchApi<ApiJob>('/jobs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** Append client or SME message to a job */
export async function postMessage(
  jobId: string,
  payload: { text: string; sender?: 'client' | 'sme' }
): Promise<ApiJob> {
  return fetchApi<ApiJob>(`/jobs/${jobId}/messages`, {
    method: 'POST',
    body: JSON.stringify({
      message_text: payload.text,
      received_at: new Date().toISOString(),
      sender: payload.sender ?? 'client',
    }),
  });
}

/** Edit quote line items / contingencies */
export async function editQuote(
  jobId: string,
  payload: {
    line_items?: Array<{ id: string; name: string; quantity: number; unit_price: number; total: number }>;
    contingencies?: Array<{ id: string; label: string; rate: number | null; amount: number }>;
  }
): Promise<{ quote: ApiJob['quote'] }> {
  return fetchApi<{ quote: ApiJob['quote'] }>(`/jobs/${jobId}/quote`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

/** Approve quote */
export async function approveQuote(jobId: string): Promise<ApiJob> {
  return fetchApi<ApiJob>(`/jobs/${jobId}/approve_quote`, {
    method: 'POST',
  });
}

/** Submit manual SME input for missing fields */
export async function submitManualInput(
  jobId: string,
  payload: { supplied_fields: Record<string, any>; source?: string }
): Promise<ApiJob> {
  return fetchApi<ApiJob>(`/jobs/${jobId}/manual_input`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** Retry failed job */
export async function retryJob(jobId: string): Promise<ApiJob> {
  return fetchApi<ApiJob>(`/jobs/${jobId}/retry`, {
    method: 'POST',
  });
}

// ==========================================
// KNOWLEDGE BASE API
// ==========================================

export interface ApiKnowledgeEntry {
  knowledge_id: string;
  business_id: string;
  name: string;
  source_type: string;
  status: 'UPLOADING' | 'PROCESSING' | 'READY' | 'FAILED';
  input_method: 'file' | 'manual';
  file_name?: string;
  error_message?: string;
  created_at: string;
}

export async function getKnowledgeSources(businessId: string): Promise<ApiKnowledgeEntry[]> {
  return fetchApi<ApiKnowledgeEntry[]>(`/knowledge?business_id=${businessId}`);
}

export async function createKnowledgeSource(payload: {
  business_id: string;
  name: string;
  source_type: string;
  input_method: 'file' | 'manual';
  file_name?: string;
}): Promise<ApiKnowledgeEntry> {
  return fetchApi<ApiKnowledgeEntry>('/knowledge', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateKnowledgeSource(
  id: string,
  payload: Partial<ApiKnowledgeEntry>
): Promise<ApiKnowledgeEntry> {
  return fetchApi<ApiKnowledgeEntry>(`/knowledge/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteKnowledgeSource(id: string): Promise<{ success: boolean }> {
  return fetchApi<{ success: boolean }>(`/knowledge/${id}`, {
    method: 'DELETE',
  });
}

// ==========================================
// AVAILABILITY API
// ==========================================

export interface ApiAvailabilityDate {
  id: string;
  business_id: string;
  date: string;
  status: 'available' | 'booked' | 'blocked';
  reason?: string;
  created_at: string;
}

export async function getAvailabilityDates(businessId: string): Promise<ApiAvailabilityDate[]> {
  return fetchApi<ApiAvailabilityDate[]>(`/availability?business_id=${businessId}`);
}

export async function createAvailabilityDate(payload: {
  business_id: string;
  date: string;
  status: 'available' | 'booked' | 'blocked';
  reason?: string;
}): Promise<ApiAvailabilityDate> {
  return fetchApi<ApiAvailabilityDate>('/availability', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateAvailabilityDate(
  id: string,
  payload: Partial<ApiAvailabilityDate>
): Promise<ApiAvailabilityDate> {
  return fetchApi<ApiAvailabilityDate>(`/availability/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteAvailabilityDate(id: string): Promise<{ success: boolean }> {
  return fetchApi<{ success: boolean }>(`/availability/${id}`, {
    method: 'DELETE',
  });
}

export async function checkAvailability(
  businessId: string,
  date: string
): Promise<{ available: boolean; conflict_reason?: string }> {
  return fetchApi<{ available: boolean; conflict_reason?: string }>(
    `/availability/check?business_id=${businessId}&date=${date}`
  );
}

