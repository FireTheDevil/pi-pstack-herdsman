# Herdsman runtime

Load once per active context when delegating. This adapter targets pi-herdsman 0.13.0 and Pi >=0.87.0 <0.88.0. Use the existing `agent` tool, not a package scheduler or a new orchestration engine.

## Definitions and models

Run `/setup-pstack [role]` to preview and confirm one project definition at a time. Eleven model-pinned templates become the `pstack-*` roles listed in the README in trusted `<cwd>/.pi/agents/`. Templates alone are not discoverable. Setup checks exact model availability and never overwrites files, installs globally, or changes live agents. Reload/restart and inspect `agent {"action":"list"}` when resolving the effective roster, not as a progress poll.

Herdsman precedence is bundled < trusted project < global. A same-name global definition overrides the project, including tools and model. Unknown fields and malformed definitions fail discovery, not silently fall back. Inspect effective definitions before assigning work. Skill and extension paths in definitions pass unchanged, so use absolute paths for explicitly authorized additions.

Model and thinking are definition fields. Templates pin the user's `pstack/models.json` policy as authored; that file is not read at runtime. Setup checks the pinned model in the authenticated registry without fallback. There is no per-request model pool. Feature/refactoring use pstack-poteto-agent (Sol/medium), bug-fix pstack-bug-fix (Sol/high), perf pstack-perf-issue (Astra/medium), hillclimb pstack-hillclimb (Luna/max); why investigation pstack-investigator (Luna/max), how exploration pstack-how-explorer (Luna/max); synthesis/design pstack-advisor (Sol/medium), judgment pstack-reviewer (Sol/low), runtime proof pstack-verifier (Astra/medium) or pstack-verifier-sol (Sol/medium) for Astra-written work. Researcher uses Sol/medium; verifier and researcher assignments are inferred because the policy lists neither role. Arena/architect candidate pools and interrogate/reflect diversity are intent, not automated selection. To require multiple models, explicitly prepare additional discovered definitions with different available models and inspect their effective configuration. Otherwise disclose independent-session attempts with model overlap. Never invent availability or silently substitute.

## Delegate and hand off

The following is a JSON request to the existing agent tool. Replace the example assignment and evidence paths with a complete authorized brief.

```json
{
  "action": "delegate",
  "definition": "pstack-investigator",
  "label": "parser-evidence",
  "task": "Inspect the parser flow without edits. Scope is src/parser.ts and its tests. Return entry points, evidence for the reported parsing defect, uncertainties and relevant test commands.",
  "files": ["src/parser.ts"]
}
```

Accepted delegate inputs are action, definition, task, optional files, label, fork and timeoutMs. Do not pass model, thinking, tools, schema, cwd, worktree, runner or recursive fields. timeoutMs budgets startup, not the task's execution.

Include objective, scope/non-goals, exact paths, authority, acceptance/validation, dependencies, and expected handoff. Evidence files do not grant runtime capabilities. Attach needed skills only if unavailable to the definition; do not attach instruction files merely because they exist. Put coordination artifacts under project-local `.pi-herdsman/`, with one current artifact per objective. Reports preserve task rubrics and concrete evidence; no backend JSON-schema enforcement is claimed.

Launch genuinely independent assignments, then do necessary independent lead work. Results arrive asynchronously. There is no wait/join/collection call. No sleep or status polling loops. When only dependent work remains, end the current turn and yield without a final synthesis. Integrate every required completion or report missing coverage before concluding.

Preserve each exact returned completion ref, such as `result:<request-id>`, and pass it unchanged through `files` to dependent assignments, rather than copying summaries. A fresh independent review always uses delegate without fork or continue. For genuinely continuing work, use `agent` action `continue` with the exact returned Pi session path or full UUID and a self-contained task plus files. Never guess a session from a live label. A retired session requires fresh delegation with its result evidence.

## Ownership, controls and recovery

Live controls use the exact returned agent label and only currently listed `available_actions`.
- `steer` changes ongoing work non-preemptively, not a status request.
- `interrupt` cancels the current operation and supplies required replacement instructions.
- `reply` answers a valid outstanding owner question.
- `close` intentionally tears down or abandons work.
- `inspect` and `transcript` are bounded read-only evidence tools, not progress polling.

Every action revalidates ownership and state. Own only direct agents. Inactivity is advisory, not proof of loss. Handle required attention before yielding. A lost assignment is unresolved, not a completed failure: preserve physical/session identity and cleanup evidence, follow currently available recovery actions, and do not silently replace it. On result persistence errors follow the recorded nextAction and resolve the mailbox before closing and replacing. Do not conclude while unresolved work can still progress or requires your control.

All eleven templates are leaves (`agents: []`). The lead dispatches reviews and other dependent workflow steps. Herdsman supports lead -> delegating agent -> leaf when explicitly configured, but this package does not create delegating roles or authorize deeper nesting. A leaf reports missing capabilities or asks its owner instead of trying to run a controller workflow.

## Tools and child identity

Investigator, how-explorer, reviewer, researcher and advisor allow only read, grep, find and ls. All four implementation profiles also allow bash, edit, write and notebook; both verifiers also allow bash and notebook. Bash and notebook can mutate and require task-specific authorization. These are native tool ceilings, not OS sandboxes. Templates set noExtensions and noSkills, retaining mandatory Herdsman infrastructure including ask_owner. Supplied files do not add tools. Researcher can inspect supplied external-source snapshots, but live web/MCP research requires authorized definition customization with verified capabilities; otherwise report blocked.

Herdsman's documented agent-definition schema, Runtime prompt order, appends `<active_agent name="definition"/>` to the effective system prompt as interoperability metadata. The extension reads Pi's `ctx.getSystemPrompt()` to suppress controller activation and setup in managed agents, even if branch state says on. It does not derive identity from user input, argv, or an invented environment variable. This suppression is UX, not a security boundary. Revalidate on backend upgrades.

## Isolation and long-running workflows

Fresh delegates use the controller cwd. There is no managed-worktree or request-cwd option. For competing code candidates or different branches, explicitly authorize and prepare external worktrees, then start separate lead sessions in those worktrees and transfer evidence manually. Alternatively use disjoint output-only paths in the same cwd when genuinely safe. A path in a brief does not isolate processes. One writer per worktree or file boundary; isolate ports/services/outputs too. Do not launch overlapping writers under the fiction of automatic isolation.

Orchestrate/autopilot playbooks express workflow intent, not automatic fleet support: scope leaf assignments to a bounded phase, return to the lead for review/dependent steps, and use separate leads for isolated checkout work. Retain worktrees until inspected and integrated or explicitly discarded. This adapter never cleans them.

CI/ref watching can be an authorized verifier command. Unattended periodic work requires an explicitly authorized external scheduler; agent completion is not a timer. The package changes no approvals, auth, compaction, host settings or backend limits.
