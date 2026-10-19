# Selective upstream alignment for 0.15.26

## Scope and pins

This source port gives Pi users explicit formal-verification skill generation and complete catch-up decisions. Maintainers retain the existing inventory, provenance, profile, and runtime contracts.

The reviewed Cursor repository is https://github.com/cursor/plugins.git. The baseline is 0.15.25 at `6ce45c59b9301a638c1fe1a7b8dc2a82b650898f`. The target is 0.15.26 at `0b8e952052d482ee6de06deebf14d590d77b1b34`. The independent package version stays 0.1.0.

The read-only inventory classified all 196 relevant changed paths, comprising 30 canonical pstack paths, 158 generated Claude distribution files, and eight root integration paths. Another 57 third-party changes are unrelated. Canonical target files and the full diff were inspected locally. The exact upstream generator passed its check against the exported distribution. That is generated-byte evidence, not Claude runtime compatibility.

## Selected adaptations

- Add one hidden, explicitly invoked `/skill:create-formal-verification-skill`. It writes one project-local `.pi/skills/verify-<area>/SKILL.md` with matching frontmatter and supporting formal artifacts.
- Select formal targets by user scope, harm, and test blind spots. Choose a tool for the question, map the model to real code and atomicity, pin its version, and give one rerun command and a concrete drift trigger.
- Keep findings as findings. Invocation does not grant installs, network access, product fixes, publication, global changes, or production/shared-state writes. Read-only roles return evidence or a draft.
- Require authorized disposable isolated scratch state for broken real-code variants. Preserve user edits and restore only the run's own scratch changes. Missing tools, authority, isolation, or execution leave a draft or inconclusive result.
- Expand Ketchup to every pending human decision. Each item carries identity, an available link, user effect, evidence, and explicit risk. Shared calls and recommendations appear once. Unknown needed facts remain unknown.
- Replace actor-specific premise census with direct falsification. Distinguish legitimate-state handling from guards that hide impossible-state producers. Derive retry convergence and stale recognition from observed state.
- Judge behavior tests by contract regression and internal-refactor survival. Keep external payload, absence-with-positive-control, error-type, invariant, and compile-time contracts.
- Slim lead judgment without an arbitrary finding cap. Retain contextual judgment, security/correctness scrutiny, and visible act/dismiss reasons.
- Replace the branded parser cast with a verifying UUID predicate and narrowed return. The compiler trusts predicate annotations and does not prove their bodies.
- Add name-to-directory equality and local README count/formal-route checks to the existing validator. Keep the existing inventory and hash checks.

## Deliberate differences

Do not import the generated Claude distribution, Claude/Cursor manifests, host adapter, marketplaces, guide tree, or generator. The excluded make-bot-ui skill stays absent. No separate docs checker, full README catalog, or anchor validator is introduced.

Retain substantive local migration and type-system principles despite upstream slimming. Retain Swarm's explicit worker count, report table, all required results, pinned models, asynchronous delivery, no polling, and single-writer controls. Retain full independent swarm verification after patch changes rather than upstream's weaker single-verifier cadence.

Retain authorization for instrumentation, proposal-only diagnostic signals, and persistent-state restart caution. Stale evidence grants no cleanup authority. Global profiles, catalog/history/synchronizer, model settings, host ranges, runtime controls, extension commands, and executable helpers remain unchanged except the host skill-count assertion.

The original source lineage remains intact. Superseded reviewed adaptations stay in adaptationHistory. The .25 review moves into lock reviewHistory, and selected reviewed resources carry the exact .26 target hashes. Unchanged retained resources are described as reviewed retentions, not newly copied bodies.

## Acceptance walkthroughs

These are source-level instruction walkthroughs, not model trials.

For a named retry race, target selection starts in that area. An ordering question selects a faithful state model. An overflow question can select a code verifier. An unbounded promise can require a proof. Every modeled step names code and must respect its real atomicity. Bounds and assumptions accompany any pass.

Each property must fail on an intentional broken variant, and the generated skill must catch an isolated scratch change in real code. A toy model mutation alone does not satisfy that step. A current defect stays a counterexample, not a weakened property or unsolicited fix. Restoration returns to the original passing state or the original reported failures. A cold agent gets exact source paths, a pinned tool, rerun command, drift trigger, and modeling-error versus defect guidance. No formal solver execution occurs during this source port.

Thirty pending PRs require thirty independently decidable entries. Two items remain concise. History stays under 100 words, while approximate per-item guidance never limits completeness. Shared recommendations appear once, with per-item exceptions only when different. Risks remain explicit even when low. Options carry gain, cost, and current state without a duplicate risk line. Delay consequences appear only for material costs beyond delay. Missing links are omitted and needed unknown facts are literal unknowns. Older unresolved human calls remain, while actionable agent work stays with the agent. Empty state stops. Visuals use existing facts and artifacts without writing files, polling, inventing screens, or drawing action-item diagrams.

## Verification

Post-integration `npm run check` and all 37 existing root tests pass, including npm tarball and extracted-package checks. The inventory contains 55 hidden skills, 23 playbooks, 136 resources, and 168 shipped files. The installed Pi 1.3.0/Herdsman 0.29.0 checker loads all 55 hidden skills without diagnostics and passes extension and documentation contracts.

Nine disposable validator probes pass. They cover correct/new names, wrong lowercase names after hash refresh, missing formal routes in README/help, wrong formal source link, count drift after hash refresh, hash tampering, and shipped/physical membership omissions. Sixteen .26 source hashes match immutable Git objects. All inherited resource lineage and adaptation history are preserved. Profile/runtime/helper/model/host-range preservation checks pass. `git diff --check` passes. See [VALIDATION](../VALIDATION.md) for exact limits and historical evidence. Independent review remains with the lead. Structural and loader checks cannot establish prompt efficacy, solver correctness, live agent discovery, model availability, or Herdr connectivity.

Baseline helper evidence from `abf2065` is reused because helper behavior is unchanged. No unit tests, solver installs, live inference, global profile changes, publication, commits, or PRs are part of this port. Local inventory and implementation evidence lives under `.pi-herdsman/port-0.15.26/`.
