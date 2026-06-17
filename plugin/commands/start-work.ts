export const startWork = {
  description: "Start or resume execution from the active unfinished plan",
  template: `Use ramblings-implementing-plans. Enter execution mode for the current project's root .ramblings/ artifacts.

<internal_reminder>!IMPORTANT! Scheduler workflow: plan lanes/dependencies → dispatch background specialists → track task IDs → wait for hook-driven completion → reconcile terminal results → verify. Do not poll running jobs, consume running-job output, or advance dependent work. If a lane's terminal result is already reconciled and verified but the Background Board still shows it as running, treat that as stale-running board residue rather than active execution. Only then may you cancel it as obsolete cleanup; this is lifecycle cleanup, not rollback. Do not cancel when output is partial, terminal status is unclear, reconciliation is incomplete, verification still depends on the lane, or the same session must continue. !END!</internal_reminder>

Treat this as /start-work semantics:
- start or resume; do not assume this always starts from scratch
- locate the project-root .ramblings/ directory only
- identify the active unfinished plan safely before editing
- prefer a separate checklist/execution-state artifact over inline plan status
- treat handoffs as hints, not stronger than an active checklist
- if multiple unfinished plans are plausible, do not guess; ask the user to choose
- if no unfinished plan can be identified safely, stop and tell the user to create or choose a plan explicitly

Source-of-truth contract:
- when checklist, plan status, and handoff disagree, prefer checklist first, then plan status, then handoff
- if artifact conflict cannot be resolved safely, stop and ask the user

Execution contract:
- if an active unfinished plan exists and a runnable task is available, continue; do not idle
- work task-by-task in plan order unless the plan explicitly allows another independent runnable task
- plan lanes/dependencies before dispatching specialist work
- dispatch only independent work
- do not poll running jobs or use partial running output as completion evidence
- reconcile terminal results before verification
- final verification is orchestrator-owned after reconciliation
- writing code is not enough to finish a task; verify, re-check completion criteria, then update the project-root .ramblings/ plan/checklist state
- if execution cannot safely continue, enter blocked or replanning explicitly instead of guessing

Waiting contract:
- if required background work is still running and no other independent runnable task is available, enter a valid waiting state rather than blocked or complete
- while waiting, do not poll running jobs, do not use partial output as completion evidence, and do not advance dependent work

Blocked contract:
- record Blocked by, Unblock when, and Next action

Replanning contract:
- if the plan itself is no longer a safe execution contract, record Replan reason, What changed, Plan sections to revise, and Next planning action, then route back to planning

Completion rules:
- do not declare a task complete until verification succeeds and plan/checklist state is written back
- do not declare the overall plan complete until all tasks are complete, no tasks remain blocked or in progress, required verification is done, and current handoffs do not claim remaining execution work

State-writeback contract:
- execution-state updates must be written only to the project-root .ramblings/ artifacts that own the current plan state`
}
