### Opening a PR

Invoked at the end of every other playbook.

**Worktree.** For isolated checkout work, explicitly authorize and prepare an external git worktree from the intended base, then start a separate lead session in that worktree. Herdsman delegates inherit the controller's cwd; there is no per-request cwd or managed-worktree option. Keep one writer per worktree or file boundary. Preserve unrelated dirty work in place. If the checkout is dirty or tangled, stop and report its state; use an authorized fresh worktree and transfer only the intended change after inspection. Never discard or reset shared work as a delegation fallback.

**Commits.** Commit liberally. Rebase into small, ordered commits before opening PRs. Each commit is a future PR. Amend when the fix belongs in a just-made commit. Make a new commit when the change is separable.

**PRs.** Run the local `/skill:deslop` skill over the diff before commit. After the implementation handoff, the lead runs `/skill:no-comments` before review. Write every PR title, PR description, and commit body with `/skill:technical-writing`, then apply `/skill:unslop`. Apply every technical-writing layer except Diátaxis. Use one word for each action, keep articles, and avoid `-ing` when a plain verb works.

**Titles.** Use Conventional Commits in the form `type(scope): subject`. Use `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, or `perf` as the type. Use the changed area, such as `pstack` or `poteto-mode`, as the scope. Keep the subject short and imperative. Name a real symbol when one carries the change. For example, `fix(pstack): retarget opening-a-pr babysit trigger`. Do not add a trailing period.

**Descriptions.** The PR body is a briefing, not the lab notebook. A reviewer who has the diff should learn why the change exists, what is out of scope, and how you proved the change works. The squash commit body is the PR body. If the body would make the squash commit longer than about 40 lines, cut the body.

Use these sections in order. Drop a section when it has nothing to say.

- `## Why`. State the intent and approach in one or two short paragraphs. Do not list SHAs or rebase genealogy. Do not add a "based on main" preamble.
- `## Scope`. Use bullets to list real symbols and paths. Name both sides of a rename or retarget. State what is in and out only when the boundary matters. Do not write a file-by-file essay.
- `## Tradeoffs`. Name only rejected alternatives that a reviewer would otherwise ask about. Skip this section when there was no real choice.
- `## Blast Radius`. In one to three sentences, name who or what the change touches and why the change is safe or risky. State the continuing cost if main stays red without the fix.
- `## Verification`. Name each real run path and its outcome. For a performance change, report one primary number with its unit in `before → after` form. Link the arena or swarm directory for the remaining evidence. Do not include sample-size methodology, swarm recitals, or metric tables.

After these sections, attach videos or screenshots when they prove a claim. Do not paste full SHAs, swarm or arena lane recitals, lever-correction essays, file-by-file checklists, or `CLEAN` verdicts. Put these details in a linked artifact. Do not use `## Summary` or `## Test plan` boilerplate. A commit body does not restate its subject.

**Forge.** Resolve the forge before the first PR operation and keep that choice for create, edit, view, watch, and merge. GitHub CLI (`gh`) is the default. If `command -v origin` succeeds and Origin can resolve the repository, prefer `origin pr ...`. If Origin is absent or cannot resolve the repository, stay on `gh` and record the fallback. Do not require Graphite (`gt`).

**Size and stacks.** Prefer five narrow PRs to one large PR. A stack is a base-branch chain. The root PR targets trunk. Each child branch rebases onto its parent's exact tip and its PR targets the parent branch. Create a child with `origin pr create --status open --base <parent-branch>` or `gh pr create --base <parent-branch>` according to the resolved forge. Retarget an existing child with `origin pr edit <pr> --base <parent-branch>` or `gh pr edit <pr> --base <parent-branch>`. Branch from trunk only for independent work. Rebase on trunk before substantial stack work.

**Readiness.** Open every PR ready, never as a draft. With Origin, pass `--status open`. With `gh`, omit `--draft`. If a PR still opens as a draft, run `origin pr ready <number>` or `gh pr ready <number>` according to the resolved forge. Run `origin pr view <number>` or `gh pr view <number>` before you refer to PR status.

**Babysit.** Opening a PR does not start a babysit. Post the URL and keep building. Finish the phase or stack first. Run a separate the Babysit playbook (`playbooks/babysit.md`) pass only when the user asks for one after the whole stack exists. A babysit for each new PR stalls the build and spends checks on commits that later waves restart. Push back when feedback drifts from intent.

**Lead-owned review.** A pstack-poteto-agent leaf implements only its authorized scope and returns the diff, validation evidence and exact completion ref to the lead. It does not launch reviewers. After the implementation handoff, the lead runs `/skill:no-comments` and `/skill:interrogate`, supplying the required review skills/rubrics explicitly through files when the reviewer definition does not already provide them. Forward the exact implementation result ref through files and keep the reviewed scope frozen. Integrate asynchronous review results before authorizing follow-up edits or PR opening; end the turn and yield when only dependencies remain. Supply any needed deslop, technical-writing and unslop instructions as explicit evidence to a leaf assigned local cleanup or PR preparation. A leaf explicitly authorized to open the reviewed PR returns the URL and evidence, then returns to its owner without starting a babysit or nested review.
