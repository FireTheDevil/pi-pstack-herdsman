---
name: arena
description: "Spawn N parallel candidates at the same task, pick a base, graft the strongest parts of the losers into it. Use for /skill:arena, 'arena this', 'throw it in the arena', or when one attempt at a non-trivial artifact would lock in the wrong shape."
disable-model-invocation: true
---

# Arena

For Herdsman launch, discovered definitions, asynchronous results, external isolation, and tool prerequisites, read [Herdsman runtime](../poteto-mode/references/herdsman-runtime.md) when needed. Required capabilities must be available before launch.

Open a todolist with one entry per phase (Frame, Fan out, Cross-judge, Pick, Graft, Verify) before launching anything.

## Phase A: Frame

Every candidate gets the same prompt, so the prompt is the contract.

1. State the artifact each candidate is producing.
2. Derive 3-6 concrete gradeable criteria for success on this task. The picker uses the rubric in Phase D. Candidates only see the task.
3. Pick the runners. Use two independent attempts as the normal starting point. Add justified attempts for distinct design directions within task authority and resource limits, without requiring another request. Match code-writing roles to the [runtime role table](../poteto-mode/references/herdsman-runtime.md): poteto-agent for features/refactoring, bug-fix for defects, perf-issue for measured fixes, hillclimb for iterative optimization. Use pstack-advisor for read-only designs. Models come from actual definitions. For model diversity, explicitly configure distinct discovered definitions; otherwise disclose same-model independent attempts.
4. Assign output ownership. Read-only pstack-advisor candidates return designs and rationales in their completion results; they do not write files. The lead persists those results to task-owned artifact paths when authorized, preserving their exact result refs. Reserve file-producing assignments for an appropriately authorized implementation-role writer with a disjoint output path or explicitly prepared external worktree and separate lead session, per the **separate-before-serializing-shared-state** principle skill.

## Phase B: Fan out

Launch independent candidates using `delegate_agent` with definition, task and evidence files. For code in competing checkouts, first authorize external worktrees and separate lead sessions; there is no request cwd or managed isolation. Read-only proposals return through results, not filesystem writes. Disjoint output paths may suffice only for authorized file-producing writers; paths do not grant tools. Continue independent work or end the turn and yield. Integrate all asynchronous completions before Phase C. Require a short rationale naming the alternatives considered and the options rejected.

If a candidate produces no output, proceed with N-1 and note the dropout.

## Phase C: Cross-judge

After all candidates finish, inspect the effective discovered judge definitions. Choose one read-only pstack-advisor or pstack-reviewer whose configured model family differs from the parent's, in the explicitly configured preference order. Do not change model pins or pass model fields. Never use a parent-model alias as a diverse judge. If the parent's model is unknown, disclose that the family check could not run. If no authorized different-family judge is available, skip the judge and disclose the missing coverage. Do not invent a fallback model or silently substitute a same-family judge.

Pass the rubric, any lead-persisted candidate paths and exact completion refs through files. The judge returns criterion scores, a recommended base and its rationale. Record its effective model. Read candidates independently while it works, then integrate its asynchronous result.

## Phase D: Pick a base

Read every candidate end to end before picking. Score each against the rubric criterion by criterion, not on holistic feel, and compare with the cross-judge when one ran. Agreement on the base confirms the pick. Disagreement means one of you is biased or the rubric was ambiguous. Read both rationales before deciding.

Pick the base on which candidate a future maintainer can extend most easily without breaking invariants. Prefer the cleaner boundary or smaller API when two feel tied, per the Laziness Protocol.

The lead records the pick and the reason in a short synthesis note alongside the base artifact, including the cross-judge's verdict or why the judge was skipped, when artifact writes are authorized. Otherwise return the synthesis and note in the lead's result.

## Phase E: Graft

Walk each losing candidate once more for what is worth porting into the base, usually one or two things per candidate, not most of it. Fold each graft in by hand, per the **redesign-from-first-principles** principle skill, so the result stays coherent under one mental model. Don't paste mechanically.

If the candidates converge on one shape, that is strong agreement. Note it and ship the consensus shape. No graft is needed. If they wildly diverge, Phase A was under-specified. Reframe and re-run rather than averaging the divergence.

## Phase F: Verify

The synthesized artifact has to hold up under the same scrutiny as any other output, per the **prove-it-works** principle skill. Verify the real artifact and return the child outputs, not just a claim that a candidate passed.

If verification surfaces a problem the arena did not catch, either Phase A was wrong (re-frame and re-run) or one candidate caught it and you missed the graft (go back to Phase E). Don't paper over.

## Outputs

One synthesized artifact, with a short synthesis note alongside naming the base and why, the cross-judge's verdict or skipped coverage, each graft with its source candidate, what was rejected and why, any convergence or dropouts, and the verification result.
