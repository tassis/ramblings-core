import { archive } from "./archive"
import { handoff } from "./handoff"
import { officeHours } from "./office-hours"
import { resumeFromHandoff } from "./resume-from-handoff"
import { createIntegration } from "./create-integration"
import { startWork } from "./start-work"
import { writePlan } from "./write-plan"
import { writeBrief } from "./write-brief"

export const ramblingsCommands = {
  "archive": archive,
  "handoff": handoff,
  "create-integration": createIntegration,
  "office-hours": officeHours,
  "resume-from-handoff": resumeFromHandoff,
  "start-work": startWork,
  "write-plan": writePlan,
  "write-brief": writeBrief
}
