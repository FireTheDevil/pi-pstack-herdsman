# Cursor pstack 0.15.25 alignment

## Scope and integration history

Status: implementation, metadata, independent review and portable verification complete. Supported-host runtime certification remains unavailable; limits are recorded below.

Alex authorized local integration in the original checkout, not publication or a global installation. The verified `review/cursor-pstack-0.15.17` branch was fast-forwarded into local `master` at `896c2d8`. Branch `0.15.25` starts there. Commit `4848ffe` carries the unique changes from the older `update/cursor-pstack-0.15.21` commit `c6c572656c4120878de92e01b16358dae805df1e` without replacing newer profile synchronization, catalog history, refresh guards, status/help behavior or host fixes. The old worktree remains available.

The upstream audit checked all 31 changed paths from 0.15.17 to 0.15.21 and all 45 paths from 0.15.21 to 0.15.25. The latter interval adds two skills and modifies 43 files; it deletes no files. No missing approved 0.15.21 behavior was found. Earlier deliberate prose retentions and platform exclusions remain in effect.

Exact source pins:

- [0.15.17](https://github.com/cursor/plugins/commit/978ca6e9c0e012047cd5058b8e829240336e704e): `978ca6e9c0e012047cd5058b8e829240336e704e`.
- [0.15.21](https://github.com/cursor/plugins/commit/1dcc2bacde73ddd284803b7af28164d0436198fc): `1dcc2bacde73ddd284803b7af28164d0436198fc`.
- [0.15.25](https://github.com/cursor/plugins/commit/6ce45c59b9301a638c1fe1a7b8dc2a82b650898f): `6ce45c59b9301a638c1fe1a7b8dc2a82b650898f`.

Both upstream plugin manifests at the last pin declare 0.15.25. The audit fetched upstream main but deliberately pinned the release commit rather than a later main snapshot. Upstream plugin versions do not replace this package's independent version.

## Selected portable changes

| Area | Adaptation |
| --- | --- |
| New explicit skills | `in-your-own-words` restates goals and the problem without executing. `sharpen` improves an authorized approach using available evidence; it cannot relax user requirements, permissions or acceptance criteria. Both remain hidden from model discovery and explicitly callable. |
| Catch-up | Final 0.15.25 Ketchup favors concise plain-language outcomes and existing visual evidence. It distinguishes human decisions, proposals, unknowns and pending agent work. The word target cannot hide a material blocker. No new investigation, fabricated screens or external artifact writes are authorized by catch-up. |
| Help and debugging | Help and recipes name both new skills. Root-cause guidance proposes cheap persistent diagnostic signals after difficult investigations, without granting permission to add telemetry or instrumentation. |
| Owner and stack workflows | Carry portable durability, lease, topology ownership, post-merge child retarget, gate-approval and bounded merge-preparation guidance into existing Pi playbooks. Preserve operator authority, asynchronous bounded assignments, unattended preflight and independent proof. |
| Frontier helper | Replace Graphite stack discovery with GitHub PR base chains and an explicit forge selector. Keep local store isolation, locking, generation and order pins. Reject unknown, incomplete, cross-repository or ambiguous evidence, missing refs, cycles and forks. Origin discovery refuses unverified evidence rather than guessing. |
| Review and worktree helpers | Treat Code Review Gate `ACTION_REQUIRED` as a human gate, not ordinary failure; ordinary action-required checks still fail. Worktree audit falls back from unverified Origin evidence to validated GitHub evidence, or holds candidates. Protect both open and draft PRs. Retain pagination hardening, nonterminal frontier-ready behavior, configurable audit bases and Pi-scoped transcript lookup. |

The 0.15.21 carry-over also preserves robust Markdown fence parsing, empty-data verification readiness, Pi explorer tools and evidence-backed catch-up boundaries. See the [earlier alignment report](upstream-alignment-0.15.17.md#selective-01521-carry-over-onto-01525).

## Deliberate differences from upstream

- **Model and host policy:** do not adopt dynamic effort/speed selection, provider-slug fallback, model defaults, Cursor plugin search, Cursor installation, cloud placement or loop scheduling. The eleven definition templates, profile history/synchronizer, local model choices and declared Pi/Herdsman ranges remain unchanged. Effort-only changes in ordinary skills/playbooks and provider-selection changes in Arena/Interrogate require no destination edits.
- **Verification strength:** retain a full independent swarm at code-ready and after patch-changing pushes. Do not adopt upstream's general single-verifier downgrade for minor fixes or conflict resolution. A SHA-only rebase retains a code verdict only through the existing stable patch-id rule, with fresh current-head CI and mergeability checks. This is an intentional behavioral divergence, not equivalent cadence.
- **Authority and recovery:** no automatic grants to publish, merge, delete, weaken checks, poll agents or replace unresolved writers. Preserve existing trust preflight, operator holds, exact identity/control evidence and one executor per unresolved unit. Stack topology has one writer; shipping is not permission to bypass forge gates.
- **Evidence and safety:** preserve explicit regression lanes, proof receipts, no-test reproductions, dirty/pinned-work checks, current-bottom/merge-result checks and honest missing evidence. Keep the local principle and Why source guidance retained during earlier ports. `make-bot-ui` remains excluded.
- **Tests:** do not import new upstream unit tests. Existing inventory constants and obsolete helper fixtures/assertions may be maintained without adding test cases or removing coverage. Disposable CLI execution and existing suites provide verification instead.

Original resource lineage, prior review records and prior adaptation history remain intact. New resources record their exact upstream origin. Adapted resources record the reviewed source commit/path/hash separately from their inherited lineage; excluded resources keep their earlier provenance. The manifest also records the eight earlier .21 carry-over adaptations explicitly before recording superseding .25 changes. Package inventory adds two skills and this report: structural and package checks verify 54 skills, 23 playbooks, 135 resources and 166 shipped files.

### Forge compatibility boundary

The installed GitHub CLI documents the required `--limit` and `isCrossRepository` fields. Frontier discovery requests up to 1,000 matching rows and refuses a cap-sized response instead of assuming completeness. It rejects foreign or ambiguous branch identities and requires exact local branch refs. Audit applies equivalent conservative evidence checks and treats a failed dirty-state read as unknown. A closed PR alone is not proof of a merged branch. Missing `jq` or valid forge evidence holds audit candidates; a `safe` bucket is still advice, not deletion permission.

Both helpers bind every GitHub PR lookup to one validated local `origin` URL with explicit `--repo HOST/OWNER/REPO`; inherited `GH_REPO` and `GH_HOST` cannot redirect reads. Accepted forms are standard HTTPS, `ssh://git@HOST/OWNER/REPO`, and `git@HOST:OWNER/REPO`, with optional `.git`. Missing or multiple origins, local paths, credentials, explicit ports and unsupported URL forms refuse frontier discovery or hold audit candidates. Custom SSH aliases are not expanded. This is intentionally narrower than all Git transport configurations; no repository configuration is rewritten to make it pass.

Origin is not installed. The upstream four-field response does not establish repository identity or list completeness, and a bounded public documentation/source search did not verify a usable contract. This does not prove Origin lacks one. The adapter accepts `--forge origin` but refuses when discovery needs PR evidence, recommending `--forge gh` only for a repository that GitHub can resolve correctly. A current-trunk empty frontier needs no forge data. Audit attempts the known Origin read but does not treat its response as cleanup proof; it falls back to GitHub or holds unknown. No undocumented fields or options were invented. Other playbooks require validating installed Origin operation syntax before use; no live Origin compatibility is claimed.

## Verification

Before the 0.15.25 edits, both the merged 0.15.17 baseline and the selective 0.15.21 integration passed `npm run check` and all 37 root tests. The 0.15.21 integration also passed 33 watcher core tests, ten reused fake-GitHub scenarios, 15 plan CLI probes and 13 audit CLI probes. Full watcher CLI/typecheck at that stage was blocked by missing declared dependencies. The installed-host checker rejected Herdsman 0.26.0 outside the unchanged supported range.

After integration, `npm run check` and all 37 root tests pass, including exact tarball membership and extracted-package checks. Existing test maintenance changes only the inventory count, obsolete Graphite fixtures/assertions and one watcher fixture's required `pageInfo`; no test cases were added. The latter corrects two executable watcher tests that failed against the pre-.25 reader as well. Runtime pagination checks were not weakened to accommodate those fixtures.

Independent review inspected all 12 changed Markdown resources. It found one missing Shipping ceiling guard: after the final verified PR merged, the prose could mutate its unverified child. The integrated step 7 now goes directly to the stop step when the frozen verified run is empty, without changing any descendant. A subsequent independent review confirmed this finding is closed. No other actionable prose issues remain.

Independent code review confirmed the source hashes, historical provenance, inventory and protected local files. It found that `GH_REPO` could select unrelated PR evidence despite a local working-directory argument. Both helpers now use the origin-bound explicit selector above. Independent post-fix review closed the finding and found no new actionable issues. Independent execution verified accepted and invalid origins under hostile environment selectors and competing default-repository configuration.

Final post-fix verification:

- `npm run check` and all 37 root tests pass, including tarball and extracted-package checks.
- All 65 existing helper tests pass with 714 assertions, including executable watcher lifetime tests, under hostile `GH_REPO`/`GH_HOST`. Watcher and orch strict TypeScript checks pass. Bash syntax and whitespace checks pass.
- Actual disposable CLI execution passes 17 frontier scenarios and 18 real-`jq` audit scenarios, including positive OPEN/DRAFT protection and merged/review classification, not merely universal refusal. Separate origin-binding probes accept four standard forms, refuse eight invalid forms plus missing/multiple origins, preserve frontier state on refusal, and assert the exact intended repository on every GitHub call.
- The queued watcher exits with a nonterminal `WAITING` frontier-ready receipt while upstack remains pending. Ten unchanged pagination scenarios and fast/rollup owner-gate mapping retain their independently passing evidence; watcher bytes were confirmed unchanged before reuse.
- Pi 1.1.0's skill loader loads all 54 explicit-only skills without diagnostics. This is a skill-loader smoke check, not full host certification.

Helper dependencies were installed with the existing frozen lockfile only in an isolated temporary copy. Official jq 1.8.1 was downloaded to a temporary directory and checked against its published SHA-256 before execution. No project dependencies, lockfile, global installation or profiles changed. No new unit test cases were added. Verification uses fixture forges and temporary repositories, not live forge operations. Source fingerprints show the tested snapshot did not change during independent verification; final documentation and hash refresh do not change helper behavior.

The installed Herdsman 0.26.0 is outside the declared >=0.25.1 <0.26.0 range. Pi 1.2.0 is also outside >=1.1.0 <1.2.0; the available Pi 1.1.0 is in range, but cannot remove the Herdsman mismatch. Both host-check attempts refuse at the Herdsman gate. No gate was widened or bypassed. Evidence and reproducible commands remain in `.pi-herdsman/port-0.15.25/verification/`; independent review reports are under `.pi-herdsman/port-0.15.25/review/`. These local evidence artifacts are not shipped.

Structural checks and fixture execution do not establish live forge compatibility, macOS behavior, prompt-model outcomes or installed Herdsman execution. No browser UI change is involved. See [Validation boundaries](../VALIDATION.md).
