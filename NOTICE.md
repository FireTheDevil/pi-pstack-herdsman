# Attribution and provenance

This extension uses [zenspc's pi-pstack port](https://github.com/zenspc/pi-extensions/tree/main/packages/pi-pstack) as its starting point and adapts its workflows and commands for the [pi-herdsman extension](https://github.com/boadij/pi-herdsman).

Original upstream: **Cursor pstack (`cursor/plugin/pstack`, as named in the request)** by Lauren Tan.
Verified repository spelling: https://github.com/cursor/plugins
Canonical plugin: https://github.com/cursor/plugins/tree/main/pstack
License: MIT; original copyright and full license are preserved in LICENSE.

Recorded upstream pin: df3fb154fb982fb83f649de8646d4af6a0cb16b3.
Portable instruction changes through Cursor pstack 0.15.17 (pstack change commit 978ca6e9c0e012047cd5058b8e829240336e704e) were reviewed and adapted. Resource lineage still points to the original pinned input; this is not a claim of byte-for-byte parity. The alignment report in docs/upstream-alignment-0.15.17.md records the scope and exclusions.
Intermediate Pi adaptation: zenspc/pi-extensions, packages/pi-pstack, commit 88600500953dfa28f19441d9085c3e9edcfc5b5c (0.5.0).

PORT-MANIFEST.json records source and destination hashes for copied skills and supporting resources and preserves their prior lineage. Historical pins remain unchanged. The 0.15.17 review used a freshly checked upstream repository snapshot and records its pinned source hashes.

This adapter replaces backend-specific orchestration guidance and command setup with Herdsman's existing API and native definitions. No runtime code or engine from pi-herdsman is copied. Herdsman 0.17.1 is Apache-2.0; its API/docs are the integration reference. It is not the original pstack upstream.
