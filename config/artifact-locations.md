# Artifact locations

This is the canonical model-readable configuration and policy for workflow artifacts. Read it before choosing a coordination, decision-log, resume-note, or handoff path. It is not a Herdsman agent definition. No runtime parser or automatic enforcement reads this file.

## Defaults

| Setting | Value |
| --- | --- |
| Project base | Active project's cwd/workspace, not the installed skill package |
| Artifact root | `.pi-herdsman/`, relative to the project base |
| Decision log | `<artifact-root>/decisions.tsv` |
| Concurrent task decision log | `<artifact-root>/decisions/<task-slug>.tsv` |
| Resume note | `<artifact-root>/resume/<slug>-resume.md` |
| Handoff note | `<artifact-root>/handoffs/<slug>.md` |
| Orchestrate store | `<artifact-root>/orchestrate/<project-slug>/` |

`<artifact-root>` means the resolved artifact root, not a literal directory name. Choose a task or project slug that identifies the effort without colliding with another writer. Orchestrate's `decisions.tsv` inside its chosen store is an explicit workflow path and takes precedence over the general decision-log default.

## Resolve and use

1. Honor explicit user or assignment paths first. Otherwise reuse existing adequate artifacts at their current paths. Do not create a competing source of truth.
2. For a new artifact without a supplied path, identify the active project cwd/workspace and resolve the defaults above against it. Do not resolve them against this configuration file or the installed skill package. If the project base is unclear, establish it before writing.
3. Create directories or modify artifacts only with write authority for the assignment and those paths. This policy grants no write authority. A read-only agent returns its evidence to its owner for authorized persistence.
4. Do not automatically migrate, rename, or delete existing artifacts. Keep ordinary working artifacts untracked. Preserve approved permanent audits and their approved locations and tracking. This file does not change git configuration or grant commit authority.
5. Pass canonical files and exact result refs unchanged through `files`. Choosing an artifact location does not copy, snapshot, or relocate transport evidence.

This configuration does not move or configure Herdsman runtime result/session storage. Continue using the runtime-provided paths and exact result refs for those records.
