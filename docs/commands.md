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

## plan-eng-review

Use for engineering-oriented challenge of a spec or plan.

## qa-review

Use for failure-mode and verification challenge.

## careful

Use to shift into a more conservative, high-risk workflow posture.

## handoff

Use to write transferable context for a future session or another agent.

## resume-from-handoff

Use to continue safely from the newest relevant handoff artifact.

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

Active discovery should ignore `.ramblings/archive/**`; archived plans are historical records, not execution candidates.

Archive only after the work is truly complete enough that no active execution should resume from it.

There is currently no dedicated archive command. Archive is an explicit operator action: once the work is no longer an active execution candidate, move the completed plan and its owning checklist into a plan-unit archive directory under `.ramblings/archive/`.
