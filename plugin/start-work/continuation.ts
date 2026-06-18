import {
  type StartWorkArtifactResolution,
  type StartWorkChecklistState,
  type StartWorkContinuation,
  type StartWorkTaskSelection,
} from "./types"

export const executionOrchestratorContract = "- /start-work should route to a dedicated execution orchestrator, not the planning-only conductor"

export const firstIterationSequentialPolicy = [
  "- first iteration policy: one active task at a time",
  "- at most one active delegated lane per task",
  "- one specialist per delegation type at a time",
  "- sequential execution by default; do not assume routine parallel same-type delegation",
].join("\n")

export const continuationOutcomeContract = [
  "- continuation outcomes are explicit: continue, waiting, blocked, replanning, done, or ask-user",
  "- after each terminal result, reconcile first, verify second, then choose exactly one continuation outcome",
].join("\n")

export interface StartWorkContinuationInput {
  artifactResolution?: StartWorkArtifactResolution | null
  checklist?: StartWorkChecklistState | null
  taskSelection?: StartWorkTaskSelection | null
}

export function decideStartWorkContinuation(input: StartWorkContinuationInput): StartWorkContinuation {
  const artifactDecision = continuationFromArtifactResolution(input.artifactResolution)

  if (artifactDecision) {
    return artifactDecision
  }

  if (input.checklist?.execution_state === "replanning") {
    return {
      kind: "replanning",
      reason: "The YAML checklist already marks execution_state as replanning.",
      activeTaskId: input.checklist.active_task,
    }
  }

  if (input.checklist?.execution_state === "ask-user") {
    return {
      kind: "ask-user",
      reason: "The YAML checklist already marks execution_state as ask-user.",
      activeTaskId: input.checklist.active_task,
    }
  }

  if (!input.taskSelection) {
    return {
      kind: "ask-user",
      reason: "No runnable-task decision was provided for continuation.",
      activeTaskId: input.checklist?.active_task ?? null,
    }
  }

  switch (input.taskSelection.kind) {
    case "task":
      return {
        kind: "continue",
        reason: `Task ${input.taskSelection.task.id} is the next safe runnable task.`,
        activeTaskId: input.taskSelection.task.id,
      }
    case "waiting":
      return {
        kind: "waiting",
        reason: input.taskSelection.reason,
        activeTaskId: input.taskSelection.task?.id ?? null,
      }
    case "blocked":
      return {
        kind: "blocked",
        reason: input.taskSelection.reason,
        activeTaskId: input.taskSelection.task?.id ?? null,
      }
    case "done":
      return {
        kind: "done",
        reason: input.taskSelection.reason,
        activeTaskId: null,
      }
    case "ask-user":
      return {
        kind: "ask-user",
        reason: input.taskSelection.reason,
        activeTaskId: input.taskSelection.taskIds[0] ?? null,
        note: input.taskSelection.taskIds.length > 0
          ? `Ambiguous task ids: ${input.taskSelection.taskIds.join(", ")}`
          : undefined,
      }
    case "replanning":
      return {
        kind: "replanning",
        reason: input.taskSelection.reason,
        activeTaskId: input.checklist?.active_task ?? null,
      }
  }
}

function continuationFromArtifactResolution(artifactResolution?: StartWorkArtifactResolution | null) {
  if (!artifactResolution) {
    return null
  }

  switch (artifactResolution.kind) {
    case "resolved":
      return null
    case "ask-user":
      return {
        kind: "ask-user" as const,
        reason: artifactResolution.reason,
        activeTaskId: null,
        note: artifactResolution.candidates.map((candidate) => candidate.planPath).join(", "),
      }
    case "no-active-plan":
      return {
        kind: "ask-user" as const,
        reason: artifactResolution.reason,
        activeTaskId: null,
      }
    case "conflict":
      return {
        kind: "ask-user" as const,
        reason: artifactResolution.conflict.reason,
        activeTaskId: null,
        note: artifactResolution.conflict.details.join("; "),
      }
  }
}
