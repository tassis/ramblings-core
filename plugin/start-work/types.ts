export type StartWorkTaskStatus =
  | "not_started"
  | "in_progress"
  | "blocked"
  | "complete"

export type StartWorkExecutionState =
  | "running"
  | "waiting"
  | "blocked"
  | "replanning"
  | "done"
  | "ask-user"

export type StartWorkContinuationKind =
  | "continue"
  | "waiting"
  | "blocked"
  | "replanning"
  | "done"
  | "ask-user"

export type StartWorkSpecialistRole =
  | "orchestrator"
  | "fixer"
  | "explorer"
  | "librarian"
  | "designer"
  | "oracle"

export interface StartWorkDelegation {
  role: StartWorkSpecialistRole
  task_id: string
}

export type StartWorkDelegationStatus =
  | "running"
  | "terminal_unreconciled"
  | "terminal_reconciled"
  | "cancelled_obsolete"

export interface StartWorkDelegationRegistryEntry extends StartWorkDelegation {
  name: string
  task_ref: string
  status: StartWorkDelegationStatus
}

export interface StartWorkChecklistTask {
  id: string
  title: string
  status: StartWorkTaskStatus
  delegated_to: StartWorkDelegation | null
  waiting_on: string | null
  blocked_by: string | null
  unblock_when: string | null
  next_action: string | null
  last_update: string | null
}

export interface StartWorkChecklistState {
  plan: string
  active_task: string | null
  execution_state: StartWorkExecutionState
  delegations?: StartWorkDelegationRegistryEntry[]
  tasks: StartWorkChecklistTask[]
  notes?: string[]
}

export interface StartWorkPlanCandidate {
  planPath: string
  checklistPath: string | null
  handoffPath: string | null
}

export interface StartWorkArtifactConflict {
  reason: string
  details: string[]
}

export type StartWorkArtifactResolution =
  | {
      kind: "resolved"
      candidate: StartWorkPlanCandidate
      checklist: StartWorkChecklistState | null
    }
  | {
      kind: "ask-user"
      reason: string
      candidates: StartWorkPlanCandidate[]
    }
  | {
      kind: "no-active-plan"
      reason: string
    }
  | {
      kind: "conflict"
      conflict: StartWorkArtifactConflict
    }

export type StartWorkTaskSelection =
  | {
      kind: "task"
      task: StartWorkChecklistTask
    }
  | {
      kind: "waiting"
      reason: string
      task: StartWorkChecklistTask | null
    }
  | {
      kind: "blocked"
      reason: string
      task: StartWorkChecklistTask | null
    }
  | {
      kind: "done"
      reason: string
    }
  | {
      kind: "ask-user"
      reason: string
      taskIds: string[]
    }
  | {
      kind: "replanning"
      reason: string
    }

export interface StartWorkContinuation {
  kind: StartWorkContinuationKind
  reason: string
  activeTaskId: string | null
  note?: string
}
