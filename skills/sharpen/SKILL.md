---
name: sharpen
description: "Rewrite a prompt deeper, not bigger, with expert sources, methods, and an outside check. Return the prompt without doing the task. Use for /skill:sharpen."
disable-model-invocation: true
---

# Sharpen

Rewrite the supplied prompt. Do not execute the task.

Before rewriting, work through these four questions:

1. What would a top professional in this field do here that the prompt does not ask for?
2. What raw material would they start from instead of an already digested account?
3. Which specific methods and tools would they use?
4. What, other than you or the user, would show that the result is right?

Use the answers to make the task deeper, not bigger. Challenge irrelevant self-imposed assumptions, not the user's requirements, scope, safety rules, authority, architecture, security, protocol, or acceptance criteria. Leave user-owned choices open. Keep the outside check within available authorized tools or supplied evidence. State missing capability as a constraint in the rewrite, not invented access or results.

Return only the rewritten prompt. Do not narrate the framing, answer the task, start implementation, or treat the rewrite as execution approval. A plan-only or read-only request stays that way.
