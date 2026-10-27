# Selective upstream 0.15.34 alignment

## Source and scope

This is selective alignment, not full upstream parity. The baseline is `eb4db2b55b2b7dec3d9282754cddf0a56bf4ff10` (0.15.30); the immutable target is `519d36aa98955bf680db01bcde5fdfba686dc901` (0.15.34). Both canonical target plugin manifests report 0.15.34. The full commit was fetched through GitHub HTTPS, ancestry and Git object integrity checked, and the complete target exported. This establishes object identity, not signed-commit attestation. The complete delta and export are retained under ignored `.pi-herdsman/port-0.15.34/`.

The user explicitly approved replacing Statechart's architecture, with automatic provisioning removed and rendering gated on separate approval. No dependency installation was authorized or performed. Package version and host compatibility ranges remain unchanged.

## Separately authorized Ketchup-video follow-up

After the original selective alignment was committed as `f9a9fe7`, the user authorized Ketchup-video as a separate addition from the same immutable target. This supersedes only the original Ketchup-video exclusion recorded below. The new `skills/ketchup-video/SKILL.md` is instruction-only, hidden and explicit-only via `/skill:ketchup-video`; README, question-only help, exact package membership and hashed provenance now include it. No renderer, dependency, runtime handler or automatic offer is added.

The skill preserves Ketchup's last-actual-user-message window (notifications/results do not reset it), older unanswered calls, factual outcomes and text decisions. It retains at most ten connected factual slides, silent landscape video made from rendered slide frames rather than screen recording, one inspected frame per slide from the final file and at least one second per three added words. No fabricated screens, counts or completion claims are allowed. Writing requires a confirmed authorized new or empty owned directory outside the repository. Installs and external effects need separate explicit approval. Neither native model video generation nor inline Pi playback is assumed: unsupported or unverified playback gets an absolute `file://` output link and external-player guidance without launching it.

Source acceptance walkthroughs (not model/render trials): explicit invocation with authorized tools/output permits the slide workflow; ordinary Ketchup stays read-only and never auto-routes to video; missing tools/authority reports video blocked and returns human calls only; failed rendering or inspection gives a one-line explanation and only text calls, never an unchecked video; successful inspection with unverified inline playback uses the file link. Every call remains independently decidable in text even when pictured. No video rendering, frame inspection, installs or live-host checks ran for this addition. Current checks and limits are in `VALIDATION.md`.

## Statechart architecture and migration

The old eight JavaScript/model resources are retired. The replacement is a TypeScript compiler pipeline: TLC message, config, spec, DOT, value, trace and verdict frontends; graph/region/reachability/label/path passes; Mermaid, report and plain-text backends; runtime, worker, coordinator and launcher. Compiler/trace fixes in the pinned snapshot are adopted together, not reconstructed from selected intermediate commits. All executable resources except `run.ts` are exact target bytes. The runtime removes mise lookup/install entirely, requires explicit approved absolute `JAVA` and `TLA2TOOLS` paths, and adds an explicit exit-code union annotation for the existing TypeScript checker.

Migration is intentionally breaking:

- Run `scripts/statechart SPEC.tla [--config FILE] [--view FILE] [--out DIR]` on Node >=24. No npm runtime dependencies are needed. The upstream launcher also offers alternate runtimes; only the installed Node was exercised.
- Old `from-chart`, `from-spec`, `--fixed`, `--against`, `--expect-broken` and `--png` interfaces are gone. There is no chart-to-TLA helper, map scaffold or old output-folder model.
- A view exports `state`, optional `step`, `group`, `colors`, and `title`; not the old `readerActions` mapping. States may be flat, hierarchical or parallel regions.
- Read `report.md`, `chart.mmd`, `tlc.out` and any `tlc-RULE.out`; old `summary.json` and `stories.md` are gone. Above 500 states only bug paths are charted; a passing large model has no chart.
- Checking preserves TLC's verdict, then checks remaining rules with bounded reruns. Reports distinguish broken, possibly broken, and unchecked rules. Exit 0 means the original config holds, 1 a rule breaks, 2 an error, and signals have separate statuses. Output is published only for 0/1 to a new or empty folder. `--help` is not an accepted upstream flag: invalid/no arguments print usage and exit 2.

TLC 1.7.4 is the reviewed upstream dependency. No TLC or Java is bundled or automatically discovered/provisioned. The path checks are not dependency authentication. The skill preserves isolated copied inputs, trusted executable views, owned output, replay against real code before product-bug claims, finite-bound disclosure and exact evidence. Instruction gates do not sandbox direct scripts. Views and their imports execute unrestricted code; external Java processes and resource use still need authorized execution. Preserve failure/process identities before cleanup. The new coordinator stages publication and manages process cleanup, but arbitrary external writers, machine crashes, dependency behavior and filesystem durability are not certified.

Pele replaces the old npx Mermaid renderer guidance. The reference pins `pele@1.9.0`, gives size limits and light/dark CSS for group/bug/path/repeat marks. Mermaid source is the default handoff. Renderer execution and any installation/network/cache effects require separate explicit approval; no renderer is invoked by the bundled compiler. No Pele, browser, SVG rendering or visual inspection ran.

## Other selected changes

- Watch-pr requires GitHub fork identity, never treats a fork's same-named head as an upstream stack parent, and stops traversal at fork heads. Normal, queued and retry sleeps are capped at the remaining deadline. Local full-list pagination, origin binding, owner gates and bounded frontier-ready receipt remain intact.
- Orch prefers the sole open PR over historical closed/merged PRs on a branch, retaining historical anchors only when none is open. Multiple active candidates still fail closed. The local gh frontier and Origin refusal contracts remain.
- Worktree audit selects GNU or BSD stat/date flags once. It preserves path-with-spaces handling, Pi session evidence, dirty/unknown holds, origin identity and complete forge-evidence checks.
- Plan lint handles matching multi-backtick inline code spans before checking prose. Existing scheduler authority and stored-objective rules remain.
- Formal creation refers to Statechart by name without copying version-specific commands. Invocation remains explicit and scope-gated, and the text discloses the chart size budget.
- Reflect shows the exact project/global Pi skill destination before approval, copies instead of editing installed/cache resources, preserves existing-user-work and external-write gates, and does not open a PR or push.
- Swarm's upstream numbering and result-table fix needs no local edit. The local skill already has correct numbering and a result table; effective Herdsman roles, model pins and asynchronous ownership remain unchanged.
- Help and README describe the new Statechart workflow and remove obsolete chart-to-spec/comparison/PNG claims. Guide semantics are folded into those summaries rather than importing the guide tree. Claude marketplace instructions remain excluded. Ketchup-video was excluded at the original baseline and is added only by the separately authorized follow-up above.

All 925 changed repository paths were classified: 6 marketplace/plugin-manifest/CI modifications; 8 prose-skill modifications; 6 pstack README/guide modifications; 1 root vendor README modification; 2 ketchup-video additions; 4 Statechart skill/render paths; 20 poteto-mode helper/test modifications; 832 Statechart helper/tool/test/fixture paths; 46 unrelated third-party integration paths. Counts include canonical and generated mirrors. The delta has 850 additions, 53 modifications and 22 deletions. Read-only reconnaissance is retained as `result:instruction-delta#1`; the path inventory is `delta.tsv`.

## Exclusions and preserved adaptations

At the original `f9a9fe7` baseline, Ketchup-video was explicitly excluded by the user: no skill, installation, offers, help routing or resource shipment. The separately authorized follow-up above supersedes that exclusion for the instruction-only skill and its documentation/inventory integration, not renderer installation or automatic offers. Existing Ketchup remains unchanged. Generated Claude mirrors, Cursor manifests/host distributions, upstream test trees and corpora, root marketplace/CI, guides as a tree, unrelated plugins and third-party changes are not imported. Statechart's upstream package/tsconfig development metadata is not shipped; no fast-check dependency is added. Existing immutable tests and corpus are reused only in ignored/disposable validation scratch.

All eleven definitions, profiles/catalog/history/synchronizer, models/thinking pins, extension runtime, nine Herdsman APIs, tool ceilings, evidence/lease and landing authority, hidden explicit invocation, scoped .26 principles, full-swarm verification cadence and Shipping lane-result reuse remain intact. Host ranges are not widened. Pi 1.4.0 and both the supplied Herdsman 0.31.1 context and the currently observed installed 0.33.1 are outside those ranges. The host checker stops at that gate; no host files change or live-host certification is claimed.

## Instruction acceptance walkthroughs

These are source walkthroughs, not model trials or measured prompt efficacy.

| Request or condition | Required decision |
| --- | --- |
| Explicit Statechart on a trusted finite TLA+ model | Confirm scratch/output and execution authority, use approved tool paths, report bounds and paths. |
| Read-only Statechart request | Explain or draft without execution or installation. |
| No Java/TLC paths, including direct CLI invocation | Exit 2, report checking blocked, do not provision dependencies or publish checked output. |
| Untrusted view or imports | Do not execute them. Path checks do not sandbox code. |
| Image requested without renderer approval | Give Mermaid source; report rendering blocked. No automatic Pele install or execution. |
| Old agreed-chart/from-chart request | Explain the CLI migration, do not claim chart-to-spec support. |
| Large passing model | Report successful checking without promising a chart above the size budget. |
| Model reports a code bug | Replay the path against real code before claiming a product defect. |
| TLA+ formal-skill generation | Refer to Statechart by name, not copied commands; no automatic invocation. |
| Reflect targets an installed/cache skill | Show the Pi copy destination before approval, preserve existing work, edit the approved copy, no PR/push. |
| Ordinary implementation or help about setup | Hidden invocation and question-only help remain unchanged; do not select Statechart or start formal generation automatically. |

The Statechart description removes obsolete chart-to-spec and fixed-comparison promises and names TLA+ checks and shortest paths. The same cases and held-out setup-help case fit the revised description without broadening invocation. Swarm needs no description or policy change.

## Verification boundaries

Exact commands/results and retained logs are recorded in `VALIDATION.md` and `.pi-herdsman/port-0.15.34/implementation/REPORT.md`. No unit tests are authored. Existing inventory constants/fixtures are maintained, and immutable upstream suites run against scratch copies of actual ported resources. Replay fixtures do not execute real TLC and are not formal verification of implementation code. Real TLC, fast-check differential testing, Pele rendering, prompt efficacy/model trials, live forge behavior and live Herdsman operation remain unverified. No installs, global configuration, commits, pushes or PRs are performed.
