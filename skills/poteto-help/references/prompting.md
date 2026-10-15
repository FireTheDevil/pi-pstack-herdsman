# Word the prompt

A prompt states the intent and the check for done. The playbook supplies the steps, so a few plain sentences beat a spec.

## Put in

- The goal. Say what is wrong or what the user wants.
- The done check. It can pass or fail. "Make it better" and a duration are not checks.
- The proof to show. Ask for the real command output, a video of the flow, the stored value, or a before and after number.
- What the user already knows. A symptom, a repro step, a log, or a link saves the agent a search.
- The real constraints. "repro first", "don't change any code yet", "zero behavior change", and "let me review before proceeding" each change what the agent does.

## Leave out

- The how. Say what to achieve, and leave the agent room to find a better way.
- A list of skills or steps. A hand-written order drops or reorders steps the playbook keeps. Name a skill only to override one choice.
- The user's theory of the cause, until the agent restates the problem. A stated guess narrows the search.

## Load the context first

- For a noisy report, ask the agent to restate the underlying issue in its own words and in plain English before it does anything else. A misreading shows up before any code exists.
- In a fresh chat, `/skill:recall` earlier work on the topic. Old chats hold context that the new agent lacks.
- Before a change to unfamiliar code, ask `/skill:how` for the mechanics and `/skill:why` for the reasons. An agent with no traced model fixes the symptom at the first plausible spot.
- Ask `/skill:teach` to make the case for a choice, as in "convince me it fixes the cause and not the symptom". A case is easier to check than a summary.

## Design before the plan

- Never take the first design. Ask for prototypes of a few options, with screenshots or videos for UI, and pick from the evidence.
- Let prototypes answer the open questions. Don't review an abstract plan adversarially, because reviewers invent risks that never happen.
- For a shared package or API, ask for the README or a tutorial first, then work back to the code. The doc becomes the target the agent checks itself against.
- Ask for the plan only after the design is settled. Each step of the plan ends in a check.

## Follow up short

- "do it", "continue", and "keep going until done" are whole prompts once the chat holds the task.
- Start with "new task" when the subject changes. Otherwise the mode treats the message as the next step.

## Before stepping away

State the authorized scope, done checks, proof, and stop condition. Name the actions that are allowed, including whether commits or publication are authorized. A request to keep going does not waive approval gates.

Use the Autonomous run trust preflight: demonstrate one successful run, provide verification and diagnostic tools, require proof and stop gates per stage, and review available transcripts for recurring failures. Authorize external worktree preparation explicitly if isolation is needed. Periodic wakeups require a real authorized external scheduler; prose is not a timer.

Keep a decision trail for later audit. If genuinely blocked, stop with evidence rather than silently widening scope.

## Make verification reusable

Use inspectable artifacts: actual command output, stored values, screenshots, videos, or profiles. Link them and distinguish checked behavior from assumptions. Build reusable verification only within write authority, and run it before calling it complete.

Design control CLIs with discoverable help, `--dry-run`, machine-readable output, and errors that say what to fix. Use repeatable seeded development state and known reset steps so another engineer can reproduce the proof. Keep evidence through cleanup and respect data-deletion approvals.

## Steer in one line

- "The goal is to reproduce. Do not fix yet."
- "Apply prove it works. Show the real output, not just the build log."
- Name a principle only when it changes a decision; its source must be read before applying it.
