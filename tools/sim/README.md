# Fight simulation harness

Bots that play the fights without a browser to find crashes, soft-locks, invalid numbers and balance outliers. Each game's module bundle is loaded straight from `games/*.html` (`loader.js`), so the bots test the exact shipped engine code. Nothing here modifies the games.

| Script | What it does |
| --- | --- |
| `loader.js` | Pulls the `modules[...]` bundle out of a game HTML and runs it in a Node sandbox with minimal DOM stubs. |
| `bot.js` | Chaos/progress bot: random movement, mashing Z/X, menu navigation and firing at fixed 1/120 s steps. Reports exceptions, non-finite numbers in `snapshot()`, HP outside 0–max, negative enemy HP, stalls (no progress for 150 s of game time), endings reached and time spent per state. |
| `balance.js` | Plays each fight twice, always choosing FIGHT: once standing still, once wandering randomly. Reports damage per minute for each attack pattern. A pattern that never hits a still player is a camping hole. |
| `muffet-bot.js` | Muffet has no module bundle, so its bot runs in headless Chromium against a temporary copy of the file that exposes `game`. Needs Playwright. |

```sh
node tools/sim/bot.js all 1200 4 0          # every fight, 20 simulated minutes, 4 seeds, normal play
node tools/sim/bot.js all 2400 3 1          # god mode (built-in invincibility, or the harness refills HP)
node tools/sim/bot.js aqua,gerson 600 2 0   # selected fights
node tools/sim/balance.js all 900           # per-pattern damage, still vs random
NODE_PATH=$(npm root -g) node tools/sim/muffet-bot.js 1200 3 0
```

Each line of output is one JSON report. Known-intentional values: Sans + Alphys steel relay cells have `hp=Infinity` (bullet-proof by design). A "stall" in a terminal state (`won`, `victory`) just means the bot is idling on the ending.

The bots only see the engine. The Notebook wrappers, touch buttons and rendering are installed by each page's main script, so browser-level checks (Playwright) remain necessary for those layers. A bot surviving is not a human playtest, and a bot's damage numbers are relative signals, not difficulty ratings.
