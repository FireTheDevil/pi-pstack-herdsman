---
name: recall
description: "Reconstruct your recent working context from your own chat history, live state, and the shared record (user reports, prior fixes, incidents), then hand back a tight current-state brief. Use for 'recall my work on X', 'catch me up', 'what have I been working on', 'where did I leave off', before starting or resuming work."
disable-model-invocation: true
---

# Recall

For Herdsman launch, discovered definitions, asynchronous results, external isolation, and tool prerequisites, read [Herdsman runtime](../poteto-mode/references/herdsman-runtime.md) when needed. Required capabilities must be available before launch.

**Before you start or resume work, rebuild the user's recent working context and hand back a tight capsule of where things stand now and what to do next.**

Keep it tight and on-topic. Read only what the in-scope threads need, then stop.

Your context lives in two records. Your own chat history holds what you did and decided. The shared record holds everything that happened around the same code under other names, such as symptoms users keep reporting, fixes that shipped and got reverted, and errors still firing. That second record is what the **why** skill searches across source control, issue trackers, chat and issue channels, long-form docs, and error tracking. A feature with a long bug tail keeps most of its story there, so do not reconstruct it from transcripts alone.

Pi stores sessions under `~/.pi/agent/sessions/--<cwd>--/`, one subdirectory per working directory, where `<cwd>` is the resolved absolute cwd with its leading separator removed and each remaining slash, backslash, or colon replaced by `-`. `$PI_SESSION_FILE` identifies the active session when set. Read only the active file or the current cwd directory. The first JSONL record is a session header; later records include messages and session events.

1. Classify, then route. One specific prior chat to resume is the Session pickup playbook, not this. Turning habits into a durable skill is `automate-me`. A human-readable summary of your work is a different task. Recall loads working context across recent chats before you act. If the user already gave you a full state capsule with paths, branch, and change, use it and skip the mining.
2. Lock the scope before searching. Pin the window, with the last 7 days as the default, the topic if named, and the workspace, with the active cwd as the default. State the scope back. Never quietly turn "all" into "recent N".
3. Fan out across chat history. Spawn separate nonblocking Herdsman `pstack-investigator` tasks, each taking a slice of the cwd-scoped corpus. Retain every target and integrate asynchronous completions before synthesis. End the turn and yield when only dependencies remain; there is no collection call. Order candidate session files by modification time, grep the topic first, then read only matching chats and relevant regions. Skip the current chat and obvious subagent, eval, and test noise. Each child follows the same reporting rubric (not backend schema validation), one block per chat with topic, user goal, decisions, open threads, struggles and corrections, and artifacts such as PRs, tickets, branches, each citing the session path. For one or two chats, skip fan-out and search directly. Keep raw transcripts in the children and return only findings.
4. Sweep the shared record whenever the topic names a feature, file, subsystem, area, or bug. This is the default, not a judgment call, and "my work on X" does not exempt it. Use the **why** skill's source investigators, steering the question toward current state, failed fixes, and remaining reports. Reuse its per-source playbooks. Run investigators in parallel with chat-history mining, and inherit its posture. One investigator per source. Null results are findings. Skip an unavailable MCP and say so. Fold the results into the brief. Skip this step only for pure activity recall with no named target, where your own history and live state are the entire answer.
5. Verify against live state. Take the PRs, branches, and tickets that mining and the sweep surfaced and check them with `git` and `gh`. When the answer hinges on what an agent actually did, read the full session, not a trimmed local copy.
6. Write the brief to the contract below. Group by thread. Stay on the named topic.

## Output contract

Lead with the capsule, then the thread status, then the problems, then the next move. Deeper detail goes below or gets cut.

- **Capsule.** At most 5 bullets. What this work is and where it stands overall.
- **Threads.** One line each, prefixed with exactly one status tag: `[merged #N]`, `[open PR #N]`, `[in flight <branch>]`, `[verified, uncommitted]`, `[reverted #N]`, or `[planned, not started]`. A thread with no tag is not done yet, so tag it.
- **Problems.** At most 5 recurring ones. Include symptoms users keep reporting and any fix that shipped and was reverted, so the next attempt starts where the last one failed.
- **Next move.** The single most useful next action, concrete.

An adjacent feature or ticket stays out unless it blocks this one. When the capsule and thread lines outgrow a screen, cut detail before you cut threads. Write the brief through `/skill:unslop`, cite chat findings by session path and shared-record findings by their source, and sanitize private context before public output.

**Reply:** the brief, to the contract above.
