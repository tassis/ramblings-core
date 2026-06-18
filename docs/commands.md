# Commands

These commands are injected by `plugin/ramblings-plugin.ts`.

## conductor

Use to enter Conductor Mode for planning-only work on project-root `.ramblings/` artifacts.

## office-hours

Use for early discussion, scope discovery, and feature or product shaping.

## start-feature

Use for a substantial feature or project workflow that should move from discussion through spec, plan, execution, and ready-check.

## plan-ceo-review

Use for product-oriented challenge of a spec or plan.

This command now routes through the shared `review` agent while still instructing `ramblings-product-review`.

## plan-eng-review

Use for engineering-oriented challenge of a spec or plan.

This command now routes through the shared `review` agent while still instructing `ramblings-engineering-review`.

## qa-review

Use for failure-mode and verification challenge.

This command now routes through the shared `review` agent while still instructing `ramblings-qa-review`.

## careful

Use to shift into a more conservative, high-risk workflow posture.

## handoff

Use to write transferable context for a future session or another agent.

Create a compact dated artifact under `.ramblings/handoffs/`.

- Keep handoffs append-only; do not overwrite a single `current.md` file.
- New handoffs should include compact frontmatter metadata: `topic`, `work_unit`, `references`, optional `supersedes`, and `status`.
- Keep the body reference-first rather than duplicating full specs or plans.

## resume-from-handoff

Use to continue safely from the newest relevant handoff artifact.

Selection order:

1. exact `work_unit` match when available;
2. broader `topic` match;
3. exclude handoffs marked `superseded`, `stale`, or invalidated by newer source artifacts;
4. prefer explicit `supersedes` relationships;
5. then prefer the newest remaining dated handoff;
6. verify against referenced source artifacts before trusting it;
7. if multiple candidates remain equally plausible, ask the user.

Examples:

- Same topic, different work units:
  - `2026-06-18-ultrawork-status-handoff.md` with `work_unit: ultrawork-runtime-hardening`
  - `2026-06-19-ultrawork-status-handoff.md` with `work_unit: ultrawork-archive-cleanup`
  - If the requested continuation is runtime hardening, prefer the exact `work_unit` match even if another ultrawork handoff is newer.
- Explicit supersession:
  - `2026-06-18-ultrawork-status-handoff.md`
  - `2026-06-20-ultrawork-runtime-handoff.md` with `supersedes: 2026-06-18-ultrawork-status-handoff.md`
  - Prefer the newer superseding handoff after verifying its references.
- Ambiguity stop:
  - two handoffs imply the same work unit,
  - neither supersedes the other,
  - and current plan/checklist evidence does not clearly disambiguate.
  - In that case, stop and ask the user instead of guessing.

## retro

Use to capture lessons learned after meaningful work.

## investigate

Use to understand how an existing system or flow works before deciding next action.

## write-spec

Use to turn discussion into a written spec.

## write-plan

Use to turn an approved direction into an implementation plan.

## start-work

Use to start or resume execution from the active unfinished plan under the current project's root `.ramblings/` directory.

The intended contract is for `/start-work` to route into a dedicated execution orchestrator rather than the planning-only `conductor`.

`start-work` should prefer a machine-readable YAML checklist under `.ramblings/checklists/` as the durable execution-state source of truth when one exists.

Recommended YAML execution-state shape:

```yaml
plan: .ramblings/plans/YYYY-MM-DD-topic.md
active_task: task-2
execution_state: running
delegations:
  - name: resolver-implementation
    role: fixer
    task_id: ses_xxx
    task_ref: task-2
    status: running
tasks:
  - id: task-2
    title: Add active artifact and next-task resolver helpers
    status: in_progress
    delegated_to:
      role: fixer
      task_id: ses_xxx
    waiting_on: lane_completion
    blocked_by: null
    unblock_when: null
    next_action: wait for terminal hook
    last_update: resolver lane dispatched
```

Rules:

- `status` remains the primary task state; do not replace it with `delegated`.
- Top-level `delegations` may record participating specialist sessions for resume/reconcile support.
- Delegation and waiting should be expressed as annotations such as `delegated_to` and `waiting_on`.
- First iteration scope assumes one active task and at most one active delegated lane per task.
- First iteration scope is sequential by default and does not assume routine same-type parallel delegation.
- Recommended registry lifecycle: `running` → `terminal_unreconciled` → `terminal_reconciled`, with `cancelled_obsolete` reserved for stale-lane cleanup after verified terminal completion.

Active discovery should ignore `.ramblings/archive/**`; archived plans are historical records, not execution candidates.

Archive only after the work is truly complete enough that no active execution should resume from it.

There is currently no dedicated archive command. Archive is an explicit operator action: once the work is no longer an active execution candidate, move the completed plan and its owning checklist into a plan-unit archive directory under `.ramblings/archive/`.
