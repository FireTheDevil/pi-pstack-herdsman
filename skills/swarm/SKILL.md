---
name: swarm
description: "Fan out N parallel workers, drain them, and return one report. Use for /skill:swarm, 'swarm this', or parallel coverage, races, gauntlets, and exploration."
disable-model-invocation: true
---

# Swarm

For Herdsman launch, discovered definitions, asynchronous results, external isolation, and tool prerequisites, read [Herdsman runtime](../poteto-mode/references/herdsman-runtime.md) when needed. Required capabilities must be available before launch.

Fan out N parallel workers. They may cover separate slices, race the same brief, or mix both. The parent launches them detached, remains available while they run, then aggregates every required terminal result into one report.

## Start

Open a todolist with one entry per phase before launching anything.

1. Frame
2. Fan out
3. Aggregate
4. Report

## Phase A: Frame

1. State the done predicate and the artifact or report the swarm must return.
2. Choose the shape. Partition into slices, race N workers on identical briefs, or mix both. For a race or mixed shape, declare `first pass`, `rank all`, or `best-of` before spawning.
3. Set N from the user or derive it from the shape. N is total workers.
4. Pick a discovered pstack-* definition for each arm using the [role table](../poteto-mode/references/herdsman-runtime.md). Match the work: poteto-agent for features/refactoring, bug-fix for defects, perf-issue for a one-off performance fix, hillclimb for iterative optimization, how-explorer or investigator for local exploration, researcher only for accessible source evidence, advisor for design, reviewer for judgment, and verifier or verifier-sol for authorized behavioral checks. Record effective model identities; a same-model race is independent-attempt evidence, not multi-model evidence.
5. Give each worker its own writable output when it writes. For verification or measurement, each brief names the exact commit SHAs. A measurement brief also names the sample count, what one sample is, and the order of samples. Require the worker to record the SHAs and the measurement method in its result.

## Phase B: Fan out

Launch independent arms with `agent_delegate`, definition, self-contained task and files. Retain live labels and completion/session identities. Continue necessary independent work; when only dependencies remain, end the turn and yield. Integrate asynchronous completions before synthesis; no collection call or polling. One writer per disjoint output boundary.

For different branches or competing code writers, explicitly prepare external worktrees and start separate lead sessions there. Fresh delegates inherit their lead cwd. Do not change a shared branch or pass cwd/worktree request fields.

Every brief stands alone. Include the goal, scope, exact slice or race arm, how to verify, and what to report. Reports use `PASS`, `ISSUES`, or `BLOCKED` with evidence. A worker that proves a defect reports `ISSUES` and lists every issue it can prove, not only the first.

If a worker drops out, proceed with N-1 and note it.

## Phase C: Aggregate

Read the terminal results. Drop a result that omits the SHAs or method required by its brief, and assign that slice to a fresh worker once with consolidated scope and the invalid receipt. After a second miss, record a gap, never a pass. Resolve any outstanding execution and write ownership before replacement. For coverage, every required slice needs a result. For a race, apply the selection rule declared up front. Use first pass, rank all, or best-of. Do not paste raw worker dumps.

Keep a compact result table, one-line evidenced issues, and explicit gaps or dropouts.

## Phase D: Report

Return one consolidated in-chat report with the table, issue one-liners, gaps or dropouts, and the race rule when used.
