# Work in progress (paused 2026-10-21)

The Sans + Alphys and Aqua attack reworks were stopped part-way when the session ran low on usage. Their unfinished, **untested** edits are saved here as patches so the games in `games/` stay at their last tested state.

- `sans-genocide-rework.patch`: Sans + Alphys rework (phrased waves, chained skull rings, skull lifecycle, finale cuts); stopped while adding engine-side changes.
- `aqua-rework.patch`, `aqua-final-rework.patch`: Aqua rework (visible pre-phases, hover-then-strike knives, beam staging, parry callout, finale staging, R34 stamp); stopped mid-way.

To resume: `git apply docs/wip/<name>.patch`, then finish against the work lists in `docs/reference-study/*-attacks-lookfeel.md`, under the same rules as the finished Gerson rework (keep turn/wave lengths, preserve mechanics, own art only), verify with `tools/sim` and browser captures, and delete this folder.

## Aqua patch: checked 2026-10-21 (not applied)

Applied cleanly and checked: both builds load with no page errors and show R34; god-mode bots win every seed with no errors. **Not shipped**, because the 400 s balance probe (damage per minute, standing still / moving randomly, old → new) shows swings beyond the ±25% target that need tuning:

| Pattern | Still | Random |
| --- | --- | --- |
| blue | 142 → 60 | 76 → 129 |
| circle | 382 → 435 | 269 → 150 |
| memory | 299 → 394 | 157 → 79 |
| mirror | 220 → 256 | 133 → 47 |
| ribbon | 88 → 131 | 134 → 114 |
| spin | 385 → 370 | 214 → 100 |
| split | 269 → 269 | 180 → 257 |
| stop | 299 → 223 | 170 → 67 |

The other patterns were within about ±20%. The probe is short and noisy, so re-run it longer (900 s+) before tuning. Visual review (browser captures of patterns, parries, beams, finale) has not been done.
