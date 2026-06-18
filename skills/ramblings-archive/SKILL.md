---
name: ramblings-archive
description: Archive completed or near-completed work units, consolidate multiple related specs into one canonical spec, clean obsolete active .ramblings artifacts, preserve older specs as archive history, and package archive outputs using the existing .ramblings/archive flow. Use when the user asks to archive, 歸檔, 整理 completed work, clean up old specs, merge overlapping specs into one canonical spec, or reduce active .ramblings clutter while preserving historical context.
---

# Ramblings Archive

Use this skill when the job is整理, not active feature delivery.

This workflow is for completed or near-completed work units that need:

- one clean canonical spec;
- old overlapping specs cleared from the active area;
- completed plan/checklist packaging under `.ramblings/archive/`; and
- historical context preserved without leaving the active `.ramblings/` area noisy.

## Goal

Produce a clean end state for a workstream by:

1. consolidating related specs into one canonical source of truth when needed;
2. deciding what stays active versus what becomes historical;
3. archiving completed work units using the repo's existing archive process.

## When to use

Use this skill when the user asks to:

- archive or 歸檔 completed work;
- clean up active `.ramblings/` clutter;
- merge or consolidate multiple specs into one;
- choose the canonical spec and remove obsolete overlap;
- package a finished work unit into `.ramblings/archive/`.

## When not to use

Do not use this skill when:

- the work is still actively being implemented;
- the main need is writing a new spec from scratch;
- source-of-truth conflicts are so large that planning discussion is needed first;
- the user is asking for ordinary implementation, debugging, or review rather than cleanup.

## Core workflow

### 1. Inventory the related artifacts

Collect the work unit's:

- plan;
- checklist, if any;
- related specs;
- handoffs;
- ready-checks;
- optional debug / retro / review notes.

### 2. Decide the canonical spec outcome

Prefer one integrated canonical spec.

Default outcomes:

1. generate one new canonical spec from overlapping active specs;
2. keep one existing spec only when consolidation adds no real value;
3. archive the final canonical spec too when the workstream is fully finished.

Do not leave several overlapping active specs around once a canonical replacement exists.

### 3. Preserve older specs as history

Older specs should usually be preserved as history rather than silently destroyed.

They may move into the archived work-unit package, optionally with:

- `summary.md`
- `spec-index.md`
- or other compact notes explaining the final source-of-truth outcome.

### 4. Check archive readiness

Before archive packaging, confirm:

- the plan is complete;
- the checklist is complete, if one exists;
- no active `in_progress` or `blocked` execution state remains;
- no handoff still claims remaining active execution work;
- any ready-check supports the archive decision when relevant.

### 5. Package the archive

Use the existing archive flow under:

```text
.ramblings/archive/YYYY-MM-DD-<topic>/
```

Minimum pair:

- `plan.md`
- `checklist.md` or `checklist.yaml`

Optional contents:

- `spec.md`
- `summary.md`
- `spec-index.md`
- `handoff.md`
- `ready-check.md`
- `retro.md`
- `debug.md`

### 6. Clean the active area

After consolidation and packaging:

- keep only the still-canonical active spec, if any;
- remove obsolete active overlap;
- avoid leaving duplicate active + archived copies without a clear reason.

## Stop conditions

Stop and ask the user when:

- multiple candidate specs remain plausibly canonical after inspection;
- the work is not actually complete enough to archive;
- active checklist/plan/handoff state still conflicts;
- consolidation would require guesswork about source of truth.

## Suggested output

```markdown
## Archive Review

**Work unit:**
- [name]

**Archive readiness:**
- ready / not ready

**Canonical spec decision:**
- [generate one canonical spec / keep one existing canonical spec / archive final canonical spec / unresolved]

**Artifacts to keep active:**
- [item]

**Artifacts to archive:**
- [item]

**Archive package:**
- `.ramblings/archive/...`

**Open ambiguity:**
- [item]
```

## Guidance

- prefer one clean active spec over many overlapping active specs;
- preserve history, but do not let history masquerade as active source of truth;
- archive should follow the existing repo flow, not invent a new packaging system;
- do not fabricate execution detail for old pre-checklist work — use historical notes instead.
