# Approved fidelity decisions

Alex completed two questionnaire rounds and confirmed: record and implement all agreed changes, verify them, update PR #11, do not merge.

Baseline is bdad3a9 on update/pstack-upstream-0.15.36. Target upstream is pinned Cursor pstack 0.15.36 c742dd61706fbacc1b95f1a20b7b988cf096ce6c, available under .pi-herdsman/port-0.15.36/pstack. Preserve actual Pi/Herdsman capabilities, fixed profiles/models, permission gates, one executor per assignment, asynchronous ownership, privacy, and no-invented evidence. No dependency installs, no new unit tests, no compatibility-range expansion.

## Findings

- W-001. Help executes explicit authorized work requests through Poteto mode. Ordinary questions stay read-only. Do not require a redundant invocation.
- W-002. Restore upstream requirement to build a tool that does or proves nontrivial authorized work. Exempt trivial work, not a subjective cost exception. Read-only requests do not acquire write authority.
- W-003. Remove obsolete coordinator-always-merges/workers-never-merge comparison. Use current ownership and approval rules without granting merge authority.
- W-004. Remove extra generic prompting-help prescriptions for dry-run flags, machine-readable output, seeded state and reset steps. Restore upstream's narrower scope. Retain independently applicable safety rules.
- W-005. Restore upstream PR Scope bans on symbols/paths and Verification bans on methodology/swarm recitals. Keep detailed evidence in appropriate linked records.
- W-006. Keep explicit Poteto trigger for TypeScript edits and explicit type-system review. Document this as an approved local policy paired with S-004.
- W-007. Restore discoverability for existing skills and missing Ketchup/TDD examples, using actual Pi invocation. TDD remains subject to user testing policy; no new unit tests authorized. Do not invent make-bot-ui availability.
- W-008. Replace lane VM with actual authorized prepared verification environment. Worktrees isolate files, not process/security boundaries; disclose actual isolation limits. Stronger isolation only when required. Existing video requirement remains; unavailable capability is reported, not invented.
- W-009. Restore at least two focused audit lanes, with extra lanes justified by distinct coverage.
- W-010. Stop authority wins. Reach a safe atomic boundary only when permitted; preserve/report unresolved broken state rather than continue editing after an immediate stop.
- S-001. Arena rationales must name alternatives considered and rejected options.
- S-002. Allow justified extra Arena/Architect attempts without an additional request, within task authority/resources. Two can remain normal starting point, not a cap. No dynamic model changes or new authority.
- S-003. Sharpen shows concise four-part framing, then a clearly separated rewritten prompt. It does not perform the underlying task.
- S-004. Keep edits/explicit type-review-only TypeScript applicability. Ordinary reading/explanation is exempt. This is Alex's explicit reading-cost preference, not necessary host adaptation.
- S-005. Require one shared skill artifact for delegated tool use, including one-off work, with recipe, verification contract and do-not-touch boundaries. Authorized writer creates it; leaf tools/permissions unchanged.
- S-006. Remove ALL 17 audited retained expansions and restore upstream's shorter prose. Preserve only independently necessary host/safety adaptations, not generic extra instruction justified after the fact. Files listed below. Alex explicitly chose upstream even for Prove It Works, TDD, Unslop and Sentry where recommendations suggested retention.
- S-007. Restore supported description-validation/iteration procedure after Reflect tuning. No imaginary Cursor create-skill API. Hidden skills remain explicit-only; missing model-evaluation capability must be disclosed, not a successful evaluation claim.

## S-006 files

1. skills/blast-radius/SKILL.md
2. skills/figure-it-out/SKILL.md
3. skills/how/references/explorer-prompt.md
4. skills/principle-encode-lessons-in-structure/SKILL.md
5. skills/principle-exhaust-the-design-space/SKILL.md
6. skills/principle-guard-the-context-window/SKILL.md
7. skills/principle-laziness-protocol/SKILL.md
8. skills/principle-outcome-oriented-execution/SKILL.md
9. skills/principle-prove-it-works/SKILL.md
10. skills/principle-sequence-verifiable-units/SKILL.md
11. skills/tdd/SKILL.md
12. skills/technical-writing/SKILL.md
13. skills/unslop/SKILL.md
14. skills/why/references/sources/code-archaeology.md
15. skills/why/references/sources/incident-postmortem.md
16. skills/why/references/sources/sentry.md
17. skills/why/references/sources/slack.md

## Evidence and acceptance

Existing audit at docs/upstream-differences preserves frozen45607d3 source findings. Do not rewrite old hashes or claim old approval existed. Add current decision/disposition record and current evidence; distinguish approved local policies W-006/S-004 from restored upstream behavior. R-001 and C-001 already resolved. No new current unexplained differences should be hidden as resolved. Historical unknown evidence remains unknown.

Read actual source pairs and all changed callsites/help descriptions so the chosen rules are consistent. Verify strict exactness for pure upstream restorations and explicitly enumerate remaining host adaptations for mixed files. Use source acceptance cases for instructions; do not claim prompt efficacy/live runtime from source checks. Existing npm tests/checks and manifest idempotence must pass. Do not weaken existing checks merely to accommodate an accidental mismatch. Independent review and publication belong to the lead.
