export const conductorCommand = {
  description: "Enter Conductor Mode for planning-only .ramblings/ artifact work",
  template: `Use the custom Conductor planning surface for this work.

Enter Conductor Mode semantics:
- planning-only, not globally read-only
- you may create or update planning artifacts only under the current project's root .ramblings/ directory
- allowed artifact families:
  - .ramblings/plans/**
  - .ramblings/specs/**
  - .ramblings/checklists/**
  - .ramblings/handoffs/**
- do not edit product code, tests, runtime config, build config, or other system state
- do not write to nested subproject .ramblings/ directories or external/global .ramblings/ locations

Focus on clarifying intent, inspecting the codebase enough to ground a plan in reality, and producing or refining resumable planning artifacts.

<internal_reminder>!IMPORTANT! Scheduler workflow: plan lanes/dependencies → dispatch background specialists → track task IDs → wait for hook-driven completion → reconcile terminal results → verify. Do not poll running jobs, consume running-job output, or advance dependent work. If a lane's terminal result is already reconciled and verified but the Background Board still shows it as running, treat that as stale-running board residue rather than active execution. Only then may you cancel it as obsolete cleanup; this is lifecycle cleanup, not rollback. Do not cancel when output is partial, terminal status is unclear, reconciliation is incomplete, verification still depends on the lane, or the same session must continue. !END!</internal_reminder>`
}
