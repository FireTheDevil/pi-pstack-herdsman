---
name: setup-pstack
description: "Preview and create project-local Herdsman definitions with /setup-pstack."
disable-model-invocation: true
---

# Set up pstack

On ordinary Lead startup, the extension automatically reconciles all eleven global profiles under `<agent-dir>/agents/`. Safe package description and prompt changes propagate without an update command. Installed model, thinking, configuration, omissions and nonconflicting prompt edits remain intact. Conflicts hold the affected profile and report its evidence path. Synchronization does not check pinned model availability or mutate running agents. Reload and inspect the effective roster. To change a pinned model or thinking level, edit the global definition and reload.

`/setup-pstack [role]` remains an optional project-only copy command. Choose one of the eleven roles in the [runtime role table](../poteto-mode/references/herdsman-runtime.md): investigator, how-explorer, poteto-agent, bug-fix, perf-issue, hillclimb, reviewer, researcher, verifier, verifier-sol or advisor. The command checks the template's pinned model against the available registry, then previews the project definition and destination for confirmation. It does not prompt for a model or reasoning budget. No project writes occur on cancellation or in headless mode. Existing files are never overwritten. A same-name global definition takes precedence over a project copy; the command cannot replace it.

The optional command's destination is trusted project `<cwd>/.pi/agents/pstack-<role>.md`. Trust is granted by Pi, never by this command. Restart/reload Pi and inspect the effective agent roster before delegating. Precedence is bundled < project < global; same-name global definitions win. Malformed definitions fail discovery. Package templates are not automatically discovered until copied.

Headless extension startup still reconciles global profiles; only the interactive project setup command declines to write. Templates already pin model/thinking; change those fields in the effective global definition if the model is unavailable or a different budget is intended. The upstream Cursor `pstack-models.mdc` rule is not read by this port. See [Herdsman runtime](../poteto-mode/references/herdsman-runtime.md) for tool ceilings, async handoffs, model diversity limitations, and external worktree setup.

`/pstack-status` takes no arguments and reports Poteto Mode and skill visibility without changing state. The old `/pstack` catalog toggle is removed; historical catalog-filter decisions are ignored. All bundled skills remain hidden from automatic invocation, but direct `/skill:<name>` works. `/poteto-mode off` separately disables the sticky controller hint. Managed-agent system-prompt identity suppresses controller activation and setup.

## Optional verification guidance

These offers belong to an explicitly invoked setup skill conversation, not the runtime `/setup-pstack [role]` command. The command does not run an onboarding wizard or load these offers. In a headless or canceled flow, do not start generation or write configuration.

Check whether the project has an app-driving verification skill or another way to drive the real app. If neither exists, offer once to generate one with `/skill:create-verification-skill`. Read the [app verification generator](../create-verification-skill/SKILL.md) before starting a separately authorized generation workflow.

Separately check whether a project skill runs a model checker, proof, or code-level verifier against named code. If none exists, offer once to generate a formal check with `/skill:create-formal-verification-skill`. Explain that it checks one key property within stated bounds, not the whole system. Read the [formal generator](../create-formal-verification-skill/SKILL.md) before starting a separately authorized workflow. Missing dependencies do not authorize installation.

Declining either offer ends that offer for this conversation. Do not repeat it or offer creation when that kind of verification already exists. If covered code changed after an existing formal check's sync commit, suggest `/skill:maintain-formal-verification-skill` instead of regenerating it.
