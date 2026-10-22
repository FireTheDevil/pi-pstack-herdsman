---
name: poteto-help
description: "Answer questions about Pi pstack setup, workflow selection, and prompt wording without starting the work. Type /skill:poteto-help with a question."
disable-model-invocation: true
---

# Poteto help

Answer the help question, offer at most one ready-to-send prompt, and link the source file you read. Do not execute examples or start the workflow. If the message requests actual work instead of help, identify [poteto-mode](../poteto-mode/SKILL.md) as the route and let the user invoke it. This help turn remains question-only.

Infer the need from the message and chat. If unclear, ask one multiple-choice question: setup, starting a task, picking a skill, fixing a run, or customizing the workflow. Answer only the selected need. Read the routed file before recommending it; that file overrides this map. Use local source links, not invented public URLs or Cursor documentation.

## Setup and runtime

Read [setup-pstack](../setup-pstack/SKILL.md) and [Herdsman runtime](../poteto-mode/references/herdsman-runtime.md) for setup questions. On lead session startup, the extension reconciles global profiles, creating missing ones and applying safe package description and prompt updates. Installed configuration, including models, thinking, and tools, remains user-owned. Conflicts and package capability changes hold the affected profile. Restart Pi after reported profile changes and inspect the effective definitions. Same-name globals override project definitions. Installation alone does not synchronize profiles. `/setup-pstack [role]` previews an optional confirmed project copy; it is not a model-budget wizard. Models and tools belong to effective discovered definitions. Preserve Sol, Luna, and Astra policy; never invent model availability or substitute a fallback.

When effective definitions or availability are unknown and matter to the answer, mention that uncertainty. At most once per chat, ask whether the user wants setup guidance now or later. Do not inspect agents as a progress poll or change configuration from help. For cost questions, explain the cost of independent exploration and review, not nonexistent budget menus.

For verification questions, identify whether a matching project verification skill or actual app tool is available. If none is known, say so and route to [create-verification-skill](../create-verification-skill/SKILL.md). For a formal property, race, or invariant beyond test reach with no existing formal check, route to [create-formal-verification-skill](../create-formal-verification-skill/SKILL.md), explicitly invoked with `/skill:create-formal-verification-skill`. It produces one project-local formal check, not app-driving verification or a feature-map maintenance loop. If a formal check already exists and its covered code changed after its recorded sync commit, recommend `/skill:maintain-formal-verification-skill` and read the [maintenance skill](../maintain-formal-verification-skill/SKILL.md). Do not offer creation again. Missing sync history is a maintenance uncertainty, not evidence that the old pass proves current code. For a reader-visible checked chart, recommend `/skill:statechart` and read [Statechart](../statechart/SKILL.md). Explain its scratch, trusted-map, tool, and PNG approval gates. Help does not run checks, install tools, or mutate definitions. A green build does not prove behavior.

## Start and select

`/poteto-mode` enables the style for the session; `/poteto-mode off` disables it. `/skill:poteto-mode` also enables it. `/pstack-status` takes no arguments and reports Poteto Mode and bundled skill visibility without changing session state. Hidden skills remain explicitly callable as `/skill:<name>`; no automatic discovery accuracy is promised. For prompt wording, read [prompting](references/prompting.md) and [recipes](references/recipes.md).

| Need | Source |
| --- | --- |
| Rigorous implementation or workflow routing | [poteto-mode](../poteto-mode/SKILL.md) |
| Mechanics, ownership, or placement | [how](../how/SKILL.md) |
| Historical reasons or a number's origin | [why](../why/SKILL.md) |
| Plain explanation | [teach](../teach/SKILL.md) |
| Restate the goals and underlying problem without starting work | [in-your-own-words](../in-your-own-words/SKILL.md) |
| Rewrite a prompt deeper, not bigger, without doing the task | [sharpen](../sharpen/SKILL.md) |
| Recent cross-session context on a topic | [recall](../recall/SKILL.md) |
| Current-chat outcomes, real visuals, and every self-contained human decision | [ketchup](../ketchup/SKILL.md) |
| Breakage outside a diff | [blast-radius](../blast-radius/SKILL.md) |
| Types and module design | [architect](../architect/SKILL.md) |
| Same brief, competing candidates and synthesis | [arena](../arena/SKILL.md) |
| Partitioned coverage or races | [swarm](../swarm/SKILL.md) |
| Independent adversarial review | [interrogate](../interrogate/SKILL.md) |
| Prose cleanup or document structure | [unslop](../unslop/SKILL.md), [technical-writing](../technical-writing/SKILL.md) |
| Reusable app proof or drift maintenance | [create-verification-skill](../create-verification-skill/SKILL.md), [maintain-verification-skill](../maintain-verification-skill/SKILL.md) |
| Formal properties beyond test reach, with no existing check | [create-formal-verification-skill](../create-formal-verification-skill/SKILL.md) |
| Existing formal checks after covered-code changes | [maintain-formal-verification-skill](../maintain-formal-verification-skill/SKILL.md) |
| Reader-visible statecharts, agreed-chart skeletons, or code-to-spec comparison | [statechart](../statechart/SKILL.md) |
| Performance measurement rigor | [benchmark-checklist](../benchmark-checklist/SKILL.md) |
| A bespoke rigorous run | [figure-it-out](../figure-it-out/SKILL.md) |
| Decision trail | [show-me-your-work](../show-me-your-work/SKILL.md) |
| Session lessons or repeated mistakes | [reflect](../reflect/SKILL.md), [correct](../correct/SKILL.md) |
| Personal workflow | [automate-me](../automate-me/SKILL.md) |

For another installed skill, read its frontmatter and body before routing. Principles are one-rule skills that shape decisions, not extra orchestration layers. Explicit invocation uses `/skill:principle-<name>`.

## Playbooks and close calls

Playbooks are files selected inside poteto-mode, not standalone commands. Read the matching file before recommending it.

- How explains mechanics; Why investigates reasons; Teach explains the evidence plainly.
- Arena compares the same brief; Swarm partitions checks. Neither creates automatic worktrees or cloud isolation. One writer owns each boundary. External worktrees need authorization and separate lead sessions.
- Recall reconstructs recent topic context; Ketchup summarizes this chat. A specific old branch or session routes to [Session pickup](../poteto-mode/playbooks/session-pickup.md).
- For a plan-only deliverable, use [Multi-phase plan](../poteto-mode/playbooks/multi-phase-plan.md). For unsettled design, use [Prototype](../poteto-mode/playbooks/prototype.md) or Architect first. State a checkpoint when implementation needs approval.
- PR status or babysitting routes to [Babysit](../poteto-mode/playbooks/babysit.md). Status does not authorize fixes or merge. Landing routes to [Shipping](../poteto-mode/playbooks/shipping.md) with explicit authority and independent verification.
- One task to a predicate routes to [Autonomous run](../poteto-mode/playbooks/autonomous-run.md). A multi-day program routes to [Orchestrate](../poteto-mode/playbooks/orchestrate.md). Neither grants scheduling or broader authority.
- Pausing routes to [Pause safely](../poteto-mode/playbooks/pause-safely.md). Skill edits use [Authoring a skill](../poteto-mode/playbooks/authoring-a-skill.md); evaluations require an authorized available runner.

## Troubleshooting and reply

For drift, restate the goal or say "new task". For overlapping writers, stop and resolve ownership rather than assuming isolation. For unsupported tools or models, report the missing capability. For claimed success from compilation alone, ask for inspectable proof of the real behavior.

Lead with the answer. Give at most one adapted prompt from recipes and the source link. Apply unslop to the reply without turning help into implementation.
