---
name: why
description: "Use for 'why does X work this way', 'why we picked Y', design rationale, regressions, postmortems, or data-backed thresholds. Discovers available MCPs and queries each evidence category (source control, issue tracker, long-form docs, real-time chat, infrastructure observability, error tracking, product analytics warehouse) in parallel, then returns a cited read on decisions and tradeoffs. Use how for runtime behavior."
disable-model-invocation: true
---

# Why

For Herdsman launch, discovered definitions, asynchronous results, external isolation, and tool prerequisites, read [Herdsman runtime](../poteto-mode/references/herdsman-runtime.md) when needed. Required capabilities must be available before launch.

Investigate the motivation and intent behind code. The companion `how` skill answers what the code does and how it works. `why` answers what forces led to its shape.

## Operating Posture

Operate as a **careful, cautious, and precise investigator**. Be honest about what you know vs what you're inferring. Read `references/epistemics.md` for the full confidence framework and phrasing guide. The synthesizer must follow it.

## Step 1. Understand the Target and the Question

The **target** is usually a chunk of code, a pattern, a feature, or a named design decision. The **question** is usually a design rationale, a tradeoff, a motivating edge case, an external constraint, dead code, or a broad history sweep.

If the target is vague ("why do we do it this way?" with no clear referent), make your best guess from conversation context (open files, recent edits, cursor location, what was just discussed). State your interpretation briefly so the user can redirect if you're off, then proceed.

## Step 2. Establish the Code Anchor

Build the code anchor in the lead: file paths and line ranges, key symbols, recent commits, PR numbers, and linked ticket IDs. The shipped `pstack-investigator` has no shell or `gh`. Use available authorized history commands such as `git blame -L <start>,<end> <file>`, `git log --follow -p -- <file>`, `git log --oneline -20 -- <file>`, and `git log -1 --format=%B <commit>`. If `gh` is available and authorized, fetch substantive PR bodies and discussion with `gh pr view <number> --json title,body,author,createdAt,mergedAt,labels,closingIssuesReferences,comments,reviews`. Pass snapshots to investigators; label unavailable history as a gap.

## Step 3. Spawn Parallel Investigators (default posture)

**Default to parallel investigation of reachable evidence.**

### Discovery

Before spawning investigators, list the available MCP tools in this Pi session. Use the available-tools map when present. Otherwise inspect the project and user Pi MCP configuration for enabled servers.

Map each available MCP to one evidence category:

1. Source control history
2. Issue / ticket tracker
3. Long-form documents
4. Real-time team chat
5. Infrastructure observability
6. Error / exception tracking
7. Product analytics warehouse

Source control may be available to the lead through git or `gh`, but neither tool is in the shipped investigator profile. Collect history in the lead and pass relevant snapshots as files; otherwise mark history blocked. For the other six, classify using the MCP name, server instructions, tool names, and resource descriptors. If an MCP could fit more than one category, choose the one matching its primary evidence. Record ambiguous cases in the coverage map.

Aim for a complete **coverage map**, not a minimal one. Document unavailable categories as gaps; a tool visible to the lead is not automatically available to a child.

Launch separate `agent_delegate` assignments only for categories whose evidence files or verified tools the selected definition can actually access. Collect every attributed completion before synthesis. Don't ask one agent to cover multiple MCPs.

Herdsman task assignment for each source:
- Herdsman definition: `pstack-investigator` for local source-control evidence; `pstack-researcher` for web or MCP evidence. Confirm target tool availability before launch.
- Use model/thinking from the effective discovered definition. Global definitions override project definitions; there are no per-request model fields.
- Required capabilities must exist in the effective definition. Shipped investigator/researcher/advisor tools are local read-only. For shell or live MCP access, obtain explicit authorization to customize a definition with verified installed tools/extensions first, or report that evidence source blocked. There is no run allowlist request field.

Fill `references/investigator-prompt.md` for each investigator. Include the selected category playbook from `references/sources/<source>.md` using `references/source-playbook.md` as the index, the code anchor, and the user's question. If the target code is defensive, also include `references/sources/incident-postmortem.md` for queries within that investigator's own source.

Nonblocking dispatch does not grant MCP tools. Verify target provider availability first. Investigators should not write repository files.

### Investigator roster. One per available evidence category

Delegate one investigator per reachable evidence category. Each owns one supplied source or authorized tool.

Each category exposes a different kind of rationale. Record gaps and empty results as well as findings.

1. **Source control.** Implementation-time rationale in comments, tests, commits, or review. History requires supplied snapshots or an authorized shell-capable definition.
2. **Issue tracker.** Product or business forcing functions.
3. **Long-form documents.** Design rationale written before implementation.
4. **Team chat.** Deliberation that never reached a document.
5. **Infrastructure observability.** Runtime conditions that motivated timeouts, retries, limits, or circuit breakers.
6. **Error tracking.** Specific exceptions and trajectories that motivated defensive code.
7. **Product analytics warehouse.** Data behind flags, experiments, migrations, or numerical thresholds.

### When to skip an investigator

Only with an **explicit, written justification** that goes in the final Sources Consulted. Two valid reasons:

- **No accessible evidence or authorized tool is available for that category** in this environment. Flag this as a gap, not a choice. Example: "Real-time team chat skipped. No matching MCP or supplied snapshot was available, so the conversational record was not searchable."
- **The source is provably irrelevant**, not just "probably irrelevant." A high bar. Example: "Error / exception tracking skipped. Target is a build-time script with no runtime code path."

If your scope assessment suggests a single-commit trivial target where the PR description already contains the complete answer, you may answer inline only after explicitly showing why every reachable category search would be redundant across the seven categories. Availability alone does not show redundancy. Name inaccessible categories as gaps. State each redundancy determination in Sources Consulted. This shortcut should be rare.

## Step 4. Synthesize

Spawn one synthesizer background child:

- Herdsman definition: `pstack-advisor`
- Use model/thinking from the effective discovered definition. Global definitions override project definitions; there are no per-request model fields.
- Required capabilities must exist in the effective definition. Shipped investigator/researcher/advisor tools are local read-only. For shell or live MCP access, obtain explicit authorization to customize a definition with verified installed tools/extensions first, or report that evidence source blocked. There is no run allowlist request field.

Configured MCP adapters and permissions must be available in the child. Evidence files do not add capabilities. Results arrive asynchronously; end the turn and yield when only dependencies remain.

The synthesizer gets:
1. Exact returned investigator result refs through files, including null results and categories skipped with justification
2. The code anchor
3. The user's original question
4. The epistemics framework from `references/epistemics.md`
5. The synthesizer prompt template from `references/synthesizer-prompt.md`

## Step 5. Present

Present the synthesizer's output to the user. You may lightly edit for clarity or add context from the conversation, but **do not rewrite the confidence language**.

## Output Format

The structure is the one in `references/synthesizer-prompt.md`: The Question, The Code in Question, What We Found, What We Can Reasonably Infer, Competing Hypotheses, What We Don't Know, Sources Consulted, Confidence Summary. Adapt as needed, but keep the confidence separation intact, and keep Sources Consulted as one line per investigator, including the ones that returned nothing or were skipped, with the reason.

After Sources Consulted, if the user's `why` question is a precursor to changing this code, convert the lineage findings into a Preserve / Change / Avoid / Risk constraint set for planning the change.

## Common Failure Modes to Avoid

- **Recency bias**. Assuming the most recent commit is authoritative. The current shape is often the accretion of many earlier decisions. Trace back.
