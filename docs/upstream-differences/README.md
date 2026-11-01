# Upstream differences

This reference records what the Pi port changes, omits, and has not proved. It does not approve unexplained differences or certify upstream parity.

## Current approved dispositions

Alex approved all 17 open findings after two questionnaire rounds. The [current decision and resolution record](current/README.md) distinguishes restored upstream contracts from the explicitly accepted TypeScript reading-cost policy, W-006 and S-004. All 17 S-006 expansions are removed. Fourteen files are byte-exact upstream restorations; three retain enumerated host or existing safety deltas.

The current record starts from `bdad3a95984d029ee7857b324e3cd78e57c2b22b`. Independent policy and restoration reviews passed. The [verification record](current/verification.md#independent-review) includes the corrected byte-comparison probe and its negative checks. The commit containing this record identifies the delivered snapshot. The frozen reports and hashes below are unchanged. Current approval does not establish historical approval or model efficacy.

## Frozen comparison

- Upstream repository is `https://github.com/cursor/plugins.git`, canonical `pstack/`.
- Upstream 0.15.36 is `c742dd61706fbacc1b95f1a20b7b988cf096ce6c`.
- Audited local snapshot is `45607d3d895f63d6deccc3933f742d258d6b384e`.
- This documentation integration follows that snapshot. Its new documents and README hash refresh are not part of the audited tree.

The three audit lanes compared actual .36 source contracts, including unchanged files and retained older differences. Earlier versions have [immutable pairings and recorded differences](versions.md), not a fresh path-by-path semantic review. A generic manifest label such as "adapted" or "selective portable behavior" proves neither equivalence nor owner approval.

## Findings at the frozen comparison

R-001 and C-001 remain resolved at their respective fix commits. The 17 workflow and skill findings were open at the frozen comparison. Their current dispositions are in the [resolution table](current/README.md#decision-dispositions). The IDs stay stable across later versions. Lane-local F numbers are namespaced below.

| ID | Priority | Difference and effect | Category | Evidence |
| --- | --- | --- | --- | --- |
| W-001 | Medium | Help makes an explicit work request wait for another invocation. | Unexplained drift | Workflow F1 in [report](workflows/report.md) |
| W-002 | Medium | Mode weakens Build-the-Lever's nontrivial-work trigger with a cost exception. | Unexplained drift | Workflow F2 in [report](workflows/report.md) |
| S-001 | P2 | Arena candidate rationales no longer require alternatives and rejections. | Unexplained drift | Skills F1 in [report](skills/report.md) |
| S-002 | P2 | Arena and Architect require a user request for extra attempts. | Unexplained drift | Skills F2 in [report](skills/report.md) |
| S-003 | P2 | Sharpen suppresses the four visible framing judgments and returns only a rewrite. | Recorded local presentation choice, rationale/approval unverified | Skills F3 in [report](skills/report.md) |
| C-001 | Resolved after frozen snapshot | Host checker now expects 58 skills, including Ketchup-video. | Resolved local adapter defect | [Resolution and verification](code-history/report.md#c-001-resolution) |
| S-004 | P2/P3 | TypeScript guidance excludes ordinary reading and explanation. | Unconfirmed local reading-cost policy | Skills F4 in [report](skills/report.md) |
| S-005 | P3 | Build-the-Lever makes the shared skill contract conditional on reuse. | Unexplained artifact-policy drift | Skills F5 in [report](skills/report.md) |
| S-006 | P3 | Seventeen files retain instruction expansions absent from the target, including upstream-pruned guidance. | Recorded retention, specific owner rationale unverified | Skills F6 and per-path [coverage](skills/coverage.tsv) |
| S-007 | P3 | Reflect description tuning loses the upstream validation loop. | Unexplained drift | Skills F7 in [report](skills/report.md) |
| W-003 through W-010 | Low | Stale Orchestrate ownership explanation, extra CLI-design prescriptions, PR-body omissions, TypeScript trigger addition, reduced help discoverability, residual VM wording, audit-count restriction, and pause ambiguity. | Mixed unexplained drift and residual host assumptions | Workflow F3 through F10 in [report](workflows/report.md) |
| R-001 | Resolved at frozen snapshot | The no-merge recipe exactly matches upstream after `45607d3`. | Resolved wording defect | [Verified history correction](recipe-history.md) |

`W-00n`, `S-00n`, and `C-001` map to their lane's Fn. Each W-003 through W-010 is a separate finding, not one combined disposition. An audit recommendation is not an authorization to fix or delete retained guidance.

## Coverage and proof limits

[Coverage boundaries](coverage.md) records the exact union. All **202 tracked local paths** at the frozen snapshot appear in the preserved ledgers. That is complete path accounting, not complete runtime verification. The local lanes overlap on the decision-log TSV. Upstream skill and helper inventories also overlap on fixture resources. Do not sum lane totals as a unique repository count.

| Lane | Paths accounted for | Durable review and ledger |
| --- | --- | --- |
| Workflows | 31 local paths, including 3 local-only | [Report](workflows/report.md), [coverage](workflows/coverage.tsv), [hashes](workflows/hashes.tsv), [vendor exclusions](workflows/exclusions.json) |
| Skills and non-executable resources | 399 union paths, 84 local and 315 upstream-only | [Report](skills/report.md), [coverage](skills/coverage.tsv), [hashes](skills/hashes.tsv) |
| Code, adapter, docs, inventory, and history | 88 local paths, 424 upstream helper/development paths, 3 retired paths | [Report](code-history/report.md), [local coverage](code-history/coverage.tsv), [upstream helper coverage](code-history/upstream-helper-coverage.tsv), [retired coverage](code-history/retired-coverage.tsv), [source attestations](code-history/source-pins.tsv) |

The skills audit verified all 397 owned upstream files against pinned Git objects with no mismatches. The code audit authenticated 152 of 202 historical source attestations. Fifty remain explicitly unknown, not passing. The workflow lane originally compared an unauthenticated export. Integration independently verified its 28 upstream counterpart files against the same pinned Git tree. [Workflow hashes](workflows/hashes.tsv) distinguish that additional byte check from the original semantic review.

Byte identity proves which source was compared. It does not prove model behavior, live host compatibility, solver correctness, video rendering, or forge behavior. Source walkthroughs are not executed workflows. Historical approval claims were not independently re-established from primary user messages.

## Categories and status

- **Exact** means equal bytes at the named pair.
- **Intentional adaptation** names the specific platform constraint and changed contract. It is not a blanket parity claim. Pi invocation, definition-owned models, bounded leaves, and async evidence are examples supported by the compared runtime contract.
- **Local policy** names a behavior choice and its decision record. Unattended trust gates and publication approval are distinct from upstream behavior. Recorded decisions without primary approval evidence remain recorded, not independently verified consent.
- **Unexplained drift** means no specific platform need or owner rationale was established. It does not imply malicious intent or measured harm.
- **Exclusion**, **local-only**, and **retired** describe missing counterparts or deliberate scope boundaries. Missing capability is not an equivalent implementation.
- **Unknown** means evidence is unavailable or the relevant review was not done.

Status is separate from category. Findings are open, resolved, superseded, or explicitly accepted by a referenced owner decision. Superseded findings keep their old snapshot and replacement ID. Resolved findings keep their fix SHA and proof. Before a fix is committed, its record names the baseline and working-tree hashes rather than inventing a fix SHA. A new port does not silently close earlier findings.

## Maintenance

The [new-version checklist](maintain.md) keeps future ports tied to matching source and local commits. Existing [alignment reports](versions.md) remain historical rationale records. These repository audit documents are not npm package resources. Package membership and historical validation counts are unchanged.
