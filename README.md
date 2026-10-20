# PURPLE — The Underground

Undertale-style browser boss encounters: Seth (Purple SOUL) and Aqua (Cyan SOUL) through the Underground. Recovered from the 2026-10-20 full-quality lean handoff (four-part archive, SHA-256 `feed8146…28e8` verified on reassembly).

**Read [HANDOFF.md](HANDOFF.md) before changing any game.** It holds the canon, route map, encounter contracts and the user's design/testing preferences.

## Layout

| Path | Contents |
| --- | --- |
| `games/` | The fifteen exact game HTMLs extracted from hub v60 (runtime code, music, sprites, fonts inline). `HUB-PAYLOADS.json` lists their sizes and hashes. |
| `hub/Purple-The-Underground.shell.html` | The launcher with its embedded game pack replaced by a `__PACK__` placeholder. |
| `tools/build_hub.py` | Packs `games/` into the shell → `dist/Purple-The-Underground.html` (the full offline hub). |
| `tools/extract_hub.py` | The reverse: pulls exact game HTMLs out of a built hub. |
| `docs/` | Continuity log, dialogue/lore guide, Aqua R28 verification report, Claude's dialogue rewrite ZIP. |
| `references/` | The four Aqua design reference images (inspiration, not replacement art). |

The full hub is 145.6 MB — over GitHub's per-file limit — so it is generated rather than committed.

## Build the hub

```sh
python3 tools/build_hub.py                     # writes dist/Purple-The-Underground.html
python3 tools/build_hub.py --expect-original   # also asserts byte-identity with the original v60 hub
```

With unmodified `games/`, the output is byte-identical to the original hub (`b1abed43…af9`). After editing a game, rebuild and the script reports that the digest differs, as expected.

## Not included

The original editable Git repositories and test trees were not in the handoff. The games are packed runtime builds, not full sources with history; any reconstruction should be labelled as such.
