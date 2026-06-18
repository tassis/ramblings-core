# Skills Guide

This page is the quick routing guide for the repo's workflow skills.

- Use the tables below to choose the right skill quickly.
- Use the linked `SKILL.md` files for full guidance and output structure.
- Command-first entrypoints such as `office-hours`, `handoff`, `resume-from-handoff`, and `start-work` are documented in `docs/commands.md`.

## Archive Policy

Completed execution artifacts should move out of the active `.ramblings/` paths and into archive-by-plan-unit directories.

Preferred structure:

```text
.ramblings/archive/YYYY-MM-DD-<topic>/
  plan.md
  checklist.md
  handoff.md        # optional
  ready-check.md    # optional
  retro.md          # optional
  debug.md          # optional
```

Rules:

- `plan.md` and `checklist.md` are the minimum archived pair.
- Optional artifacts should be copied only when they clearly belong to the same work unit.
- Active discovery should ignore `.ramblings/archive/**`.
- Archived artifacts are historical records, not candidates for `start-work`.
- Archive only after the work is no longer executable: checklist complete, no `in_progress`, no `blocked`, no remaining active execution work.
- If a `ready-check` exists, archive is safest when its state is `ready`; if no `ready-check` exists, a conservative fallback may archive only when the checklist and handoff state still show no remaining active work.
- After archival, active-area copies of the same plan/checklist should not remain in `.ramblings/plans/` or `.ramblings/checklists/`.
- There is currently no dedicated archive command; archive is a manual operator workflow until experience proves a command is necessary.

## Handoff Artifact Policy

Handoffs are append-only dated snapshots under `.ramblings/handoffs/`; they are not a single overwritten `current.md` file.

New handoffs should use compact frontmatter metadata:

```yaml
---
topic: ultrawork
work_unit: ultrawork-runtime-hardening
references:
  - .ramblings/plans/...
  - .ramblings/specs/...
supersedes: 2026-06-18-ultrawork-status-handoff.md   # optional
status: active                                       # active | superseded | stale | complete
---
```

Rules:

- `work_unit` is the preferred resume key when present.
- `references` should point to the source-of-truth artifacts the next session must read.
- `supersedes` may explicitly mark a newer handoff as replacing an older one without deleting history.
- `status` is a handoff-level hint, not a replacement for checklist or ready-check state.
- The handoff body should stay compact and reference-first.

Resume selection ladder:

1. Filter to handoffs relevant to the requested or inferred work unit/topic.
2. Prefer exact `work_unit` matches over broader `topic` matches.
3. Exclude handoffs marked `superseded`, `stale`, or clearly invalidated by newer source artifacts.
4. Prefer a handoff that explicitly `supersedes` another candidate.
5. Among remaining candidates, prefer the newest dated handoff.
6. Verify against referenced plans/specs/checklists before trusting the handoff.
7. If multiple candidates remain equally plausible after verification, ask the user rather than guessing.

Migration guidance:

- Older handoffs without frontmatter remain usable as historical inputs.
- New handoffs should use the normalized metadata contract.
- Prefer forward-only migration; do not rewrite historical handoffs by default.
- For older handoffs, infer topic/workstream from filename or content only when reasonably clear, then verify against referenced source artifacts.
- If mixed old/new handoffs still leave ambiguity, ask the user rather than guessing.

Examples:

### Example 1: same topic, different work units

```text
.ramblings/handoffs/2026-06-18-ultrawork-status-handoff.md
  topic: ultrawork
  work_unit: ultrawork-runtime-hardening

.ramblings/handoffs/2026-06-19-ultrawork-status-handoff.md
  topic: ultrawork
  work_unit: ultrawork-archive-cleanup
```

If the requested continuation is runtime hardening, resume should prefer the exact `work_unit` match even if the archive-cleanup handoff is newer.

### Example 2: explicit supersession

```text
.ramblings/handoffs/2026-06-18-ultrawork-status-handoff.md

.ramblings/handoffs/2026-06-20-ultrawork-runtime-handoff.md
  topic: ultrawork
  work_unit: ultrawork-runtime-hardening
  supersedes: 2026-06-18-ultrawork-status-handoff.md
```

After verifying references, resume should prefer the newer handoff that explicitly supersedes the older one.

### Example 3: ambiguity must stop

```text
.ramblings/handoffs/2026-06-20-ultrawork-runtime-a.md
  work_unit: ultrawork-runtime-hardening

.ramblings/handoffs/2026-06-20-ultrawork-runtime-b.md
  work_unit: ultrawork-runtime-hardening
```

If neither handoff supersedes the other and the current plan/checklist/spec state does not clearly disambiguate them, ask the user rather than guessing.

## Phase Skills

| Skill | Purpose | Use when | Not for |
|---|---|---|---|
| [`ramblings-triage`](../skills/ramblings-triage/SKILL.md) | Classify a messy request and choose the next route. | The request is ambiguous, incomplete, or could map to multiple workflows. | Clear bugfixes, explicit spec writing, explicit planning, explicit review, or explicit handoff/resume requests. |
| [`ramblings-investigation`](../skills/ramblings-investigation/SKILL.md) | Establish current-state facts before deciding the next step. | You need to trace how something works or understand existing behavior first. | Confirmed bugfix execution, casual brainstorming, or final verification. |
| [`ramblings-brainstorming`](../skills/ramblings-brainstorming/SKILL.md) | Collaborative discussion and decision support. | You want to compare options, see examples, or talk through tradeoffs before committing. | Formal spec capture or production implementation. |
| [`ramblings-prototype`](../skills/ramblings-prototype/SKILL.md) | Run or plan a focused feasibility/design spike. | There is a concrete question that a small experiment can answer. | Open-ended exploration, formal spec writing, or production implementation. |
| [`ramblings-spec-writing`](../skills/ramblings-spec-writing/SKILL.md) | Turn a converged direction into a reviewable artifact. | You want a spec, proposal, design note, or requirements artifact before implementation. | Casual exploration before conclusions have formed. |
| [`ramblings-writing-plans`](../skills/ramblings-writing-plans/SKILL.md) | Turn an approved direction into an execution-ready implementation plan. | The work is multi-step, risky, or spans multiple files and should be guided by a plan. | Tiny one-file tweaks or work that still needs requirement discovery first. |
| [`ramblings-implementing-plans`](../skills/ramblings-implementing-plans/SKILL.md) | Execute an existing plan safely, step by step. | A real plan already exists and the next job is execution with verification and state writeback. | First-time planning, open-ended design, or requirement discovery. |
| [`ramblings-systematic-debugging`](../skills/ramblings-systematic-debugging/SKILL.md) | Root-cause debugging for confirmed bugs or failing behavior. | A bug, regression, or failing test needs diagnosis and a focused fix. | Pure current-state understanding when you are not ready to call it a bug yet. |
| [`ramblings-ready-check`](../skills/ramblings-ready-check/SKILL.md) | Summarize evidence and decide what readiness state can be claimed next. | You need to decide whether work is ready for review, validation, completion, or a readiness-claiming handoff. | Early validation planning or ordinary handoff without a readiness claim. |
| [`ramblings-handoff`](../skills/ramblings-handoff/SKILL.md) | Write future-session context. | You want to preserve state, blockers, and next steps for a later session/agent. | Ordinary completion reporting or final readiness judgment by itself. |
| [`ramblings-resume-from-handoff`](../skills/ramblings-resume-from-handoff/SKILL.md) | Resume from a prior handoff safely. | You want to continue from existing handoff context. | New work that does not depend on a prior session. |
| [`ramblings-retro`](../skills/ramblings-retro/SKILL.md) | Capture lessons learned after meaningful work. | You want a retrospective, reusable pattern, or process improvement note. | Readiness decisions or context transfer. |

## Review Lenses

| Skill | Purpose | Use when | Not for |
|---|---|---|---|
| [`ramblings-product-review`](../skills/ramblings-product-review/SKILL.md) | Challenge value, scope, prioritization, and product coherence. | The main question is whether the proposed work solves the right problem in the right scope. | Architecture-heavy critique or failure-mode-focused review. |
| [`ramblings-engineering-review`](../skills/ramblings-engineering-review/SKILL.md) | Challenge structure, coupling, complexity, and maintainability. | The main question is whether the technical shape is sound. | Product-scope critique or review-feedback handling. |
| [`ramblings-qa-review`](../skills/ramblings-qa-review/SKILL.md) | Challenge edge cases, failure modes, and verification gaps. | The main question is what can break and what is still unverified. | Product-value critique or implementation execution. |
| [`ramblings-devex-review`](../skills/ramblings-devex-review/SKILL.md) | Challenge developer/operator workflow quality. | The main question is setup pain, maintainability, CLI clarity, or debugging friction. | End-user UX review or generic architecture review. |

## Review Orchestration and Review Workflow

| Skill | Purpose | Use when | Not for |
|---|---|---|---|
| [`ramblings-challenge-me`](../skills/ramblings-challenge-me/SKILL.md) | Structured multi-lens critique of an idea, spec, plan, or change. | You want pressure testing from multiple perspectives rather than one lens. | One-question-at-a-time interviews or single-lens critique. |
| [`ramblings-grill-me`](../skills/ramblings-grill-me/SKILL.md) | One-question-at-a-time interrogation to force clarity. | You want to be questioned until assumptions and requirements are explicit. | A full multi-lens review dump or passive summary. |
| [`ramblings-requesting-code-review`](../skills/ramblings-requesting-code-review/SKILL.md) | Prepare a focused review request after implementation exists. | The next step is reviewer attention and you want the review context organized. | Handling existing reviewer comments. |
| [`ramblings-receiving-code-review`](../skills/ramblings-receiving-code-review/SKILL.md) | Evaluate and respond to incoming review feedback. | Reviewer comments already exist and need technical handling. | Requesting a new review or brainstorming design options from scratch. |

## Command-First / Protocol / Modifier Guidance

| Skill or Command | Purpose | Use when | Not for |
|---|---|---|---|
| `office-hours` | Open-ended discussion, scope discovery, and shaping. | You want an early conversational entrypoint before deciding whether to spec or plan. | Committing to a full execution lifecycle by itself. |
| `start-feature` | Command-first full lifecycle entrypoint for substantial work. | You want a feature, subsystem, or project to move from discussion through spec, plan, execution, and ready-check. | Narrow single-phase work such as only brainstorming, only planning, or only debugging. |
| [`ramblings-workflow`](../skills/ramblings-workflow/SKILL.md) | Umbrella lifecycle guidance for substantial work. | You want an end-to-end path from discussion through spec, planning, execution, and verification. | Narrow single-phase work such as only debugging, only spec writing, or only final verification. |
| [`ramblings-testing-strategy`](../skills/ramblings-testing-strategy/SKILL.md) | Choose the best practical validation approach before implementation. | The testing strategy itself is unclear, risky, or explicitly requested. | Final verification evidence after implementation. |
| [`ramblings-careful-mode`](../skills/ramblings-careful-mode/SKILL.md) | Conservative high-risk posture guidance. | The task is dangerous enough that caution should override speed. | Ordinary low-risk planning or execution by default. |
| `careful` | Explicit command-first high-risk mode hint. | You already know the task is risky before evaluation starts. | Generic planning that has not shown risk signals. |
| `handoff` / `resume-from-handoff` | Explicit protocol entrypoints for session transfer. | You clearly want to preserve or restore session context. | General workflow routing when no transfer is involved. |
| `start-work` | Command-first entrypoint for plan execution. | An active unfinished plan exists and should be resumed or continued. | Requirement discovery or plan writing. |

For delegated Ultrawork execution, prefer a YAML checklist under `.ramblings/checklists/` as the durable execution-state source of truth. Keep task `status` simple (`not_started`, `in_progress`, `blocked`, `complete`) and express delegation/waiting through annotations like `delegated_to` and `waiting_on`.

## Overlap and Routing Rules

| Situation | Prefer | Instead of | Why |
|---|---|---|---|
| You want to talk through options and decide together. | `ramblings-brainstorming` | `ramblings-spec-writing` | The work is still exploratory rather than converged. |
| You want to write down the chosen direction as an artifact. | `ramblings-spec-writing` | `ramblings-brainstorming` | The work has converged enough to capture. |
| You need to understand current behavior before deciding what to change. | `ramblings-investigation` | `ramblings-systematic-debugging` | The job is fact-finding, not confirmed bugfix execution yet. |
| You already have a bug or failing behavior to fix. | `ramblings-systematic-debugging` | `ramblings-investigation` | The task needs root-cause debugging and a safe fix. |
| You want multiple review perspectives. | `ramblings-challenge-me` | A single review lens | This is a multi-lens critique problem. |
| You want one question at a time after the assistant reads your doc. | `ramblings-grill-me` | `ramblings-challenge-me` | The interaction style matters more than the number of concerns. |
| You need to know whether the work is ready for review, validation, or completion. | `ramblings-ready-check` | `ramblings-handoff` | This is a readiness/evidence question, not just context transfer. |
| You only need to transfer current state to a future session. | `ramblings-handoff` | `ramblings-ready-check` | A handoff does not require a readiness claim unless one is asserted. |

## Renamed / Consolidated Skills (Planned Cleanup)

| Old | New / Replacement | Notes |
|---|---|---|
| `ramblings-challenge-session` | `ramblings-challenge-me` | Renamed to better match user intent. |
| `ramblings-verification` + `ramblings-finish-handoff` | `ramblings-ready-check` | Merged into a single readiness gate. |
| `ramblings-execution-strategy` | `ramblings-implementing-plans` | Planned consolidation of execution-time orchestration into plan execution. |
| `ramblings-careful-mode` | `careful` + embedded workflow guidance | Planned repositioning away from normal standalone trigger use. |
| `ramblings-workflow` | `start-feature` + backing guidance | Planned shift to a command-first umbrella entrypoint. |

## Trigger Examples

| Example prompt | Prefer | Why |
|---|---|---|
| “Help me design this feature.” | `ramblings-brainstorming` | The user wants collaborative exploration before committing to an artifact. |
| “Write a spec for this.” | `ramblings-spec-writing` | The user wants a durable design artifact. |
| “Trace how this command works.” | `ramblings-investigation` | The job is current-state understanding before deciding what to do next. |
| “Tests are failing after this change.” | `ramblings-systematic-debugging` | The problem is already a confirmed failing behavior that needs root-cause debugging. |
| “How should we test this change?” | `ramblings-testing-strategy` | The testing/validation approach itself is the question. |
| “Summarize what was verified and whether this is ready.” | `ramblings-ready-check` | The question is about evidence plus readiness state. |
| “Challenge this plan from multiple angles.” | `ramblings-challenge-me` | The user wants structured multi-lens critique. |
| “Find edge cases I’m missing.” | `ramblings-qa-review` | The dominant concern is failure modes and verification gaps. |
| “Read this spec and ask me one question at a time.” | `ramblings-grill-me` | The interaction style is document-grounded one-question-at-a-time pressure testing. |
| “I need to leave this for my next session.” | `ramblings-handoff` | The goal is future-session context transfer, not readiness judgment. |
