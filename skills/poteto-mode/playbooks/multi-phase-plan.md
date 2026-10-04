### Multi-phase or multi-PR plan

**Adapter boundary.** Use bounded leaf assignments, not persistent actors or nested controller workflows. The lead dispatches independent review and subsequent phases. Competing checkouts require explicitly prepared external worktrees and separate lead sessions; direct delegates share the lead cwd. Do not pass model/tools/cwd/worktree/schema in agent requests. When only dependent agent work remains, end the turn and yield; integrate asynchronous results and forward exact result refs through files. These constraints govern the workflow below.

Use [Herdsman runtime](../references/herdsman-runtime.md) for supported launch, wake, isolation, and stop semantics. A written goal or cadence is not a running scheduler.

**You own the plan, not the code. The plan is a checklist an owner runs box by box and the operator audits from the evidence.** The plan is the deliverable. Do not implement.

1. When the change is one or two files with an obvious approach, skip the plan. Say so and stop.
2. Settle open questions by prototype before you write. Run `playbooks/prototype.md` for each. Keep the branch, the SHA, and the screenshots for Appendix A. Ask the operator only about a product or preference call that no run can settle. Give options (the **never-block-on-the-human** principle skill).
3. Explore in Herdsman `pstack-investigator` agents with read-only briefs per the Subagents section (the **guard-the-context-window** principle skill). Each returns file pointers, conventions, test commands, and entry points. No inlined dumps.
4. Copy the skeleton below into the plan file and fill every placeholder. Unless the operator names a path, write the file under the agent store's `docs/`. Keep every heading and every sub-block in the order shown. One section per PR. One PR is one change with its own evidence (the **sequence-verifiable-units** principle skill). Name the execution playbook in **How to read this**. Pick between `playbooks/autopilot-full.md` and `playbooks/autopilot-stack.md` per the rule at the end of `playbooks/autopilot-stack.md`. A standing program takes `playbooks/orchestrate.md`.
5. Write under `/skill:technical-writing` in full, then `/skill:unslop`. The body is one Diátaxis mode, how-to. Appendices hold explanation and reference. Each heading states the task or the finding. No long dashes. No mid-sentence colons.
6. Run `node skills/poteto-mode/scripts/check-plan.mjs <plan.md>` and fix every line it prints (the **encode-lessons-in-structure** principle skill).
7. Hand back. Post the plan path and the script's output, then stop. Execution starts on the operator's explicit go, under the execution playbook the plan names.

**Verification.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked (the **prove-it-works** principle skill). That sentence is the verification rule. Every verification block opens with it. The live block is mandatory. Ten lanes at the PR head, using an appropriately configured pstack-verifier definition, drive the real surface through the project's verification skill or harness, per the **swarm** skill. Each lane is one box with a concrete scenario, the screenshot it saves, and its pass predicate. One lane is the **Regression lane against trunk.** It runs the same load-bearing scenario on trunk and head. If trunk does not have the feature, the lane records that fact and gates the behavior the diff adds plus the end state the user waits for instead of inventing a trunk result. The perf gate is dual-sided. Trunk and head must both produce the named metric. If trunk lacks the feature, also isolate the work the diff adds and set an absolute budget for that work plus the end-to-end state the user waits for. Do not claim a ratio between unlike scenarios. The perf block names the metric, the interleaved probe, the trunk baseline measured first, and the rule with the number that fails. A PR that changes an interaction is review-gated. The operator reviews it in chat with screenshots and a video before merge. A PR that changes no interaction writes `**Review gate.** None. <PR id> is not review-gated.` and no boxes under it.

**Verification surface.** Pick the project's verification skill or harness by surface. Browser, Electron, web UI, CLI, TUI, and native mobile changes each name the concrete launch, drive, and evidence commands. A PR that touches two surfaces gets lanes on both. A surface without a verification path is a risk in Appendix C, and its live block still names how each lane drives it.

````markdown
# <Program> plan

<Under ten lines. What changes, for whom, the rule the program enforces, and the PR ids in order.>

## How to read this

One box is one unit of work. Every box names the evidence that checks it. A nested box is a sub-step of the box above it. Check a box only when its evidence exists, a file, a log line, a screenshot, a test run, or a SHA. The body is a how-to. The appendices explain and record.

The program runs `skills/poteto-mode/playbooks/<execution playbook>.md`. <Who merges, and which PR ids are the operator's items that stop at merge-ready.>

Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

## Program checklist

### Arm the program

- [ ] State the protocol and this plan to the operator, then stop. Start execution only on the operator's explicit go.
- [ ] On the operator's go, record the standing goal with the plan path, PR ids in order, verification rule, merge authority, and done condition in the decision trail.
- [ ] Read these from trunk at program start. Re-read them at every tick.
  - [ ] `git show origin/main:skills/poteto-mode/playbooks/<execution playbook>.md`
  - [ ] `git show origin/main:skills/swarm/SKILL.md`
  - [ ] `git show origin/main:<project verification skill or harness path>`
  - [ ] `git show origin/main:skills/poteto-mode/playbooks/opening-a-pr.md`
  - [ ] `git show origin/main:skills/<each other leaf skill the program uses>`
- [ ] Arm the hourly audit tick with a separately installed, explicitly authorized scheduler; otherwise record the timed audit as blocked. Never leave the cadence to memory.
- [ ] Use this tick prompt, verbatim. "Re-read the execution playbook from trunk and the plan. Audit the operation against both and fix authorized drift in this tick. Assess concrete evidence and required attention for direct-owned lanes only; do not status-poll active agents or treat inactivity as proof of a hang. If recovery is necessary, preserve exact assignment identity and partial-work evidence, and use only current available_tools for that live agent. Resolve pending controls and mailbox/result-persistence issues according to the recorded recovery instructions before closing or replacing an assignment. Confirm teardown of the old execution and release of its write ownership before any replacement; never create overlapping writers. If evidence, control resolution or teardown is uncertain, report the blocker and do not replace the lane. Then post a short status message in this chat only for tracked changes not reported before, such as a new PR or head, a verdict, merge, recovered lane, blocker, or operator decision. Do not repeat unchanged tables or blockers. If nothing changed, end the turn without a status message. Append this tick and its reported items (or none) to the decision trail."
- [ ] On the operator's hold or stand-down, send every owner a zero-writes order at once.

### Spawn owners

- [ ] Spawn one owner per PR with the full lifecycle the execution playbook names.
- [ ] Follow this dependency graph. Start dependent work only after its parent merges, or base it on the parent branch when the execution playbook stacks.
  - [ ] <PR id> and <PR id> are independent and first. Both branch from `main`.
  - [ ] <PR id> after <PR id>.
- [ ] Hold the file boundaries. <PR id or class> touches only `<glob>`.
- [ ] Hold the review gate. <PR ids> change an interaction. They wait for the operator's review in chat with screenshots and a video before merge.

### PR mechanics, for every PR

- [ ] Resolve the forge once. Default to `gh`; if `command -v origin` succeeds and Origin can resolve the repository, use `origin pr` for every PR operation. Record any fallback to `gh`. Never require `gt`.
- [ ] Open the PR ready, never draft, per **Opening a PR**, using an available PR tool only for operations its documented schema supports. Otherwise use `origin pr create --status open --base <base-branch>` or `gh pr create --base <base-branch>` according to the resolved forge. A stack child targets its parent branch. After each verifiable unit, push the authorized branch with hooks on. Use fresh consolidated assignments for independent items.
- [ ] Run the repo's lint and typecheck once before the PR-facing push. Push with hooks on.
- [ ] Run `/skill:deslop` before each commit using supplied instructions for a leaf. After the implementation handoff, the lead runs `/skill:no-comments` before review and owns any `/skill:interrogate` delegation, forwarding required skill/rubric evidence and exact result refs through files.
- [ ] Triage every Bugbot and security-reviewer comment per `../references/bugbot-triage.md`.
- [ ] Rebase onto current trunk before the code-ready report and babysit. Preserve that base during fix rounds. Rebase again only at merge prep, on a conflict with trunk, or when CI fails because trunk changed.

### Verdict and merge, for every PR

- [ ] At the code-ready head and each later push changing the patch, run the swarm per `skills/swarm/SKILL.md`. One gates lane. The ten live lanes from the PR's **Verify, live** block. The perf lane from its **Verify, perf** block. Two focused audit lanes read the diff and receipts rather than trusting the PR body. The root checks the receipts again at merge-ready.
- [ ] Clean only when every lane is `PASS`. The lead sends every proven finding to the owner in one fix-forward. A behavior defect filed as a note is a finding. Require a red test across every site with the same defect, or a reproduction receipt when no test can demonstrate it. Carry each defect into the next review brief. A new head gets a fresh swarm and a fresh verdict.
- [ ] <The merge or append rule from the execution playbook, with the patch-id rule from `playbooks/shipping.md`.>

### Boot recipe, for every live lane

Each live lane requiring isolation runs in an explicitly prepared external worktree with a separate lead session at the PR head. Delegation does not provision worktrees or select cwd. A worktree does not isolate processes, ports, databases, or credentials. Assign separate resources for each lane before launch. Drive through the project's verification skill or harness.

- [ ] `git fetch origin <head-branch> && git checkout <head SHA>`.
- [ ] <Start the backend and the surface. Wait for ready.>
- [ ] <Deliver input only through the project verification skill's commands. Name the read-only diagnostics.>
- [ ] Save every screenshot or other required artifact to `/tmp/swarm-<pr-id>/worker-<n>/<slug>` and return the paths with the report.

## <Task as a verb phrase> (<PR id>)

**Depends on.** <PR id, or None.>

**Files.**

- [ ] Edit `<path>`.
- [ ] Create `<path>`.
- [ ] Delete `<path>`.

**Build.**

- [ ] <One change. Name the symbol and the file.>

**You see.**

- [ ] <One observable result, with the exact log line or screen state.>

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] <Test file and the case it gains.> Run `<command>`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes at the PR head, using an appropriately configured pstack-verifier definition, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Run <the same load-bearing scenario> at trunk and head. If trunk lacks the feature, record that and gate <the behavior the diff adds plus the end state the user waits for>. Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 2. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 3. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 4. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 5. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 6. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 7. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 8. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 9. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 10. <Scenario.> Save `<slug>.png`. Pass when <predicate>.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. <What is measured at both trunk and head. If trunk lacks the feature, also name the diff-added work and the end-to-end state the user waits for.>
- [ ] Probe. <The command or procedure, run at trunk and at the head, interleaved. Both sides must produce the metric.>
- [ ] Baseline. Record the trunk <value> first.
- [ ] Rule. <Head against trunk, with the number that fails. If the scenarios differ, add absolute budgets for the diff-added work and the user-visible end state instead of an invalid ratio.>

**Review gate.** The operator reviews before merge.

- [ ] Copy lane <n> screenshots into `<media path>/<pr-id>-review-<slug>.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `<media path>/<pr-id>-review.mp4`.
- [ ] Post the screenshots and the video in chat. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Merge-preparation rebase completed after verification lanes start, current-head CI passed, and patch-id checked per `playbooks/shipping.md`.
- [ ] Immediately before merge, fetched trunk, confirmed a clean merge-tree and no trunk changes overlapping PR paths or CI-selection paths. Otherwise rebase, require CI, and repeat, re-verifying any changed patch.
- [ ] <The owner squash-merges its own PR, or the root appends it to the base-branch stack and the operator lands it bottom-up.>

## Close the program

- [ ] Every box above is checked with its evidence.
- [ ] Reply to the operator with the report the execution playbook names.

## Appendix A. Prototype evidence

<Each open question a prototype answered, with the branch, the SHA, and the artifact links. Each question that stays unproven.>

## Appendix B. Alternatives rejected

<Each approach weighed and why it lost.>

## Appendix C. Risks

<Each risk with the PR it lands in and what the owner watches.>

## Appendix D. Links and reading list

<Docs to read before editing. Which PRs get `skills/how/SKILL.md` and `skills/interrogate/SKILL.md`. The trail per `skills/show-me-your-work/SKILL.md`.>
````

**Reply:** the plan path, the PR ids with their dependencies and the review-gated set, what the prototypes proved and what stays unproven, and the check script's output.
