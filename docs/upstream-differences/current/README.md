# Approved fidelity resolutions

This reference records Alex's approved questionnaire decisions and their implementation from local baseline `bdad3a95984d029ee7857b324e3cd78e57c2b22b` on `update/pstack-upstream-0.15.36`. The target remains Cursor pstack 0.15.36, `c742dd61706fbacc1b95f1a20b7b988cf096ce6c`.

The [approved brief](approved-decisions.md) is the decision authority supplied by the lead after two questionnaire rounds. This record does not reconstruct the questionnaires or imply that these decisions existed at earlier commits. The Git commit containing this record identifies the implementation. The recorded hashes identify changed existing files.

## Decision dispositions

Independent policy and restoration reviews passed. Source acceptance means that the instructions contain the approved contract. It does not mean an agent executed that contract successfully.

| Decision | Current disposition | Implementation and source acceptance |
| --- | --- | --- |
| W-001 | Restored | Help executes explicit authorized work through Poteto mode without another invocation. Ordinary questions remain read-only. Help metadata, body, and help-only caveats agree. |
| W-002 | Restored | Mode requires the smallest tool that does or proves nontrivial authorized work. Triviality is the exemption. Read-only roles gain no writes. |
| W-003 | Restored ownership explanation | Autopilot-full no longer says the coordinator always merges and workers never merge. Current ownership, independent verdicts, and explicit merge approval govern. |
| W-004 | Restored narrower scope | Prompting drops the extra reusable-verification section and its CLI flags, seeded-state, and reset prescriptions. Existing authority, trust, and evidence rules elsewhere remain. |
| W-005 | Restored | Opening a PR bans symbols and paths in Scope and sample-size methodology, swarm recitals, and metric tables in Verification. Detailed evidence stays linked. |
| W-006 | Accepted local policy | The mode explicitly loads TypeScript guidance for edits and explicit type-system review. This is Alex's preference, not a necessary host adaptation. |
| W-007 | Restored discoverability | Help lists TDD, TypeScript, no-comments, and Bro. Recipes include Ketchup and cheap-test TDD with actual Pi invocation. The example grants no new unit tests. No make-bot-ui capability is invented. |
| W-008 | Host correction | Multi-phase plan retains the video requirement but uses the actual authorized prepared environment. It discloses file-only worktree isolation and reports unavailable recording. Stronger isolation is conditional on need. |
| W-009 | Restored | Multi-phase plan requires at least two focused audit lanes. Extra lanes need distinct coverage, not a new permission request. |
| W-010 | Stop precedence clarified | An immediate stop or zero-writes hold wins. Atomic completion or rollback requires permission. Broken state is preserved and reported. The later WIP-commit step also requires current write and commit authority. |
| S-001 | Restored | Arena candidate rationales name alternatives considered and rejected options. |
| S-002 | Restored adaptive attempts | Arena and Architect start with two attempts but permit justified extra directions within authority and resources, without another request. Effective definitions still own models and tools. |
| S-003 | Restored framing | Sharpen shows concise four-part framing, then a clearly separated rewritten prompt. It does not perform the task. README, help table, description, and recipe agree. |
| S-004 | Accepted local policy | TypeScript edits and explicit type review require the skill. Ordinary reading and explanation do not. Paired with W-006 as Alex's reading-cost preference. |
| S-005 | Restored | An authorized writer creates one shared skill artifact for delegated tool use, even one-off work. It contains the recipe, verification contract, and do-not-touch boundaries outside delegates' write scopes. Leaf permissions do not change. |
| S-006 | Restored all 17 files | The [restoration contract](restorations.json) covers every approved path. Fourteen are byte-exact. Three have only the host or existing safety deltas enumerated below. |
| S-007 | Restored supported loop | Reflect description tuning links steps 4 through 6 of the Pi authoring procedure. It requires cases, revision, held-out validation, and honest missing-model-runner reporting. Synthesizer guidance preserves hidden explicit-only invocation and supported metadata. |

The path-keyed [acceptance cases](acceptance.json) identify the operative text and forbidden old wording for each decision. [The source probe](check-source.py) checks those cases and every complete S-006 file.

R-001 and C-001 remain resolved as documented in the frozen overview. No new evidence changes the historical recipe introduction or the 50 unknown historical source attestations.

## Complete S-006 fidelity boundary

The restoration contract stores each upstream SHA-256 and the full text of every allowed replacement. The source probe reverses only those replacements and requires the complete resulting file to hash to the pinned source. Extra retained prose fails that check.

The fourteen exact files are How's explorer prompt, Encode Lessons in Structure, Exhaust the Design Space, Guard the Context Window, Laziness Protocol, Outcome-Oriented Execution, Prove It Works, Sequence Verifiable Units, TDD, Unslop, and the Why source guides for code archaeology, incident postmortems, Sentry, and Slack.

Only these three S-006 files remain mixed:

| File | Complete remaining delta from upstream | Reason |
| --- | --- | --- |
| `skills/blast-radius/SKILL.md` | Replace the multi-model Arena sentence with independent investigator sessions and actual model-overlap reporting. | Fixed effective definitions cannot promise dynamic model selection or diversity. |
| `skills/figure-it-out/SKILL.md` | Translate the description's invocation to `/skill:figure-it-out`. Retain the existing unattended trust preflight paragraph. Replace per-request reasoning and speed selection with effective-definition ownership. | Pi invocation, existing trust and approval gate, fixed model/thinking definitions. |
| `skills/technical-writing/SKILL.md` | Translate the description's invocation to `/skill:technical-writing`. | Pi invocation only. |

No generic retained instruction expansion remains in those 17 files. In particular, the former Prove It Works execution checklist, TDD extra requirements, Unslop process expansion, Sentry warnings, and source-guide evidence lists are removed as approved. Upstream's own shorter descriptions and rules remain intact, even where a description contains more guidance than the body.

## Remaining current differences

[Current path differences](differences.tsv) lists every baseline-tracked path with unequal or absent same-path upstream bytes, this phase's new records, and every upstream-only path. This is mechanical path accounting against pinned upstream, not a new whole-repository semantic audit. Local-only documentation and adapters are listed too. [Affected source pairs](affected-pairs.diff) preserves all upstream-to-local changed hunks for changed instructions, with zero unchanged context. The [mixed-file ledger](mixed-files.md) enumerates their remaining host, safety, policy, and equivalent-prose deltas, including files outside S-006. [Current hashes](hashes.tsv) records baseline, current, and pinned upstream hashes for changed existing paths.

The following differences remain intentionally outside the restored upstream contracts:

- Pi invocation, sticky-mode commands, setup/profile reconciliation, hidden explicit invocation, quoted metadata where needed, and local authoring procedures replace unavailable Cursor APIs.
- Herdsman uses bounded leaves, direct-owner control, asynchronous results, exact result refs through evidence files, one executor per assignment, definition-owned models/tools, explicit external checkout preparation, and honest isolation limits.
- Approval and privacy constraints remain. Read-only work grants no writes. Existing unattended trust, publication, install, deletion, scheduling, and merge gates remain.
- W-006 and S-004 are now explicitly accepted TypeScript reading-cost policy. They are not host necessities.
- Existing executable adapters, helper packaging choices, local Deslop, relocated no-comments reviewer, TypeScript example corrections, formal-check and rendering approval boundaries, and artifact/session-history resolution remain as recorded in the frozen lane reports. This phase does not newly certify their runtime behavior.
- make-bot-ui remains unavailable. The omitted Statechart fixture tree, Cursor model rules and cloud capabilities, generated upstream distributions, and unrelated integrations remain omissions, not equivalent implementations.
- Historical source unknowns remain unknown. Existing broader policy provenance claims are not upgraded by this approval. No new unexplained difference is treated as resolved merely because a file is labeled adapted.

## Verification and limits

The [verification record](verification.md) records executed commands and limits. No new unit tests, dependencies, compatibility ranges, model configurations, global settings, or profile definitions changed. No commit, push, PR update, issue write, or merge occurred in this phase.

The probe can run without the scratch export:

```sh
python3 docs/upstream-differences/current/check-source.py
```

With the existing upstream object store, it also verifies all 17 restoration source hashes against Git, without fetching:

```sh
python3 docs/upstream-differences/current/check-source.py .pi-herdsman/port-0.15.34/upstream.git
```

The record proves source fidelity and existing check results. It does not prove model efficacy, automatic selection accuracy, live Pi/Herdsman compatibility, app behavior, video production, solver correctness, or forge behavior. Completed independent review is recorded in the [verification record](verification.md#independent-review). Publication does not authorize merging.
