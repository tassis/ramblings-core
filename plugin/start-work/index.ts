import {
  assignTaskDelegation,
  clearTaskDelegation,
  setActiveTask,
  setDelegationStatus,
  updateChecklistTask,
  writeChecklistState,
} from "./checklist"
import { decideStartWorkContinuation, type StartWorkContinuationInput } from "./continuation"
import { getNextRunnableTask, resolveStartWorkArtifacts } from "./artifacts"
import {
  type StartWorkChecklistState,
  type StartWorkContinuation,
  type StartWorkDelegationRegistryEntry,
  type StartWorkTaskSelection,
} from "./types"

export interface StartWorkLoopState {
  checklistPath: string
  checklist: StartWorkChecklistState
  taskSelection: StartWorkTaskSelection
  continuation: StartWorkContinuation
}

export async function resolveStartWorkLoop(projectRoot: string): Promise<StartWorkLoopState | StartWorkContinuation> {
  const artifactResolution = await resolveStartWorkArtifacts(projectRoot)

  if (artifactResolution.kind !== "resolved") {
    return decideStartWorkContinuation({ artifactResolution })
  }

  if (!artifactResolution.checklist || !artifactResolution.candidate.checklistPath) {
    return {
      kind: "ask-user",
      reason: "The active plan does not yet have a YAML checklist execution-state artifact. Create or select one before continuing execution.",
      activeTaskId: null,
      note: artifactResolution.candidate.planPath,
    }
  }

  const taskSelection = getNextRunnableTask(artifactResolution.checklist)
  const continuation = decideStartWorkContinuation({
    artifactResolution,
    checklist: artifactResolution.checklist,
    taskSelection,
  })

  return {
    checklistPath: artifactResolution.candidate.checklistPath,
    checklist: artifactResolution.checklist,
    taskSelection,
    continuation,
  }
}

export function beginTaskExecution(
  checklist: StartWorkChecklistState,
  taskId: string,
  note: string,
): StartWorkChecklistState {
  return setActiveTask(
    updateChecklistTask(checklist, taskId, {
      status: "in_progress",
      next_action: null,
      last_update: note,
    }),
    taskId,
    "running",
  )
}

export function dispatchDelegatedLane(
  checklist: StartWorkChecklistState,
  taskId: string,
  delegation: StartWorkDelegationRegistryEntry,
  note: string,
): StartWorkChecklistState {
  return setActiveTask(
    assignTaskDelegation(checklist, taskId, delegation, {
      waiting_on: "lane_completion",
      last_update: note,
    }),
    taskId,
    "waiting",
  )
}

export function recordDelegatedLaneTerminalResult(
  checklist: StartWorkChecklistState,
  taskId: string,
  note: string,
): StartWorkChecklistState {
  return setActiveTask(
    clearTaskDelegation(
      setDelegationStatus(checklist, taskId, "terminal_unreconciled"),
      taskId,
      {
        registryStatus: "terminal_unreconciled",
        waiting_on: null,
        last_update: note,
      },
    ),
    taskId,
    "running",
  )
}

export function recordTaskCompletion(
  checklist: StartWorkChecklistState,
  taskId: string,
  note: string,
): StartWorkChecklistState {
  return setActiveTask(
    clearTaskDelegation(
      updateChecklistTask(checklist, taskId, {
        status: "complete",
        next_action: null,
        last_update: note,
      }),
      taskId,
      {
        registryStatus: "terminal_reconciled",
        waiting_on: null,
        last_update: note,
      },
    ),
    null,
    "running",
  )
}

export function recordBlockedTask(
  checklist: StartWorkChecklistState,
  taskId: string,
  blockedBy: string,
  unblockWhen: string,
  nextAction: string,
  note: string,
): StartWorkChecklistState {
  return setActiveTask(
    clearTaskDelegation(
      updateChecklistTask(checklist, taskId, {
        status: "blocked",
        blocked_by: blockedBy,
        unblock_when: unblockWhen,
        next_action: nextAction,
        last_update: note,
      }),
      taskId,
      {
        waiting_on: null,
        last_update: note,
      },
    ),
    taskId,
    "blocked",
  )
}

export function recordReplanningState(
  checklist: StartWorkChecklistState,
  taskId: string | null,
  note: string,
): StartWorkChecklistState {
  const updatedChecklist = taskId
    ? updateChecklistTask(checklist, taskId, {
        next_action: "route back to planning",
        last_update: note,
      })
    : checklist

  return setActiveTask(updatedChecklist, taskId, "replanning")
}

export async function writeLoopChecklist(
  projectRoot: string,
  loopState: StartWorkLoopState,
  checklist: StartWorkChecklistState,
) {
  await writeChecklistState(projectRoot, loopState.checklistPath, checklist)
}

export function rerunContinuation(checklist: StartWorkChecklistState): StartWorkContinuation {
  const taskSelection = getNextRunnableTask(checklist)
  const input: StartWorkContinuationInput = { checklist, taskSelection }
  return decideStartWorkContinuation(input)
}
