# Work in progress (paused 2026-10-21)

The Sans + Alphys and Aqua attack reworks were stopped part-way when the session ran low on usage. Their unfinished, **untested** edits are saved here as patches so the games in `games/` stay at their last tested state.

- `sans-genocide-rework.patch`: Sans + Alphys rework (phrased waves, chained skull rings, skull lifecycle, finale cuts); stopped while adding engine-side changes.
- `aqua-rework.patch`, `aqua-final-rework.patch`: Aqua rework (visible pre-phases, hover-then-strike knives, beam staging, parry callout, finale staging, R34 stamp); stopped mid-way.

To resume: `git apply docs/wip/<name>.patch`, then finish against the work lists in `docs/reference-study/*-attacks-lookfeel.md`, under the same rules as the finished Gerson rework (keep turn/wave lengths, preserve mechanics, own art only), verify with `tools/sim` and browser captures, and delete this folder.
