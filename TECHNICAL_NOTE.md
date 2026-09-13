# BillAm Agent

## What We Built

BillAm is an AI assistant that helps Nigerian small and medium-sized businesses respond to client enquiries, gather the details needed for a job, draft quotes, and move each request through a controlled approval workflow.

The agent is designed for businesses such as event decorators, caterers, tailors, photographers, event planners, and equipment rental companies. A client can send a natural-language request, including Nigerian business phrasing and informal budget descriptions, and BillAm turns that conversation into structured job information.

The core flow is:

```text
Client message → Interpret current intent → Validate brief → Clarify if needed → Draft quote → SME approval
```

The agent does not send quotes autonomously. It gathers information, checks the request against the business knowledge base, calculates a draft using the relevant price catalogue, and saves the result for the business owner to review.

The important invariant is that a quote cannot be drafted merely because the model extracted something that looks related to a required field. The backend computes the authoritative missing-field list from the business knowledge base after every turn. Only when every configured prerequisite is present and valid can the job enter `AWAITING_HUMAN_APPROVAL`.

Each stage has a distinct responsibility:

- **Ingestion and extraction** — Reads the client's message and identifies fields such as event type, guest count, date, venue, budget, and special requests.
- **Conversation and clarification** — Interprets greetings, general questions, complete requests, partial requests, and answers to earlier questions from the current context. It asks focused follow-up questions when essential information is missing, re-checks the cumulative brief after every response, and can do this for a maximum of two autonomous rounds before escalating to the SME.
- **Quote generation** — Uses business-specific pricing data to calculate line items, logistics, rush fees, and other contingencies. It also prepares a client-facing draft message.
- **Approval and execution** — Keeps the quote in `AWAITING_HUMAN_APPROVAL` until the SME reviews it. Only the SME can approve and send it.
- **Persistence and recovery** — Preserves jobs, conversations, quote edits, acknowledgements, and availability information across requests and server restarts.

The current architecture is built around a Strands agent guided by a readable operating playbook rather than a large manually maintained conversation loop:

```text
Client message → Strands Agent → SOP + skills → bounded tools → persisted job state
                                      ↓
                         Clarification / SME escalation / quote approval
```

The agent's main behavior is defined in `billam-sop.md`. Its focused behaviors are separated into skills for conversation style and quote generation. Its tools are scoped to concrete operations such as reading a knowledge base, loading a price catalogue, updating a job, and recording a permitted message.

The dashboard is connected to the real backend workflow. It displays real messages, extracted fields, quote line items, totals, retry failures, escalation states, quote edits, and approval actions instead of relying on scripted responses or placeholder quotes.

## How We Built It

The first version was deliberately explicit. We started with a state machine, a job store, an audit log, an LLM provider abstraction, and a set of tools for ingestion, brief parsing, clarification, quote computation, and message simulation. This gave us a concrete foundation for enforcing important rules: clarification could not continue indefinitely, quotes required SME approval, and invalid state transitions were rejected.

We then connected the pieces into a manual orchestration loop. The loop coordinated the model, tools, state transitions, and client response. This allowed us to validate the main product flows, but it also made the agent difficult to change. Prompt logic was spread across TypeScript files, provider behavior lived inside custom wrappers, and the loop had to understand too many details at once.

The early implementation also taught us where model-driven systems fail in practice. Claude did not always return the exact field name or nesting shape we initially expected. Quote totals appeared under different keys, quote data was sometimes nested, responses could be truncated, and clarification output could expose raw JSON. We fixed these cases one by one, added real integration flows, and verified important edge cases—including requests whose budget was clearly infeasible for the requested scope.

At that point, the problem was no longer simply making the agent complete the workflow. We needed the agent to remain flexible enough to interpret different client messages, business types, and multi-turn conversations, while still being governed at runtime. The manual loop gave us control, but every new behavior had to be hardcoded into the orchestration logic. A completely open-ended agent would give us flexibility, but would make tool use, tone, clarification limits, approval boundaries, and failure handling harder to control. We pivoted to using the full Strands Agents SDK (orchestration) based on the concepts tab documentation to solve both sides of that problem: let the agent reason and adapt through an SOP, skills, and tools, while enforcing runtime governance through hooks, guardrails, bounded capabilities, and explicit state updates.

The major architectural change was the move to the full Strands Agents SDK orchestration model. Instead of continuing to expand the manual loop, we moved the agent's operating behavior into a declarative Standard Operating Procedure. The refactor introduced:

- `billam-sop.md` as the agent's master playbook.
- Modular skills for conversational clarification and quote generation.
- A Strands-based agent initializer.
- A native model adapter in place of the custom LLM client layer.
- Bounded tools for knowledge, pricing, job updates, and permitted messages.
- A rate-limiting hook to stop runaway tool loops.
- A tone guardrail to steer responses toward a professional, empathetic, concise style.
- JSON-backed persistence for jobs and related state.
- Knowledge-base and availability APIs.

The pivot was driven by two requirements that had to coexist: runtime governance and conversational flexibility. The manual orchestrator provided control, but each new conversational variation required another hardcoded branch. An entirely open-ended agent provided flexibility, but left too much responsibility to the model. Strands gave us a middle layer: the agent can interpret and choose the next useful action, while hooks, tool boundaries, state validation, invocation limits, and human approval enforce the operating rules at runtime.

The refactor changed the mental model of the system. The agent loop no longer owns every decision. The SOP defines the intended behavior, the skills explain how to perform specialized tasks, and the tools provide controlled capabilities. The SDK coordinates the agent's reasoning and tool use while the application remains responsible for domain state and safety boundaries.

After the main refactor, we continued hardening the lifecycle around it. We restored and aligned session management so conversational history matched the persisted job. We persisted generated client identity and quote acknowledgements. We made quote edits durable instead of treating them as temporary UI changes. We improved the handling of retry failures and availability status transitions. These changes were necessary because a persistent job and a persistent conversation are related, but they are not the same thing.

In parallel, the dashboard moved from mock data to live backend data. The frontend API client gained the complete job and quote workflow, response mappers translated backend shapes into UI models, and the chat simulator was connected to real jobs. This surfaced and fixed several integration issues: missing quote-message fields, status mismatches, fake quote fallbacks, failed-retry handling, and a duplicate React key caused by a field appearing in both extracted and missing data.

## Challenges We Faced

**Moving from a manual loop to an autonomous agent.** The hardest part of the refactor was deciding what should remain application logic and what should become agent behavior. The old loop made every decision in code. The new architecture needed the agent to reason more freely without weakening the approval gate, clarification limit, or state machine. We solved this by making the SOP explicit and keeping high-risk actions behind bounded tools and persisted state updates.

**Keeping the agent from running away.** A tool-using agent can repeatedly call tools when a response is unclear or a condition is not satisfied. We added a deterministic rate limiter that resets for each invocation and stops execution after five tool calls in a turn. This gives the agent a clear signal to stop using tools and respond.

**Preventing false completion.** Early behavior allowed the model's extracted fields or suggested missing-field list to influence downstream state too directly. That meant a vague value could be treated as complete, or a quote-ready state could be selected before the brief was actually sufficient. We added a backend validator that reads the configured business rules, rejects vague guest counts and unresolved dates, accepts explicit venue-to-be-decided answers, and recomputes missing fields from the merged persisted brief. The model interprets language; the application decides whether a requirement is satisfied.

**Maintaining natural conversation without adding state complexity.** The team considered adding a separate Concierge state. We chose not to expand the operational state machine. Concierge behavior is a reasoning responsibility inside the existing flow: the agent can greet, answer a general question, acknowledge supplied details, or ask for a specific missing field, while the same deterministic validation still controls quote, booking, and completion transitions.

**Avoiding duplicate clarification messages.** Retries and repeated tool calls can otherwise append the same question more than once. Clarification sends are now idempotent when the latest agent clarification has the same text, so a retry returns the existing message rather than creating a duplicate.

**Preserving human approval.** Quote generation and quote sending are different operations. The agent can calculate and draft a quote, but it must never send that quote directly to the client. We moved the workflow toward an explicit `AWAITING_HUMAN_APPROVAL` state and kept sending behind the SME dashboard approval action.

**Handling model output that is almost—but not exactly—right.** The model sometimes returned `total` instead of `total_amount`, nested quote data differently, or produced a response that exceeded the original token limit. Clarification responses also initially leaked raw JSON into the conversation. The fixes required tolerant parsing, larger response capacity, better tests, and a clearer separation between internal structured data and client-facing text.

**Recognizing infeasible requests.** A request can be technically complete but commercially impossible. For example, a large event paired with an unrealistically low budget should not produce an empty or misleading successful quote. The agent now treats feasibility as part of the workflow and can move the job into a failure or SME-intervention state with an explanation.

**Keeping persistence coherent.** Saving jobs to disk solved only part of the problem. Session history, generated identity, quote acknowledgements, quote edits, availability, and job state all need to agree. The post-refactor persistence work aligned these pieces so the system can continue a conversation without losing the business state around it.

**Replacing frontend illusions with backend truth.** The dashboard initially contained mock conversations and placeholder quote data. Once it was connected to the real agent, the UI had to represent states where no quote exists, where the agent has escalated to an SME, where a retry failed, or where approval is still pending. This was essential for making the product honest and testable.

**Keeping the dashboard current after a job is created.** A successful chat or job mutation previously required a manual page refresh before the overview and sidebar views reflected the new job. Mutation responses now emit a lightweight jobs-updated event. The relevant dashboard views refresh immediately and use a small polling fallback, keeping synchronization simple without introducing another heavy realtime subsystem.

**Making the new architecture understandable.** A framework migration can reduce code while increasing confusion if the boundaries are not documented. The SOP, skills, state names, tool contracts, API documentation, testing guides, and updated dashboard behavior all serve to make the new flow visible to the next developer.

## What We Learned

- **A narrow workflow is more reliable than a general-purpose agent.** BillAm works best when the task is constrained: collect a defined brief, ask for defined missing information, calculate from a defined catalogue, and stop at a defined approval boundary.
- **The orchestration layer should not own every decision.** The manual loop was useful for proving the first version, but it became a bottleneck. Moving the operating procedure into a readable playbook made the system easier to reason about and modify.
- **Safety must exist outside the prompt.** The approval gate, clarification cap, state validation, tool schemas, and rate limiter are stronger together than a written instruction alone. The agent can be guided by the SOP, but the application must still enforce the boundaries.
- **The model should interpret, not certify.** LLM extraction is useful for understanding natural language, but required-field satisfaction and state transitions must be deterministic. This prevents a plausible-sounding interpretation from becoming an unsafe quote or premature downstream action.
- **Natural conversation does not require a new operational state.** A concierge-like conversational layer can be implemented through context-aware reasoning while preserving a small, auditable state machine.
- **Tools should provide capabilities, not hide the whole business process.** Fetching a catalogue, reading a knowledge base, or updating a job is easier to test and audit than a single tool that silently performs several reasoning steps.
- **Persistence is a workflow concern.** Job records, agent sessions, quote edits, approval acknowledgements, and availability cannot be designed as unrelated storage features. They describe one continuing business interaction.
- **Model output needs contracts and defensive handling.** Even when prompts are clear, models can vary field names, nesting, length, and formatting. Structured parsing, validation, fallback behavior, and realistic end-to-end tests are necessary.
- **The frontend is part of the agent system.** If the backend has meaningful states but the UI shows a fake quote or generic success message, the system is not reliable from the user's perspective. The dashboard must reflect the actual state of the job.
- **Human approval is a product feature, not just a restriction.** The SME remains in control of pricing and client communication while the agent removes repetitive intake and drafting work. That division makes automation more useful for real businesses.
- **Cost controls belong in the architecture.** Removing the natural-language goal judge, caching static prompts and tool definitions, reusing the model provider, enabling automatic context management, bounding turns and output, and logging per-job usage reduce unnecessary work without weakening the validation or approval guarantees.

## Built With

- TypeScript and Node.js
- Express API
- Strands Agents SDK
- Anthropic model integration
- Zod schemas and validation
- JSON-backed job and session persistence
- Knowledge-base and price-catalogue data
- Jest tests and integration flows
- React dashboard frontend
- Nigerian Naira pricing and SME workflow rules
