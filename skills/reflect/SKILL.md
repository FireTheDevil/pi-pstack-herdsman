---
name: reflect
description: Spawn three parallel review subagents over the active transcript, surface learnings, and route each to a concrete edit on an existing skill. Use when the user says reflect.
disable-model-invocation: true
---

# Reflect

For Herdsman launch, discovered definitions, asynchronous results, external isolation, and tool prerequisites, read [Herdsman runtime](../poteto-mode/references/herdsman-runtime.md) when needed. Required capabilities must be available before launch.

Mine the current conversation for durable learnings, then route them into skill edits.

## When to invoke

Invoke when the user says "reflect" or "/skill:reflect". Skip when the conversation is trivial, off-topic, or already covered by an existing skill the parent followed correctly. One-offs are not learnings.

## Process

### 1. Locate the active transcript

The parent finds its own transcript file before fanning out. Use the exact active session path exposed by the runtime when available; do not assume an environment variable or guess the session identity. For earlier sessions, use only `~/.pi/agent/sessions/--<cwd>--/`, where `<cwd>` is the resolved absolute cwd with its leading separator removed and each remaining slash, backslash, or colon replaced by `-`. Never glob other working-directory folders. That crosses project boundaries and reads unrelated private chats.

For each candidate, inspect the session header for its cwd, then locate the first user message record and match its text to the conversation's opening prompt. Take the matching path. If no path resolves, write a tight digest of the session and pass that instead.

### 2. Spawn three reviewers in parallel

Delegate three fresh read-only assignments using discovered definitions from the table. Model/thinking come from definitions; disclose overlap or explicitly configure distinct definitions when diversity is required. Continue independent work or end the turn and yield. Integrate all asynchronous results before synthesis; no collection call.

| Lens | Definition | Prompt template |
|---|---|---|
| Judgment | `pstack-advisor` | `references/judgment-reviewer.md` |
| Tooling | `pstack-investigator`, or `pstack-researcher` for external evidence | `references/tooling-reviewer.md` |
| Divergent | `pstack-advisor` | `references/divergent-reviewer.md` |

Pass each template verbatim, substituting the transcript path or digest where marked. Reviewers return findings in their child output.

### 3. Synthesize

Delegate a fresh pstack-advisor with `references/synthesizer.md` and all exact returned reviewer result refs in files. No need to inline the reports. External quality checks require verified tools in an explicitly authorized definition; evidence alone grants no tools. End the turn and yield when only dependencies remain. Integrate its asynchronous Accepted / Rejected / Backlog report before applying edits. Preserve the rubric; no schema enforcement is claimed.

### 4. Structural enforcement check

Sanity-check the synthesizer's Accepted list. For any item that would be enforced more reliably by a lint rule, script, metadata flag, or runtime check, move it from Accepted to Backlog. See the **encode-lessons-in-structure** principle skill.

### 5. Apply

Before applying any Accepted edit, present the synthesizer's full Accepted, Rejected, and Backlog output to the user and wait for explicit approval. The user picks which subset to apply and may redirect routings. Skill changes affect every future agent in the project. Do not auto-apply.

Backlog items go to whatever devex or backlog tracker the team uses automatically. Only the Accepted list waits for approval.

For each approved Accepted item, follow the Routing field exactly:

- Trivial existing-skill edit such as a one-line bullet or stale fact correction. The parent does it directly.
- Substantive existing-skill edit such as a new section or pattern table. Use `../poteto-mode/playbooks/authoring-a-skill.md` and `/skill:unslop` for the draft, test, and iterate loop.
- `tune description: <skill path>`. Narrow the description to the phrases that should trigger it. Do not add unknown frontmatter keys.
- `new skill: <kebab-name>`. Use `../poteto-mode/playbooks/authoring-a-skill.md` and `/skill:unslop`. Do not invent the shape ad hoc.

If the environment ships a SKILL.md validator, run it on every touched skill before declaring done. Skip this step if it does not.

### 6. Summarize for the user

Short list, no preamble:

- Edits applied. Name the skill path and what changed.
- New skills created. Name the path and what it does.
- Backlog filed. Name the issue and tags.
- Dropped. Name each rejected finding and why.
