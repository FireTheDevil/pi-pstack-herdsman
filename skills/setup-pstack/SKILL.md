---
name: setup-pstack
description: Preview and create project-local Herdsman definitions with /setup-pstack.
disable-model-invocation: true
---

# Set up pstack

Run `/setup-pstack [role]`. Choose one of investigator, poteto-agent, reviewer, researcher, verifier or advisor, then an authenticated model and thinking level. Review the complete definition and destination and confirm. Repeat for other roles. No writes occur on cancellation or in headless mode. Existing files are never overwritten. Edit existing definitions manually after review; there is no global setup command.

The destination is trusted project `<cwd>/.pi/agents/pstack-<role>.md`. Trust is granted by Pi, never by this command. Restart/reload Pi and inspect the effective agent roster before delegating. Precedence is bundled < project < global; same-name global definitions win. Malformed definitions fail discovery. Package templates are not automatically discovered.

For headless setup, manually review and copy selected files from package `definitions/` to the trusted project's `.pi/agents/`. Templates inherit model/thinking; add actual available model/thinking fields if needed. No inert model configuration exists. See [Herdsman runtime](../poteto-mode/references/herdsman-runtime.md) for tool ceilings, async handoffs, model diversity limitations, and external worktree setup.

`/pstack [on|off|status]` controls only the catalog filter. All 47 skills remain hidden from automatic invocation, but direct `/skill:<name>` works. `/poteto-mode off` separately disables the sticky controller hint. Managed-agent system-prompt identity suppresses controller activation and setup.
