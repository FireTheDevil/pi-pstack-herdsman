---
name: interrogate
description: "Use for \"interrogate\", \"adversarial review\", \"multi-model review\", \"challenge this\", \"stress test this code\", \"find blind spots\", or \"tear this apart\". Adversaries try to break a change or design, and only findings proven by a run survive."
disable-model-invocation: true
---

# Interrogate

Adversaries try to break a change or a design. Keep a finding only when a run proves it. Report findings. Do not apply fixes.

## Frame

Use the scope the user names. Otherwise review the branch diff from its merge base with the intended base branch through the working tree, including relevant untracked files. State the intent with [In your own words](../in-your-own-words/SKILL.md), from the user's request, commits and PR description. Ask when intent is unclear. Freeze the reviewed scope.

Read [Herdsman runtime](../poteto-mode/references/herdsman-runtime.md). Follow [Arena](../arena/SKILL.md) Phase A steps 3 and 4 and Phase B for independent attempts and ownership, with the execution brief below instead of a candidate artifact and rationale. Skip Arena's cross-judge, pick and graft phases. Different adversaries find different failures.

## Fan out

The lead dispatches fresh execution-capable verifier definitions, normally pstack-verifier and pstack-verifier-sol, rather than granting shell to read-only pstack-reviewer. Models come from effective definitions. Disclose actual family overlap or missing diversity. No Cursor Task, generalPurpose or per-request model fields are available.

Execution, scratch writes and external effects still need explicit task authority. A read-only review request does not authorize code changes, repro files, service changes, installations or arbitrary commands with effects. Use authorized non-mutating probes where possible. If a repro needs writes, request an authorized isolated worktree or task-owned scratch and an appropriately capable definition. Do not widen profiles. For competing checkouts prepare external worktrees and separate lead sessions. Direct delegates share cwd. Copy the frozen scope's uncommitted changes only into those authorized isolated checkouts, preserving unrelated work.

Pass identical scope, intent, authority limits, snapshots and dependency evidence through `files`. Each adversary receives this brief:

> Break this change. Prove each finding with an authorized run against the real code, such as an existing failing test, a repro command, or output that shows wrong behavior. For a design or plan, probe the current tree or run an authorized isolated prototype. Keep repro artifacts only in your owned authorized scratch. Report each finding's title, exact command, actual output and the output the intent requires. Leave out unrun claims, style preferences and risks that require a future change to matter. No findings is valid. Report blocked probes and missing capabilities separately. Do not install dependencies, edit the reviewed tree or apply fixes.

Results arrive asynchronously. Continue independent work, then end the turn and yield when only dependencies remain. Forward exact result refs through files. Missing or blocked execution coverage is not a clean review.

## Verify

Rerun each finding's command under the same authorization and isolation rules. Keep it when the output proves failure and that failure breaks the intent. Drop the rest with a reason. Merge findings with the same root cause. An unsafe or unavailable rerun is unverified coverage, not a pass. Retain every verified finding, not just one adversary's list.

## Output

- State the intent and reviewed base, head and working-tree snapshot.
- List actual adversary definitions and models, execution coverage and blockers.
- For each verified finding, give the command, actual output, intent violation and adversaries that found it. Say "no verified findings" when none survive, without calling blocked coverage clean.
- Give each adversary's dropped count and reasons.
- Apply no fixes.
