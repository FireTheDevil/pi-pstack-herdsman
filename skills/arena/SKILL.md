---
name: arena
description: "Spawn N parallel candidates at the same task, pick a base, graft the strongest parts of the losers into it. Use for /skill:arena, 'arena this', 'throw it in the arena', or when one attempt at a non-trivial artifact would lock in the wrong shape."
disable-model-invocation: true
---

# Arena

For Herdsman launch, discovered definitions, asynchronous results, external isolation, and tool prerequisites, read [Herdsman runtime](../poteto-mode/references/herdsman-runtime.md) when needed. Required capabilities must be available before launch.

Fan out N parallel attempts at the same task. Read every candidate end to end. Pick the strongest as the base. Graft the best ideas from the others into it. Verify the synthesized result.

## Start

Open a todolist with one entry per phase before launching anything.

1. Frame
2. Fan out
3. Cross-judge
4. Pick
5. Graft
6. Verify

## Phase A: Frame

The N candidates will receive the same prompt, so the prompt is the contract.

1. State the artifact each candidate is producing.
2. Derive the rubric. State what success looks like for *this* task, then turn it into 3-6 concrete gradeable criteria. The rubric is the picker's tool in Phase D. Candidates only see the task.
3. Pick the runners. Use four independent attempts by default, fewer for a narrow comparison. Use pstack-poteto-agent for code and pstack-advisor for read-only designs. Models come from actual definitions. For model diversity, explicitly configure distinct discovered definitions; otherwise disclose same-model independent attempts.
4. Assign output ownership. Read-only pstack-advisor candidates return designs and rationales in their completion results; they do not write files. The lead persists those results to task-owned artifact paths when authorized, preserving their exact result refs. Reserve file-producing assignments for an appropriately authorized pstack-poteto-agent writer with a disjoint output path or explicitly prepared external worktree and separate lead session, per the **separate-before-serializing-shared-state** principle skill.

## Phase B: Fan out

Launch independent candidates using `agent` action `delegate` with definition, task and evidence files. For code in competing checkouts, first authorize external worktrees and separate lead sessions; there is no request cwd or managed isolation. Read-only proposals return through results, not filesystem writes. Disjoint output paths may suffice only for authorized file-producing writers; paths do not grant tools. Continue independent work or end the turn and yield. Integrate all asynchronous completions before Phase C. Include a short rationale request.

Each rationale names the alternatives the candidate considered and what it rejected.

If a candidate fails to produce output, proceed with N-1 and note the dropout in the synthesis record.

## Phase C: Cross-judge

After Phase B completes, delegate a fresh pstack-advisor or pstack-reviewer with a read-only brief, rubric, any lead-persisted candidate paths and exact completion refs through files. The cross-judge returns its scores and rationale in its result; the lead persists any review artifact. Record its effective model and disclose overlap. It scores each criterion and recommends a base. Read candidates independently while it works, then integrate its asynchronously delivered result.

## Phase D: Pick a base

Read every candidate end to end before picking.

Score each candidate against the rubric criterion by criterion, not on holistic feel. Compare against the cross-judge. Agreement on the base confirms the pick. Disagreement means one of you is biased or the rubric was ambiguous. Read both rationales before deciding.

Pick the base on which candidate a future maintainer can extend most easily without breaking invariants. Prefer the cleaner boundary or smaller API when two feel tied, per the Laziness Protocol.

The lead records the pick and the reason in a short synthesis note alongside the base artifact, including the cross-judge's verdict, when artifact writes are authorized. Otherwise return the synthesis and note in the lead's result.

## Phase E: Graft

Walk each losing candidate once more and identify what is worth porting into the base. The signal is usually one or two things per candidate, not most of it.

Fold each graft in by hand, per the **redesign-from-first-principles** principle skill. Don't paste mechanically. The result has to remain coherent under one mental model.

Record what was grafted, from which candidate, and what was rejected and why.

When N candidates converge on the same shape, that is a strong agreement signal. Note the convergence in the record and ship the consensus shape. No graft is needed. When N candidates wildly diverge, Phase A was under-specified. Reframe and re-run rather than averaging the divergence.

## Phase F: Verify

The synthesized artifact has to hold up under the same scrutiny as any other output, per the **prove-it-works** principle skill. Verify the real artifact and return the child outputs, not just a claim that a candidate passed.

If verification surfaces a problem the arena did not catch, either Phase A was wrong (re-frame and re-run) or one candidate caught it and you missed the graft (go back to Phase E). Don't paper over.

## Outputs

One synthesized artifact. One short synthesis note alongside, naming the base, the grafts (with source candidate), the rejections, the dropouts if any, and the verification result.
