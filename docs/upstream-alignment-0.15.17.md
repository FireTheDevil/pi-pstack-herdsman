# Aligning the Pi pstack port with upstream 0.15.17

## Purpose and current status

This document explains the proposed changes, the scope Alex approved, and the implementation results. It is readable without the earlier conversation or Git history.

The work is on `review/cursor-pstack-0.15.17`. The requested resource changes are applied, and focused independent review passed. After the separately requested count update, the isolated branch passes all 34 existing tests, and the current working tree passes all 37. Supported-host certification remains blocked. The earlier committed-snapshot results and their scope are recorded below. Existing uncommitted work that predates this task is preserved outside the commit. No release or pull request is part of this work.

Our previous reviewed baseline was Cursor pstack 0.15.9. A fresh upstream audit found eight later pstack commits through 0.15.17. The main token-efficiency change is 0.15.16, which distills 35 skill and reference Markdown files. The upstream audit found no measured token savings or behavioral evaluation results.

## Original recommendation

The first recommendation was deliberately narrower than full upstream parity:

1. Shorten repeated How and review instructions while retaining execution and delegation safeguards.
2. Combine repeated Why investigation guidance without losing evidence boundaries or uncertainty handling.
3. Shorten technical-writing and unslop conservatively, retaining examples, checklists, and the prose self-audit.
4. Consider a new `ketchup` skill separately. It summarizes current-chat progress and outstanding human decisions without doing more work.
5. Consider a new `poteto-help` skill separately. It answers workflow questions and offers prompting guidance without executing the workflow.

The recommendation prioritized shorter loaded instructions. It did not promise measurable savings or equivalent agent behavior.

## What the original recommendation left out

| Omitted area | Why it was omitted | Current decision |
| --- | --- | --- |
| Broad prose cleanup, including ordinary replies | The port previously loaded unslop only for requested edits and explicit cleanup steps. | Include. Apply the broader writing policy without turning every reply into a prose-editing task. |
| Wholesale portable prompt cuts | Some cuts remove examples or checks that the port retained deliberately. | Include the upstream reductions across portable skills and references. Keep Pi runtime and authorization requirements. |
| Unattended-run trust checks | This is a guardrail change rather than text compression. | Include explicit preflight checks before unattended work. |
| More guide material | Prompt anatomy, design advice, and verification guidance were outside the initial efficiency shortlist. | Include portable guidance and recipes. Do not promise Cursor-only capabilities. |
| Commit-message hygiene | It is a small writing improvement, not a token-efficiency feature. | Include the rule that the body does not repeat the subject. |
| Other compressed skills and playbooks | The initial shortlist did not cover Arena, Reflect, principles, or forensics guidance. | Include portable changes across the upstream delta. |
| Upstream model defaults | They remove Sol and adopt Cursor-specific Opus and Grok preferences. | Hold off. Preserve Alex's Pi model and thinking policy. |
| Cursor-specific installation, cloud, budget, and loop features | They do not implement Pi or Herdsman behavior. | Exclude. Explain the supported Pi equivalents where useful. |
| `make-bot-ui` | Alex previously excluded it. | Keep excluded. Do not advertise it in imported help or recipes. |

## Local consistency issues and their fixes

### PR preparation must not assume managed worktrees

The earlier audit flagged automatic Task worktrees and a hard reset. Inspection of the saved pre-edit file found that the current local playbook already used explicit external worktrees and prohibited discarding shared work. The audit overstated that particular local defect. Herdsman does not automatically isolate delegated work in worktrees. A hard reset can discard Alex's uncommitted changes.

Keep the existing safe worktree instructions. Strengthen the entry conditions with explicit branch ownership, working-tree inspection, and authority for commits, rebases, pushes, PR creation, and merges. This is what the implemented change does. It preserves unrelated work and keeps ordinary PR preparation separate from permission to publish or merge.

### Reflect must not file Backlog items automatically

Reflect's automatic Backlog filing instruction conflicted with the port's authorization rules for external writes.

Make the default output a recommendation or draft. File or update external items only when the current request explicitly authorizes that action and the required tools are available. Missing tools or authority are a reported limitation, not a reason to widen the agent's permissions.

## Why investigation checks

The follow-up review found counterfactual and full-record guidance already in the local investigator prompt. Do not add duplicate instructions simply because the earlier audit listed them as candidates.

During implementation, check that the revised prompt still requires reading the available full record before making strong claims. Check that it asks how the evidence would differ if the current interpretation were wrong. Retain source confinement and label incomplete evidence. Add only requirements that are genuinely absent.

## Implementation plan

1. Capture the current working state and run the existing validator before editing.
2. Apply upstream prompt distillation and the approved behavioral changes to portable Markdown resources. Add Pi-native help and catch-up skills.
3. Update resource provenance, reviewed scope, package inventory, and validation expectations. Preserve original lineage rather than claim a byte-for-byte upstream import.
4. Review the actual diff independently. Check instruction consistency, links, metadata, and package loading. Run existing tests without writing new unit tests.
5. Update this document with actual changed files, verified results, and remaining limitations.

One worker owns skill edits. Documentation and later metadata integration remain with the lead. No agents write the same files concurrently.

## Validation and limits

Structural validation can prove that resources load, links resolve, shipped inventory agrees, and hashes match. A read-through can check whether permissions and workflow requirements remain explicit. Neither proves that agents perform equally well after prompt compression.

Do not describe fewer words as a measured token saving. Do not claim successful unattended runs or improved task outcomes without running those checks. The completed report will distinguish structural checks from behavioral evaluations.

## Implementation results

### Changes applied

Forty-three skill and reference resources were changed or added across implementation and review remediation. The package now contains 52 explicitly callable hidden skills and 23 playbooks. It previously contained 50 skills. Run `npm run check` to display validation counts from the current inventory.

| Area | What changed | Where to read it |
| --- | --- | --- |
| General prose | Unslop now applies to every prose output, including ordinary replies and agent instructions. Loaded instructions are reused within the active context. The upstream-deleted extra self-audit step was removed. | `skills/unslop/SKILL.md`, `skills/poteto-mode/SKILL.md` |
| Explanation and review | Repeated instructions and examples were reduced in How, Architect, Arena, Interrogate, and Reflect. Pi definitions, result handoffs, read-only boundaries, and approval gates remain explicit. | The matching `skills/<name>/SKILL.md` files and review references |
| Principles and writing | Portable cuts were applied to ten principle leaves, technical-writing, and figure-it-out. Upstream-deleted type-system examples and checklists were removed. Technical-writing retains the worked example and review checklist that current upstream retains. | `skills/principle-*/SKILL.md`, `skills/technical-writing/SKILL.md`, `skills/figure-it-out/SKILL.md` |
| Investigation and forensics | Why's roster, confidence guidance, investigator/synthesizer prompts, and code-archaeology, Datadog, and Sentry references were compressed. Trace-forensics wording was shortened. | `skills/why/`, `skills/poteto-mode/playbooks/trace-forensics.md` |
| Catch-up | New read-only current-chat catch-up distinguishes human decisions from remaining agent work. It consumes arrived results without polling. | `skills/ketchup/SKILL.md` |
| Help and guide material | New question-only help routes to real Pi skills and playbooks. References cover prompt anatomy, restate-first investigation, README-first API design, prototypes before plans, reusable verification, CLI controls, repeatable state, and away-run recipes. | `skills/poteto-help/SKILL.md`, `skills/poteto-help/references/prompting.md`, `skills/poteto-help/references/recipes.md` |
| Unattended trust | Four preflight checks require a demonstrated run, diagnostic tools, proof and stop gates, and transcript review. A shared gate applies regardless of route, with direct guards in Figure it out, Orchestrate, and both Autopilots. Missing checks block unattended execution, not authorized attended preparation. | `skills/poteto-mode/SKILL.md`, `skills/poteto-mode/playbooks/autonomous-run.md`, and the program entrypoints |
| PR and commit guidance | PR preparation strengthens branch/worktree ownership and authorization gates. Existing dirty-work preservation and reset prohibitions remain. Commit bodies must not repeat their subjects. | `skills/poteto-mode/playbooks/opening-a-pr.md` |
| Reflect authorization | Backlog recommendations or drafts are the default. Actual external writes require explicit authority and available tools. | `skills/reflect/SKILL.md` and its references |
| Why checks | Full-record reading and counterfactual checks remain once each. The revised full-record rule explicitly labels unavailable portions as partial evidence. | `skills/why/references/investigator-prompt.md` |

Wholesale portable cuts do not mean byte-for-byte replacement of Pi instructions. The port retains runtime requirements that Cursor's text cannot express, including definition-owned models and tools, asynchronous handoffs, one-writer ownership, source confinement, and authorization limits. Some execution-path and reachable-risk review guidance remains because it prevents unsupported review findings. Hidden discovery policy is unchanged.

### Upstream differences still held off

- Model defaults and budget rules remain local policy. No Sol panel or definition was removed or replaced.
- Setup keeps Pi's confirmed template-copy behavior. Cursor installation, model rule files, cloud workflows, and loop scheduling are not imported.
- `make-bot-ui` remains absent from the package and help recommendations.
- No upstream orchestration test or runtime engine was copied. The changes are workflow resources and their package validation metadata.
- The entire Cursor guide was not copied. Portable advice is consolidated into Pi-native help references rather than duplicate guide pages.

The upstream changes to `architect/references/runner-prompt.md` and `blast-radius/SKILL.md` only adjust model-count wording already represented by Pi's independent-attempt and model-overlap rules. They required no new local behavior. `setup-pstack/SKILL.md` remains unchanged because its delta changes Cursor model and budget policy.

### Metadata and documentation

`upstream.lock.json` now records the 0.15.17 reviewed scope and retains the previous 0.15.9 entry in review history. `PORT-MANIFEST.json` preserves original resource lineage and previous adaptation records while adding pinned source hashes for this pass. The four new resources and this report are included in `package.json.files`.

The validators expect 52 skills and the broadened prose policy. They accept historical reviewed source commits rather than incorrectly require every resource to originate at the latest review. README and NOTICE describe the new scope. The help text explicitly distinguishes `/pstack` catalog filtering from `/poteto-mode` workflow activation.

### Verification before commit isolation

- The pre-change `npm run check` passed with 50 skills and 129 resources.
- The integrated `npm run check` passed with 52 skills and 133 resources.
- The implementation's targeted frontmatter and relative-link scan passed. Its scoped `git diff --check` passed.
- Two independent Sol reviewer sessions both found that Figure it out, Orchestrate, and Autopilot could bypass the new unattended trust preflight. Remediation added a shared routing gate and linked guards at all four direct entrypoints. The canonical checks remain in one place. A fresh focused Sol review passed after inspecting every remediation hunk and the final report and trail. These sessions are independent attempts, not distinct-model evidence.
- Neither reviewer found changed validation-script comments to remove. Both reported that the decision trail's baseline label said "tests green" although the baseline only ran the structural validator. An appended correction now says "structural check passed"; the historical row is preserved.
- Independent Astra verification ran the unchanged existing suite. It initially reported 35 of 37 tests passing. One contract assertion expects the previous How role wording. The same test contains a later assertion requiring Why's explicit investigator tool limitation. Remediation restored both concise role statements. The existing contract suite then passed all 12 tests without changing any tests.
- The other failure is a fixed-size package-inventory assertion that expects 156 members. The actual package contains 161 after four new resources and this document. Independent tarball inspection confirmed exactly 161 regular files matching `package.json.files`. The test's fixed-size expectation needs a maintenance update to 161. This task does not change unit tests.
- After remediation, the full existing suite passed 36 of 37 tests. Only the stale 156-member assertion remains failing. The final `npm run check` passed with 52 skills, 23 playbooks, and 133 resources. The suite is not green, and this report does not claim otherwise.
- Extracted-package validation passed outside Git. Manifest refresh was byte-identical across repeated updates in the extracted package. Pinned source hashes, original lineage, prior adaptation records, and protected pre-existing changes passed independent checks.
- The installed Pi 1.1.0 skill loader loaded all 52 hidden skills without diagnostics. This is separate evidence, not supported-host certification, because the package declares Pi below 1.1.0.
- Supported-host certification is blocked. The installed Herdsman version is 0.25.1, while the host checker targets 0.19.1. The installed Pi version also exceeds the checker's historical range. No version gates were bypassed and no dependencies were changed.

The reviewers audited the trail against the supplied source and check artifacts. An exact parent transcript path was unavailable, so they did not perform a transcript audit or search unrelated sessions. Their instruction coverage was targeted, not an exhaustive behavioral audit of every prompt.

No new unit tests were written. No tokenizer measurement, model trial, or unattended workflow was run. Instruction consistency review is not proof of unchanged agent outcomes.

## Source references

- [Reviewed baseline, 0.15.9](https://github.com/cursor/plugins/commit/e43c7ee26e0038c6c1fa8380dd34ce86ff94cb2a).
- [Prompt distillation, 0.15.16](https://github.com/cursor/plugins/commit/00b14f1df36b32a8dd1529324a3a459f6563b127).
- [Catch-up skill, 0.15.17](https://github.com/cursor/plugins/commit/978ca6e9c0e012047cd5058b8e829240336e704e).
- The audit snapshot used repository main `11713c683fe4add4fd403ea880580abbc9e0875f`. The complete local audit is `/tmp/pi-pstack-upstream-audit/report.md`. Temporary evidence is not required to understand this document.

## Commit isolation

The requested commit includes upstream alignment only. Pre-existing artifact-location work is left uncommitted. This excludes `config/artifact-locations.md`, its existing README and package-inventory additions, the artifact-location edits in Orchestrate, Pause safely, and Show me your work, and existing test changes. The new unattended guard in Orchestrate is included separately from its older Store layout change.

The working-tree checks above used 161 package members because the local artifact-location addition was present. The isolated commit contains 160 members. It has the same 52 skills and 133 resources. Its manifest is refreshed against the isolated files, so it does not require excluded local files or their hashes. Commit-snapshot verification results are recorded below.

The isolated snapshot passed `npm run check` with 52 skills, 23 playbooks, and 133 resources. Its unchanged existing tests passed 33 of 34. The sole failure expects 155 package members while the snapshot contains 160. The pre-existing local test edit that raises the expectation to 156 was deliberately excluded. No test files were changed for this commit.

## Follow-up inventory count update

Alex subsequently requested the count update. The existing expectation in `test/package-inventory.test.mjs` now matches the inventory: 160 in the isolated branch and 161 in the local working tree that includes the uncommitted artifact-location file. No new tests or test logic were added.

The current checkout passed `npm test` with 37 of 37 tests and passed `npm run check`. The isolated follow-up snapshot passed all 34 existing tests and its structural check. The follow-up commit contains only count maintenance and this report update, with refreshed generated hashes. Unrelated artifact-location work remains uncommitted. The earlier 33-of-34 snapshot failure is historical and is resolved by this count correction.
