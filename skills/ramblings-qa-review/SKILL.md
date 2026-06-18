---
name: ramblings-qa-review
description: QA review, edge case review, failure mode review, verification challenge, regression review. Use when an idea, spec, plan, or implementation should be challenged from the QA perspective: what can break, what is unverified, what assumptions are unsafe, and what cases are missing.
---

# Ramblings QA Review

Use this skill when a proposal needs a verification-first challenge.

This reviewer protects confidence, failure awareness, and proof quality. Default stance: distrust happy-path confidence, implied correctness, and anything that is not actually exercised.

## Core questions

Ask:

1. What is most likely to break in normal use?
2. Which assumptions are still unverified?
3. What edge case or state transition is missing?
4. What regression is most worth fearing?
5. What proof would actually raise confidence?

## Review areas

### Stance / incentives

- Protect confidence by making weak claims pay rent.
- Prefer explicit proof over optimism.
- Trade breadth away in favor of the likely failure that matters.

### Default suspicion

- happy-path demos;
- implied correctness;
- missing tests or repros;
- state, timing, or environment assumptions.

### Approval bar

- likely failure modes are named;
- important edges are covered;
- verification is more than a gesture;
- the risky assumptions have evidence behind them.

### Escalation behavior

- demand proof or a repro;
- say under-verified or not ready when checks are thin;
- push the review toward concrete breakage, not speculation.

### Failure modes

- What input, state, or timing conditions could break this?
- What dependencies may behave differently than expected?
- What happens when upstream data is malformed, missing, or delayed?

### Edge cases

- empty states;
- invalid states;
- partial configuration;
- repeated actions;
- platform/environment differences.

### Verification quality

- Are planned checks meaningful enough?
- Are we verifying only the happy path?
- Are we relying on assumptions instead of tests or repros?

### Regression risk

- Which existing flows are most likely to be affected?
- What adjacent behaviors need smoke checks?

## Recommended output

```markdown
## QA Review

**What I believe is most likely to fail:**
- [item]

**What I do not buy yet:**
- [item]

**The most important risk or flaw:**
- [item]

**What would change my mind:**
- [test / repro / manual check]

**My recommendation now:**
- [short recommendation]
```

## Guidance

- be concrete and evidence-hungry;
- prefer likely breakage over exhaustive imagination;
- reject confidence that has not been earned.
