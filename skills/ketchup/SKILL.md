---
name: ketchup
description: "Catch up on this chat since your last message, with decision-ready summaries of outstanding user action items. Use for /skill:ketchup."
disable-model-invocation: true
---

# Ketchup

Catch the user up on this chat since the last actual user message before this invocation. Notifications and agent results do not reset that boundary. Use the plain voice of [bro](../bro/SKILL.md), without its restating step. Assume the user remembers their last message and nothing after it. Use recognizable names for branches, PRs, and agents.

## Gather what changed

Keep this turn read-only. Collect your own progress, arrived agent reports, and other messages in this chat. Do not continue the task, approve actions, write files, or mine other sessions.

Report the current PR, CI, or agent state from available authorized evidence. A bounded PR or CI read is allowed when tools and authority exist. Consume arrived agent results, not progress polls. Use Herdsman evidence/control tools only when runtime eligibility permits; never use roster calls or inspection as a waiting loop. Say which work is still running, which state is stale, and what could not be checked. Do not invent completion.

An action item is a decision or step only the user can take, such as a product choice, approval, irreversible action, or missing access. Include unresolved user items raised earlier than the boundary. Work the agent can still do is not a user action item.

## Reply

Open with the action-item count, or say there are none. If nothing happened and no user items remain, say so and stop.

Describe outcomes most important first and what they mean for the user. Omit steps that changed nothing. Name remaining agent work in one line without doing it.

For each user item, explain the decision, why it matters now, options and costs, recommendation, and what happens if unanswered. Say when a part is unknown. Link available detail, but give enough context to decide without opening it. Apply [unslop](../unslop/SKILL.md), reusing instructions already in context.

Show each action item as an evidence-backed before-and-after comparison, side by side. For a choice, show the current state beside each option, or just the options when there is no current state. Use existing screenshots or video for visible changes. Otherwise use an inline table, diff, or diagram based only on evidence already available in this chat. Label proposed outcomes as proposals, not observed results.

Do not start an app, investigate further, or write files solely to create catch-up visuals. Never invent numbers, screenshots, or figures of screens you did not capture. Link only existing artifacts. If no supported visual is available, say so plainly and give the decision in prose. Prefer a supported visual to dense prose.
