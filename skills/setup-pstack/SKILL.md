---
name: setup-pstack
description: Preview and create project-local Herdsman definitions with /setup-pstack.
disable-model-invocation: true
---

# Set up pstack

On first lead session load, the extension automatically copies all eleven missing profiles to the global `<agent-dir>/agents/` directory. It preserves existing global definitions and does not check pinned model availability during the copy. Reload and inspect the effective roster. To change a pinned model or thinking level, edit the global definition and reload.

`/setup-pstack [role]` remains an optional project-only copy command. Choose one of the eleven roles in the [runtime role table](../poteto-mode/references/herdsman-runtime.md): investigator, how-explorer, poteto-agent, bug-fix, perf-issue, hillclimb, reviewer, researcher, verifier, verifier-sol or advisor. The command checks the template's pinned model against the available registry, then previews the project definition and destination for confirmation. It does not prompt for a model or reasoning budget. No project writes occur on cancellation or in headless mode. Existing files are never overwritten. A same-name global definition takes precedence over a project copy; the command cannot replace it.

The optional command's destination is trusted project `<cwd>/.pi/agents/pstack-<role>.md`. Trust is granted by Pi, never by this command. Restart/reload Pi and inspect the effective agent roster before delegating. Precedence is bundled < project < global; same-name global definitions win. Malformed definitions fail discovery. Package templates are not automatically discovered until copied.

Headless extension startup still copies missing global profiles; only the interactive project setup command declines to write. Templates already pin model/thinking; change those fields in the effective global definition if the model is unavailable or a different budget is intended. The upstream Cursor `pstack-models.mdc` rule is not read by this port. See [Herdsman runtime](../poteto-mode/references/herdsman-runtime.md) for tool ceilings, async handoffs, model diversity limitations, and external worktree setup.

`/pstack [on|off|status]` controls only the catalog filter. All 47 skills remain hidden from automatic invocation, but direct `/skill:<name>` works. `/poteto-mode off` separately disables the sticky controller hint. Managed-agent system-prompt identity suppresses controller activation and setup.
