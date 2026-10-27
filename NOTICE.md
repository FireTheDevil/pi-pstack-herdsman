# Attribution and provenance

This extension uses [zenspc's pi-pstack port](https://github.com/zenspc/pi-extensions/tree/main/packages/pi-pstack) as its starting point and adapts its workflows and commands for the [pi-herdsman extension](https://github.com/boadij/pi-herdsman).

Original upstream: **Cursor pstack (`cursor/plugin/pstack`, as named in the request)** by Lauren Tan.
Verified repository spelling: https://github.com/cursor/plugins
Canonical plugin: https://github.com/cursor/plugins/tree/main/pstack
License: MIT; original copyright and full license are preserved in LICENSE.

Recorded upstream pin: df3fb154fb982fb83f649de8646d4af6a0cb16b3.
At the earlier 0.15.30 stage, selected portable changes through Cursor pstack 0.15.30 (pstack change commit eb4db2b55b2b7dec3d9282754cddf0a56bf4ff10) were reviewed and adapted. Resource lineage still points to the original pinned input; this is not a claim of byte-for-byte parity. That stage's scope and exclusions are in docs/upstream-alignment-0.15.30.md. Earlier alignment reports preserve historical review records, including scoped 0.15.26 policies.
Intermediate Pi adaptation: zenspc/pi-extensions, packages/pi-pstack, commit 88600500953dfa28f19441d9085c3e9edcfc5b5c (0.5.0).

PORT-MANIFEST.json records source and destination hashes for copied skills and supporting resources and preserves their prior lineage. Historical pins remain unchanged. Reviewed adaptations record pinned source hashes and retain earlier adaptation history. The 0.15.30 preflight authenticated both exact commits through GitHub HTTPS and exported the complete repositories. At that stage, eight new Statechart helper and model resources retained exact upstream bytes. Other selected instructions are adapted for Pi authority and invocation. This is a selective port, not full upstream parity.

Current selective review targets Cursor pstack 0.15.34 at `519d36aa98955bf680db01bcde5fdfba686dc901`. The Statechart compiler/runtime replacement and other selected adaptations are recorded in docs/upstream-alignment-0.15.34.md. A separately authorized follow-up adds the instruction-only Ketchup-video skill from `pstack/skills/ketchup-video/SKILL.md` at that same pin, adapted for explicit Pi invocation, authorized outside-repository output, separate installation/external-effect approval and honest playback/tool limits. No renderer or dependencies are bundled. Earlier review and exclusion history remains in the alignment reports and upstream.lock.json.

This adapter replaces backend-specific orchestration guidance and command setup with Herdsman's existing API and native definitions. No runtime code or engine from pi-herdsman is copied. Herdsman 0.17.1 is Apache-2.0; its API/docs are the integration reference. It is not the original pstack upstream.
