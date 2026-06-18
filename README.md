# ramblings

OpenCode workflow framework plugin for discussion, spec writing, planning, execution, review, handoff, archive, and task tracking.

This repo is not just a bag of skills or command shortcuts. It is a workflow framework built around:

- `skills/` for workflow semantics, routing, persona, and guidance
- `plugin/` for command surfaces and agent surfaces
- project-root `.ramblings/` artifacts for durable workflow state

The intended lifecycle is roughly:

1. discussion / shaping
2. spec writing
3. planning
4. execution
5. review
6. handoff or ready-check
7. archive / cleanup

The workflow should be read as one system:

- discussion shapes the direction;
- specs capture it;
- plans make it executable;
- `start-work` drives execution;
- review and ready-check challenge quality;
- archive cleans the active area for the next session.

This repo provides two layers:

1. `skills/` — the actual `ramblings-*` skills
2. `plugin/` — an OpenCode plugin that:
   - registers this repo's `skills/` directory
   - injects optional commands such as `office-hours`, `start-feature`, and `plan-ceo-review`
   - injects custom primary agents named `conductor` and `reviewer`

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
    "ramblings@git+https://github.com/tassis/ramblings.git"
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
    "~/workdir/ramblings/plugin/ramblings-plugin.ts"
  ]
}
```

## Positioning

This plugin should be thought of as a workflow framework for OpenCode.

- Skills carry most workflow behavior.
- Agents exist when a stable role or permission boundary matters.
- Commands exist when an entrypoint should be easier to use.

The repo aims for completeness across the workflow, not minimal feature count. Archive, review, planning, execution, and tracking are all treated as parts of the same system rather than unrelated extras.

## What do I use when?

- early discussion or feature shaping → `office-hours` or `ramblings-brainstorming`
- write down a converged idea → `write-spec` or `ramblings-spec-writing`
- turn an approved direction into execution tasks → `write-plan` or `ramblings-writing-plans`
- execute an existing plan → `start-work` or `ramblings-implementing-plans`
- challenge a plan or idea from multiple angles → `ramblings-challenge-me`
- run a single-lens review → product / engineering / QA / DevEx review skills
- preserve resumable context → `handoff` or `resume-from-handoff`
- summarize readiness → `ramblings-ready-check`
- clean up and archive finished work → `ramblings-archive`

## Surface taxonomy

- **skill** = capability, context, method, persona, or workflow boundary
- **agent** = stable role surface with explicit permissions or operational posture
- **tool** = deterministic operation that an agent should be able to call directly
- **command** = convenience entrypoint that routes into the right workflow surface

In this repo, skills carry most workflow behavior, agents carry stable role/permission shells, tools carry deterministic mechanics, and commands reduce entry friction.

## Stable vs evolving

Most stable concepts:

- project-root `.ramblings/` as durable workflow state
- `start-work` as the main execution entrypoint
- review, handoff, ready-check, and archive as workflow phases

More likely to evolve:

- exact helper layout under `plugin/start-work/`
- exact tool inventory
- exact agent prompt wording
- exact command phrasing

## Commands provided by the plugin

- `conductor`
- `office-hours`
- `start-feature`
- `plan-ceo-review`
- `plan-eng-review`
- `qa-review`
- `careful`
- `challenge-me`
- `grill-me`
- `handoff`
- `resume-from-handoff`
- `retro`
- `investigate`
- `write-spec`
- `write-plan`
- `start-work`

`start-work` is the main execution entrypoint. It operates against project-root `.ramblings/` artifacts, prefers a YAML checklist as the durable execution-state source of truth, and now has a small deterministic custom-tool surface for mechanical state operations.

When those helper tools are called directly, use the repo-prefixed names:

- `ramblings_start_work_resolve`
- `ramblings_start_work_begin_task`
- `ramblings_start_work_record_blocked`
- `ramblings_start_work_record_completion`
- `ramblings_start_work_rerun_continuation`

## Skill taxonomy

For the routing guide, overlap rules, and linked skill index, see [`docs/skills.md`](docs/skills.md).

Completed execution artifacts may be moved under project-root `.ramblings/archive/` so active execution discovery can ignore stale plans and checklists.

Archive should happen only after the work is no longer an active execution candidate.

There is currently no dedicated archive command; archiving is an explicit operator action.

## Agent provided by the plugin

- `conductor` — planning-only custom agent for project-root `.ramblings/` artifacts
- `reviewer` — shared callable review agent for skill-driven product, engineering, QA, and DevEx review

Use Conductor when you want a planning surface that can write:

- `.ramblings/plans/**`
- `.ramblings/specs/**`
- `.ramblings/checklists/**`
- `.ramblings/handoffs/**`
- `.ramblings/debug/**`
- `.ramblings/retros/**`

without entering implementation.

Use Reviewer (`@reviewer`) when you want a stable shared review agent that routes through the selected review skill for persona, skepticism, and recommendation shape.

Use `challenge-me` when you want structured multi-perspective pressure testing through the shared `Reviewer` surface. When multiple lenses are selected, it should instantiate one independent reviewer lane per lens before synthesis.

Use `grill-me` when you want one-question-at-a-time interrogation to reduce ambiguity before committing to a spec, plan, or implementation direction.

See `docs/commands.md` for details.
