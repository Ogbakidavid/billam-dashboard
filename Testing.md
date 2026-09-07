# BillAm Agent — Test Scenario Guide

Four scenarios used to verify the agent end to end, covering the happy path,
the clarification path, a known edge case, and the infeasibility safeguard.
Each scenario has two testing methods below: through the real frontend
(Chat Simulator) and directly against the backend (curl).

---

## Prerequisites

- Backend running: `pnpm run dev` in the `BillAm-agent` repo, confirm it
  logs `listening at http://localhost:3005` (or whichever port is free —
  check for port conflicts with other local projects first).
- Frontend running: `npx next dev -p 4029` in the `billam-dashboard` repo.
- Jobs are stored **in memory only**. Restarting the backend wipes every
  job that existed. Always create a fresh job before each test.

---

## Part 1 — Frontend Testing (Chat Simulator)

Go to `http://localhost:4029/dashboard/chat`.

**Before every scenario:** click **Reset** (top right, next to the persona
selector). This creates a brand-new real job on the backend. If the
backend server itself was restarted, do a full browser page refresh
instead of just Reset, since a restart wipes all jobs and Reset alone
won't recover from that.

### Scenario 1 — Happy Path (exact budget)
**Goal:** confirm a complete brief with a specific number goes straight to
a computed quote.

1. Click Reset.
2. Send:
   > Good day! I am planning a wedding for about 150 guests on November
   > 20th in Lekki. Our budget is around 2 million Naira.
3. **Expected result:** agent replies with a status message —
   *"Thanks! I've got everything I need. I'm preparing your quote now,
   the business owner will review it shortly."*
   This confirms the job reached `AWAITING_HUMAN_APPROVAL` with a real
   quote. Check the matching job's detail page (Jobs list) to see the
   actual line items and total.

### Scenario 2 — Vague Pidgin Brief (missing field)
**Goal:** confirm a genuinely incomplete brief triggers a real clarifying
question, not a fake or generic one.

1. Click Reset.
2. Send:
   > We wan do baby shower for my wife, next month, maybe Saturday. We no
   > get too much money, but we still want am to look sweet. We need
   > backdrop, some balloons, and maybe small table decoration. Location
   > na Surulere area, or maybe online sha.
3. **Expected result:** agent asks a real, natural clarifying question
   about the missing guest count, no raw JSON, no generic script.
   Checking the matching Job Detail page's Client Brief panel should show
   Event Type, Date, Location, and Budget as present, and Guests flagged
   as missing.

### Scenario 3 — Multi-Field Brief, Vague Budget (known inconsistent case)
**Goal:** stress-test a brief that's complete but has an ambiguous,
non-numeric budget signal.

1. Click Reset.
2. Send:
   > We're planning a corporate launch for 80 guests on 15th October,
   > indoor hall in Lekki Phase 1. We want it to look premium, but we no
   > wan waste money. Need a backdrop with our company logo, balloon
   > arch, table decoration for all 80 guests.
3. **Expected result:** usually succeeds with a real computed quote.
   **Known behaviour:** this specific message has produced both a
   successful quote and a `FAILED_RETRY` infeasibility response across
   repeated identical runs. This is not a bug — it reflects genuine
   variance in how the underlying model judges an ambiguous, non-numeric
   budget signal ("we no wan waste money") for a premium-sounding
   request. Re-run it more than once if you want to observe this
   directly. Scenarios with an exact number (like Scenario 1) do not show
   this inconsistency.

### Scenario 4 — Clearly Infeasible Request (exact low budget)
**Goal:** confirm the system refuses to fabricate a quote when the
numbers are obviously unrealistic.

1. Click Reset.
2. Send:
   > We are having a wedding reception next weekend, venue not decided
   > yet. We need full catering for 500 people, decor including
   > backdrop, balloons and table settings, plus music and DJ, and
   > photography and video. Total budget is not more than 150,000 naira
   > for everything.
3. **Expected result:** agent replies —
   *"Hmm, I'm having trouble putting together a realistic quote for this
   request. Someone from our team will reach out to you directly."*
   This confirms the job correctly reached `FAILED_RETRY` instead of
   silently producing a fake quote. Because this budget is unambiguously
   too low (not just vague), this result should stay consistent across
   repeated runs, unlike Scenario 3.

---

## Part 2 — Backend Testing (curl)

**Before every scenario**, create a fresh job:

```bash
curl -X POST http://localhost:3005/jobs \
  -H "Content-Type: application/json" \
  -d "{\"business_id\": \"biz_vendor_001\", \"business_type\": \"event_vendor\"}"
```

Copy the `job_id` from the JSON response — you'll substitute it for
`PASTE_JOB_ID` in the next command.

### Scenario 1 — Happy Path
```bash
curl -X POST http://localhost:3005/jobs/PASTE_JOB_ID/messages \
  -H "Content-Type: application/json" \
  -d "{\"message_text\": \"Good day! I am planning a wedding for about 150 guests on November 20th in Lekki. Our budget is around 2 million Naira.\", \"received_at\": \"2026-09-06T12:00:00.000Z\"}"
```
**Check for:** `"state": "AWAITING_HUMAN_APPROVAL"` and a populated `quote`
object with real `line_items`, `contingencies`, and a non-zero `total`.

### Scenario 2 — Vague Pidgin Brief
```bash
curl -X POST http://localhost:3005/jobs/PASTE_JOB_ID/messages \
  -H "Content-Type: application/json" \
  -d "{\"message_text\": \"We wan do baby shower for my wife, next month, maybe Saturday. We no get too much money, but we still want am to look sweet. We need backdrop, some balloons, and maybe small table decoration. Location na Surulere area, or maybe online sha.\", \"received_at\": \"2026-09-06T12:00:00.000Z\"}"
```
**Check for:** `"state": "CLARIFYING"` and
`"missing_required_fields": ["guest_count"]`. The `messages` array should
include a third message from `"sender": "agent"` with a clean, natural
clarifying question.

### Scenario 3 — Vague Budget (known inconsistent case)
```bash
curl -X POST http://localhost:3005/jobs/PASTE_JOB_ID/messages \
  -H "Content-Type: application/json" \
  -d "{\"message_text\": \"We're planning a corporate launch for 80 guests on 15th October, indoor hall in Lekki Phase 1. We want it to look premium, but we no wan waste money. Need a backdrop with our company logo, balloon arch, table decoration for all 80 guests.\", \"received_at\": \"2026-09-06T12:00:00.000Z\"}"
```
**Check for:** either `"state": "AWAITING_HUMAN_APPROVAL"` with a real
quote, or `"state": "FAILED_RETRY"` with `"quote": null`. Both are valid
outcomes for this specific message — see the note under Scenario 3 above.

### Scenario 4 — Infeasible Request
```bash
curl -X POST http://localhost:3005/jobs/PASTE_JOB_ID/messages \
  -H "Content-Type: application/json" \
  -d "{\"message_text\": \"We are having a wedding reception next weekend, venue not decided yet. We need full catering for 500 people, decor including backdrop, balloons and table settings, plus music and DJ, and photography and video. Total budget is not more than 150,000 naira for everything.\", \"received_at\": \"2026-09-06T12:00:00.000Z\"}"
```
**Check for:** `"state": "FAILED_RETRY"`, `"quote": null`, and a real,
non-null `error_message` explaining the infeasibility (not a generic or
empty error).

---

## Quick Reference Table

| # | Scenario | Trigger | Expected State | Consistency |
|---|----------|---------|-----------------|-------------|
| 1 | Happy path | Complete brief, exact budget | `AWAITING_HUMAN_APPROVAL` | Reliable |
| 2 | Vague Pidgin | Missing guest count | `CLARIFYING` | Reliable |
| 3 | Vague budget | Complete brief, no exact number | `AWAITING_HUMAN_APPROVAL` or `FAILED_RETRY` | **Inconsistent** — known LLM judgment variance |
| 4 | Infeasible | Complete brief, unrealistically low exact budget | `FAILED_RETRY` | Reliable |

**Out of scope:** the PRD's original tailor-business scenario is not
tested here, since `tailor.json` doesn't exist in the knowledge base or
price catalog — the MVP is scoped to `event_vendor` only.