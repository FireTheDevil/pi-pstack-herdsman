# Herdsman runtime

Load once per active context when delegating. This adapter targets pi-herdsman >=0.25.1 <0.26.0 and Pi >=1.1.0 <1.2.0. Use Herdsman's nine managed-agent tools listed below, not a package scheduler or a new orchestration engine.

## Definitions and models

On ordinary Lead startup, the extension reconciles `pstack-*.md` templates with global `<agent-dir>/agents/` profiles (`~/.pi/agent/agents/` by default, `$PI_CODING_AGENT_DIR/agents/` when set). Safe package description and whole-body-core changes propagate automatically. Installed configuration, model/thinking, formatting and omissions remain user-owned. Conflicting edits and package capability changes hold the whole affected profile. Legacy body-core matches can establish a compatible baseline with exact shipped evidence; this does not prove original installed header ancestry. State and retained backups live outside discovery under `<agent-dir>/pstack-profile-sync/`. Successful synchronization retains the current baseline and one latest completed transaction per profile, then permanently deletes older completed records through recoverable cleanup staging. Incomplete or unresolved records remain available for recovery. Held or failed synchronization skips pruning. Unsafe or ambiguous cleanup evidence reports failure without hiding successful profile publication or restart guidance. See [automatic synchronization](../../../README.md#automatic-profile-synchronization) for parsing, concurrency and recovery limits.

Startup does not check provider/model availability, change settings, grant trust, or mutate running agents. There is no install hook; `pi install` alone does not synchronize until a session loads the extension. Restart Pi after reported profile changes and call `list_agents` when resolving the effective roster, not as a progress poll. Same-session refresh is not promised. `/setup-pstack [role]` remains an optional confirmed project copy command, but a same-name global profile wins over it.

Herdsman precedence is bundled < trusted project < global. A same-name global definition overrides the project, including tools and model. Unknown fields and malformed definitions fail discovery, not silently fall back. Inspect effective definitions before assigning work. Skill and extension paths in definitions pass unchanged, so use absolute paths for explicitly authorized additions.

Model and thinking are definition fields. Templates pin the user's `pstack/models.json` policy as authored; that file is not read at runtime. Setup checks the pinned model in the authenticated registry without fallback. There is no per-request model pool. Select the role by task and actual capability, then check the effective definition:

| Role | Use | Pinned model / thinking |
| --- | --- | --- |
| `pstack-poteto-agent` | Feature and refactoring implementation | Sol / medium |
| `pstack-bug-fix` | Root-cause bug-fix implementation | Sol / high |
| `pstack-perf-issue` | One-off measured performance fix | Astra / medium |
| `pstack-hillclimb` | Iterative metric optimization | Luna / max |
| `pstack-investigator` | Local code and supplied source evidence | Luna / max |
| `pstack-how-explorer` | Complex how/architecture exploration | Luna / max |
| `pstack-researcher` | Supplied external-source evidence; live research requires authorized tools | Sol / medium |
| `pstack-advisor` | Read-only design and synthesis | Sol / medium |
| `pstack-reviewer` | Independent read-only judgment | Sol / low |
| `pstack-verifier` | Behavioral checks, especially Sol-authored work | Astra / medium |
| `pstack-verifier-sol` | Behavioral checks independent of Astra-authored work | Sol / medium |

Verifier and researcher pins are inferred defaults because the policy lists neither role. Arena/architect candidate pools and interrogate/reflect diversity are intent, not automated selection. To require multiple models, explicitly prepare additional discovered definitions with different available models and inspect their effective configuration. Otherwise disclose independent-session attempts with model overlap. Never invent availability or silently substitute. The 0.15.5 upstream Cursor budget/model rule does not configure Pi; edit the selected definition's model/thinking after checking availability.

## Delegate and hand off

The following is a JSON request to `delegate_agent`. Replace the example assignment and evidence paths with a complete authorized brief.

```json
{
  "definition": "pstack-investigator",
  "label": "parser-evidence",
  "task": "Inspect the parser flow without edits. Scope is src/parser.ts and its tests. Return entry points, evidence for the reported parsing defect, uncertainties and relevant test commands.",
  "files": ["src/parser.ts"]
}
```

Accepted `delegate_agent` inputs are definition, task, optional files and label. Do not pass action, fork, timeoutMs, model, thinking, tools, schema, cwd, worktree, runner or recursive fields. Labels must match `^[a-z][a-z0-9_-]{0,31}$`; live-label collisions fail. Startup uses Herdsman's configured timeout; it does not budget the task's execution. Managed agents' direct Pi built-in bash/powershell calls without an explicit timeout default to 600 seconds; an explicit timeout is preserved.

Include objective, scope/non-goals, exact paths, authority, acceptance/validation, dependencies, and expected handoff. Evidence files do not grant runtime capabilities. For implementation assignments, supply the absolute Poteto mode SKILL.md path and applicable principle leaf paths through `files`. Require the worker to read them in full before implementation and report missing or unreadable required files to its owner. Controller workflows and dependent phases remain lead-only. Keep `noSkills: true`, tool allowlists, model pins, and `agents: []` unchanged. For other assignments, attach needed skills only if unavailable to the definition; do not attach instruction files merely because they exist. Put coordination artifacts under project-local `.pi-herdsman/`, with one current artifact per objective. Reports preserve task rubrics and concrete evidence; no backend JSON-schema enforcement is claimed.

Launch genuinely independent assignments, then do necessary independent lead work. Results arrive asynchronously. There is no wait/join/collection call. No sleep or status polling loops. When only dependent work remains, end the current turn and yield without a final synthesis. Integrate every required completion or report missing coverage before concluding.

Delegate and continue return startup evidence, not completion. Each generation owns one assignment; its terminal result is delivered once, then the live agent is cleaned up while its saved Pi session remains available. Preserve each exact returned completion ref, such as `result:researcher#1` or a supplied canonical `result:<request-id>`, and pass it unchanged through `files` to dependent assignments, rather than copying summaries. Reusable direct-agent refs resolve against the calling session's current branch. Files are explicit per-message evidence, not inherited caller context or runtime capability.

A fresh independent review always uses `delegate_agent`, not continuation. For genuinely continuing work, use `continue_agent` with `session` (the exact returned Pi session path or full UUID), `task`, and optional `files`. It creates a new generation, never a second assignment for a live agent. The saved session supplies cwd, history and definition identity; current configuration must still enable and authorize that definition. Explicit definition model/thinking fields override saved settings. Continuation inherits the saved logical label; occupied labels or conflicting session representations fail closed. Never guess a session from a live label. A retired session requires fresh delegation with its result evidence.

## Ownership, controls and recovery

`list_agents` accepts only `{}` and returns the effective roster and visible owned generations. Use it for materially needed live state/ownership or a roster refresh, not progress polling. Live controls use the exact returned `agent` label and only currently listed `available_tools`; eligibility is a snapshot and every invocation revalidates it. Delegate/continue are controller tools, not listed controls on a live agent.
- `steer_agent` takes `agent`, required `message`, optional `files`; it queues a non-preemptive correction for an execution boundary, not a status request.
- `interrupt_agent` takes the same fields; it cancels the working Pi operation, supersedes undelivered steering, and continues the same assignment with replacement instructions.
- `reply_agent` takes the same fields and answers only a valid correlated pending `ask_owner` question.
- `close_agent` takes only `agent` and destructively abandons an eligible directly owned generation. Closing a delegating parent cascades child-first; unknown identity remains non-actionable.
- `inspect_agent` and `read_agent_transcript` take only `agent`. Inspect returns bounded live terminal/process evidence; transcript returns bounded persisted Pi conversation/tool evidence, not raw reasoning or live process state. Transcript requires a materialized non-empty session file and may be eligible for proven lost agents. Neither is a progress-polling tool.

For stale attention, use supplied evidence first; if insufficient, perform at most one bounded diagnostic read. Do not repeat reads solely for the same stale reminder. An unchanged stale episode means queued steering has not crossed an execution boundary. Wait only while evidence supports legitimate long-running work; otherwise use an eligible interrupt rather than repeated steering or polling.

Every action revalidates ownership and state. Own only direct agents. Inactivity is advisory, not proof of loss. Handle required attention before yielding. A lost assignment is unresolved, not a completed failure: preserve physical/session identity and cleanup evidence, follow currently available recovery actions, and do not silently replace it. On result persistence errors follow the recorded nextAction and resolve the mailbox before closing and replacing. Do not conclude while unresolved work can still progress or requires your control.

All eleven templates are leaves (`agents: []`). The lead dispatches reviews and other dependent workflow steps. Herdsman supports lead -> delegating agent -> leaf when explicitly configured, but this package does not create delegating roles or authorize deeper nesting. A leaf reports missing capabilities or asks its owner instead of trying to run a controller workflow.

## Tools and child identity

Investigator, how-explorer, reviewer, researcher and advisor allow only read, grep, find and ls. All four implementation profiles also allow bash, edit and write; both verifiers also allow bash. These six profiles allow exec_command, write_stdin, exec, wait, notebook, new_context, history and notes for the installed Codex adapter's Notebook Mode with local context management and nested shell calls. The read-only profiles intentionally do not enable that adapter: exec would grant shell access. Bash, exec and exec_command can mutate and require task-specific authorization. Templates set `noExtensions: false` for ordinary extension discovery and `noSkills: true` for native skills, retaining mandatory Herdsman infrastructure including ask_owner. An allowed tool name such as notebook is callable only if an installed extension actually registers it in that child session. Extension handlers may run even when their tools are excluded; tool allowlists are not extension or OS sandboxes. Supplied files do not add tools. Researcher can inspect supplied external-source snapshots, but live web/MCP research requires authorized definition customization to allow the verified tool names; otherwise report blocked.

Herdsman's documented agent-definition schema, Runtime prompt order, appends `<active_agent name="definition"/>` to the effective system prompt as interoperability metadata. The extension reads Pi's `ctx.getSystemPrompt()` to suppress controller activation and setup in managed agents, even if branch state says on. It does not derive identity from user input, argv, or an invented environment variable. This suppression is UX, not a security boundary. Revalidate on backend upgrades.

## Isolation and long-running workflows

Fresh delegates use the controller cwd. There is no managed-worktree or request-cwd option. For competing code candidates or different branches, explicitly authorize and prepare external worktrees, then start separate lead sessions in those worktrees and transfer evidence manually. Alternatively use disjoint output-only paths in the same cwd when genuinely safe. A path in a brief does not isolate processes. One writer per worktree or file boundary; isolate ports/services/outputs too. Do not launch overlapping writers under the fiction of automatic isolation.

Orchestrate/autopilot playbooks express workflow intent, not automatic fleet support: scope leaf assignments to a bounded phase, return to the lead for review/dependent steps, and use separate leads for isolated checkout work. Retain worktrees until inspected and integrated or explicitly discarded. This adapter never cleans them.

CI/ref watching can be an authorized verifier command. Unattended periodic work requires an explicitly authorized external scheduler; agent completion is not a timer. The package changes no approvals, auth, compaction, host settings or backend limits.
