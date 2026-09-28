# pi-pstack-herdsman

Standalone **local** pstack workflow adapter for Pi Herdsman. It adds commands, 47 hidden explicitly callable skills, 23 playbooks, supporting references/scripts and eleven leaf definition templates. It does not implement orchestration.

Original upstream is **Cursor pstack (`cursor/plugin/pstack`, as named in the request)**. The verified canonical location is https://github.com/cursor/plugins/tree/main/pstack in https://github.com/cursor/plugins. Lauren Tan's MIT license is retained. zenspc's Pi port, local Shepherdr and local Fabric adapters are intermediate adaptations, not the original upstream. See [NOTICE](NOTICE.md), [pins](upstream.lock.json) and [resource inventory](PORT-MANIFEST.json).

## Try locally

Requires Node >=24, Pi >=0.87.0 <0.88.0 and an independently configured Herdsman 0.13.x host (including its Herdr prerequisites). This package does not install or configure them.

From a trusted target project, load this local package for one invocation alongside your existing Herdsman setup:

```sh
pi -e /path/to/pi-pstack-herdsman
```

No global installation is needed. Review project resources before granting trust.

- `/poteto-mode [task]` enables the sticky controller hint and opens the workflow. Default is off. `/poteto-mode off` disables it. Explicit decisions restore from the active session branch.
- `/pstack [on|off|status]` independently filters this package's skill catalog. Hidden skills remain directly callable with `/skill:<name>`. Status does not test backend readiness.
- `/setup-pstack [role]` selects a model-pinned role, checks exact model availability, then previews the full project definition before confirmation. Cancellation and headless execution write nothing. Existing definitions are never overwritten; no global setup option exists.

Repeat setup for the roles you need. Reload/restart and inspect the effective Herdsman roster. Definitions are discovered from trusted project `.pi/agents/`, not package `definitions/`; same-name global definitions override project definitions. Setup does not grant trust or edit settings.

| Role argument / definition | Purpose | Native tools |
|---|---|---|
| investigator / pstack-investigator | Local evidence | read, grep, find, ls |
| how-explorer / pstack-how-explorer | Deep how exploration | read, grep, find, ls |
| poteto-agent / pstack-poteto-agent | Feature/refactoring implementation | read, grep, find, ls, bash, edit, write, notebook |
| bug-fix / pstack-bug-fix | Bug-fix implementation | same as poteto-agent |
| perf-issue / pstack-perf-issue | Performance implementation | same as poteto-agent |
| hillclimb / pstack-hillclimb | Intensive optimization | same as poteto-agent |
| reviewer / pstack-reviewer | Fresh independent review | read, grep, find, ls |
| researcher / pstack-researcher | External-source evidence | read, grep, find, ls |
| verifier / pstack-verifier | Authorized behavioral checks, Astra | read, grep, find, ls, bash, notebook |
| verifier-sol / pstack-verifier-sol | Authorized behavioral checks, Sol | same as verifier |
| advisor / pstack-advisor | Design, decisions, synthesis | read, grep, find, ls |

All templates are leaves and disable ordinary extensions/skills. Their model/thinking pins follow `~/.pi/agent/pstack/models.json` as configured when these templates were authored; that file is not read at runtime. Verifier and researcher pins are inferred defaults because the policy lists neither role. Herdsman's mandatory infrastructure remains. Supply needed evidence/skills through files. Live external tools need explicit definition customization; the researcher can read supplied source snapshots without web access. Tool ceilings are not OS sandboxes.

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
