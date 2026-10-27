# Selective upstream 0.15.30 alignment

## Scope and source identity

Pi users gain prompt rewriting, formal-check maintenance, and executable statechart resources. Maintainers inherit the upstream helper design without a new runtime dependency or orchestration API.

The reviewed delta is Cursor plugins `0b8e952052d482ee6de06deebf14d590d77b1b34`, pstack 0.15.26, to `eb4db2b55b2b7dec3d9282754cddf0a56bf4ff10`, pstack 0.15.30. Both target plugin manifests report 0.15.30. The preflight fetched both full commits through GitHub HTTPS, checked ancestry and object integrity, and exported both complete repositories. This establishes object identity, not signed-commit attestation.

The complete delta contains 114 changed paths. It has 28 canonical pstack paths, 28 generated Claude mirror paths, one root CI path, and 57 unrelated paths. Local evidence under `.pi-herdsman/port-0.15.30/` includes `REPORT.md`, `path-inventory.json`, `upstream.git`, complete baseline and target exports, archive hashes, and `verify-evidence.py`. These ignored artifacts are not package resources. The implementation evidence is in its `implementation/` subdirectory.

`upstream.lock.json` advances only the reviewed upstream pin and preserves the exact prior review scope in history. `PORT-MANIFEST.json` retains inherited lineage and earlier reviewed adaptations. New source records and current adaptations name the full target commit, canonical path, and actual SHA-256. The package version remains 0.1.0.

## Selected resources

| Resource | Portable behavior and Pi adaptation |
| --- | --- |
| `skills/sharpen/SKILL.md` | Four expert questions shape one deeper rewritten prompt. Return only the rewrite. Do not execute the task or decide user-owned choices. Preserve constraints and authority. |
| `skills/create-formal-verification-skill/SKILL.md` | TLA+ is the default for event ordering in any implementation language. Prefer a real-code verifier for all-input properties. If none exists, disclose the gap and generate inputs against the real code. Record per-check covered files/functions and a last-confirmed sync commit. Preserve `.pi/skills/verify-<area>/`, exact tool versions, isolated mutation checks, and no automatic installation. |
| `skills/maintain-formal-verification-skill/SKILL.md` | Hidden explicit maintenance. Run old checks, trace covered-code history and new writers, update from the code, rerun, and prove relevant breaks are still caught in isolated scratch. Edit only verification files. Report alignment separately from the bug verdict. |
| `skills/statechart/SKILL.md` | Hidden explicit model-to-reader chart and agreed-chart-to-model workflow. Gate executable mappings, copied inputs in authorized isolated scratch, owned output replacement, tools, and PNG external effects. Reproduce counterexamples against real code before reporting product bugs. |
| `skills/statechart/scripts/*.mjs` | Adopt `statechart`, `chart-to-tla`, `tlc-to-chart`, `compare-charts`, and `lib` byte-for-byte. Node built-ins only. |
| `skills/statechart/scripts/model/OutputFolder.*` | Adopt the TLA, cfg, and mapping resources byte-for-byte. This bounded self-model is not a proof of arbitrary filesystem behavior. |
| Setup, help, recipes, and README | Distinguish absent formal checks from stale existing checks. Explain rewrite-only Sharpen and Statechart. Optional app/formal generation offers stay in setup skill guidance, not `/setup-pstack [role]` runtime behavior. |

The domain records are deliberately small. Sharpen maps a prompt to a rewrite. Each formal check records property, covered code, bounds, assumptions, command, and sync commit. A maintenance outcome separates model alignment from a passing or failing property. Statechart projects a finite graph into reader states and steps. Bug counts come from `summary.json`, not image inspection.

## Exclusions and preservation

The three upstream Statechart test-tree files are not shipped. Verification reuses those immutable tests and fixtures against scratch copies of the actual ported resources. No unit tests or test framework are added. Only existing skill and package count assertions change.

Generated Claude distribution, host manifests, marketplace changes, unrelated third-party plugins, and Cursor CI are excluded. The root CI's portable testing intent is retained through local checks, not an imported workflow. Guide semantics are incorporated into existing help and this report. No guide tree is imported. Claude installation, Cursor model-budget setup, `/loop`, custom modes, and unavailable built-ins are excluded.

The changed guide material also mentions Helpers, retained verification evidence, Opening a PR, Origin watching, and Ketchup. Existing local instructions already cover those behaviors. No orchestration refresh is needed because the upstream delta does not change the mode, principle files, cadence playbooks, or runtime helpers outside Statechart.

All eleven definitions, model/thinking pins, profile catalog/history/synchronizer, extension lifecycle, nine Herdsman APIs, tool ceilings, hidden invocation, exact evidence and lease handling, external isolation requirements, and landing authority remain unchanged. The two scoped .26 principle files remain exact upstream bytes. Code-ready and major-change full-swarm policy remains intact. Rebase/conflict/minor-fix follow-ups retain a single independent verifier. Shipping retains patch-id and demonstrated build-equivalent lane reuse, noise accounting, fresh changed-material review, no-output-lane reruns, and current-head CI/mergeability. Compatibility ranges are unchanged.

## Script execution risks

The executable resources retain upstream behavior. Skill gates are instructions, not a sandbox. Direct invocation can bypass them.

- Mappings and their imports run unrestricted JavaScript, possibly repeatedly. They must be inspected and trusted.
- The coordinator replaces an entire accepted output folder. Its name check does not establish ownership. Direct helpers overwrite explicit files without that publication guard. Prior PNGs disappear on a no-PNG run.
- `from-chart` can create the source trio before discovering missing TLC. Missing maps can produce a scaffold and exit 2. Exit 2 does not guarantee no writes. A rendering failure may publish usable files and still exit 2.
- Java/TLC must be separately provisioned. The helper checks jar presence, not authenticity or version. It has no process timeout and can use substantial memory. Abrupt exits can leave temporary folders, asided output, or orphan Java processes. Preserve exact identities and diagnose before cleanup.
- Direct-input fingerprints do not cover imported TLA modules or mapping dependencies. Copied, stable dependency sets are necessary for reproducible receipts.
- `--png` runs unpinned `npx -y @mermaid-js/mermaid-cli`. It may fetch and execute packages, install scripts, and a browser runtime, and write caches. It needs separate explicit approval. No renderer execution or installation is authorized by this port.
- Fixed/against replay is behavioral comparison, not formal refinement. Hidden steps, coarse labels, unmatched fields, finite bounds, and deadlock suppression limit the conclusions. A chart is not a liveness or timing proof.

## Instruction acceptance cases

These are source walkthroughs, not model trials. The preflight `REPORT.md` contains the complete case table.

| Case | Expected decision from the adapted instructions |
| --- | --- |
| Sharpen a migration-guide prompt | Return only a deeper prompt with sources, methods, and an outside check. Do not write the guide. |
| Sharpen asks to loosen security or protocol constraints | Preserve the constraint and user-owned choice in the rewrite. |
| Ordinary implementation without explicit Sharpen | Hidden invocation policy is unchanged. |
| Event-ordering property in non-TLA code | Default to TLA+ with explicit code mapping and bounds. |
| No implementation verifier for an all-input property | Disclose the tool gap and use generated inputs against real code. Do not advertise a hand model as implementation proof. |
| Maintain with no formal skill | Stop and point to explicit creation. |
| Existing formal skill lacks a sync commit | Disclose last verification-file commit fallback. Missing history or unclear coverage can block confirmation. |
| Old model passes after covered code moved or new writers appeared | Trace those changes before trusting the pass. Update from code, not from the desired verdict. |
| Updated check passes or exposes a bug | Catch a relevant scratch break for a pass. Replay a failure against real code. Preserve product findings and do not weaken the property. |
| Check is blocked or code is dirty | Keep a blocked check's old sync commit. Record relevant working-tree differences separately from a commit. |
| Setup is canceled/headless or formal checks already exist | No generation starts. Do not repeat creation offers. Existing-check drift routes to maintenance. |
| Help asks for a chart | Recommend Statechart without executing it. Explain scratch, dependency, mapping, and rendering gates. |
| Chart uses unsupported final/history/fork/nested regions | Refuse the unsupported syntax rather than reinterpret it. |
| `from-chart` lacks TLC | Source files may be created. Report exit 2 and blocked checking, not a checked chart. |
| `--png` lacks external-effect approval | Do not run npx. Report rendering blocked. |
| Owned output is replaced or rollback fails | Preserve failure paths and process identities. Do not blindly delete or retry. |

Description tuning uses these cases and a held-out setup-command question. The setup skill's offers do not apply to the runtime project-copy command. The descriptions name explicit invocation and distinguish creation, maintenance, charting, and rewriting. Walkthroughs find no need to broaden invocation. No model efficacy or automatic selection accuracy is claimed.

## Verification

The implementation runs `node scripts/update-manifest.mjs`, `npm run check`, `npm test`, `git diff --check`, source-hash checks, protected-file comparisons, the existing Statechart suite without TLC, and dependency-free CLI checks. Commands and actual results are recorded in `VALIDATION.md` and local `implementation/REPORT.md` with logs.

Expected inventory is 57 hidden skills, 23 playbooks, 146 resources, 32 generated records, and 179 shipped files. The manifest refresh derives hashes and generated membership from exact package paths. The root suite checks actual packed membership and extracted packages in both supported test contexts.

TLC execution, real PNG rendering, model trials, and live Herdsman operation are not certified. Java is absent from PATH and TLA2TOOLS is unset in this environment. The installed Herdsman 0.31.1 is outside the declared range. Current Pi 1.4.0 is also outside the declared range. A prior Pi 1.3.0 installation does not make that Herdsman pair supported. No tools or hosts are installed and ranges are not widened. Lead-owned independent review and any later dependency approval remain separate steps.
