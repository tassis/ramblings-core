# ramblings-skills

Custom OpenCode-oriented workflow skills and optional command shortcuts.

This repo provides two layers:

1. `skills/` — the actual `ramblings-*` skills
2. `plugin/` — an OpenCode plugin that:
   - registers this repo's `skills/` directory
   - injects optional commands such as `office-hours`, `start-feature`, and `plan-ceo-review`
   - injects custom primary agents named `conductor` and `review`

## Principles

- no automatic commits, merges, or PR creation
- no global bootstrap mode
- skills are manually or contextually invoked, not forced globally
- commands are convenience entrypoints, not hidden workflow overrides

## Install from git-backed plugin spec

Add this to `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "ramblings-skills@git+https://github.com/tassis/ramblings-skills.git"
  ]
}
```

Restart OpenCode after changing config.

## Local development install

If you are testing from a local clone instead of GitHub, you can still use a direct plugin path:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "~/workdir/ramblings-skills/plugin/ramblings-plugin.ts"
  ]
}
```

## Commands provided by the plugin

- `conductor`
- `office-hours`
- `start-feature`
- `plan-ceo-review`
- `plan-eng-review`
- `qa-review`
- `careful`
- `handoff`
- `resume-from-handoff`
- `retro`
- `investigate`
- `write-spec`
- `write-plan`
- `start-work`

`start-work` is intended as the execution entrypoint and should operate against project-root `.ramblings/` artifacts with a YAML checklist as the preferred durable execution-state source of truth.

## Skill taxonomy

For the routing guide, overlap rules, and linked skill index, see [`docs/skills.md`](docs/skills.md).

Completed execution artifacts may be moved under project-root `.ramblings/archive/` so active execution discovery can ignore stale plans and checklists.

Archive should happen only after the work is no longer an active execution candidate.

There is currently no dedicated archive command; archiving is an explicit operator action.

## Agent provided by the plugin

- `conductor` — planning-only custom agent for project-root `.ramblings/` artifacts
- `review` — shared review execution surface for skill-driven product, engineering, QA, and DevEx review

Use Conductor when you want a planning surface that can write:

- `.ramblings/plans/**`
- `.ramblings/specs/**`
- `.ramblings/checklists/**`
- `.ramblings/handoffs/**`
- `.ramblings/debug/**`
- `.ramblings/retros/**`

without entering implementation.

Use Review when you want a stable review carrier that routes through the selected review skill for persona, skepticism, and recommendation shape.

See `docs/commands.md` for details.
