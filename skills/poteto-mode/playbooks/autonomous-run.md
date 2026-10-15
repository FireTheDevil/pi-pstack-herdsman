### Autonomous run

Use [Herdsman runtime](../references/herdsman-runtime.md) for supported launch, wake, isolation, and stop semantics. A written goal or cadence is not a running scheduler.

## Unattended trust preflight

Before unattended work, confirm all four checks. If one is missing, report the gap and establish it through authorized attended work before proceeding unattended.

1. Observe a successful manual or agent run of the intended workflow.
2. Equip the run with available verification, profiling, and logging tools sufficient to diagnose failures.
3. Require inspectable proof at each stage and a stop-the-line gate when proof fails or authority is missing.
4. Review available transcripts and encode recurring failures into the workflow or checks. Do not mine unrelated sessions or change skills without authority.

These checks grant no scheduling, commit, publication, or scope authority. Preserve unrelated work; discard only task-owned changes when authorized.

**You own the exit condition. Define done, then drive to it without stopping.**

1. State the exit condition as a checkable predicate before the first iteration (tests green, repro fixed, all N PRs merged, pixel-diff zero).
2. Choose the wake mechanism. For an event such as CI or a ref change, dispatch a nonblocking verifier task running the real watcher. Its settlement wakes the controller. A periodic heartbeat requires a separately installed, explicitly authorized scheduler. Without one, continue active work and audit at real event boundaries, but report unattended timed wakeups as unavailable.
3. Each iteration makes the smallest change the evidence justifies, verifies it against the predicate, commits if authorized and it advanced, discards only authorized task-owned changes that did not help. Belt-and-suspenders that "might help" gets reverted, not left to ride.
   Sequence the work via the **sequence-verifiable-units** principle skill, verifying each unit before the next instead of batching checks at the end.
4. Mid-run discoveries are yours. Address broken skills, related bugs, flaky verifiers, review noise, tooling failures, orphaned follow-ups, and fixable drift yourself via poteto-mode. Put out-of-band fixes in their own PR. Do not park reversible work for the human or ask a user question. Surface only irreversible actions, genuine product or preference calls no experiment can settle, or a real dead end. Keep the predicate as the main drive, and return to it after each side fix.
5. Checkpoint every iteration via the **show-me-your-work** skill, a row for what changed and whether the predicate moved.
6. Stop when the predicate is met. A plateau is not a stop, so keep going and pivot your approach to push past it. Surface a genuine dead end rather than spinning, and never relax the predicate to declare victory.

**Reply:** the exit condition, iterations run, what landed, what was discarded, final predicate state.
