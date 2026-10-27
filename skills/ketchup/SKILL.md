---
name: ketchup
description: "Catch up on what changed in this chat in plain words and small evidence-backed visuals, with every pending human decision self-contained. Use for /skill:ketchup."
disable-model-invocation: true
---

# Ketchup

Catch the user up since the last actual user message before this invocation. Notifications and agent results do not reset that boundary. Assume the user remembers their last message and nothing after it. Lay out every pending call so they can decide from the reply alone.

Use [bro](../bro/SKILL.md)'s voice, not its restating task: plain words, short sentences, no jargon. Explain what changed for the user, not how you did it. Say "the tests pass", not "CI is green". Omit hashes, paths, commands and counts unless needed to act. Use names the user recognizes; give context when a fact needs it.

## Gather what changed

Keep this turn read-only. Collect your progress, arrived reports and messages in this chat. Do not continue the task, approve actions, write files, mine other sessions, start apps or jobs, or post anything to manufacture visuals.

Report current PR, check and agent state from available authorized evidence. A bounded PR or CI read is allowed when tools and authority exist; do not open a new investigation. Consume arrived results, not progress polls. Herdsman evidence/control tools require runtime eligibility; never use roster or inspection calls as a waiting loop. Say what is still running, stale, unknown or uncheckable. Check displayed numbers against source facts and disclose corrections. Do not invent completion.

An action item is a decision or step only the user can take: a product choice, approval, irreversible action or missing access. Include older unanswered items. Remaining agent work is not a user item. Never invent a call to fill the reply. An unasked, unnecessary step is not an action item unless it is irreversible and already waiting on the user; give that exception one action line, no visual and no invented consequence of silence.

One call can cover many items, such as PRs awaiting merge. For each item, collect its identity, link if available, user effect, evidence, explicit risk, and recommendation. Write "unknown" for needed facts you do not know. Omit missing links rather than inventing them.

## Write the reply

Spend words on decisions, not history. Keep what happened under 100 words excluding visuals. Aim for about 30 words per item, but never cut an item or needed context to meet a word count. Two items stay concise, usually well under 150 words. Thirty pending items need thirty independently decidable entries, not a count or link-only summary.

Open with one short sentence naming what waits on the user, or say nothing does. If nothing changed and nothing waits, say so and stop.

Show outcomes pictures first. Embed existing screenshots or videos inline when supported, then a diagram if it explains the change. Give one short bullet per requested outcome. Say what came of it and whether it is done, running, failed, or unchecked. Each bullet must be true alone. Name bugs found and fixed. Never mark work done while it still needs the user. Avoid repeating facts from visuals or action items. Add at most three short contextual lines, then one line of remaining agent work without doing it.

List human action items as plain bullets, never boxes. Ask the call the user owns, such as merge, approve, or pick. Include prerequisites and irreversible effects in the recommendation. An unasked irreversible exception gets only one line and no visual.

For one item, give the call, recommendation, user effect, evidence, and explicit risk in one bullet. Name the item once. For a shared call, state the call and recommendation once. Then give each item its own bullet, riskiest first, with its identity and link if available, user effect, evidence, and risk. Include low risks too. State a per-item recommendation only when it differs. Say what waiting costs only when it is more than delay, such as a deadline or lost data.

For a choice between options, give every option weighed, its gain, cost, and current state when one exists. These costs are the risk, so add no separate risk line. Put each option's gain and cost under its existing screenshot when available. Label proposals as proposals, not observed results. Apply [unslop](../unslop/SKILL.md), reusing instructions already in context.

## Visuals

A Markdown table is not a visual. Prefer real screenshots or video for visible changes. If none exists, mark the outcome "No screenshot yet" and explain the visible change plainly. Link only artifacts that exist; do not create files or investigate solely for catch-up visuals.

An inline Mermaid diagram or chart may use facts already available when it is clearer than prose. Use only available output capabilities, not assumed graphics or image-generation tools. Keep connected diagrams small: at most six boxes and eight words per box. No empty status boxes, disconnected status lists, invented numbers or fake screens. If no supported visual helps, use honest prose.
