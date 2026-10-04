# pi-pstack-herdsman

Standalone **local** pstack workflow adapter for Pi Herdsman. It adds commands, 50 hidden explicitly callable skills, 23 playbooks, supporting references/scripts and eleven leaf definition templates. It does not implement orchestration. On the first lead session after loading the extension, it copies missing templates into the global Herdsman agent directory.

Original upstream is **Cursor pstack (`cursor/plugin/pstack`, as named in the request)**. The verified canonical location is https://github.com/cursor/plugins/tree/main/pstack in https://github.com/cursor/plugins. Lauren Tan's MIT license is retained. zenspc's Pi port, local Shepherdr and local Fabric adapters are intermediate adaptations, not the original upstream. See [NOTICE](NOTICE.md), [pins](upstream.lock.json) and [resource inventory](PORT-MANIFEST.json).

The resource lineage remains pinned to upstream 0.15.0. Applicable skill/workflow changes through Cursor pstack 0.15.5 were reviewed and adapted, not copied wholesale: Cursor model rules, persistent agent routing and plugin-specific actions do not configure Pi. The eleven Herdsman profiles below remain intact; the [runtime role table](skills/poteto-mode/references/herdsman-runtime.md) routes tasks by capability and pinned definition.

## Try locally

Requires Node >=24, Pi >=1.0.2 <1.1.0 and an independently configured Herdsman >=0.19.1 <0.20.0 host (including its Herdr prerequisites). This package does not install or configure them.

From a trusted target project, load this local package for one invocation alongside your existing Herdsman setup:

```sh
pi -e /path/to/pi-pstack-herdsman
```

No global Pi package installation is needed. Loading the extension (including from a trusted project or in headless mode) writes missing `pstack-*.md` profiles to `~/.pi/agent/agents/`, or `$PI_CODING_AGENT_DIR/agents/` when set. Existing files are never overwritten; later package updates do not refresh customized or previously copied profiles. There is no npm postinstall hook, so `pi install` alone does not copy profiles until the extension starts a lead session. Review the package before granting project trust or loading it explicitly.

- `/poteto-mode [task]` enables the sticky controller hint and opens the workflow. Default is off. `/poteto-mode off` disables it. Explicit decisions restore from the active session branch.
- `/pstack [on|off|status]` independently filters this package's skill catalog. Hidden skills remain directly callable with `/skill:<name>`. Status does not test backend readiness.
- `/setup-pstack [role]` remains an optional, project-only template preview/copy command. It checks model availability and requires confirmation; cancellation and headless *command execution* write nothing. A same-name global profile installed on session start takes precedence, so edit that global profile if you need to customize the effective role.

Reload/restart and inspect the effective Herdsman roster after the automatic copy. Global definitions override trusted project `.pi/agents/` definitions with the same name. Package `definitions/` are templates, not directly discovered. The copy does not grant project trust or edit settings. If a pinned model is unavailable, edit the corresponding global profile manually before delegation.

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
