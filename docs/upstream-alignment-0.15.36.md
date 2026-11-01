# Selective upstream 0.15.36 alignment

## Source and scope

The baseline is `519d36aa98955bf680db01bcde5fdfba686dc901` (0.15.34). The intermediate is `ab1f702ce8e8b6557edb56b09f52cde8bfb83f17` (0.15.35). The immutable target is `c742dd61706fbacc1b95f1a20b7b988cf096ce6c` (0.15.36). Git ancestry confirms that sequence. The target was fetched over GitHub HTTPS and its canonical pstack tree exported. This verifies object identity, not signed attestation. The inventory and source export are under ignored `.pi-herdsman/port-0.15.36/`.

The complete repository delta has 66 paths, comprising 46 modifications, 14 deletions and 6 additions. There are 29 canonical pstack paths, 29 generated Claude paths, six unrelated Rippling paths and two root marketplace/README paths. Canonical instructions and guide changes were reviewed for portable intent. Generated distributions, Cursor plugin manifests, model-selection rules, marketplace metadata and unrelated integrations are not imported. Guide semantics are folded into local workflow documentation rather than adding the guide tree.

This is selective alignment, not full parity. No dependencies or global tools are installed. No new unit tests are authored. Existing tests are maintained only for changed contracts and inventory. Publication and independent final review remain owner-owned.

## Selected workflows and Pi adaptations

- Poteto mode states the user's goal, problem and smallest expected change before work, repeats the goal in briefs, PR Why sections and final reports, and stops when evidence disproves the request. Steering remains asynchronous. Herdsman continuation creates a new generation, not a foreground resume of a live worker.
- Autopilot-full permits rebasing after a known concurrent same-file change lands. Finished authorized units are externalized before starting the next. Full swarm verification remains required at code-ready and after major behavior or design changes. Minor fixes, conflicts and rebases get one independent verifier. Wording-only edits need no new verifier but retain current-head CI and mergeability requirements. Only demonstrated user-visible bugs, failed gates and wrong shipped docs block. Defects already on trunk or a parent PR remain separately recorded unless copied or newly reached by the PR. Other concerns become follow-ups.
- Autopilot-stack is Autopilot-full without merging, not a requirement to assemble every queue into one linear chain. Only real dependencies stack. Branch owners rebase onto the parent, with one writer and serialized chain operations, exact leases and explicit tip handoffs. Stable patch-id retention never bypasses fresh current-head checks. Operator landing and post-handoff write gates remain.
- Orchestrate now uses a coordinator-owned tracker and decision trail in the configured artifact store. It has no bundled state CLI, initialization or polling loop. Callers migrate before the orch implementation and its obsolete implementation tests are removed. Old stores remain readable historical evidence without automatic migration or deletion. The coordinator assigns work and checks artifacts, not code. One logical PR owner spans bounded implementation, review and landing phases. Direct delegates share cwd. External worktrees and separate leads are needed for competing checkouts. The eleven shipped definitions stay leaves. Missing subscriptions or scheduling are disclosed, not replaced with invented Cursor capabilities.
- Interrogate uses execution-backed findings instead of rubric-based opinions. Its scope includes the branch's working-tree changes. The lead reruns reported commands, keeps every demonstrated intent violation and merges shared root causes. No fixes are applied automatically. Read-only requests do not gain execution or scratch-write authority. Existing execution-capable verifiers perform authorized probes without widening read-only reviewer profiles. Missing capabilities or unrun lanes are blocked coverage, not a clean verdict. Obsolete rubric references and their callers are retired together.
- Arena selects an authorized discovered judge from a different model family. No available different-family judge means disclosed skipped coverage and lead-only selection. Model pins remain definition-owned. Cursor slug fallback logic and dynamic model adjustment are excluded.
- Ketchup-video adds readable burned-in subtitles below slides. Added-word counts include subtitles and changed labels. Holds count only fully visible time, measured from matching rendered frames rather than fade-sensitive still-frame detection. Output and external-effect approvals, final-file inspection, text decisions, explicit invocation and external-player fallback remain.
- Explain the Number requires a decision threshold and noise floor before measuring. Runs whose spread exceeds the effect do not support the decision.

## Issue fixes

Issues #7, #8 and #9 are integrated with the upstream migration. A read-only scout fetched all three full issue bodies through `gh issue view`. Before/after scenarios and exact results are retained with the implementation evidence. Runtime/status paths must not install dependencies. Session-history uncertainty must hold worktree cleanup. The audit accepts an explicit absolute custom session directory or `PI_CODING_AGENT_SESSION_DIR`, validates cwd headers and never treats missing or old files as complete inactivity evidence. Because it cannot certify full coverage, it no longer emits inactivity-based `safe` suggestions. Tools named in instructions must exist in the effective session, and obsolete Interrogate rubric files must not survive as callable guidance.

## Preserved boundaries and exclusions

All eleven definition templates, models, thinking pins, profile catalog and synchronizer, hidden explicit invocation and compatibility ranges remain unchanged. The port does not add Cursor Task, cloud VM, fork, per-request model or managed-worktree APIs. Existing tool ceilings still apply. Shell tools are not read-only sandboxes. Evidence attachments do not confer capabilities.

No automatic video routing, renderer, new formal dependencies, live forge mutation or publication is included. Existing Statechart behavior is outside this delta. The installed Pi/Herdsman versions can be outside declared compatibility ranges. Source checks do not certify supported-host execution, live delegation, prompt efficacy, actual video rendering or real TLC. See [validation boundaries](../VALIDATION.md) for current commands, results and limitations.

## Instruction acceptance cases

These are source walkthroughs, not model trials.

| Case | Required decision |
| --- | --- |
| Start an implementation task | State the goal and smallest expected change without asking for confirmation. |
| Steer a live worker while other results arrive | Queue eligible steering and keep results asynchronous. Do not foreground-wait or create a competing executor. |
| Independent no-merge queue | Deliver verified independent PRs without building an artificial stack. |
| Dependent no-merge queue | Base each child on its parent, serialize restacking and recheck current heads. Never merge or arm auto-merge. |
| Same-file concurrent trunk change lands | Rebase through the owning lane and apply current-head verification policy. |
| Orchestrate on a fresh project | Use authorized tracker files and leaf assignments. Do not invoke retired scripts or infer a running scheduler. |
| Review with no execution authority | Report blocked execution coverage. Do not broaden a reviewer profile or claim no verified defects as a pass. |
| Executed repro fails without breaking intent | Drop the finding with its reason. |
| No different-family Arena judge | Skip the judge and disclose missing coverage. Keep configured models unchanged. |
| Video fade duration exceeds readable hold | Exclude transitions, count subtitle words and rerender if the fully visible hold is too short. |
| Measurement has no decision threshold | Write the decision and noise floor before running. |
| Setup-help question, held-out nearby request | Explain capabilities only. Do not select hidden workflows or install tools. |

Descriptions remain hidden and explicit-only. Interrogate's description changes its acceptance bar from opinion to run-backed findings. Ketchup-video names subtitles. Other edits preserve local description scope rather than importing Cursor trigger or model-selection policy.
