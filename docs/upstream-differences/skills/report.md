# Whole-slice skill fidelity audit

> Durable audit record for local `45607d3d895f63d6deccc3933f742d258d6b384e` and upstream `c742dd61706fbacc1b95f1a20b7b988cf096ce6c`. Lane-local F IDs map to the stable IDs in the [overview](../README.md).
>
> Scratch exports, full diffs, quotation dumps, scripts, logs, approval trails, and checkpoint paths named below are historical local evidence, not retained dependencies. Treat them as unavailable after scratch cleanup. Preserved ledgers and report quotations remain in this directory. Historical commands below are audit records, not installed commands. This copy does not claim those raw artifacts are shipped.


## Outcome: completed source audit; semantic divergences remain

Compared local **45607d3d895f63d6deccc3933f742d258d6b384e** with Cursor pstack **0.15.36 / c742dd61706fbacc1b95f1a20b7b988cf096ce6c**. This is an audit, not a fix or runtime certification. No tracked writes, installs, tests authored, network calls, publication, or delegation occurred.

**399 owned paths:** 26 identical; 33 justified adaptations; 23 unexplained divergences; 2 local-only; 315 upstream-only. The latter includes **314 non-executable Statechart test fixture resources** and one missing skill, `make-bot-ui`. There are **84 local paths** in this slice. Counts deliberately include reference data, not just SKILL.md files.

The main actionable issues are reduced Arena candidate explanations, Arena/Architect's added permission gate on attempt count, and Sharpen's suppressed four-part framing. These are source-contract differences, not claims that a model demonstrably failed. No help-like malformed shell recipe was found in this owned prose.

### Original scratch artifacts

- `coverage.md` / `coverage.json`: every owned path, classification, complete source ranges, explanation, latest local modifying commit.
- `evidence.md`: exact local/upstream quotations with individual source line numbers for every changed operative block; identical-file statement and representative quote; omitted fixture opening quotes and complete ranges.
- `full.diff`: complete unnormalized diff, including omitted resources.
- `local/skills/**`, `upstream/skills/**`: immutable compared bytes copied into audit scratch.
- `source-verification.json`: 397 upstream files byte-verified against the pinned Git object, **zero mismatches**.
- `compare.py`, `verify-source.py`, `report.py`, `check-links.py`: rerunnable inventory/evidence checks and ledger generation. They write only this scratch directory.
- `link-check.json`, `final-status.txt`, `checkpoint.md`: bounded structural check, clean tracked status, task recovery.

## Scope and classification rules

Owned: all `skills/**` prose and non-executable resources, excluding all `skills/poteto-mode/**` and `skills/poteto-help/**`. Includes Statechart reference prose and non-executable test `.md`, `.mmd`, `.dot`, `.out`, `.exit`, `.cfg` resources. Excludes executable scripts, `.ts`, Java, TLA model programs, package/runtime metadata, and sibling repository documentation/agents as audit targets. The upstream `agents/comment-sicko.md` was read only to identify a relocated rubric. Broader guide-tree omission belongs to the documentation/provenance owner; no guide audit is claimed here.

“Justified adaptation” means actual platform translation or a constraint supported by the supplied assignment/global policy (authorization, no unapproved installs/global changes, no leaf spawning, model pins/tools supplied by definitions), not byte equivalence. It also includes semantically equivalent rephrasing and two demonstrably correct TypeScript example clarifications. Where a file has both justified changes and an unexplained substantive change, the latter determines its classification. “Unexplained” does **not** mean necessarily accidental or harmful: it means host necessity or direct owner preference for that difference was not established. Historical alignment reports establish intent to retain, but not independent approval. `upstream-only` / `local-only` retain their path classification even when omission/relocation has a known explanation.

All files were compared from local Git objects rather than a potentially dirty worktree. The upstream export is **not a separate Git repository**: running `git -C <export> rev-parse HEAD` finds the containing local repository, not upstream identity. Instead, all 397 owned upstream files were verified against `.pi-herdsman/port-0.15.34/upstream.git` with `GIT_NO_LAZY_FETCH=1`. No implicit partial-clone hydration was allowed.

## Prioritized findings

### F1 — P2: Arena candidate rationale loses alternatives and rejected options

- Upstream `skills/arena/SKILL.md:22`: “a short rationale naming the alternatives it considered and what it rejected.”
- Local same path `:24`: “Include a short rationale request.”
- Consequence: a candidate can satisfy the local contract with a short justification that says nothing about alternative shapes or rejected options. That removes information the picker/grafter needs. Async result delivery and read-only output handling do not require deleting these particulars.
- Introduction: local `087fcd7` (initial adapter); literal local wording present from that commit. This is inherited, not introduced by .36. Architect's separate rationale template preserves its richer design contract; generic Arena remains weaker.
- Suggested disposition: restore the two required rationale contents without changing host dispatch.

### F2 — P2: Arena/Architect forbid adaptive extra attempts without a user request

- Upstream `skills/arena/SKILL.md:17`: “Spawn more runners when the arena covers multiple design directions.”
- Local `skills/arena/SKILL.md:19`: “Use two independent attempts by default. Expand the attempt count only when explicitly requested.”
- Local `skills/architect/SKILL.md:31` repeats that restriction; upstream `:31` takes runners from the role configuration rather than imposing this user-request gate.
- Consequence: an authorized design exploration with several viable directions may not expand beyond two unless the user anticipated that count. Definition-owned model pins explain replacing the Cursor pool, not this separate gate. Local Exhaust the Design Space still says “build 2-3 competing prototypes or sketches” (`:11`).
- Introduction: `b58c238` explicitly added the two-attempt/explicit-request wording while replacing a four-attempt default. Its commit message calls this preservation/restored fidelity. `docs/upstream-alignment-0.15.17.md:172` says these counts were already present. Neither is a direct user preference record.
- Suggested disposition: obtain/locate the actual count-policy decision or classify it openly as product policy; otherwise retain upstream adaptive expansion.

### F3 — P2: Sharpen silently replaces visible framing with rewrite-only output

- Upstream `skills/sharpen/SKILL.md:7–14`: “Before rewriting it, do four things”; “Say what a top professional ...”; “Name the rawest material ...”; “Name the specific methods and tools ...”; “Say what ... would show the result is right”; “Then rewrite my prompt to ask for exactly that.”
- Local `:11`: “Before rewriting, work through these four questions”; `:20`: “Return only the rewritten prompt. Do not narrate the framing”.
- Consequence: local explicitly suppresses an observable part of the upstream instruction. Not executing the underlying task is faithful; forbidding explanation of the four judgments is an additional choice. The upstream wording may allow concise framing, but does not say to suppress it.
- Introduction: `93f6575`, port .15.30. `docs/upstream-alignment-0.15.30.md:17` describes “Return only the rewrite” as the intended adaptation, not source evidence that upstream requested it.
- Suggested disposition: resolve the desired presentation with the owner; do not silently call rewrite-only output equivalent.

### F4 — P2/P3: TypeScript skill's applicability is narrowed beyond a tool/path adaptation

- Upstream `skills/typescript-best-practices/SKILL.md:3–4`: “Use when reading or editing any .ts or .tsx file.” and `paths: ["**/*.ts", "**/*.tsx"]`.
- Local `:3`: “Not for ordinary read-only navigation or explanation.”; `:11`: “Reading a TypeScript file to locate a symbol, trace execution, or explain behavior does not trigger this skill.”
- Removing an unsupported `paths` selector is a host adaptation. Explicitly excluding read-only explanation is a semantic policy choice. The rest of the rule table remains intact. Both files are hidden (`disable-model-invocation: true`), so this is applicability guidance after explicit inclusion/routing, not proof of automatic discovery behavior.
- Introduction: `087fcd7` (initial adapter), not a .36 regression. No direct user evidence for this narrower scope was recovered.
- Suggested disposition: document/confirm this as local reading-cost policy or restore the wider applicability sentence.

### F5 — P3: Build the Lever drops a mandatory shared contract artifact

- Upstream `skills/principle-build-the-lever/SKILL.md:17`: “write the lever as a skill they all read: the recipe, the verification contract, and the do-not-touch fences in one artifact.”
- Local `:17`: “give each the recipe, verification contract, and do-not-touch fences as evidence. Create a shared skill only if the recipe is reusable”.
- The local still requires evidence/fences, but no longer requires one shared immutable skill artifact for a non-reusable delegated recipe. Read-only leaves cannot write; an authorized lead still can. That explains the adjacent read-only exception (`:18`), not making the shared contract optional.
- Introduction: `a405767`. Suggested disposition: record as deliberate artifact policy or restore one shared contract without requiring executable capabilities in leaves.

### F6 — P3: retained upstream-pruned instruction expansions are widespread, not necessary Pi adaptations

This is not a new corruption claim. Earlier upstream text was intentionally retained, but the current target is thinner. The 17 affected retained-expansion files are individually marked in the ledger (principles, How explorer, Why source guides, technical-writing, TDD, Unslop, Figure it out and Blast radius). Exact additions are all reproduced in `evidence.md`.

Concrete examples:

- Upstream `principle-exhaust-the-design-space/SKILL.md:9` only says “It also applies to product design decisions where user experience depends on feel, not logic.” Local `:9–21` adds the 2–3-prototype rule and applicability/exemption lists.
- Upstream `principle-encode-lessons-in-structure/SKILL.md:9` says “If the lesson needs judgment and cannot be encoded, make the instruction more prominent and add an example of the failure mode.” Local `:9–28` retains mechanism ranking, brain-note/skill/lint/principle routing and three anti-patterns.
- Upstream `why/references/sources/slack.md:8–10` has author/PR/error searches; local `:21–33` additionally specifies keyword search, five channel classes, and whole-thread traversal.
- Upstream `principle-prove-it-works/SKILL.md:12–16` gives direct-observation checks; local `:12–26` additionally prescribes build/run/full-chain/integration and delegated-artifact inspection. The user supplied this exact local file as audit evidence, not an explicit instruction to revert it.
- Local `technical-writing/SKILL.md:108–119` adds the eight-item review checklist absent from the target's end at `:106`.

For nine of these files (four principles, How explorer, four Why guides), upstream commit `08bd59b` **0.15.19** expressly removed the sections (`refactor(pstack): cut unneeded sections from seven skills (#571)`; actual diff covers the listed resources). Local retention is claimed by `.25` alignment `:37` and the lock's review history. This is evidence of deliberate divergence, not proof the user wanted every retained sentence. Other expansions predate current .36; per-path last-changing commits are recorded without pretending they identify first introduction.

Suggested disposition: preserve useful guidance if the owner wants it, but list these as named local customizations rather than “necessary Pi adaptation”. No blanket deletion is recommended. The instruction payload and additional work obligations are real; downstream quality effects were not measured.

### F7 — P3: Reflect description tuning loses upstream's validation loop

- Upstream `skills/reflect/SKILL.md:57`: “hand to `create-skill` and run its description-optimization loop.”
- Local `:53`: “Narrow the description to the phrases that should trigger it. Do not add unknown frontmatter keys.”
- Local substantive/new-skill routes still name the bundled authoring playbook (`:52,54`), but description tuning does not ask for an optimization/test loop. Replacing Cursor's built-in is necessary; replacing validation with a single narrowing instruction is not inherently necessary. Hidden invocation policy makes automatic-trigger tuning inapplicable to hidden skills; local reviewer templates correctly say it cannot enable automatic invocation. For other catalog-visible target skills the lost loop still matters.
- Introduction: `087fcd7`. Suggested disposition: explicitly scope the tuning contract to permitted visible skills and preserve available validation, or document why the loop is intentionally excluded.

## Omissions, additions, and checked adaptations

### O1 — upstream-only make-bot-ui

`skills/make-bot-ui/SKILL.md` is wholly absent locally (upstream 1–115). Upstream `:3–6` triggers on a custom UI that wakes a Grok Bot over a webhook and Tailscale exposure; `:15` says “Call `update_state` with target `routine` and action `create`”; `:41` says “Do not accept the sender key in chat. Send a secret-request, then stop.” The resource also defines exact auth headers, one POST/no retry, failure-log draining, tailnet setup and untrusted webhook handling.

Material loss: this port does not offer that end-to-end bot-UI workflow or its credential-handling recipe. This is not quietly equivalent to another shipped skill. The lock's .15.9 history records “make-bot-ui excluded by user and unavailable capabilities”; this is a provenance **claim**, not a retrieved user message. Cursor-specific `update_state` / `SendToUser` affordances are real in the source and not supplied by the assignment host, providing concrete host-exclusion evidence. Do not port automatically.

### O2 — local-only Deslop

`skills/deslop/SKILL.md:9` says “Check the diff against main and remove AI-generated slop introduced in the branch.” `:13–17` targets comments, defensive catches, `any`, nesting and inconsistent style. No same-path upstream .36 skill exists. This is code cleanup, distinct from upstream Unslop's prose cleanup. Introduced with initial adapter (`087fcd7`); whether it was inherited from an intermediate rather than newly invented is outside the verified target comparison.

### O3 — local-only comment-reviewer is a relocation

`skills/no-comments/references/comment-reviewer.md:1–27` is not missing upstream behavior: its source counterpart is `pstack/agents/comment-sicko.md:7–33`. Legal/external/API/issue-link exceptions, suppression judgments, `MUST KILL`, and exact opening reply survive. Local `:21` replaces recursive `/how`/`/why` execution (upstream `:27`) with direct read-only inspection and owner escalation. Necessary leaf/profile adaptation; path remains local-only in the ledger. This supplementary source mapping does not audit the sibling agent layer.

### O4 — 314 upstream-only Statechart fixture resources

All omitted resource paths are enumerated, not reduced to a directory placeholder. They include 33 `report.md` examples, Mermaid charts, graph DOT, TLC/SANY outputs, exit statuses and cfg inputs. The omission removes shipped worked reference evidence for constraints, deadlock, initial-state checks, failed evaluation, graph budgets and shortest paths. Example upstream `skills/statechart/scripts/test/corpus/Counter/report.md:7`: “TLC checked Low only in the initial states, because it has no [], <>, or ~>. List it as an INVARIANT to check every state.” The skill's operative `Write the spec` guidance retains the initial-state/property distinction, so no runtime workflow omission follows just from this fixture omission. Test-tree nonshipment is explicitly claimed in .30/.34 alignment reports. These are fixture examples, **not live proof**; executing their associated programs belongs to the executable owner.

### Important preserved semantics

- **Interrogate:** working-tree scope, executed repro evidence, lead rerun, intent violation gate, shared-root-cause merging, all findings retained and no automatic fixes. Current .36 local adds explicit blocked-coverage reporting and no unauthorized writes; it does not substitute opinion-based review. No obsolete owned rubric files remain.
- **Arena:** task-only candidates/judge-only rubric, cross-family judge preference and disclosed missing diversity, read-every-candidate, graft and verify all survive. Do not confuse F1/F2 with a total loss of Arena.
- **Ketchup-video:** slide count/layout and factual content, burned subtitles, three added words/second, changed-label word counting, fully visible holds and frame-matching inspection all survive. Output directory/install/player approvals and no assumed inline playback are policy/platform adaptations, not upstream requirements.
- **Statechart:** invariants versus temporal properties, traces, shortest violation paths, report/log handoff and 500-state chart budget survive. Automatic TLC/Java/Pele installation becomes blocked until approval. Exact renderer version/options/style remain. No live TLC or render certification is inferred.
- **Principles:** 12 principle leaves are byte-identical (see ledger); changed ones distinguish permission gates from retained prose. Migration/type-system discipline files really match the pinned target.
- **TypeScript examples:** predicates are trusted by the compiler and a plain numeric duration can be negative. Local corrections in `references/patterns.md` explain those facts rather than claiming the representation alone proves them.
- **Reflect/Why/Recall/How:** defined models, local tool ceilings, async results, session privacy and unavailable evidence gaps replace Cursor assumptions. Backlog external writes wait for authority. These are grounded in task/runtime constraints; not proof of live configured tool reachability.
- **Setup:** intentionally different product contract (pinned definition setup/global reconciliation rather than Cursor's model-budget wizard). Instruction comparison only; runtime implementation belongs to the executable owner.

## Validation, limitations, next action

1. Ran deterministic full path inventory and complete raw-text comparisons. Expanded inventory beyond Markdown to all owned non-executable script-test resources.
2. Byte-checked **397/397** upstream resources against the immutable target object: **zero mismatches**. Local files came from `git show 45607d3:<path>`.
3. Read every operative prose delta, preserved context in snapshot files, and checked named core workflow requirements against full skill text. Omitted fixture data was inventoried/hashed and opening/rule examples inspected, not exhaustively reinterpreted as solver correctness evidence.
4. Relative Markdown path check: **53** links; one syntactic miss is the existing literal `[...](url)` output-template placeholder in `why/references/synthesizer-prompt.md:65`, present upstream too. No broken actual relative resource target detected. Anchors and dynamic plain-text paths were not comprehensively validated.
5. `git status --porcelain=v1` empty at completion. No implementation or tracked documents changed; scratch is exclusively this directory.

No unit tests or live model/host/browser/solver/renderer workflows ran; they would not resolve the source-fidelity questions and are not certified. External approval messages were not retrieved; reports and commit messages are explicitly treated as claims. Initial adapter lineage may predate available local history; per-file latest commit is not mislabeled as introduction. No fixes proposed here should be applied without owner review.

**Next:** owner triages F1–F7, chooses which retained differences are intentional product policy, and incorporates this ledger/quotes into durable versioned difference docs. Poteto/help and executable/provenance results remain independent and are not replaced by this slice.
