# Architecture

## Layers

### `skills/`

Contains the actual `ramblings-*` skills. These define workflow guidance such as brainstorming, spec writing, ready checks, debugging, review, and challenge workflows.

See `docs/skills.md` for the current taxonomy, routing rules, and overlap guide.

### `plugin/`

Contains an OpenCode plugin that registers this repo's `skills/` path, injects optional commands into live config, and injects the custom `conductor` planning agent.

## Design decisions

- The plugin does **not** inject a global workflow bootstrap.
- The plugin does **not** override user-defined commands of the same name.
- The plugin does **not** override a user-defined `conductor` agent if one already exists.
- The plugin does **not** perform git actions.
- Commands are lightweight prompt shortcuts that encourage the right `ramblings-*` skill usage.
- `conductor` is the repo-owned planning surface; native `@plan` behavior remains outside this repo's contract.

## Current command-surface boundary

This repo's command hardening is currently contract-driven, not runtime-engine-driven.

- `handoff`, `resume-from-handoff`, and `start-work` can define artifact rules, selection ladders, and stop conditions in their prompt surfaces.
- `start-work` is now also gaining helper-backed control logic under `plugin/start-work/` for active artifact resolution, continuation outcomes, and YAML checklist-first execution state.
- These command surfaces still do **not** provide a full standalone runtime scheduler or executor.
- Determinism currently comes from clearer artifact contracts plus explicit helper-backed control rules, not from a deeper runtime engine.

## Start-work execution boundary

The intended `start-work` model is:

- route `/start-work` to a dedicated execution orchestrator;
- do **not** reuse the planning-only `conductor` for execution;
- keep first-iteration execution single-task, single-lane, and sequential by default;
- treat YAML checklists under `.ramblings/checklists/` as the durable execution-state source of truth.

If the host/plugin environment cannot yet hard-bind `/start-work` to a dedicated execution agent, the command surface should still behave as though that execution-orchestrator contract exists.

Consider a deeper runtime/helper implementation later if:

- multi-handoff ambiguity remains common in real usage;
- delegated execution still drifts even with YAML checklist + helper-backed control logic;
- prompt-level selection still produces inconsistent results;
- or the host/plugin environment gains a better structured mechanism for artifact discovery and ranking.

## Installation model

The repo supports both git-backed plugin installation and direct local plugin-path development. The layout keeps the same `skills/` and `plugin/` split in either case so the command surface and skill paths stay stable.
