# Workflow Markdown semantic fidelity audit

> Durable audit record for local `45607d3d895f63d6deccc3933f742d258d6b384e` and upstream `c742dd61706fbacc1b95f1a20b7b988cf096ce6c`. Lane-local F IDs map to the stable IDs in the [overview](../README.md).
>
> Scratch exports, full diffs, quotation dumps, scripts, logs, approval trails, and checkpoint paths named below are historical local evidence, not retained dependencies. Treat them as unavailable after scratch cleanup. Preserved ledgers and report quotations remain in this directory. Historical commands below are audit records, not installed commands. This copy does not claim those raw artifacts are shipped.


## Outcome

Completed artifact audit of the entire owned project slice at frozen local `45607d3d895f63d6deccc3933f742d258d6b384e`, versus the supplied `.pi-herdsman/port-0.15.36/pstack` snapshot for upstream `0.15.36`, requested pin `c742dd61706fbacc1b95f1a20b7b988cf096ce6c`.

31 paths covered: **2 byte-identical, 26 changed pairs, 3 local-only, 0 upstream-only**. Every local file equals its frozen HEAD blob. Five changed paths contain unexplained wording/trigger drift, plus recipes with an omission; the rest are justified host/policy adaptation or retained semantics, with residual issues explicitly noted. This is not a claim of full parity or behavioral/model verification. The known malformed no-merge recipe is now exactly upstream; that does not make the rest of recipes identical.

The most consequential open questions are the help actual-work trigger and Build-the-Lever trigger weakening. Neither is needed merely to replace Cursor tools. No implementation fixes were made.

## Evidence and repeatability

- `coverage.tsv`: one classification and substantive review for **every** owned path, including unchanged and local-only files. Mixed files retain both adaptation reasons and divergence IDs.
- `inventory.json`: SHA-256 of both artifacts, presence status and frozen-HEAD check.
- `pairs.diff`: actual complete pair differences, not merely latest commit diff.
- `full-pairs.txt`: full numbered upstream/local texts, including unchanged context. Upstream line citations below refer to the supplied snapshot, local citations to the frozen checkout.
- `history.txt`: actual `git log -p -S` histories for suspicious text and deleted examples, including first-visible local introductions and the recipe repair.
- `compare.py`: deterministic read-only artifact check; run from repository root with `python3 .pi-herdsman/fidelity-audit/workflows/compare.py`. It writes only this audit directory.
- `write_report.py`: regenerates coverage judgments/history evidence, not a semantic verifier.

I read all differing hunks, unchanged interiors and the two identical files, rather than accepting previous alignment verdicts. I inspected local history for suspicious additions, omissions and the repaired recipe. Policy records below are corroborating evidence only, not proof that every rewrite is correct.

Original lane snapshot provenance limitation, superseded only for byte authentication by the 28-file integration check in [hashes.tsv](hashes.tsv): `upstream.lock.json:12-15` names `.36` and the requested commit; supplied `plugin.json:4` says `0.15.36`. The upstream Git object is absent from the local repository (`GIT_NO_LAZY_FETCH=1 git cat-file -t <pin>` failed). I did not independently authenticate every supplied snapshot byte against the remote commit. Hashes preserve exactly what was audited. No network retrieval was needed for this assigned artifact comparison. The lead should reuse independent pin authentication if available rather than treating this as such authentication.

## Justification ledger

These labels classify only the relevant differences, not every sentence sharing their path.

- **J1 — Pi syntax/dependency surface.** `/skill:<name>` rather than Cursor slash skills; quoted YAML; remove Cursor icon/color; local file links and package-root paths; bundled deslop rather than unavailable cursor-team-kit; project-specific actual driver instead of claiming control-ui/control-cli exists. Observable real-surface proof remains required. Pi extension command/session persistence is documented by local `README.md` and mode entry text, not assumed Cursor Custom Mode behavior.
- **J2 — Herdsman runtime.** The actual assignment runtime exposes direct-owner bounded leaves, explicit files evidence, async results and fixed definitions; it does not grant a leaf controller tools. `references/herdsman-runtime.md` centralizes the declared API, exact result refs, discovery/model fields, isolation and continuation limits. Those boundaries justify lead-owned review, no nested owner controllers, no request model/cwd/worktree, no fictitious cloud VM, external worktrees plus separate leads, and real watcher tasks rather than `/loop`. This audit does not certify every backend-version statement in that reference.
- **J3 — User authority/safety.** Supplied `/home/alex/.pi/agent/AGENTS.md` says audit/review does not authorize changes, implementation stays in scope, unrelated work is preserved, no new unit tests, and approval-sensitive preferences go to Alex. The task itself forbids writes outside scratch, installs and GitHub writes. Explicit write/publication/merge grants and refusal to reset shared work correctly qualify upstream broad autonomy. Exact ownership/lease and teardown evidence prevent overlapping writers. This does not justify rejecting work that the user actually authorized (F1).
- **J4 — Unattended trust.** The four manual-success/tools/stage-proof/transcript-learning checks are a **local policy addition**, not present in upstream Autonomous run. `.pi-herdsman/decisions.tsv:2-8` records broader approved scope and the shared gate remediation. Commit `e78d2e1` introduces the portable `.17` adaptation. I verified the gate is connected in mode, autonomous, autopilot, orchestrate and help; no primary approval transcript was re-read here, so the historical authorization is a recorded local decision, not independently re-proven user consent. No gate grants scheduling or publication.
- **J5 — Durable state policy.** `config/artifact-locations.md` explicitly resolves user path first, adequate existing artifacts second, otherwise `.pi-herdsman` defaults; it grants no writes and does not relocate runtime result/session stores. This supports checkpoint/tracker path adaptations and avoiding assumed Cursor Project store. History `ba21018` centralizes workflow artifact locations.
- **J6 — Privacy, setup effects and actual evidence.** Exact supplied/runtime-resolved history, header/cwd/identity before messages, storage overrides and unknown-history holds are necessary replacements for Cursor transcript assumptions. Requiring preinstalled watcher dependencies and actual process-exit receipts avoids treating install/network effects as a read-only status check. `.pi-herdsman/decisions/port-0.15.36.tsv:5` records the install/unknown-history issue and `bc3a47f` introduces current issue wording. Executable behavior is outside this slice and not certified here.
- **J7 — Pins and verification integrity.** Keep fixed effective model definitions instead of dynamic Cursor slug/budget fallback. Missing different-family judge/diversity is disclosed coverage, never manufactured. Per task policy, overlap is a limitation, not parity. Independent author/verifier separation, unit/live/perf plan rule, current-head CI/mergeability, contiguous ceiling, patch-id/build-result reuse, actual merged/trunk-base readback and no-merge stack authority remain explicit. Stronger two-audit/regression/receipt and lease details are compatible safety elaboration; unnecessary numerical restriction is separately F9.
- **J8 — Missing builtin and added supported routes.** Local authoring reference replaces unavailable Cursor create-skill with explicit metadata, cases, validation and authorization. Expanded formal/statechart/video help describes local routes and their install/rendering/trust gates, not evidence of actual tools/model success. Detailed correctness of these other skills is excluded; those delegations/references do not expand this audit's ownership. Other task owners must validate cross-slice contracts.

## Actionable divergences and residual issues

“Unexplained” means no specific necessity or user-policy evidence was established, **not** proof of malicious alteration. Prior reports/commit messages naming general alignment are not specific justification. Prefer an explicit ledger decision or faithful wording; this audit authorizes neither implementation nor new policy.

### F1 — Actual-work requests are no longer executed (medium)

- Upstream `skills/poteto-help/SKILL.md:11`: “A message that asks for work, such as "use pstack to fix this bug", is not a help question.”
- Local `skills/poteto-help/SKILL.md:9`: “If the message requests actual work instead of help, identify \[poteto-mode](../poteto-mode/SKILL.md) as the route and let the user invoke it.”

Upstream immediately follows with “Read \[`poteto-mode`](../poteto-mode/SKILL.md), do the work under it”. Local follows with “This help turn remains question-only.” This changes an explicit work-request trigger into another user-invocation gate. A question must not silently launch work, but that policy does not require refusing an actual authorized work request. First appears locally in `e78d2e1` (.17 help introduction); no narrower approval for this changed trigger found. Decide whether help intentionally never executes, even for explicit work requests; otherwise retain upstream distinction.

### F2 — Build-the-Lever is conditional on cost, not just triviality/authority (medium)

- Upstream `skills/poteto-mode/SKILL.md:54`: “Any non-trivial work. Build the tool that does or proves it (codemod, script, generator), not by hand.”
- Local `skills/poteto-mode/SKILL.md:63`: “Build the smallest tool that does or proves it when a rerunnable tool earns its cost.”

The authorized-write qualification and read-only handback are justified J3. The extra subjective “earns its cost” condition is not required by that qualification and weakens the nontrivial-work trigger. It also disagrees with the local principle leaf, which says “The bar is triviality, not repetition” and “Skip it only when the task is trivial”. Introduction `a405767` (reviewed upstream .5) replaces the unconditional summary; exact local history saved. Preserve the authority qualification but settle whether this extra escape is intended user policy.

### F3 — Stale Orchestrate ownership distinction survives the .36 migration (low, misleading authority explanation)

- Upstream: no corresponding sentence/section in this path (see complete pair).
- Local `skills/poteto-mode/playbooks/autopilot-full.md:9`: “Orchestrate runs a standing program whose coordinator lands verified work itself and whose workers never merge.”

Absent from the pinned upstream Autopilot-full. Present from first local commit `087fcd7` (original port; exact pre-repository ancestry unknown), still present after `bc3a47f` rewrites Orchestrate. Current local Orchestrate says “Only the owner pushes, rebases or retargets after the lead authorizes that phase” and “You run the program, never the code.” It does not establish coordinator-only merging or a workers-never-merge rule. The extra comparison is unsupported by the current target playbook and can misroute a merge phase. Align explanatory ownership wording with the current playbooks, without adding authority.

### F4 — Prompting acquires unrelated CLI-design prescriptions (low, unexplained addition)

- Upstream: no corresponding sentence/section in this path (see complete pair).
- Local `skills/poteto-help/references/prompting.md:50`: “Design control CLIs with discoverable help, `--dry-run`, machine-readable output, and errors that say what to fix.”

Upstream moves directly from stepping-away tips to “## Steer in one line”; no “Make verification reusable” section exists. Real artifact evidence and permission caveats are justified; prescribing dry-run/output design, seeded development state and reset steps is an extra product/tooling requirement, not necessary to port prompt wording. Introduced `e78d2e1` (.17); its general prose/portable-workflow approval record does not establish why this detailed addition belongs here. Document the intended policy or keep it in a separately justified verification-authoring procedure.

### F5 — PR-body compression loses specific constraints (low)

- Upstream `skills/poteto-mode/playbooks/opening-a-pr.md:17`: “`## Scope`: always. 1–3 short items on what it covers and what it deliberately leaves out (a follow-up, a known gap). No symbols, paths, or file-by-file essay.”
- Local `skills/poteto-mode/playbooks/opening-a-pr.md:19`: “`## Scope` gives one to three items on what is covered and deliberately excluded. No file-by-file essay.”

The exact no-symbols/no-paths constraint is omitted; local verification similarly drops the explicit “No sample-size methodology, swarm recitals” restriction, though its general detailed-evidence-link rule partly preserves intent. This is prose-guidance fidelity drift, not a demonstrated behavioral failure. The omitted Scope and verification restrictions were present in the initial local port; `e78d2e1` (.17) removes them in its compression of this section. No Pi tool difference requires these omissions. Decide whether to retain the original constraints or record an intentional local writing policy.

### F6 — Extra mandatory TypeScript trigger (low, undocumented policy difference)

- Upstream: no corresponding sentence/section in this path (see complete pair).
- Local `skills/poteto-mode/SKILL.md:30`: “Writing or modifying TypeScript code, or explicitly reviewing TypeScript type-system correctness → **typescript-best-practices**.”

Pinned upstream has no corresponding remaining trigger (it still has general Type System Discipline). Local narrows ordinary navigation out, but mandatorily loads another skill for writing and explicit type review. First visible in initial `087fcd7`; original intermediary ancestry and specific user approval unknown. The dependency exists locally, so this is not a broken link. A legitimate local preference is possible; record it explicitly rather than calling it a necessary Pi API adaptation.

### F7 — Help examples and discoverability omitted (low)

- Upstream `skills/poteto-help/references/recipes.md:20`: “- Bug with a cheap test: `/poteto-mode repro <bug> first. if there's a cheap test path, /tdd it. then fix and rerun.`”
- Local: corresponding example absent (see complete pair).

The cheap-test example is omitted on help introduction `e78d2e1` (.17). The upstream `/ketchup` catch-up recipe is also omitted. Help SKILL table drops explicit tdd, typescript-best-practices, no-comments and bro entries while retaining generic frontmatter fallback; all four directories still exist. This is reduced discoverability, not removal of capabilities or proof that routing fails. The no-new-unit-tests user instruction can prohibit writing tests in an assignment, but does not by itself explain removing all mention of an existing tdd route while Bug fix step 5 still requires that conditional route. The table also omits make-bot-ui, whose local availability is outside this slice. Establish an intentional help-selection policy or restore useful route examples; do not invent missing capabilities.

### F8 — VM wording remains inside the adapted plan template (low, residual host assumption)

- Upstream `skills/poteto-mode/playbooks/multi-phase-plan.md:123`: “Record a 30 to 60 second video of the change on a lane VM.”
- Local `skills/poteto-mode/playbooks/multi-phase-plan.md:129`: “Record a 30 to 60 second video of the change on a lane VM.”

This line is unchanged from upstream, not accidental altered wording. However the same local file replaces cloud VMs with external worktrees/separate leads in its boot recipe, and Herdsman runtime forbids inventing automatic VM isolation. This leftover host-specific phrase can be mistaken for an available facility. First visible local `087fcd7`; still present at frozen HEAD. Keep the video gate but state the actual prepared runtime when adapting it. No runtime lane was executed here.

### F9 — “Two or more” audit lanes becomes “Two” (low, unnecessary restriction)

- Upstream `skills/poteto-mode/playbooks/multi-phase-plan.md:65`: “Two or more audit lanes, each with its own focus, that read the diff and the receipts and distrust the PR body.”
- Local `skills/poteto-mode/playbooks/multi-phase-plan.md:70`: “Two focused audit lanes read the diff and receipts rather than trusting the PR body.”

The two-lane minimum is retained, but explicit ability to use more is lost in the template text. Autopilot-full still says “at least two”. The “Two focused audit lanes” sentence was introduced in `a405767` (reviewed upstream .5); `bc3a47f` (.36) rewrites its surrounding cadence while retaining this phrase. Probably harmless compression rather than a deliberate maximum, but that interpretation is not guaranteed by the sentence. Preserve “at least” or record a deliberate cap; no runtime conclusion.

### F10 — Pause clean-state addition has an unresolved stop ambiguity (low, not confirmed defect)

- Upstream `skills/poteto-mode/playbooks/pause-safely.md:5`: “Finish the current atomic step or back out of it. Start nothing new, and cancel any nested subagents.”
- Local `skills/poteto-mode/playbooks/pause-safely.md:5`: “Never stop mid-edit in a known-broken state.”

Extra sentence first visible in `087fcd7`; upstream only requires a safe atomic boundary and explicitly permits a broken-tree WIP commit (still local step 3). Direct-agent ownership/control adaptation is justified, but absolute “Never stop” could conflict with an immediate operator stop or unavoidable broken inherited state. This is an ambiguity, not proof the model would ignore a stop. Clarify precedence if editing; do not weaken zero-writes hold authority.

## Repaired no-merge recipe and introduction trail

At upstream `skills/poteto-help/references/recipes.md:49` and local `:47`, the complete line is now the same:

> - `/poteto-mode autopilot these changes, but don't merge. i'll land them.`

Integration correction. `e78d2e1` introduced the earlier “stack them, don't ship” recipe, not the duplicated “but autopilot, don't merge” wording. The latter first appears in `bc3a47f`, then `45607d3` repairs it. The original scratch report misidentified that introduction. See [verified recipe history](../recipe-history.md) for exact lines and boundaries. No earlier duplicated wording or reintroduction was established.

## Material exclusions and unknowns

- Eight installed third-party `scripts/node_modules/**/{README,Readme}.md` files physically live under poteto-mode. They are not authored/tracked workflow documents; exact paths are in `exclusions.json`. They were inventoried but their dependency documentation was **not semantically audited** against pstack. This exclusion is explicit; “all Markdown” coverage here means all 31 project-authored/tracked/upstream slice paths, not these incidental installed packages.
- Executable files, package/generated distributions, metadata beyond pin evidence, all other skill bodies, global profiles/configuration, actual Pi/Herdsman implementation and backend APIs are outside the assigned semantic slice. No claim is made that helper flags, setup synchronization, watchers, profile compatibility, browser/video/formal checks or automatic triggers work at runtime. Those assertions need independent executable/host validation.
- No eval/model trials, runtime/browser flows, unit tests, dependency installs, network retrieval, GitHub actions or implementation changes. This task's observable result is actual Markdown pair fidelity, not model behavior. Case descriptions are interpretation, not behavioral evidence.
- Broad local-policy records establish provenance, not a specific rationale for every extra word. Missing primary approval or intermediary ancestry is **unknown**. First local commit means first visible repository evidence, not necessarily the original author's introduction upstream/intermediary. No local package release number is invented; upstream reviewed-version labels are given only when known (.5/.17/.36).
- Generic equivalent rewrites are not individually flagged merely because bytes differ. Full differences remain inspectable; path rows explain their affected semantic surface. Residual VM wording and pause ambiguity are called out separately even though not a demonstrated unexplained changed workflow.

## Checks and remaining work

Actual checks performed: complete union inventory; SHA-256 pair comparison; 31 local-to-frozen-HEAD equality checks; all differing hunks and unchanged interiors read; exact repaired recipe equality; suspicious first-visible commit searches and patch reads. The re-runnable script proves comparison inputs and inventories, **not semantic judgments**.

Lead next steps: authenticate the upstream pin from reusable independent source evidence if already available; integrate `coverage.tsv` and findings into the durable versioned difference ledger; decide F1/F2 and explicitly accept or reject lower-impact unexplained writing/routing choices; cross-check J8 references with the other slice owners. No fix or new policy is authorized by this report.
