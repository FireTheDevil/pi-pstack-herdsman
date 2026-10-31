# Audit coverage boundaries

## Complete frozen local tree

The preserved ledgers cover every tracked path at local `45607d3d895f63d6deccc3933f742d258d6b384e`. The exact local union is **202 paths**. Missing paths and extra local paths are both empty.

- [Workflow coverage](workflows/coverage.tsv) accounts for 31 local paths.
- [Skills coverage](skills/coverage.tsv) accounts for 84 local paths and 315 upstream-only paths. A positive `local_lines` value identifies a local path.
- [Code coverage](code-history/coverage.tsv) accounts for 88 local paths.
- The code and skills lanes share `skills/show-me-your-work/references/decision-log-template.tsv`. There are no other local overlaps.

The integration verified all local hash rows against `git show 45607d3:<path>`. Frozen hashes deliberately do not change when later documentation changes README or the manifest. New audit documents are outside that frozen tree and receive documentation integrity checks, not a retroactive semantic-audit claim.

The upstream ledgers overlap on Statechart fixture resources. The 399-path skills union and 424-path helper inventory are not disjoint totals. The latter includes executable programs, tests, fixtures, package metadata, and development files. Upstream-only fixture accounting means source inventory and inspected examples, not independent proof of every solver output.

## Preserved data

| Artifact | Meaning |
| --- | --- |
| `workflows/coverage.tsv` | Per-path classifications and mixed adaptation/finding rationale. J1 through J8 and F1 through F10 are defined in its report. |
| `workflows/hashes.tsv` | Frozen local/export hashes and additional pinned-Git authentication for 28 upstream counterparts. Three local-only files have no upstream hash. |
| `skills/coverage.tsv` | All 399 paths, category, source/local line counts, explanation, and latest local modifying commit. Latest modification is not necessarily first introduction. |
| `skills/hashes.tsv` | Frozen local hashes and 397 upstream hashes already authenticated by the skills audit. Two local-only paths have no upstream hash. |
| `code-history/coverage.tsv` | All 88 local paths, categories, local/upstream hashes, counterpart paths, and review boundaries. |
| `code-history/upstream-helper-coverage.tsv` | All 424 owned upstream helper/development paths, hashes, and shipment/exclusion classification. |
| `code-history/retired-coverage.tsv` | Three removed orch implementation/test paths. Retirement is not missing-current-functionality drift. |
| `code-history/source-pins.tsv` | All 202 explicit historical source attestations. It records claimed SHA-256, immutable commit/path/blob, and verified or unknown verdict. Original retained-file scratch paths are replaced by an availability statement. |
| Lane `report.md` files | Source quotations, finding effects, rationale, historical evidence, and execution limits. The workflow report corrects the recipe introduction and discloses that correction. |

The TSV ledgers preserve audit judgments. Their category vocabulary is lane-specific. The overview defines the shared distinctions without silently relabeling every historical judgment. In particular, a "justified adaptation" row can include a recorded product-policy choice. It does not establish independent user consent.

## Explicit exclusions and unknowns

Eight physically installed vendor Markdown documents under `skills/poteto-mode/scripts/node_modules` were inventoried but not semantically audited. [Exact excluded paths](workflows/exclusions.json) survive scratch deletion. They are not tracked project documents.

Generated Claude mirrors, Cursor host/marketplace/CI metadata, the guide tree as a shipped tree, unrelated plugins, and external host implementations are outside port shipment. Existing version reports record selected guide intent and repository deltas, not complete independent upstream plugin certification. `make-bot-ui` is absent, with unavailable source host capabilities and a recorded exclusion decision. It is not replaced by an equivalent local workflow.

Global profiles/configuration, effective tool reachability, Herdr connectivity, live model behavior, actual Pi/Herdsman execution, live forge operations, Java/TLC checking, and rendering remain unverified by this source audit. Tool names and instruction gates are not sandboxes. Fixture outputs and old validation logs are not new execution results.

The code audit has 50 unknown historical source attestations because retained bytes did not match the exact historical blob. Dirty intermediary input and primary historical approval evidence are not reconstructed. Full historical path-by-path semantic review is unknown for each earlier stage in [versions.md](versions.md).

## Integration validation

`npm run check` passes with 58 skills, 23 playbooks, and 161 resources. `git diff --check` passes. The manifest diff changes only README's generated hash. Package membership, source lineage, profiles, executable files, and tests are unchanged.

Focused read-only checks confirm the 202-path local union and all 202 frozen local hashes. They also confirm 19 immutable local snapshot links and each historical upstream pin's membership in that snapshot's lock. Relative document links and named anchors resolve. The literal `[...](url)` template quoted by the skills report is not a resource link. The documented union command below was executed successfully.

All 28 workflow upstream counterpart hashes match the pinned Git tree during integration. The repaired recipe's complete line matches upstream. These are fresh integration checks. The skills and code audit verdicts remain attributed to their lanes, including the 50 unknown historical attestations. No unit tests, live host/model runs, installs, or publication were performed for documentation integration.

## Raw evidence retention

This document set preserves reports and ledgers, not enormous full-text dumps, raw transcripts, source exports, full diffs, scratch programs, or old execution logs. References to such files in lane reports describe original audit evidence. Treat those files as unavailable after scratch cleanup. They are not required links or rerunnable installed tools. Reconstruct source differences from the immutable pair when source objects are available. Do not upgrade unknown records if those objects or inputs are missing.

## Reproduce local path accounting

Run this read-only check from a repository checkout containing the frozen commit and these documents.

```sh
	python3 - <<-'PY'
	import csv
	import subprocess
	from pathlib import Path
	root = Path('docs/upstream-differences')
	def rows(path):
	    with open(root / path) as stream:
	        return list(csv.DictReader(stream, delimiter='\t'))
	lanes = [
	    {row['path'] for row in rows('workflows/coverage.tsv')},
	    {row['path'] for row in rows('skills/coverage.tsv') if int(row['local_lines'])},
	    {row['path'] for row in rows('code-history/coverage.tsv')},
	]
	tracked = set(subprocess.check_output([
	    'git', 'ls-tree', '-r', '--name-only',
	    '45607d3d895f63d6deccc3933f742d258d6b384e',
	], text=True).splitlines())
	covered = set.union(*lanes)
	assert covered == tracked, (sorted(tracked - covered), sorted(covered - tracked))
	assert len(covered) == 202
	print('202 frozen tracked paths covered; no missing or extra local paths')
	PY
```
