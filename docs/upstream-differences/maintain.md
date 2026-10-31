# Record a new upstream version

1. Freeze the local commit and the full upstream commit before comparison. Record the repository, canonical subdirectory, version, and both immutable SHAs. Do not use an export's enclosing repository HEAD as upstream identity.
2. Authenticate source bytes against that Git tree without implicit fetches. Record source and local SHA-256 values separately. Keep unavailable historical source bytes unknown.
3. Inventory the complete tracked local tree and relevant upstream tree. Include unchanged files, local-only integration, omitted resources, and retired paths. Deduplicate cross-lane inventories before reporting union counts.
4. Compare each current file with its matching upstream file, not just the latest port diff. Read changed contracts and unchanged context. Record path, category, rationale, evidence, review state, and exclusions in the ledger.
5. Separate platform adaptation from local policy. Cite a specific runtime constraint or owner decision. Keep generic adaptation labels and historical approval claims out of the proof column.
6. Review open findings against the new pair. Preserve stable IDs. Add a new ID for a new issue. Link any resolution to the actual fix commit and a source or behavior check. Link superseded records to their replacements without erasing history.
7. Check suspicious wording with `git log -p -G` and read the introducing patch. Distinguish first visible introduction, later regression, and reintroduction. Do not infer introduction from the latest modifying commit.
8. Record the source comparison separately from execution evidence. Name the tested surface, exact command, snapshot, and result. Mark unrun host, model, forge, solver, and rendering checks unknown. Do not label source walkthroughs behavioral passes.
9. Preserve enough reports, quotations, path ledgers, and hashes in repository documentation to survive scratch deletion. Mark unretained exports, raw transcripts, logs, and scripts unavailable after cleanup. Never make them the only evidence for an actionable finding.
10. Add the version pairing and per-stage differences to `versions.md`. Record intermediate versions without inventing standalone local snapshots. Keep historical mappings separate from newly reviewed semantic coverage.
11. Run existing link, inventory, and manifest checks. Refresh hashes only for authorized changed package files. Check links in the repository-only audit docs separately. Recompute the frozen-tree ledger union and require an empty missing-path set.
12. Hand the actual diff and validation results to the owner for independent documentation review and publication. Documentation does not authorize functional fixes, new tests, installs, or policy changes.
