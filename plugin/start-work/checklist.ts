import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import YAML from "yaml"
import {
  type StartWorkChecklistState,
  type StartWorkChecklistTask,
  type StartWorkDelegation,
  type StartWorkDelegationRegistryEntry,
  type StartWorkDelegationStatus,
  type StartWorkExecutionState,
  type StartWorkTaskStatus,
} from "./types"

export interface StartWorkTaskPatch {
  status?: StartWorkTaskStatus
  delegated_to?: StartWorkDelegation | null
  waiting_on?: string | null
  blocked_by?: string | null
  unblock_when?: string | null
  next_action?: string | null
  last_update?: string | null
}

export function updateChecklistTask(
  checklist: StartWorkChecklistState,
  taskId: string,
  patch: StartWorkTaskPatch,
): StartWorkChecklistState {
  return {
    ...checklist,
    tasks: checklist.tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            ...patch,
          }
        : task,
    ),
  }
}

export function setActiveTask(
  checklist: StartWorkChecklistState,
  activeTaskId: string | null,
  executionState?: StartWorkExecutionState,
): StartWorkChecklistState {
  return {
    ...checklist,
    active_task: activeTaskId,
    execution_state: executionState ?? checklist.execution_state,
  }
}

export function upsertDelegationEntry(
  checklist: StartWorkChecklistState,
  entry: StartWorkDelegationRegistryEntry,
): StartWorkChecklistState {
  // Minimal lifecycle contract:
  // - dispatch creates or refreshes a `running` registry entry
  // - terminal hook return moves it to `terminal_unreconciled`
  // - reconcile + verify + checklist writeback move it to `terminal_reconciled`
  // - stale-lane cleanup may mark it `cancelled_obsolete`
  const delegations = checklist.delegations ?? []
  const existingIndex = delegations.findIndex((delegation) => delegation.task_id === entry.task_id)

  if (existingIndex === -1) {
    return {
      ...checklist,
      delegations: [...delegations, entry],
    }
  }

  return {
    ...checklist,
    delegations: delegations.map((delegation, index) => (index === existingIndex ? entry : delegation)),
  }
}

export function setDelegationStatus(
  checklist: StartWorkChecklistState,
  taskId: string,
  status: StartWorkDelegationStatus,
): StartWorkChecklistState {
  return {
    ...checklist,
    delegations: (checklist.delegations ?? []).map((delegation) =>
      delegation.task_ref === taskId
        ? {
            ...delegation,
            status,
          }
        : delegation,
    ),
  }
}

export function clearTaskDelegation(
  checklist: StartWorkChecklistState,
  taskId: string,
  options?: {
    keepRegistry?: boolean
    registryStatus?: StartWorkDelegationStatus
    waiting_on?: string | null
    last_update?: string | null
  },
): StartWorkChecklistState {
  let nextChecklist = updateChecklistTask(checklist, taskId, {
    delegated_to: null,
    waiting_on: options?.waiting_on ?? null,
    last_update: options?.last_update,
  })

  if (options?.keepRegistry === false) {
    nextChecklist = {
      ...nextChecklist,
      delegations: (nextChecklist.delegations ?? []).filter((delegation) => delegation.task_ref !== taskId),
    }
  } else if (options?.registryStatus) {
    const registryStatus = options.registryStatus

    nextChecklist = {
      ...nextChecklist,
      delegations: (nextChecklist.delegations ?? []).map((delegation) =>
        delegation.task_ref === taskId
          ? {
              ...delegation,
              status: registryStatus,
            }
          : delegation,
      ),
    }
  }

  return nextChecklist
}

export function assignTaskDelegation(
  checklist: StartWorkChecklistState,
  taskId: string,
  delegation: StartWorkDelegationRegistryEntry,
  options?: {
    waiting_on?: string | null
    last_update?: string | null
  },
): StartWorkChecklistState {
  return upsertDelegationEntry(
    updateChecklistTask(checklist, taskId, {
      delegated_to: {
        role: delegation.role,
        task_id: delegation.task_id,
      },
      waiting_on: options?.waiting_on ?? "lane_completion",
      last_update: options?.last_update ?? null,
    }),
    delegation,
  )
}

export async function writeChecklistState(
  projectRoot: string,
  checklistPath: string,
  checklist: StartWorkChecklistState,
) {
  const absolutePath = path.isAbsolute(checklistPath)
    ? checklistPath
    : path.join(projectRoot, checklistPath)

  await mkdir(path.dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, serializeChecklistState(checklist), "utf8")
}

export async function readChecklistState(
  projectRoot: string,
  checklistPath: string,
): Promise<StartWorkChecklistState | null> {
  const absolutePath = path.isAbsolute(checklistPath)
    ? checklistPath
    : path.join(projectRoot, checklistPath)

  try {
    const text = await readFile(absolutePath, "utf8")
    return parseChecklistState(text)
  } catch {
    return null
  }
}

export function serializeChecklistState(checklist: StartWorkChecklistState) {
  const normalized: StartWorkChecklistState = {
    ...checklist,
    delegations: checklist.delegations ?? [],
    notes: checklist.notes && checklist.notes.length > 0 ? checklist.notes : undefined,
  }

  return YAML.stringify(normalized, {
    indent: 2,
    lineWidth: 0,
    minContentWidth: 0,
  })
}

export function parseChecklistState(text: string): StartWorkChecklistState {
  const parsed = YAML.parse(text) as StartWorkChecklistState | null

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Checklist YAML did not parse to an object.")
  }

  return {
    plan: parsed.plan,
    active_task: parsed.active_task ?? null,
    execution_state: parsed.execution_state,
    delegations: parsed.delegations ?? [],
    tasks: (parsed.tasks ?? []).map(normalizeTask),
    notes: parsed.notes && parsed.notes.length > 0 ? parsed.notes : undefined,
  }
}

function normalizeTask(task: StartWorkChecklistTask): StartWorkChecklistTask {
  return {
    id: task.id,
    title: task.title,
    status: task.status,
    delegated_to: task.delegated_to ?? null,
    waiting_on: task.waiting_on ?? null,
    blocked_by: task.blocked_by ?? null,
    unblock_when: task.unblock_when ?? null,
    next_action: task.next_action ?? null,
    last_update: task.last_update ?? null,
  }
}
