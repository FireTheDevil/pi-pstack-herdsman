# Attribution and provenance

Original upstream: **Cursor pstack (`cursor/plugin/pstack`, as named in the request)** by Lauren Tan.
Verified repository spelling: https://github.com/cursor/plugins
Canonical plugin: https://github.com/cursor/plugins/tree/main/pstack
License: MIT; original copyright and full license are preserved in LICENSE.

Recorded upstream pin: df3fb154fb982fb83f649de8646d4af6a0cb16b3.
Instruction changes through Cursor pstack 0.15.5 (pstack change commit 12d587dfb20741cafc376c42c696c5f6e2a64487) were reviewed and selectively adapted. Resource lineage still points to the original pinned input; this is not a claim of byte-for-byte parity with 0.15.5.
Intermediate Pi adaptation: zenspc/pi-extensions, packages/pi-pstack, commit 88600500953dfa28f19441d9085c3e9edcfc5b5c (0.5.0).
Further local intermediates: pi-pstack-shepherdr with token-conscious loading edits, then pi-pstack-fabric. The immediate input was the read-only local working tree at /path/to/pi-pstack-fabric. Its repository HEAD is recorded only as context, not as a claim that the working tree equals that commit.

PORT-MANIFEST.json hashes every copied skill/support resource against that immediate input and preserves the prior resource lineage. Historical pins come from the supplied audit/lock, not a new remote or byte-for-byte Git verification.

This adapter replaces backend-specific orchestration guidance and command setup with Herdsman's existing API and native definitions. No runtime code or engine from pi-herdsman is copied. Herdsman 0.17.1 is Apache-2.0; its API/docs are the integration reference. It is not the original pstack upstream.
