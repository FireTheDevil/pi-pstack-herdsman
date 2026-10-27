# pi-pstack-herdsman

Pstack workflow and command adapter for [Pi](https://github.com/earendil-works/pi) and the [pi-herdsman extension](https://github.com/boadij/pi-herdsman). It adds commands, 58 hidden explicitly callable skills, 23 playbooks, supporting references/scripts and eleven leaf definition templates. Herdsman provides agent orchestration; this package provides workflow guidance and commands. On normal Lead startup, it automatically reconciles its global Herdsman profiles with the loaded package.

## Skill origins

The skills originate in [Cursor's pstack plugin](https://github.com/cursor/plugins/tree/main/pstack), authored by Lauren Tan. The repository preserves the upstream MIT license and copyright notice. This extension uses [zenspc's pi-pstack port](https://github.com/zenspc/pi-extensions/tree/main/packages/pi-pstack) as its starting point and adapts it for pi-herdsman. See [NOTICE](NOTICE.md), [version pins](upstream.lock.json), and the [resource inventory](PORT-MANIFEST.json).

The resource lineage retains its original upstream pin. Selected portable changes through Cursor pstack 0.15.34 are adapted for Pi/Herdsman, not copied as full upstream parity. This pass replaces Statechart with the TypeScript compiler/runtime and adopts selected watcher, orchestration, audit, plan-lint, formal-verification and Reflect updates. A separately approved follow-up adds the explicit-only, instruction-only Ketchup-video skill; it bundles no renderer or dependencies. Optional verification offers are setup skill guidance, not a runtime command change. The [0.15.34 alignment report](docs/upstream-alignment-0.15.34.md) records selected paths, exclusions, risks, and validation limits. The [0.15.30 report](docs/upstream-alignment-0.15.30.md), [0.15.26 report](docs/upstream-alignment-0.15.26.md), [0.15.25 report](docs/upstream-alignment-0.15.25.md), and [earlier report](docs/upstream-alignment-0.15.17.md) preserve prior work. Scoped .26 principle, verification cadence, and Shipping result-reuse policies remain intact. Cursor model rules do not configure Pi. The [runtime role table](skills/poteto-mode/references/herdsman-runtime.md) routes tasks to the unchanged eleven Herdsman profiles.

## Install

Requires Node >=24, Pi >=1.1.0 <1.4.0, and pi-herdsman >=0.25.1 <0.30.0 with its Herdr prerequisites. Follow the [Herdsman setup guide](https://github.com/boadij/pi-herdsman/blob/main/docs/getting-started.md) to install Herdr and its Pi integration. These are declared compatibility ranges, not certification of every release. Prereleases are excluded. This package does not install or configure its host dependencies.

If you already manage Pi and Herdr yourself, install the extensions:

```sh
pi install npm:pi-herdsman@0.29.0
pi install git:github.com/FireTheDevil/pi-pstack-herdsman
```

For the Codex Notebook tools listed in the implementation and verifier profiles, also install the Codex conversion extension:

```sh
pi install npm:@howaboua/pi-codex-conversion
```

Open `/codex` and select Notebook mode if you want those tools. Tool names in a definition do not install or enable an extension.

Start `herdr` in your target project, then start `pi` inside its pane. Run `/poteto-mode` to enable the workflow. After startup reports created or updated profiles, restart Pi and inspect the effective definitions with `list_agents`. Authenticate the providers and ensure the models named in those definitions are available before delegating.

## Statechart dependencies

Statechart is not fully usable out of the box. Model checking requires separately installed Java (11 or later) and a TLC jar; upstream uses TLC 1.7.4. Set `JAVA` to the absolute path of the Java executable and `TLA2TOOLS` to the absolute path of the jar. The helper refuses missing paths and never installs these tools automatically. Without them, the skill can explain or prepare unverified drafts, but checking is blocked.

With Java and TLC available, Statechart can check a bounded TLA+ model and produce a report and Mermaid chart source, subject to the documented chart-size limits. **Pele is optional:** it renders the Mermaid source as SVG and is not needed for checking. Rendering uses separately provisioned `pele@1.9.0` and requires explicit approval for execution and any installation, network or cache effects. See the [Statechart skill](skills/statechart/SKILL.md) and [rendering instructions](skills/statechart/references/render.md).

The bundled TypeScript runs with Node >=24 without npm dependencies for checking. Use the Git installation above or a local checkout: Node's built-in TypeScript stripping does not execute these sources beneath `node_modules`. The current port has not verified real TLC execution, Pele rendering or live Pi/Herdsman operation; see [validation limits](VALIDATION.md).

## Try a local checkout

From a trusted target project, load this local package for one invocation alongside your existing Herdsman setup:

```sh
pi -e /path/to/pi-pstack-herdsman
```

No global Pi package installation is needed. Loading the extension (including from a trusted project or in headless mode) reconciles `pstack-*.md` profiles to `~/.pi/agent/agents/`, or `$PI_CODING_AGENT_DIR/agents/` when set. Safe package instruction changes update existing profiles automatically. User configuration remains installed-user-owned. Conflicts hold the affected profile unchanged. There is no npm postinstall hook, so `pi install` alone does not copy profiles until the extension starts a lead session. Review the package before granting project trust or loading it explicitly.

- `/poteto-mode [task]` enables the sticky controller hint and opens the workflow. Default is off. `/poteto-mode off` disables it. Explicit decisions restore from the active session branch. When enabled in a lead TUI session, the indicator reads `• poteto mode •` with purple words and muted dots; it is hidden when off.
- `/pstack-status` takes no arguments and reports Poteto Mode and bundled skill visibility without changing session state. Bundled skills stay hidden by frontmatter and remain directly callable with `/skill:<name>`. The old `/pstack` catalog toggle is removed; historical catalog-filter decisions are ignored.
- `/setup-pstack [role]` remains an optional, project-only template preview/copy command. It checks model availability and requires confirmation; cancellation and headless *command execution* write nothing. A same-name global profile installed on session start takes precedence, so edit that global profile if you need to customize the effective role.
- `/skill:poteto-help <question>` explains setup, skill selection, or prompt wording without executing the workflow. `/skill:ketchup` gives a read-only catch-up with evidence-backed visuals and every pending human decision, each with enough evidence and risk to decide from the reply alone.
- `/skill:ketchup-video` gives the same catch-up window and human calls, with a short silent slide video when authorized tools are available. The [video skill](skills/ketchup-video/SKILL.md) requires approved output outside the repository and separate approval for installs or external effects. It supplies no renderer and does not assume model video generation or inline Pi playback; unsupported or unverified playback uses an absolute `file://` output link for an external player. Rendering or inspection failure gives only the text calls with a one-line explanation.
- `/skill:create-formal-verification-skill` generates one project-local formal-property verification skill for code where harm is high and tests reach poorly. The [formal skill](skills/create-formal-verification-skill/SKILL.md) requires authorized tools and isolated scratch checks. Unrun output remains a draft. This is separate from app-driving verification and feature-map maintenance.
- `/skill:maintain-formal-verification-skill` updates existing formal checks after covered-code changes. The [maintenance skill](skills/maintain-formal-verification-skill/SKILL.md) records alignment separately from the result, preserves product findings, and edits only verification files.
- `/skill:statechart` checks a TLA+ model and projects it into reader-visible Mermaid states and numbered bug paths. The [Statechart skill](skills/statechart/SKILL.md) requires trusted executable views, copied inputs in authorized isolated scratch, and a dedicated new or empty output folder. Checking requires separately installed Java and TLC; optional Pele rendering needs separate approval. See [Statechart dependencies](#statechart-dependencies). No tools install automatically through skill invocation.
- `/skill:in-your-own-words` restates your goals and problem without starting work. `/skill:sharpen` returns only a deeper rewritten prompt with expert sources, methods, and an outside check. It does not do the task or relax your requirements and safety boundaries.

Restart Pi and inspect the effective Herdsman roster after a reported profile change. Global definitions override trusted project `.pi/agents/` definitions with the same name. Package `definitions/` are templates, not directly discovered. Synchronization does not grant project trust, edit settings, or mutate running agents. If a pinned model is unavailable, edit the corresponding global profile manually before delegation.

## Automatic profile synchronization

Startup creates missing profiles and saves exact package and installed baselines. Description and the whole prompt instruction core use conservative three-way comparison. Body comparison excludes leading and trailing whitespace; replacements retain that installed whitespace exactly. A customized field or prompt remains intact when only the user changed it. If the user and package change the same unit differently, synchronization holds the whole profile and does not advance its baseline. Model, thinking, tools, extensions, permissions, context, delegation configuration, formatting, and deliberate field omissions remain user-owned. Package capability-configuration changes require explicit review even when they reduce capabilities. Prompt changes are instruction updates, not sandbox guarantees.

Legacy copies can establish a baseline when their body core exactly matches a verified shipped body core, excluding boundary whitespace. Eligible historical snapshots must have capability configuration compatible with the incoming package and produce identical safe output. Installed overrides, including custom extensions and multiline tools, remain intact. Historical candidates record exact Git commits and template hashes. Current-template candidates record the verified package revision, catalog identity hash, template hash, and definition path instead of a Git commit. This evidence identifies a compatible reconciliation baseline, not the original installed header's ancestry. Modified legacy bodies without this evidence remain held.

The supported document subset has LF newlines, complete frontmatter, plain top-level known keys, ordinary scalar values, arrays, and raw mappings. Unknown fields, duplicate keys, aliases, tags, block scalars, body composition fields, ambiguous layouts, and new body-file references hold automatic rewrites. Pi's public parser validates proposals; unavailable parsing holds existing-profile rewrites. This is not whole-roster Herdsman validation. Created profiles do not check provider/model availability.

Baselines, retained preimages, and transaction journals live under `<agent-dir>/pstack-profile-sync/`, outside `agents/`. Publication uses same-directory atomic replacements and exclusive missing-file creation. Repeated successful startup writes no profiles or new transactions. An exclusive lock serializes cooperating synchronizers. Unknown or stale ownership never triggers automatic lock stealing. A deferred notice identifies the lock to inspect; after verifying no synchronizer is running, archive that lock directory and restart Pi for hash-based transaction recovery. Unexpected content remains held for inspection. After successful recovery, planning, and publication for each profile, synchronization permanently deletes older completed transactions and retains one latest completed transaction plus the current baseline. Completed adoption, recovered publication, and abandoned-before-publication records all count toward this per-profile limit. Every incomplete or unresolved transaction remains available for recovery. Held or failed profile synchronization skips cleanup. Existing unpruned histories shrink on a successful unchanged run without creating a transaction.

Cleanup validates the complete journal, preimages, targets, baseline, and allowed files before selecting a backup. The completion marker's filesystem modification time, read in nanoseconds, determines chronological order. A tie for latest prevents deletion. Malformed or unknown evidence, unsafe ownership, or a symlink reports a cleanup failure and preserves the affected evidence. Validated older directories first move atomically into per-profile `cleanup/` staging outside `transactions/`. A separate hash receipt permits interrupted deletion to resume without treating partial cleanup as active recovery. The current baseline is never a cleanup target. Cleanup uses the existing cooperative lock. Unknown external writers remain outside the check-and-rename guarantee.

A cleanup failure reports that profile synchronization succeeded but backup cleanup failed. Published changes still require restart and retain their historical publication events. Reports distinguish retained backup directories, cleanup staging that may be partially deleted, and pruned backups. A pruned event keeps its transaction ID instead of a deleted backup path. Any surviving cleanup receipt is reported separately. Unverifiable evidence is marked unavailable. Inspect the reported profile records or cleanup path before resolving unsafe evidence. Cleanup failures can temporarily retain more than one completed transaction. An already clean unchanged run creates no backups or transactions.

Notifications separate created, updated, adopted, held, and failed outcomes and identify affected paths or fields. Published or recovered profile changes are reported separately, even when later baseline or transaction completion fails. Such failures retain transaction evidence and still require restart. To resolve an exceptional hold, inspect the profile and its retained baseline/backups, reconcile the conflicting unit, and restart Pi. Do not delete baseline or transaction evidence to force synchronization. An older or divergent package root cannot downgrade accepted baselines. Package releases that change templates must update their catalog revision, template hashes, and explicit predecessor identities in `scripts/profile-history.json`. Its historical bytes include exact source commits and hashes. The catalog's `sourceCommit` records its historical origin, not proof of current template bytes. Runtime does not invoke Git.

### Editing bundled profiles

After editing `definitions/pstack-*.md`, run `npm run profiles:refresh`, then `npm run check` and `npm test`. Include the definitions, `scripts/profile-history.json`, and `PORT-MANIFEST.json` together in the change. Do not hand-edit template hashes or reuse a revision for different catalog identities.

The refresh command deterministically updates hashes, advances the `profile-sync-N` catalog revision only when templates or required lineage change, preserves committed profile bytes with exact source commits, records explicit predecessor identities, and runs the existing manifest refresh. Repeating it without profile/lineage changes does not advance the revision; unrelated edits only refresh manifest hashes. The initial lineage repair includes both shipped `profile-sync-2` identities. Package version (`package.json`) is separate from the profile catalog revision.

`npm run check` rejects stale template hashes and divergent same-revision identities against available Git catalog history, including after committing. Changed-profile refreshes require the source Git checkout; no-Git packages can validate and perform an unchanged refresh without Git. Extracted packages never consult an enclosing repository. Shallow history limits lineage evidence to available catalog commits; use full history when authoring releases. This authoring mechanism does not deploy profiles or weaken runtime holds.

The concurrency guarantee covers cooperating synchronizers. An external editor can still race between the final content check and rename. Do not edit profiles concurrently with startup reconciliation. Restart Pi after reported changes to ensure discovery; no same-session roster refresh is promised. There is no routine update command or manual file carry-over between releases.

| Role argument / definition | Purpose | Native tools |
|---|---|---|
| investigator / pstack-investigator | Local evidence | read, grep, find, ls |
| how-explorer / pstack-how-explorer | Deep how exploration | read, grep, find, ls |
| poteto-agent / pstack-poteto-agent | Feature/refactoring implementation | read, grep, find, ls, bash, edit, write, exec_command, write_stdin, exec, wait, notebook, new_context, history, notes |
| bug-fix / pstack-bug-fix | Bug-fix implementation | same as poteto-agent |
| perf-issue / pstack-perf-issue | Performance implementation | same as poteto-agent |
| hillclimb / pstack-hillclimb | Intensive optimization | same as poteto-agent |
| reviewer / pstack-reviewer | Fresh independent review | read, grep, find, ls |
| researcher / pstack-researcher | External-source evidence | read, grep, find, ls |
| verifier / pstack-verifier | Authorized behavioral checks, Astra | read, grep, find, ls, bash, exec_command, write_stdin, exec, wait, notebook, new_context, history, notes |
| verifier-sol / pstack-verifier-sol | Authorized behavioral checks, Sol | same as verifier |
| advisor / pstack-advisor | Design, decisions, synthesis | read, grep, find, ls |

All templates are leaves and enable ordinary extension discovery (`noExtensions: false`), while native skill discovery remains disabled. Their model/thinking pins follow `~/.pi/agent/pstack/models.json` as configured when these templates were authored; that file is not read at runtime. Verifier and researcher pins are inferred defaults because the policy lists neither role. Herdsman's mandatory infrastructure remains. Supply needed evidence/skills through files. Extension tools still need to be listed in a profile's `tools` allowlist to be callable: the researcher can read supplied source snapshots, but its default allowlist does not include web tools. Loaded extensions can run handlers even when their tools are filtered, so tool lists are not extension sandboxes.

## Artifact locations

[Artifact locations](config/artifact-locations.md) is the central model-readable configuration for Orchestrate, Pause safely, and Show me your work. It defines project-local defaults and path precedence, not runtime-enforced settings or Herdsman session/result storage.

## Deliberate limits

Read the [runtime contract](skills/poteto-mode/references/herdsman-runtime.md) before delegation.

- Model/thinking selection lives in actual definitions. No automatic task model pools or per-request model fields. Record model overlap; distinct-model reviews require explicitly prepared distinct definitions.
- Results arrive asynchronously. No wait/join/collection calls or progress polling. End the turn when only dependent work remains. Forward exact result refs in files. Continue related work by exact returned session, never a live label.
- No managed worktree/cwd option. Prepare external worktrees explicitly and start separate lead sessions for isolated checkout work. Otherwise use genuinely disjoint output paths and one writer per boundary.
- Reporting rubrics are preserved, not backend-enforced JSON schemas.
- Managed-agent controller suppression uses Herdsman's documented active_agent system-prompt metadata via Pi getSystemPrompt, not user text or a guessed environment variable.
- Long-program playbooks retain their intent, but leaf phases return to the lead for dependent review. External schedulers require separate authorization.

## Validation

```sh
npm test
npm run check
node scripts/check-host.mjs /path/to/installed/pi-coding-agent /path/to/installed/pi-herdsman
```

Host checks load the extension and skills without inference or delegation. See [VALIDATION](VALIDATION.md). No remote, publish or install step is included.
