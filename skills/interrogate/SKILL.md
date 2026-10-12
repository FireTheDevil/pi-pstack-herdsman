---
name: interrogate
description: "Use for \"interrogate\", \"adversarial review\", \"multi-model review\", \"challenge this\", \"stress test this code\", \"find blind spots\", or \"tear this apart\". Multiple LLM reviewers challenge changes from independent angles."
disable-model-invocation: true
---

# Interrogate

For Herdsman launch, discovered definitions, asynchronous results, external isolation, and tool prerequisites, read [Herdsman runtime](../poteto-mode/references/herdsman-runtime.md) when needed. Required capabilities must be available before launch.

Obtain independent adversarial reviews using the same prompt and rubric. Use fresh reviewer delegates. Distinct models require explicitly configured discovered reviewer definitions; otherwise disclose model overlap. Report their actual model identities: if they match, this is independent-session review, not multi-model evidence.

## Step 1, Scope

Identify what to review from context:

- If the user points at specific files or a diff, use that.
- If on a feature branch, run `git diff main...HEAD` (or the appropriate base branch) for the full changeset.
- If the user's message references recent work, gather the relevant files.

Package the diff or file contents with any surrounding context files the reviewers need to understand the code.

## Step 2, Intent

Before spawning reviewers, state the intent in one clear paragraph from the user's message, commit messages, the PR description if one exists, and the code. If you're unsure about the intent, ask the user before proceeding.

## Step 3, Spawn Reviewers

Delegate both fresh reviewers with the same rubric and evidence files, using effective discovered definitions. Freeze the reviewed scope. Continue independent work or end the turn and yield; integrate both asynchronous completions before synthesis. Never fork or continue the implementation session for independent review.

Models and thinking live in definitions, not request fields. If required diversity or capabilities are unavailable, report missing coverage and resolve setup explicitly.

Read `references/reviewer-prompt.md` and fill in the same template for every reviewer with the stated intent, the diff or file contents, the rubric from `references/rubric.md`, and the code-quality lens from `references/code-quality-review.md`.

## Step 4, Synthesize

As results arrive, parse every finding. Merge duplicates and record which reviewers raised each one. Independent agreement is highest signal; still read single-reviewer findings. Preserve disagreements as context for the verdict.

## Step 5, Lead Judgment

You are the lead reviewer, a pragmatic senior engineer, not a neutral aggregator. Read `references/lead-judgment.md` for the full framework. Put every finding in one of four buckets, with the model(s) that raised it and a one-line rationale.

- **Act on**. Real issues affecting correctness, security, or maintainability given the actual goals. These would block a real PR.
- **Consider**. Legitimate points, but you're not sure they outweigh the cost of addressing them right now. Worth the user's attention.
- **Noted**. Technically valid but not actionable. Context-dependent, premature optimization, or low-impact given the current stage.
- **Dismissed**. Wrong, nitpicky, or missing context. Brief explanation why.


## Output Format

### Intent
> [The stated intent paragraph from Step 2]

### Reviewers
- Reviewer [label]: [model name], [N findings] (one bullet per reviewer)

### Act On
[Findings that should be addressed. For each: description, which reviewers raised it, why it matters.]

### Consider
[Findings worth thinking about. For each: description, which reviewers raised it, tradeoff involved.]

### Noted
[Brief list.]

### Dismissed
[Each with a brief rationale.]

### Agreement Map
[Where models agreed and diverged, and what that pattern tells us.]
