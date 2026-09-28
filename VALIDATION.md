# Validation boundaries

Local command tests exercise the actual extension handlers using a mock Pi context. They cover mode default/enable/disable, queueing, active-branch restore, catalog independence, child identity suppression, preview/confirmation/cancellation/headless setup, no overwrite and directory symlink refusal.

Definition tests check the shipped restricted template contract, read-only native tool allowlists and materialized project paths. They are not a reimplementation or runtime test of Herdsman's full YAML discovery/overlay engine. Documentation contract checks confirm global-over-project precedence, malformed-definition failure and exclusion precedence against the installed 0.13.0 docs.

The host check uses the installed Pi loader and skill loader in a repository-local disposable cwd, without inference or launching an agent. It does not establish live Herdr connectivity, agent discovery/override behavior, model availability, effective provider tool presentation, or live child suppression. These remain runtime-validation limits for a later authorized environment test.

The resource validator checks all 47 hidden skills, 23 playbooks, links, forbidden old backend operations, standalone imports and complete immediate-source/destination hashes. Prior lineage and upstream pins are inherited evidence; no remote verification was performed.

No independent review or live delegation smoke test is part of this implementation assignment.
