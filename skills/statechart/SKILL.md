---
name: statechart
description: "Draw what an app's user sees as a Mermaid statechart from a TLA+ model. States are gray if they work, red if still wrong, and green if fixed. Each bug TLC finds is a numbered path. Use for /skill:statechart, \"show the PM the bug\", or to turn an agreed chart into a TLA+ skeleton."
disable-model-invocation: true
---

# Statechart

The chart shows what an app's user sees. A PM reads it to decide whether that behavior is right. Label each state with what is on the screen, such as "Paying". Label each step with what the user does or sees happen, such as "tap Pay" or "the charge goes through". Keep variable and action names out of labels. The scripts call this user the reader, as in `readerActions` and reader steps.

## Establish authority and isolate inputs

Explicit invocation does not grant installation, network, product edits, or global configuration authority. A read-only request gets an explanation or unexecuted draft. Before execution, confirm authority for the scratch and output writes, the input trust, and the tools required by the chosen command.

Copy the spec, cfg, map, imported TLA modules, mapping dependencies, and any comparison inputs into a dedicated authorized isolated scratch folder outside the repo. Work only on these copies. A mapping module and its imports are unrestricted executable JavaScript, not data. Inspect and trust them before execution. They can run repeatedly in separate processes. Do not execute untrusted mappings.

Use a dedicated output folder owned by this run. Never point `--out` at user-owned content or another run's folder. The coordinator replaces the entire accepted output folder, including prior PNGs on a later no-PNG run. Its accepted-name check does not prove ownership or preserve arbitrary user data. Direct helpers can overwrite files without the coordinator's transactional publication. The chart-to-TLA helper overwrites the source trio. `from-chart` keeps an existing TLA file, so missing companion cfg or map files require inspection rather than replacing the model.

Run `node <skill dir>/scripts/statechart.mjs --help` for commands. Resolve `<skill dir>` to this installed skill directory. Node runs the bundled helpers without npm dependencies. Actual checking requires separately provisioned Java 11 or later and an approved `tla2tools.jar`. Set `JAVA` and `TLA2TOOLS` to the approved absolute paths. The scripts do not download TLC, authenticate the jar, set a process timeout, or bound practical memory use. If dependencies or execution authority are absent, report checking blocked. Do not install them automatically.

Do not use `--png` by default. It runs unpinned `npx -y @mermaid-js/mermaid-cli`, which may download and execute packages, install scripts, and a browser runtime, and write caches. Obtain separate explicit approval for those external effects before rendering. Without it, hand off Mermaid source and report PNG rendering blocked. Never claim visual inspection from source or fake-renderer tests.

## Interpret results and preserve evidence

`from-chart` can write a missing source trio before discovering that TLC is absent. `from-spec` can write a missing-map scaffold and exit 2. Exit 2 is not a universal no-write guarantee. An invariant failure exits 1 unless exactly covered by `--expect-broken`. Do not add unexpected failures to that set to hide them. A PNG failure can publish generated files and still exit 2. Read the logs and summaries before claiming success.

Direct-input fingerprints do not cover imported modules or mapping dependencies. Preserve the copied inputs and exact command for reproducibility. Comparison with `--fixed` or `--against` is behavioral replay, not formal refinement. Hidden steps, coarse labels, and unmatched fields limit it. The finite model does not prove liveness or wall-clock timing. Do not silently reinterpret unsupported chart syntax.

A killed run can leave temporary folders, asided output, or orphan Java processes. Preserve exact paths, process identities, and failure evidence. Diagnose before cleanup. Do not blindly delete or retry a retained rollback path. Avoid concurrent runs against the same output folder.

## Pick the direction

Use `from-spec` when a TLA+ model exists or the code is concrete enough to model. Use `from-chart` when there is no model and the PM should agree on the behavior before anyone writes or changes the code.

If the code already has a TLA+ spec, start from a copy of that spec. Add the variables the user sees, and keep the spec's existing invariants. To audit the code against that spec, make the copy model what the code does, and pass the spec unchanged as `--against`. In a new spec, tie every variable and action to code that a reviewer can open, and take its name from that code. Make each action one indivisible step in the code.

## Spec to chart

1. Choose the chart's states. When the PM cares about something the screen does not show, such as a second charge while the screen still says "Paying", name the state "Paying, charged twice". Start with few states, and split a state only when the split separates two bugs.
2. Write each rule the PM agrees to as one invariant, with the PM's sentence as its comment. For a rule that applies once everything settles, define `Settled == ~ENABLED System`, where `System` is the disjunction of the actions the user does not take. Report each broken rule as a bug. Never weaken a rule to make the chart pass.
3. Run `from-spec`, then fill in the mapping file it writes. Put the labels in `state` and `step`, and list the user's actions in `readerActions` by action name. When two bugs end on the same screen through different code paths, add `cause` and make it name the code path. To color the states by what the PM cares about, such as "Toast shown", return that group from `group`. The legend names the groups, and states that break a rule still get a red border.
4. If there is an open fix, model it from the code and pass that model as `--fixed`.
5. Inspect the Mermaid source and each numbered path. If separately authorized to render, use `--png` and look at every PNG. Otherwise report visual inspection blocked. If a label reads like code, fix `state` or `step` in scratch and rerun.
6. Replay each bug's story against the real code, as a test or a live repro, one step per model action. If a bug does not reproduce, assume the model is wrong until you show otherwise. Fix the model, not the rule.

## Chart to spec

1. Draw the chart the PM agrees to. Use one region for each thing that changes independently, such as the connection and the sync badge. Add one `%% never` line per rule, with the PM's sentence. Draw "the app closes" as an edge to the state the user sees next.
2. Run `from-chart`. If a rule breaks, the agreed chart has a design bug. Take the bug to the PM.
3. Add the real code's guards and variables to the spec that `from-chart` wrote, and run `from-chart` again. For each difference it prints, ask the PM whether the code is wrong or the chart needs a correction.

## Hand off

Give the PM the Mermaid source of each chart and any authorized, inspected PNGs. Distinguish checked output, unexecuted skeletons, and blocked checks or rendering. Add one line per bug with the rule it breaks, its steps as the chart numbers them, whether it reproduced, and whether the open fix fixes it. Take every count you quote from `summary.json`. Attach `stories.md` and the command that regenerates everything. Say what the model leaves out.
