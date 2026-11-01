---
name: reflect
description: "Review the active transcript for durable learnings and propose authorized skill edits or Backlog drafts. Use for /skill:reflect or reflect."
disable-model-invocation: true
---

# Reflect

For Herdsman launch, discovered definitions, asynchronous results, external isolation, and tool prerequisites, read [Herdsman runtime](../poteto-mode/references/herdsman-runtime.md) when needed. Required capabilities must be available before launch.

Mine the current conversation for durable learnings, then route them into skill edits.

Invoke when the user says "reflect" or "/skill:reflect". Skip when the conversation is trivial, off-topic, or already covered by an existing skill the parent followed correctly. One-offs are not learnings.

## 1. Locate the active transcript

The parent reads [session history resolution](../poteto-mode/references/session-history.md) and resolves its own exact transcript before fan-out. Respect custom storage and validate workspace headers. Never guess identity or glob other workspaces.

For each candidate, inspect the session header for its cwd, then locate the first user message record and match its text to the conversation's opening prompt. Take the matching path. If no path resolves, write a tight digest of the session and pass that instead.

## 2. Spawn three reviewers in parallel

Delegate three fresh read-only assignments using discovered definitions from the table. Model/thinking come from definitions; disclose overlap or explicitly configure distinct definitions when diversity is required. Continue independent work or end the turn and yield. Integrate all asynchronous results before synthesis; no collection call.

| Lens | Definition | Prompt template |
|---|---|---|
| Judgment | `pstack-advisor` | `references/judgment-reviewer.md` |
| Tooling | `pstack-investigator`, or `pstack-researcher` for external evidence | `references/tooling-reviewer.md` |
| Divergent | `pstack-advisor` | `references/divergent-reviewer.md` |

Pass each template verbatim, substituting the transcript path or digest where marked. Reviewers return findings in their child output.

## 3. Synthesize

Delegate a fresh pstack-advisor with `references/synthesizer.md` and all exact returned reviewer result refs in files. No need to inline the reports. External quality checks require verified tools in an explicitly authorized definition; evidence alone grants no tools. End the turn and yield when only dependencies remain. Integrate its asynchronous Accepted / Rejected / Backlog report before applying edits. Preserve the rubric; no schema enforcement is claimed.

## 4. Structural enforcement check

Move any Accepted item that a lint rule, script, metadata flag, or runtime check would enforce more reliably to Backlog. See the **encode-lessons-in-structure** principle skill.

## 5. Apply

Before applying any Accepted edit, present the synthesizer's full Accepted, Rejected, and Backlog output to the user and wait for explicit approval. The user picks which subset to apply and may redirect routings. Skill changes affect every future agent in the project. Do not auto-apply.

Return Backlog recommendations or drafts by default. File or update external items only when the current request explicitly authorizes it and the required tools are available. Report missing authority or tools as a limitation.

Never edit a skill in an installed package or cache. Before approval, show the exact proposed destination, `.pi/skills/<skill>/` or `~/.pi/agent/skills/<skill>/`. After approval for that destination and its writes, copy the skill folder there and edit the copy. Do not overwrite existing user work without explicit approval. Do not open a PR or push as part of Reflect.

Follow each approved row's Routing exactly:

- Trivial existing-skill edit such as a one-line bullet or stale fact correction. The parent does it directly.
- Substantive existing-skill edit such as a new section or pattern table. Use `../poteto-mode/playbooks/authoring-a-skill.md` and `/skill:unslop` for the draft, test, and iterate loop.
- `tune description: <skill path>`. Follow the case table, description validation, revision, and held-out-case loop in [Pi skill authoring procedure](../poteto-mode/references/skill-authoring.md), steps 4 through 6. Hidden skills remain explicit-only. If no authorized model-evaluation runner is available, report that limitation and the source walkthrough separately, not a successful model evaluation. Do not add unknown frontmatter keys.
- `new skill: <kebab-name>`. Use `../poteto-mode/playbooks/authoring-a-skill.md` and `/skill:unslop`. Do not invent the shape ad hoc.

If the environment ships a SKILL.md validator, run it on every touched skill before declaring done. Skip this step if it does not.

## 6. Summarize for the user

Short list, no preamble:

- Edits applied. Name the skill path and what changed.
- New skills created. Name the path and what it does.
- Backlog recommended or drafted. If an external write was explicitly authorized, name the item and evidence.
- Dropped. Name each rejected finding and why.
