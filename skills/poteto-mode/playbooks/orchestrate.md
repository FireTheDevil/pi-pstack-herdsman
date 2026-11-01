### Orchestrate

Before unattended execution, read and satisfy all four checks in [Unattended trust preflight](autonomous-run.md#unattended-trust-preflight). Missing checks block unattended work. Authorized attended preparation can establish them. This grants no scheduling, publication, scope, or tools authority.

**You run the program, never the code.** Choose who owns each piece of work, then inspect what they produce. Use this playbook for a standing multi-day project with many PRs and workers. One task driven to a predicate is Autonomous run. One ambitious bespoke run is figure-it-out. Work one agent can finish within the session budget is not a program.

Read [Herdsman runtime](../references/herdsman-runtime.md) before dispatch. Use bounded leaf assignments and asynchronous completions, not persistent actors. Do not call an orchestration CLI or run a status polling loop. This workflow has no bundled state engine. PR event subscriptions are usable only if actually available and authorized. Otherwise dispatch a bounded authorized watcher when needed. Periodic wakes require a separately authorized scheduler. Do not invent Cursor Task, cloud VMs, forked processes, nested coordinators or request-level model and cwd fields.

#### Topology

- One logical owner per PR is the only writer of its branch. The lead dispatches implementation, review, triage and any authorized rebase or merge as separate bounded phases. Leaves never launch dependent controllers. Only the owner pushes, rebases or retargets after the lead authorizes that phase. Closing or retargeting a base PR affects every PR above it and needs a coordinated decision.
- Give each independent task a fresh worker. Include the goal, allowed and forbidden paths, prohibited actions, exact completion evidence, standing orders and relevant dependency artifacts. Pass canonical files and exact upstream result refs through `files`. Summaries alone do not transfer evidence. Continue a saved session only when its expensive context is required, never to check status.
- Direct delegates share the lead cwd. For competing checkouts, explicitly prepare authorized external worktrees and separate lead sessions. Isolate ports, services and writable outputs too. One writer per ownership boundary.
- Keep track planning at the root. The eleven shipped definitions are leaves. A sub-coordinator requires a separately provisioned authorized definition and its own spawn budget. Otherwise tracks are bookkeeping. Use a rolling window sized to the coordinator's ability to inspect completions, not a blocking batch.
- Each PR gets an independent verifier. Select from effective definitions without changing model pins. Disclose actual model overlap. Missing required diversity or execution capability is missing coverage, not permission to broaden a profile.
- Start with one unit through brief, owner, verification and authorized handoff or merge before broad fan-out. Use its evidence to correct the brief and unit size.

#### Durable state

Read [artifact locations](../../../config/artifact-locations.md) and resolve its Orchestrate store, honoring explicit paths and existing adequate artifacts. Keep the program tracker, standing orders, PR links and current heads in `notes.md` in that store. Keep the decision trail there through the show-me-your-work skill. This is coordination state, not Herdsman's session or result store.

The coordinator owns the tracker. Record each unit's goal, owner, exact assignment/session/result identity, branch, base and head SHA, last owned remote SHA, state, verification receipts, blockers and next phase. Record each verdict against its exact PR and head. Preserve adequate existing tables and evidence without automatically migrating or deleting them. Old CLI stores remain historical evidence, not automatically enforced state. No `ORCH_STORE` setting or CLI initialization is required.

#### Supervision

1. Frame the goal and observable done predicate. Scope each unit before dispatch. If you cannot name the command, expected output or artifact that proves completion, the unit is not ready.
2. Dispatch fresh bounded assignments with current standing orders and dependency evidence. When only delegated work remains, end the turn and yield. Results arrive asynchronously. There is no collection call.
3. Read the actual diff or artifact, not only the summary. Green CI is an input, not a verdict. Behavioral work needs behavioral proof. Reject scope drift. Keep only fixes required for the program and record the rest as follow-ups.
4. Record completions and receipts, then authorize the next bounded phase. A new push needs a current-head verdict under the execution playbook's verification policy. Retain code or lane results only under [Shipping](shipping.md)'s patch-id and lane-result reuse rules, with fresh CI and mergeability.
5. Read live PR and CI state before reporting. Bind forge reads to the intended repository, not a default selected by environment variables. Require complete, unambiguous base-chain evidence before advancing a stack. Missing refs, ambiguous or forked parents, cycles and incomplete forge data hold the affected operation. Do not infer a frontier from stale tracker text.
6. Account for every spawned assignment before close. Confirm the predicate on the real artifact, report every PR's current head and verdict, and preserve recoverable handoffs. Never publish merely to make work durable without the user's grant.

#### Ownership and recovery

Exactly one writer owns each stack's topology at a time. Serialize rebases and retargets with branch writes. An owner accepts an explicitly handed-over new tip before resuming. For a rewritten push, check the remote against the recorded last-owned SHA and use `--force-with-lease=refs/heads/<branch>:<last-owned-SHA>`. Unexpected remote changes stop the operation. Preserve Shipping's verified landing ceiling, operator gates and frozen landing topology.

Use current `available_tools` for a concrete recovery decision. Inactivity is advisory, not proof of a hang. Read supplied evidence first, then at most one bounded diagnostic when needed. Do not message workers to ask for status. Steering is non-preemptive. Interrupt cancels the current operation. Close intentionally abandons an eligible generation. Preserve exact identity, partial work and cleanup evidence before recovery. A lost assignment remains unresolved. Unknown teardown blocks replacement or takeover.

Retry by an established cause, such as a smaller scope after a context limit. Do not change model pins or blindly retry tools. After two bounded recovery attempts, report the blocker and replan the unit. A late result must be reconciled against the current branch and verdict before acceptance. Preserve unique findings as evidence for a fresh task, never blindly merge them.

Ask the operator only for missing authority, an irreversible action, an unsettled product choice, or a dead end after replan. Routine authorized mechanics stay with the owner. Independent review and dependent phases stay with the lead.

**Reply:** open with the goal. Report what landed or was handed off, each PR's live state, head, verdict and link, dropped work and reasons, unresolved assignments, operator gates, tracker path and trail path.
