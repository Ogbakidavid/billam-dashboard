# BillAm Agent — Current End-to-End Test Guide

This guide tests the live connection from the Chat Simulator to the BillAm
Agent API. It covers the same four paths as the earlier guide: a complete
brief, clarification, an ambiguous-budget case, and an infeasible request.

## Current Runtime Contract

- Frontend: `http://localhost:4028` (`npm run dev` in this repository).
- Backend: `http://localhost:3001` by default (`pnpm run dev` in
  `BillAm-agent`). Set `NEXT_PUBLIC_API_URL` if the backend uses another port.
- The simulator creates a job when the first client message is sent, not when
  **Reset** is clicked.
- Jobs persist in `BillAm-agent/.jobs-store.json`. Reset starts a new simulator
  thread but does not delete historic jobs. Delete that file only when you
  intentionally want a clean local store while the backend is stopped.
- Each new simulator job uses the client persona selected in the dropdown. The
  selected name is persisted on the job and is used throughout the chat, Jobs
  list, and Job Detail page.
- The event type comes from the validated `event_type` field. Values such as
  `baby_shower` are displayed as readable labels such as “Baby Shower”.
- Quotes are stored as drafts. The client receives a team-oriented
  acknowledgement while we finalize the quote; the itemised quote is sent only
  after an SME approves it on the Job Detail page.

## Before You Start

1. In `BillAm-agent`, start the API:

   ```bash
   pnpm run dev
   ```

   Confirm the terminal reports `http://localhost:3001`, or note the actual
   port and set `NEXT_PUBLIC_API_URL` in the frontend environment before
   starting Next.js.

2. In `billam-dashboard`, start the dashboard:

   ```bash
   npm run dev
   ```

3. Open `http://localhost:4028/dashboard/chat`.

4. Before each scenario, click **Reset**, select the client persona you want to
   simulate, then send the scenario's first message. Use the job ID shown in
   the simulator to locate the same record under **Jobs**.

## What Is Deterministic vs Model-Led

The API contract is deterministic: an accepted message is persisted, the job
is returned by its own ID, and a saved quote is represented as
`AWAITING_HUMAN_APPROVAL`. The wording of a clarification and ambiguous
business judgement are model-led. Test the state, persisted fields, and data
shape rather than requiring exact client-facing wording.

Clarifications should follow the `conversation-style` skill: short, natural,
context-aware, non-numbered, and in an English/Pidgin register appropriate to
the client. It should not expose field names, raw JSON, or a questionnaire.

## Scenario 1 — Complete Brief With Exact Budget

Send:

> Good day! I am planning a wedding for about 150 guests on November 20th in Lekki. Our budget is around 2 million Naira.

Expected result:

- The simulator replaces its optimistic message with the server transcript.
- The agent posts a team-oriented acknowledgement such as “Our team is putting
  your quote together now and will get back to you shortly.” Exact phrasing can
  vary, but it must not mention the business owner, internal approval, or claim
  that the quote was already sent.
- The job reaches `AWAITING_HUMAN_APPROVAL`.
- The Job Detail page for that job ID shows the selected client persona, wedding
  title, extracted brief, quote line items, contingencies, and non-zero total.
- Approving the quote appends the draft quote message to the same transcript
  and transitions the job to `EXECUTED`.

## Scenario 2 — Vague Pidgin Brief With a Missing Field

Send:

> We wan do baby shower for my wife, next month, maybe Saturday. We no get too much money, but we still want am to look sweet. We need backdrop, some balloons, and maybe small table decoration. Location na Surulere area, or maybe online sha.

Expected result:

- The job reaches `CLARIFYING` while the agent still needs a guest count and a
  specific event date. The baby-shower event type should remain `baby_shower`.
- `missing_required_fields` reflects the unresolved prerequisites, normally
  including `guest_count` and `event_date` for this message.
- The transcript includes an agent clarification. It should ask naturally for
  the missing information—not show JSON, field keys, or a numbered form.
- Send a follow-up with a guest count. The agent should merge it with the
  first message rather than asking for supplied information again.

If a model run identifies another genuinely required ambiguity, verify that it
is reflected in `missing_required_fields`; do not treat it as a UI fallback.

## Scenario 3 — Complete Brief With an Ambiguous Budget Signal

Send:

> We're planning a corporate launch for 80 guests on 15th October, indoor hall in Lekki Phase 1. We want it to look premium, but we no wan waste money. Need a backdrop with our company logo, balloon arch, table decoration for all 80 guests.

Expected result:

- A normal result is `AWAITING_HUMAN_APPROVAL` with a populated quote.
- `FAILED_RETRY` with no quote is also an acceptable result if the model judges
  the premium scope incompatible with the ambiguous low-cost signal.
- Repeat this case only when observing model judgement variance; it is not an
  exact-output regression test.

## Scenario 4 — Clearly Infeasible Exact Budget

Send:

> We are having a wedding reception next weekend, venue not decided yet. We need full catering for 500 people, decor including backdrop, balloons and table settings, plus music and DJ, and photography and video. Total budget is not more than 150,000 naira for everything.

Expected result:

- The agent should not save a normal quote for this scope and budget.
- The intended terminal state is `FAILED_RETRY`, with `quote: null` and a
  non-empty `error_message` explaining the feasibility issue.
- The client transcript should contain a polite technical/owner-follow-up
  message rather than an invented quote.

## API Verification (Optional)

Create a fresh job:

```bash
curl -X POST http://localhost:3001/jobs \
  -H "Content-Type: application/json" \
  -d '{"business_id":"biz-event-decoration","business_type":"event_vendor","client_name":"Sarah Adeyemi"}'
```

Send one scenario message, substituting the returned ID:

```bash
curl -X POST http://localhost:3001/jobs/PASTE_JOB_ID/messages \
  -H "Content-Type: application/json" \
  -d '{"message_text":"Good day! I am planning a wedding for about 150 guests on November 20th in Lekki. Our budget is around 2 million Naira.","received_at":"2026-09-11T12:00:00.000Z"}'
```

Check the response for `state`, `extracted_fields`, `messages`, and, for the
happy path, a non-null `quote`. Fetch the same record with:

```bash
curl http://localhost:3001/jobs/PASTE_JOB_ID
```

## Scope Notes

- The Chat Simulator, Jobs list, Job Detail page, detail transcript, brief,
  quote data, and approval request use the API.
- Some dashboard-only presentation and editing surfaces still contain demo
  data or local-only interactions. They are outside this live simulator test
  path and must not be used as proof of API persistence.
