export const resumeFromHandoff = {
  description: "Resume work from the newest relevant handoff artifact",
  template: "Use ramblings-resume-from-handoff. Find the newest relevant handoff under .ramblings/handoffs/ using this selection ladder: prefer exact work_unit match, then broader topic match; exclude handoffs marked superseded, stale, or clearly invalidated by newer source artifacts; prefer explicit supersedes relationships; then prefer the newest remaining dated handoff. Verify the candidate is still current by reading referenced source artifacts, reconstruct current state, and recommend the next step and next skill. If multiple candidates remain equally plausible after verification, stop and ask the user. Do not rely on the handoff note alone as source of truth."
}
