# Architecture

## Layers

### `skills/`

Contains the actual `ramblings-*` skills. These define workflow guidance such as brainstorming, spec writing, debugging, verification, review, and challenge sessions.

### `plugin/`

Contains an OpenCode plugin that registers this repo's `skills/` path, injects optional commands into live config, and injects the custom `conductor` planning agent.

## Design decisions

- The plugin does **not** inject a global workflow bootstrap.
- The plugin does **not** override user-defined commands of the same name.
- The plugin does **not** override a user-defined `conductor` agent if one already exists.
- The plugin does **not** perform git actions.
- Commands are lightweight prompt shortcuts that encourage the right `ramblings-*` skill usage.
- `conductor` is the repo-owned planning surface; native `@plan` behavior remains outside this repo's contract.

## Installation model

The current model assumes the repo is cloned locally and referenced via plugin path. The structure is chosen so future git-backed plugin installation is possible without redesigning the repo.
