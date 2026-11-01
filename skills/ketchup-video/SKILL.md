---
name: ketchup-video
description: "Catch the user up like /skill:ketchup, with a short subtitled video of slides for what happened and the waiting calls as text under it. Use only for explicit /skill:ketchup-video."
disable-model-invocation: true
---

# Ketchup video

Follow [Ketchup](../ketchup/SKILL.md), but show what happened in a short subtitled video instead of its summary and visuals. Invoke only when the user explicitly requests `/skill:ketchup-video`; do not switch ordinary Ketchup or other catch-ups to video automatically. Its window starts at the last actual user message before this invocation, not before any earlier `/skill:ketchup`. Notifications and agent results do not reset that boundary. Include older unanswered human calls as Ketchup requires.

Writing slides, frames and the video to a user-authorized output directory outside the repository is the only exception to Ketchup's read-only rule. Confirm the destination and authority before writing; preserve existing files and use a new or empty owned directory. Do not continue the underlying task or manufacture new app evidence. Use only available, authorized rendering and frame-inspection tools. This instruction-only skill bundles no renderer or dependencies and assumes neither native model video generation nor working inline Pi video playback. Installation, downloads, network/cache effects, uploads, app launches or other external effects need separate explicit approval; invocation alone does not authorize them. If tools or authority are missing, report video creation blocked in one line and give only the human calls, including any approval actually needed. Do not install or substitute unverified output.

The reply is Ketchup's opening sentence, the inspected video, one line naming any work left that you can do yourself, and the action items as text. Embed only if inline playback is supported and verified; otherwise provide an absolute `file://` link to the existing output and tell the user to open it in an external player. Do not launch the player without approval. When the video shows a call's options, call each option by the name the video gives it. Keep every human decision self-contained in text, with Ketchup's evidence, recommendation and risk, even when the video depicts it. If rendering or inspection fails, say so in one line and give only the calls; do not present an unchecked video as ready.

## Slides

Use the screenshots, recordings, diffs, and data the work produced, not the chat's prose about them. Before you draw, write the one sentence the user should leave with and one line per slide. Drop each slide that does not change what the user knows. Use at most 10 slides, and fewer is better. Neither note goes in the reply.

Each slide makes one point. Build the slides on one picture and change it from slide to slide, rather than cut to an unrelated one. A color or shape means the same thing on every slide. Show the work in pictures, such as how a system works, a PR stack with each PR's state, a before and after of a fix, or options side by side. Point at what changed with arrows, highlights, and motion. A slide is never a bullet list, a status list, a table, or boxes with nothing connecting them.

Keep text to the minimum. Put each label on the thing it names, in plain words a person would say, not tags like "Tests: pass". Never caption what a picture shows, and never give a fact twice, across slides or in the text under them.

Show what came of each thing the user asked for, and whether it is done, still running, failed, or not checked. Never show something done that still waits on the user. Show any bug found and fixed on the way. If a visible change has no screenshot, say so on its slide and name what changed on screen. Draw only from facts you have. Never invent a number, and never draw a screen you did not capture.

## Subtitles

Give each slide one short subtitle line, about ten words, that says its point the way you would tell the user, from only what that slide shows. Say what the picture means rather than read out its labels. Put the subtitle in a strip below the slide, the same height on every slide and empty except for the subtitle, so it never covers the slide. Set it small, but readable when the video plays at chat size.

## Render

Render one silent landscape video, such as an mp4, with motion between slides. Every frame is the slide itself, edge to edge, above its subtitle strip. Make the frames from the slides, never by recording a screen, and burn each subtitle into its slide's frames so it stays on screen for the slide's whole hold. The hold is the time a slide is fully on screen, not counting the motion into or out of it. Hold each slide long enough to read the words it adds, at least one second for each three words. A slide adds its subtitle and each word that was not on the slide before it, including a label it changes. The first slide adds all its words. Words inside a screenshot do not count.

Before you deliver the video, use available authorized inspection tools to check the rendered file. Look at one frame from each slide at chat size, and check that its subtitle is readable and covers nothing. Measure each hold by matching the file's frames to the slide, not with a still-frame detector, which counts the faint ends of a fade as still. Count the words each slide adds against its measured hold. Fix any slide you cannot read in that time, render again, and check again.
