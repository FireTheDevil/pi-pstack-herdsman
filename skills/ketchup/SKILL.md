---
name: ketchup
description: "Catch up on what changed in this chat in plain words and small evidence-backed visuals, with concise human decisions. Use for /skill:ketchup."
disable-model-invocation: true
---

# Ketchup

Catch the user up since the last actual user message before this invocation. Notifications and agent results do not reset that boundary. Assume the user remembers their last message and nothing after it.

Use [bro](../bro/SKILL.md)'s voice, not its restating task: plain words, short sentences, no jargon. Explain what changed for the user, not how you did it. Say "the tests pass", not "CI is green". Omit hashes, paths, commands and counts unless needed to act. Use names the user recognizes; give context when a fact needs it.

## Gather what changed

Keep this turn read-only. Collect your progress, arrived reports and messages in this chat. Do not continue the task, approve actions, write files, mine other sessions, start apps or jobs, or post anything to manufacture visuals.

Report current PR, check and agent state from available authorized evidence. A bounded PR or CI read is allowed when tools and authority exist; do not open a new investigation. Consume arrived results, not progress polls. Herdsman evidence/control tools require runtime eligibility; never use roster or inspection calls as a waiting loop. Say what is still running, stale, unknown or uncheckable. Check displayed numbers against source facts and disclose corrections. Do not invent completion.

An action item is a decision or step only the user can take: a product choice, approval, irreversible action or missing access. Include older unanswered items. Remaining agent work is not a user item. Never invent a call to fill the reply. An unasked, unnecessary step is not an action item unless it is irreversible and already waiting on the user; give that exception one action line, no visual and no invented consequence of silence.

## Write the reply

Aim well under 150 words excluding visuals. Never hide material decisions, blockers or uncertainty to meet the target. Cut history before action items. Open with the action-item count, or say none. If nothing changed and nothing waits, say so and stop.

Show outcomes pictures first. Embed existing screenshots or videos inline when supported, then a diagram if it explains the change. Give one short bullet per requested outcome: what came of it and whether it is done, running, failed or unchecked. Each bullet must be true alone. Name bugs found and fixed. Never mark work done while it still needs the user. Avoid repeating facts from visuals or action items. Add at most three short contextual lines, then one line of remaining agent work without doing it.

List human action items as plain bullets, never boxes. Give each two lines: the decision, recommendation and reason; then what no answer means. Include prerequisites and irreversible effects in the recommendation. Write "unknown" where needed and link existing detail. The unasked irreversible exception gets only one line.

After the list, compare choices with their gains and costs and the current state when one exists. Reuse screenshots already shown rather than draw a duplicate. Label proposed outcomes as proposals, not observed results. Apply [unslop](../unslop/SKILL.md), reusing instructions already in context.

## Visuals

A Markdown table is not a visual. Prefer real screenshots or video for visible changes. If none exists, mark the outcome "No screenshot yet" and explain the visible change plainly. Link only artifacts that exist; do not create files or investigate solely for catch-up visuals.

An inline Mermaid diagram or chart may use facts already available when it is clearer than prose. Use only available output capabilities, not assumed graphics or image-generation tools. Keep connected diagrams small: at most six boxes and eight words per box. No empty status boxes, disconnected status lists, invented numbers or fake screens. If no supported visual helps, use honest prose.
