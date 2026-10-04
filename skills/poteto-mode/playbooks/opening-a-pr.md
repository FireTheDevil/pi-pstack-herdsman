### Opening a PR

Invoked at the end of every other playbook.

**Worktree.** For isolated checkout work, explicitly authorize and prepare an external git worktree from the intended base, then start a separate lead session in that worktree. Herdsman delegates inherit the controller's cwd; there is no per-request cwd or managed-worktree option. Keep one writer per worktree or file boundary. Preserve unrelated dirty work in place. If the checkout is dirty or tangled, stop and report its state; use an authorized fresh worktree and transfer only the intended change after inspection. Never discard or reset shared work as a delegation fallback.

**Commits.** Commit liberally. Rebase into small, ordered commits before opening PRs. Each commit is a future PR. Amend when the fix belongs in a just-made commit. Make a new commit when the change is separable.

**PRs.** Run the local `/skill:deslop` skill over the diff before commit. After the implementation handoff, the lead runs `/skill:no-comments` before review. Write every PR title, PR description, and commit body with `/skill:technical-writing`, then apply `/skill:unslop`. Apply every technical-writing layer except Diátaxis. Use one word for each action, keep articles, and avoid `-ing` when a plain verb works.

**Titles.** Use Conventional Commits in the form `type(scope): subject`. Use `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, or `perf` as the type. Use the changed area, such as `pstack` or `poteto-mode`, as the scope. Keep the subject short and imperative. Name a real symbol when one carries the change. For example, `fix(pstack): retarget opening-a-pr babysit trigger`. Do not add a trailing period.

**Descriptions.** The PR body is a briefing, not the lab notebook. A reviewer who has the diff should learn why the change exists, what it leaves out, what it could break, and how you proved it works, in under a minute. Write short, simple sentences with few identifiers. Do not write walls of text. The squash commit body is the PR body. If the body would make the squash commit longer than about 40 lines, cut the body.

Put each section under a `##` heading, not a bold lead-in, so the sections stand apart. Use these sections in order. Scope is mandatory. Drop other sections when they have nothing to say.

- `## Why` gives the problem and the approach in one to three short sentences. Do not list SHAs or rebase genealogy. Do not add a "based on main" preamble.
- `## What changed` has one to three short bullets. Name a real symbol or path only when it carries the change. Name both sides of a rename or retarget.
- `## Scope` always names what the PR covers and what it deliberately leaves out, for example a related follow-up or a known gap. Use one to three short items. Do not list symbols or paths, and do not write a file-by-file essay.
- `## Tradeoffs` names only rejected alternatives that a reviewer would otherwise ask about. Skip this section when there was no real choice.
- `## Blast Radius` gives one or two sentences on who or what the change touches and why that is safe or risky. If main is red, state the cost of leaving it red.
- `## Verification` has one to three bullets. Each bullet names a real run path and its outcome. For a performance change, report one primary number with its unit in `before → after` form. Link the arena or swarm directory for the remaining evidence. Do not include sample-size methodology, swarm recitals, or metric tables.

After these sections, attach videos or screenshots when they prove a claim. Do not paste full SHAs, swarm or arena lane recitals, lever-correction essays, file-by-file checklists, or "CLEAN" verdicts. Put these details in a linked artifact. A commit body does not restate its subject.

**Forge.** Resolve the forge before the first PR operation and keep that choice for create, edit, view, watch, and merge. GitHub CLI (`gh`) is the default. If `command -v origin` succeeds and Origin can resolve the repository, prefer `origin pr ...`. If Origin is absent or cannot resolve the repository, stay on `gh` and record the fallback. Do not require Graphite (`gt`).

**Built-in PR tool.** Prefer an actually available PR tool for operations its documented schema supports, including creation, editing, retargeting, and marking ready. Follow its instructions and tracked-state contract. Use the resolved forge for unsupported operations or when no such tool is available. Do not invent tool fields.

**Size and stacks.** Prefer five narrow PRs to one large PR. A stack is a base-branch chain. The root PR targets trunk. Each child branch rebases onto its parent's exact tip and its PR targets the parent branch. Without a supporting PR tool, create a child with `origin pr create --status open --base <parent-branch>` or `gh pr create --base <parent-branch>` according to the resolved forge. Without a supporting PR tool, retarget an existing child with `origin pr edit <pr> --base <parent-branch>` or `gh pr edit <pr> --base <parent-branch>`. Branch from trunk only for independent work. Rebase on trunk before substantial stack work.

**Readiness.** Open every PR ready, never as a draft. With a PR tool, use its documented readiness controls and verify the resulting state. Do not assume a universal draft field. With Origin, pass `--status open`. With `gh`, omit `--draft`. If a PR still opens as a draft, run `origin pr ready <number>` or `gh pr ready <number>` according to the resolved forge. Run `origin pr view <number>` or `gh pr view <number>` before you refer to PR status.

**Babysit.** Opening a PR does not start a babysit. Post the URL and keep building. Finish the phase or stack first. Run a separate the Babysit playbook (`playbooks/babysit.md`) pass only when the user asks for one after the whole stack exists. A babysit for each new PR stalls the build and spends checks on commits that later waves restart. Push back when feedback drifts from intent.

**Lead-owned review.** The selected implementation leaf (poteto-agent, bug-fix, perf-issue or hillclimb) implements only its authorized scope and returns the diff, validation evidence and exact completion ref to the lead. It does not launch reviewers. After the implementation handoff, the lead runs `/skill:no-comments` and `/skill:interrogate`, supplying the required review skills/rubrics explicitly through files when the reviewer definition does not already provide them. Forward the exact implementation result ref through files and keep the reviewed scope frozen. Integrate asynchronous review results before authorizing follow-up edits or PR opening; end the turn and yield when only dependencies remain. Supply any needed deslop, technical-writing and unslop instructions as explicit evidence to a leaf assigned local cleanup or PR preparation. A leaf explicitly authorized to open the reviewed PR returns the URL and evidence, then returns to its owner without starting a babysit or nested review.
