import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import {
  type StartWorkArtifactResolution,
  type StartWorkChecklistState,
  type StartWorkPlanCandidate,
  type StartWorkTaskSelection,
} from "./types"
import { readChecklistState } from "./checklist"

const RAMBLINGS_DIR = ".ramblings"
const PLANS_DIR = path.posix.join(RAMBLINGS_DIR, "plans")
const CHECKLISTS_DIR = path.posix.join(RAMBLINGS_DIR, "checklists")
const HANDOFFS_DIR = path.posix.join(RAMBLINGS_DIR, "handoffs")
const ARCHIVE_DIR = path.posix.join(RAMBLINGS_DIR, "archive")

export async function resolveStartWorkArtifacts(projectRoot: string): Promise<StartWorkArtifactResolution> {
  const checklistCandidates = await readChecklistCandidates(projectRoot)
  const activeChecklistCandidates = checklistCandidates.filter(({ checklist }) => hasIncompleteTasks(checklist))

  if (activeChecklistCandidates.length > 1) {
    return {
      kind: "ask-user",
      reason: "Multiple unfinished YAML checklists remain active under project-root .ramblings/checklists/.",
      candidates: activeChecklistCandidates.map(({ candidate }) => candidate),
    }
  }

  if (activeChecklistCandidates.length === 1) {
    const { candidate, checklist } = activeChecklistCandidates[0]
    return {
      kind: "resolved",
      candidate,
      checklist,
    }
  }

  const planCandidates = await readPlanCandidates(projectRoot)

  if (planCandidates.length > 1) {
    return {
      kind: "ask-user",
      reason: "Multiple plausible unfinished plans remain after checklist resolution.",
      candidates: planCandidates,
    }
  }

  if (planCandidates.length === 1) {
    return {
      kind: "resolved",
      candidate: planCandidates[0],
      checklist: null,
    }
  }

  return {
    kind: "no-active-plan",
    reason: "No unfinished plan or YAML checklist could be identified safely under the project-root .ramblings/ directory.",
  }
}

export function getNextRunnableTask(checklist: StartWorkChecklistState): StartWorkTaskSelection {
  const inProgressTasks = checklist.tasks.filter((task) => task.status === "in_progress")

  if (inProgressTasks.length > 1) {
    return {
      kind: "ask-user",
      reason: "Multiple tasks are marked in_progress in the YAML checklist.",
      taskIds: inProgressTasks.map((task) => task.id),
    }
  }

  if (inProgressTasks.length === 1) {
    const [task] = inProgressTasks

    if (task.waiting_on) {
      return {
        kind: "waiting",
        reason: `Task ${task.id} is still waiting on ${task.waiting_on}.`,
        task,
      }
    }

    return {
      kind: "task",
      task,
    }
  }

  const firstNotStarted = checklist.tasks.find((task) => task.status === "not_started")

  if (firstNotStarted) {
    return {
      kind: "task",
      task: firstNotStarted,
    }
  }

  const blockedTask = checklist.tasks.find((task) => task.status === "blocked") ?? null

  if (blockedTask) {
    return {
      kind: "blocked",
      reason: `Task ${blockedTask.id} is blocked and no runnable task remains ahead of completion.`,
      task: blockedTask,
    }
  }

  if (checklist.tasks.every((task) => task.status === "complete")) {
    return {
      kind: "done",
      reason: "All checklist tasks are marked complete.",
    }
  }

  return {
    kind: "replanning",
    reason: "Checklist state could not be mapped safely to a runnable task or terminal outcome.",
  }
}

function hasIncompleteTasks(checklist: StartWorkChecklistState) {
  return checklist.tasks.some((task) => task.status !== "complete")
}

async function readChecklistCandidates(projectRoot: string) {
  const checklistDir = path.join(projectRoot, CHECKLISTS_DIR)
  const checklistFiles = await listFilesSafe(checklistDir, ".yaml")
  const candidates: Array<{ candidate: StartWorkPlanCandidate; checklist: StartWorkChecklistState }> = []

  for (const checklistFile of checklistFiles) {
    const checklistPath = path.join(checklistDir, checklistFile)
    const checklist = await readChecklistState(projectRoot, checklistPath)

    if (!checklist || isArchivedRamblingsPath(checklist.plan)) {
      continue
    }

    const planPath = normalizeRamblingsRelativePath(checklist.plan)
    const handoffPath = await findLinkedHandoff(projectRoot, planPath)

    candidates.push({
      candidate: {
        planPath,
        checklistPath: toProjectRelative(projectRoot, checklistPath),
        handoffPath,
      },
      checklist,
    })
  }

  return candidates
}

async function readPlanCandidates(projectRoot: string) {
  const planDir = path.join(projectRoot, PLANS_DIR)
  const planFiles = await listFilesSafe(planDir, ".md")
  const candidates: StartWorkPlanCandidate[] = []

  for (const planFile of planFiles) {
    const absolutePath = path.join(planDir, planFile)
    const relativePlanPath = toProjectRelative(projectRoot, absolutePath)

    if (isArchivedRamblingsPath(relativePlanPath)) {
      continue
    }

    const planText = await readTextSafe(absolutePath)

    if (!planText || isCompletedPlan(planText)) {
      continue
    }

    candidates.push({
      planPath: relativePlanPath,
      checklistPath: null,
      handoffPath: await findLinkedHandoff(projectRoot, relativePlanPath),
    })
  }

  return candidates
}

function isCompletedPlan(planText: string) {
  const statuses = [...planText.matchAll(/\*\*Status:\*\*\s+([^\n]+)/g)].map((match) => match[1].trim())

  return statuses.length > 0 && statuses.every((status) => status === "complete")
}

async function findLinkedHandoff(projectRoot: string, planPath: string) {
  const handoffDir = path.join(projectRoot, HANDOFFS_DIR)
  const handoffFiles = await listFilesSafe(handoffDir, ".md")
  const sortedHandoffs = [...handoffFiles].sort().reverse()

  for (const handoffFile of sortedHandoffs) {
    const absolutePath = path.join(handoffDir, handoffFile)
    const handoffText = await readTextSafe(absolutePath)

    if (!handoffText) {
      continue
    }

    if (handoffText.includes(planPath)) {
      return toProjectRelative(projectRoot, absolutePath)
    }
  }

  return null
}

async function listFilesSafe(directory: string, extension: string) {
  try {
    const entries = await readdir(directory, { withFileTypes: true })

    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
      .map((entry) => entry.name)
  } catch {
    return []
  }
}

function normalizeRamblingsRelativePath(filePath: string) {
  return filePath.replace(/^\.\//, "").replace(/\\/g, "/")
}

function isArchivedRamblingsPath(filePath: string) {
  const normalized = normalizeRamblingsRelativePath(filePath)
  return normalized === ARCHIVE_DIR || normalized.startsWith(`${ARCHIVE_DIR}/`)
}

function toProjectRelative(projectRoot: string, absolutePath: string) {
  return normalizeRamblingsRelativePath(path.relative(projectRoot, absolutePath))
}

async function readTextSafe(filePath: string) {
  try {
    return await readFile(filePath, "utf8")
  } catch {
    return null
  }
}
