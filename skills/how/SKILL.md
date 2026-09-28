---
name: how
description: "Use for \"how does X work\", code walkthroughs before changing something, and placement / ownership / layering questions (\"where should this live\", \"which package owns this\", \"is this the right layer\"). Explains subsystem architecture, runtime flow, onboarding mental models. Use why for motivation."
disable-model-invocation: true
---

# How

For Herdsman launch, discovered definitions, asynchronous results, external isolation, and tool prerequisites, read [Herdsman runtime](../poteto-mode/references/herdsman-runtime.md) when needed. Required capabilities must be available before launch.

Explore the codebase to answer "how does X work?" questions. Produce architectural explanations at the level of a senior engineer onboarding onto a subsystem, enough to build a working mental model, not so much that it reads like annotated source code.

## Step 1. Assess Complexity

If the scope is ambiguous, state your interpretation and explore. The user can redirect.

- **Simple** (a single module, a small utility, a narrow question such as "how does function X work"): no explorers. One explainer explores and explains in a single pass. Go to Step 2b.
- **Complex** (a subsystem spanning multiple files or services, a cross-cutting feature, a full architectural overview): spawn parallel explorers first, then hand off to the explainer. Go to Step 2a.

When in doubt, take the simple path.

## Step 2a. Explore (complex questions only)

Decompose the question into 2 to 4 exploration angles, each a distinct slice of the subsystem. Delegate each independent explorer with `agent_delegate`. Preserve exact live labels and completion identities; continue independent work or end the turn and yield to asynchronous results:

- Herdsman definition: `pstack-how-explorer`
- Use model/thinking from the effective discovered definition. Global definitions override project definitions; there are no per-request model fields.
- Read-only assignment. Confirm repository tools in the effective definition; a prompt does not grant tools or enforce filesystem permissions.

Each explorer gets the prompt in `references/explorer-prompt.md` with its angle filled in. Then go to Step 3.

## Step 2b. Direct Explain (simple questions)

Spawn one background child that explores and explains in one pass:

- Herdsman definition: `pstack-advisor`
- Use model/thinking from the effective discovered definition. Global definitions override project definitions; there are no per-request model fields.
- Read-only assignment. Confirm repository tools in the effective definition; a prompt does not grant tools or enforce filesystem permissions.

Build its prompt from `references/explainer-prompt.md` without the explorer-findings section. Yield while it runs; after completion notification, integrate its asynchronously delivered result. Go to Step 4.

## Step 3. Synthesize (complex questions only)

Once completion notifications show all explorers have settled, integrate their asynchronously delivered results and spawn one detached background child to synthesize their findings into one explanation:

- Herdsman definition: `pstack-advisor`
- Use model/thinking from the effective discovered definition. Global definitions override project definitions; there are no per-request model fields.
- Read-only assignment. Confirm repository tools in the effective definition; a prompt does not grant tools or enforce filesystem permissions.

Build its prompt from `references/explainer-prompt.md` with the question filled in and every exact returned explorer result ref supplied through files. Do not restate their reports. Yield while it runs; after completion notification, integrate its asynchronously delivered result.

## Step 4. Present

Present the explainer's output to the user. Light edits for clarity or context from the conversation are fine. Do not substantially rewrite it.

## Output Format

The explanation uses the sections defined in `references/explainer-prompt.md`, dropping any that do not apply: Overview, Key Concepts, How It Works, Where Things Live, Gotchas.
