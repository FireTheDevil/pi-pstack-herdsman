---
name: how
description: "Use for \"how does X work\", code walkthroughs before changing something, and placement / ownership / layering questions (\"where should this live\", \"which package owns this\", \"is this the right layer\"). Explains subsystem architecture, runtime flow, onboarding mental models. Use why for motivation."
disable-model-invocation: true
---

# How

For Herdsman launch, discovered definitions, asynchronous results, external isolation, and tool prerequisites, read [Herdsman runtime](../poteto-mode/references/herdsman-runtime.md) when needed. Required capabilities must be available before launch.

Explore the codebase to answer "how does X work?" questions. Produce architectural explanations at the level of a senior engineer onboarding onto a subsystem, enough to build a working mental model, not so much that it reads like annotated source code.

Use effective discovered definitions and read-only assignments throughout. Models and tools come from definitions, not requests. A missing capability blocks the route. The lead delegates and integrates asynchronous results; leaves report to their owner.

## 1. Assess complexity

State your interpretation if the scope is ambiguous. For a narrow question in one module, delegate one pstack-advisor to explore and explain in one pass, with `references/explainer-prompt.md` and no explorer-findings section. Then go to step 4. When in doubt, take this simple path.

For a subsystem or cross-cutting question, go to step 2.

## 2. Explore (complex only)

Split the question into 2 to 4 distinct angles. Delegate each to a fresh explorer using Herdsman definition: `pstack-how-explorer`, with `references/explorer-prompt.md` and its angle filled in. Continue independent work or end the turn and yield. Do not poll. Integrate all required asynchronous results before step 3.

## 3. Synthesize (complex only)

Delegate a fresh pstack-advisor with `references/explainer-prompt.md`, the question, and every exact explorer result ref through files. Do not restate their reports. End the turn and yield when only dependencies remain; integrate its result before presenting.

## 4. Present

Present the explainer's output. Light edits for clarity or context are fine. Do not substantially rewrite it.

## Output format

Use the sections in `references/explainer-prompt.md`, dropping those that do not apply: Overview, Key Concepts, How It Works, Where Things Live, Gotchas.
