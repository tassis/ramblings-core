import { tool } from "@opencode-ai/plugin"
import { beginTaskExecution, recordBlockedTask, recordTaskCompletion, rerunContinuation, resolveStartWorkLoop } from "../start-work/index"
import { readChecklistState, writeChecklistState } from "../start-work/checklist"

function okToolResult(output: string) {
  return output
}

function errorToolResult(code: string, message: string) {
  return `${code}: ${message}`
}

const projectRootArgs = {
  project_root: tool.schema.string().describe("Project root path")
} as const

const projectRootChecklistArgs = {
  project_root: tool.schema.string().describe("Project root path"),
  checklist_path: tool.schema.string().describe("Checklist path relative to the project root")
} as const

export const startWorkTools = {
  ramblings_start_work_resolve: tool({
    description: "Resolve the active start-work candidate and continuation outcome.",
    args: projectRootArgs,
    async execute({ project_root }: { project_root: string }) {
      await resolveStartWorkLoop(project_root)
      return okToolResult(`Resolved start-work state for ${project_root}.`)
    }
  }),

  ramblings_start_work_begin_task: tool({
    description: "Mark a checklist task in progress and set the active execution state.",
    args: {
      ...projectRootChecklistArgs,
      task_id: tool.schema.string().describe("Task identifier to mark in progress"),
      note: tool.schema.string().describe("Update note written to checklist state")
    } as const,
    async execute({ project_root, checklist_path, task_id, note }: { project_root: string; checklist_path: string; task_id: string; note: string }) {
      const checklist = await readChecklistState(project_root, checklist_path)
      if (!checklist) {
        return errorToolResult("CHECKLIST_NOT_FOUND", "Checklist could not be read.")
      }
      const updated = beginTaskExecution(checklist, task_id, note)
      await writeChecklistState(project_root, checklist_path, updated)
      return okToolResult(`Marked ${task_id} in progress in ${checklist_path}.`)
    }
  }),

  ramblings_start_work_record_blocked: tool({
    description: "Mark a checklist task blocked with required blocker metadata.",
    args: {
      ...projectRootChecklistArgs,
      task_id: tool.schema.string().describe("Task identifier to mark blocked"),
      blocked_by: tool.schema.string().describe("Concrete blocker"),
      unblock_when: tool.schema.string().describe("Observable condition that clears the blocker"),
      next_action: tool.schema.string().describe("Immediate next action to resolve or route around the blocker"),
      note: tool.schema.string().describe("Update note written to checklist state")
    } as const,
    async execute({ project_root, checklist_path, task_id, blocked_by, unblock_when, next_action, note }: { project_root: string; checklist_path: string; task_id: string; blocked_by: string; unblock_when: string; next_action: string; note: string }) {
      const checklist = await readChecklistState(project_root, checklist_path)
      if (!checklist) {
        return errorToolResult("CHECKLIST_NOT_FOUND", "Checklist could not be read.")
      }
      const updated = recordBlockedTask(checklist, task_id, blocked_by, unblock_when, next_action, note)
      await writeChecklistState(project_root, checklist_path, updated)
      return okToolResult(`Marked ${task_id} blocked in ${checklist_path}.`)
    }
  }),

  ramblings_start_work_record_completion: tool({
    description: "Mark a checklist task complete after verification and clear delegation state.",
    args: {
      ...projectRootChecklistArgs,
      task_id: tool.schema.string().describe("Task identifier to mark complete"),
      note: tool.schema.string().describe("Update note written to checklist state")
    } as const,
    async execute({ project_root, checklist_path, task_id, note }: { project_root: string; checklist_path: string; task_id: string; note: string }) {
      const checklist = await readChecklistState(project_root, checklist_path)
      if (!checklist) {
        return errorToolResult("CHECKLIST_NOT_FOUND", "Checklist could not be read.")
      }
      const updated = recordTaskCompletion(checklist, task_id, note)
      await writeChecklistState(project_root, checklist_path, updated)
      return okToolResult(`Marked ${task_id} complete in ${checklist_path}.`)
    }
  }),

  ramblings_start_work_rerun_continuation: tool({
    description: "Recompute the next start-work continuation outcome from current checklist state.",
    args: projectRootChecklistArgs,
    async execute({ project_root, checklist_path }: { project_root: string; checklist_path: string }) {
      const checklist = await readChecklistState(project_root, checklist_path)
      if (!checklist) {
        return errorToolResult("CHECKLIST_NOT_FOUND", "Checklist could not be read.")
      }
      rerunContinuation(checklist)
      return okToolResult(`Recomputed continuation for ${checklist_path}.`)
    }
  })
} as const
