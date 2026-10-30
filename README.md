# PURPLE — The Underground

Undertale-style browser boss encounters: Seth (Purple SOUL) and Aqua (Cyan SOUL) through the Underground. Recovered from the 2026-10-20 full-quality lean handoff (four-part archive, SHA-256 `feed8146…28e8` verified on reassembly).

**Read [HANDOFF.md](HANDOFF.md) before changing any game.** It holds the canon, route map, encounter contracts and the user's design/testing preferences.

## Layout

| Path | Contents |
| --- | --- |
| `games/` | The fifteen game HTMLs (runtime code, music, sprites, fonts inline), originally extracted from hub v60 and since polished — see [CHANGELOG.md](CHANGELOG.md). `HUB-PAYLOADS.json` lists their current sizes and hashes. |
| `hub/Purple-The-Underground.shell.html` | The launcher with its embedded game pack replaced by a `__PACK__` placeholder. |
| `tools/build_hub.py` | Packs `games/` into the shell → `dist/Purple-The-Underground.html` (the full offline hub). |
| `tools/extract_hub.py` | The reverse: pulls exact game HTMLs out of a built hub. |
| `tools/sim/` | Bots that play the fights in Node (and Muffet in headless Chromium) to find crashes, soft-locks, invalid numbers and balance outliers. |
| `docs/` | Continuity log, dialogue/lore guide, Aqua R28 verification report, Claude's dialogue rewrite ZIP. |
| `references/` | The four Aqua design reference images (inspiration, not replacement art). |

The full hub is 145.6 MB — over GitHub's per-file limit — so it is generated rather than committed.

## Build the hub

```sh
python3 tools/build_hub.py                     # writes dist/Purple-The-Underground.html
python3 tools/build_hub.py --expect-original   # also asserts byte-identity with the original v60 hub
```

The first commit's `games/` rebuilds byte-identically to the original v60 hub (`b1abed43…af9`); check that commit out to use `--expect-original`. The games have been edited since, so a current build reports that its digest differs, as expected.

## Not included

The original editable Git repositories and test trees were not in the handoff. The games are packed runtime builds, not full sources with history; any reconstruction should be labelled as such.
