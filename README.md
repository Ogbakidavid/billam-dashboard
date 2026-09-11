# BillAm Dashboard

BillAm Dashboard is the Next.js frontend for the BillAm Agent workflow. It gives an SME owner a live view of jobs, client conversations, generated quotes, approvals, activity, and notes.

## Connected workflow

The dashboard is API-backed for operational data. It connects to the BillAm Agent backend through `NEXT_PUBLIC_API_URL` (default: `http://localhost:3001`). The development frontend runs on `http://localhost:4028`.

The main testing path is:

1. Open `/dashboard/chat` and choose a client persona.
2. Send a client brief to create/process a job.
3. Watch the agent response and open the generated job from `/dashboard/jobs`.
4. Review the structured brief and quote.
5. Edit the quote if needed, then approve and send it.
6. Confirm the job becomes `Executed`, the quote becomes `sent`, and the quote appears in the client conversation and quotes dashboard.

Generated jobs receive a random client name and phone number when the backend request does not provide identity data. Job and quote tables sort the newest activity first.

## Stack

- Next.js 15, React 19, TypeScript
- Tailwind CSS and Lucide icons
- Recharts for dashboard activity visualisation
- Native `fetch` API client in `src/lib/api.ts`

## Getting started

Start the backend first, then run the dashboard:

```bash
npm install
npm run dev
```

Open [http://localhost:4028](http://localhost:4028).

To use another backend URL, set it in `.env.local`:

```text
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Useful routes

- `/dashboard` — overview and recent jobs
- `/dashboard/chat` — client-side chat simulator
- `/dashboard/jobs` — API-backed job list
- `/dashboard/jobs/:id` — chat, brief, quote, activity, and notes for one job
- `/dashboard/quotes` — API-backed quote list and approval actions

## Checks

```bash
npm run type-check
npm run build
```

The production build may require network access if Next.js needs to download remote fonts. Type checking does not require that network request.

## Intentional demo areas

The marketing/landing pages and a few editor/settings surfaces contain presentation fixtures or local-only interactions. They are intentionally outside the live job/quote workflow. Operational job, chat, quote, approval, identity, amount, and status data should come from the backend API.

See [`testing.md`](./testing.md) for the current end-to-end test scenarios.
