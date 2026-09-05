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
