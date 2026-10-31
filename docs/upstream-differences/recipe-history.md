# No-merge recipe history

Finding R-001 is resolved at local `45607d3d895f63d6deccc3933f742d258d6b384e`. The line in `skills/poteto-help/references/recipes.md` now exactly matches upstream `c742dd61706fbacc1b95f1a20b7b988cf096ce6c`.

## Verified local sequence

| Local snapshot | Exact recipe text |
| --- | --- |
| `e78d2e11d29b2d58def9d3519552136a3ff43936`, help introduction at .17 | `/poteto-mode autopilot these changes but stack them, don't ship. i'll land the stack.` |
| `efc173dac343cd1fd9bf11bcc01af6907ecd0c33`, pre-.36 snapshot | `/poteto-mode autopilot these changes but stack them, don't ship. i'll land the stack.` |
| `bc3a47ffb47890c3879662fa85e2b84eb5e429c2`, combined .35/.36 port | `/poteto-mode autopilot these changes but autopilot, don't merge. i'll land the stack.` |
| `45607d3d895f63d6deccc3933f742d258d6b384e`, repair | `/poteto-mode autopilot these changes, but don't merge. i'll land them.` |

The .36 port introduces the duplicated `but autopilot` wording relative to `efc173d`. The workflow scratch report incorrectly attributed that exact malformed text to `e78d2e1`. That earlier commit introduces the recipe with different wording, not the duplicated phrase.

This is a .36 wording regression relative to the pre-port recipe. Available local path history does not establish an earlier duplicated phrase followed by repair and reintroduction. No reintroduction claim or earlier first version is supported. Pre-repository intermediary history remains unknown.

## Verification evidence

Integration read the actual patches and snapshot blobs with these commands. No network or lazy fetch was used.

```sh
	git log --all --format='%h %s' -p -G 'autopilot these changes' -- skills/poteto-help/references/recipes.md
	git diff efc173dac343cd1fd9bf11bcc01af6907ecd0c33 bc3a47ffb47890c3879662fa85e2b84eb5e429c2 -- skills/poteto-help/references/recipes.md
	git show e78d2e11d29b2d58def9d3519552136a3ff43936:skills/poteto-help/references/recipes.md
	git show 45607d3d895f63d6deccc3933f742d258d6b384e:skills/poteto-help/references/recipes.md
```

The upstream line was also read from the pinned `pstack/skills/poteto-help/references/recipes.md` Git blob and compared as a complete line. Whole-file workflow hashes remain in [hashes.tsv](workflows/hashes.tsv). The repair proves source wording, not that a model executes the no-merge workflow correctly.
