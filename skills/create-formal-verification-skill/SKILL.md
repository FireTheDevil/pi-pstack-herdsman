---
name: create-formal-verification-skill
description: "Generate a project-local skill that formally verifies the code where a bug costs the most and tests reach the least, in any language, with whichever verification tool fits. Use for /skill:create-formal-verification-skill, \"model-check this race\", \"prove this invariant\", or when concurrency, retries, state machines, parsers, or unsafe code need more than tests."
disable-model-invocation: true
---

# Create a formal verification skill

A test checks the cases that someone thought to write. Formal verification checks every case in a stated scope: every order of steps in a model, every input up to a bound, or every input. This skill finds the part of the repo where that matters most, verifies one property of it, and leaves a project-local skill that lets the next agent check a change against that property. Write that skill for an agent who reads it cold, mid-change, and has never seen your work. The user must be able to trust the result and act on it without learning the verification language.

## Establish authority first

Explicit invocation permits only the assigned generation and verification scope. Read-only research stays read-only. It may return a design, not create a skill or run mutations. Check available tools and execution authority before starting. Missing tools, installation permission, or network access are blockers or reasons to return an unexecuted draft. Do not install tools automatically.

Do not change global setup, production or shared state, publish anything, or fix product code without separate authority. Use authorized disposable isolated scratch state for broken variants. Never inject a mutant into another writer's checkout or unresolved work. Preserve user edits and restore only scratch changes made by this run. If isolation or execution is unavailable, report the gap and an unexecuted draft or inconclusive result, never verified success.

## Choose the target from the code

Answer from the codebase, and ask the user only what you cannot observe. If the user named an area or a bug, start there.

A good target is a promise the code makes, where a break harms users and tests rarely reach the case that breaks it. Choose the strongest such target in the repo, not the one that is easiest to verify.

## Let the question choose the tool

Pick the tool that answers the question at the lowest cost: a model checker, a proof assistant, an SMT-backed verifier, or another tool. Whether events can happen in a bad order usually suits a model checker over a small model of the design. TLA+ is the default for that in any implementation language. Whether the code itself behaves for every input, as with memory safety, overflow, or a data-structure invariant, usually suits a verifier that runs on the code. If no verifier runs on the implementation language, disclose that gap and test the real code with generated inputs. Do not present a hand-written function model as proof over all implementation inputs. A property that must hold at every size, where a bound is not enough, can need a proof. Prefer a tool that the repo's developers can install and run, and tell the user why you chose it.

## What makes it good

- **True to the code.** Every part of the model or proof points to code that a reviewer can open. What the verification treats as one indivisible step is one indivisible step in the code. Names come from this repo.
- **Able to fail.** A check that you have never seen fail proves nothing. Show each property failing on a broken variant of the code it guards, such as a removed check or a reordered step.
- **Findings stay findings.** When the current code breaks the property, report it with the counterexample in the code's terms. Do not weaken the property or the model until it passes, and do not change product code unless the user asks.
- **Honest about scope.** Say what is verified, under which bounds and assumptions, and what is left out. A pass covers the model or the bound, not the whole system.
- **Readable without the tool.** State the property and the harm in one plain sentence each. Tell a counterexample as a short sequence of steps in the code's words.
- **Cheap to rerun.** One command, a reproducible tool version, and a run short enough that the next agent will use it on every relevant change.
- **Kept in step with the code.** Record each check's covered files and functions, and the sync commit where you last confirmed that the verification describes them. Changes to covered code after that commit require another look.

## Generate the verify skill

Write one project-local skill at `.pi/skills/verify-<area>/SKILL.md`. Use a concrete lowercase-hyphen area name. Include matching `name: verify-<area>`, a quoted description of when to use it, and `disable-model-invocation: true`. Keep supporting models and scripts in that directory. Do not overwrite existing user work. Without frontmatter, the skill never registers. From the skill alone, the next agent must be able to tell whether a change touches the verified code, run the check, tell a real bug from a modeling error, and update the verification when a change is intended. Use this repo's real commands, paths, and nouns, and leave no placeholders. Pin an exact reproducible tool version in its instructions, not this package's runtime dependencies. Give one rerun command and a concrete code-change drift trigger, such as a check of the named source files that requires model review when their content changes. Include each check's property, covered files and functions, bounds, assumptions, rerun command, and sync commit in the generated skill. Advance the sync commit only after confirming that the verification describes the code at that commit. Do not advance a blocked check. If the working tree is dirty, record the relevant differences as well. A commit alone does not identify uncommitted bytes. Content-based drift checks supplement this record. Do not add a second feature-map or maintenance framework.

## Prove it before you hand off

In authorized disposable isolated scratch state, follow the generated skill once, as the next agent would, on a change that breaks the property in the real code. Show each property failing. A broken toy model alone is insufficient evidence for a real-code property. It must catch the break. Then restore only this run's scratch change, preserve any pre-existing edits, and confirm that the check is back where it started: passing, or failing only on the findings you will report. A verify skill that was never run is a draft. If the skill misses the break or a step does not run, fix the skill or the verification, not the scratch change.

## Hand off

Tell the user what you verified, which tool you used and why, the bounds, what the check found in plain words, how to run it, and what it does not cover. Suggest a second target only if you found a close one. For later covered-code changes, point to `/skill:maintain-formal-verification-skill` and the [maintenance skill](../maintain-formal-verification-skill/SKILL.md).
