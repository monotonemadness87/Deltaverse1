# Changelog

## 2026-10-27 — Flowey false genocide: dire and hopeless

The designer wanted this route far more dire and hopeless, a real demonstration of Flowey's anger and power. The false-pacifist Flowey was just bored.

- **Music:** the designer's supplied track (Inverted Fate "Checkmate") is the theme.
- **Script rewrite:** cruel and sardonic.
  - **The partnership:** he manipulated it; he put Seth and Aqua in each other's paths and held every door. They were hopeless little brats who needed his help, then started getting stronger.
  - **The resets:** he has run this over and over for his perfect ending, and he WILL get it. If they'd finished the job he'd have left them alone; now "This isn't a fight. It's course correction." Even if Seth wins, he'll just go back.
  - **The last attack** is now COURSE CORRECTION. He no longer begs anywhere.
- **Static:**
  - Every SAVE and LOAD, rig, rug, death retry, chase LOAD and act change tears the screen with static, torn rows and a hiss.
  - LOADs count up from #4,813.
  - Mid-attack he SAVEs, then LOADs you and every bullet back, in eight attacks plus the finale.
  - Inside him, the static never really stops.
- **Chases:** crowds of laughing Floweys line the walls and throw aimed pellets.
- **Harder:**
  - His own attacks repeat about 40% more often than the false-pacifist fight's, and the replays 10% more often than in their own games.
  - **Measured pressure** (share of HP per minute vs false pacifist): about 1.43× for a random dodger and 1.35× for a still player. The escapes now take about 25% more hits because of the Flowey crowd.
- **The ending, rebuilt:**
  - He taunts instead of pleading.
  - The first slash really gets him (hundreds of damage, his hurt cry, the hurt frame).
  - He laughs in Seth's face: "Sans was right, you know? You might as well have let Sans win. Aqua's gone. And Asgore's ahead..." Then YOU'RE ALREADY DEAD.
  - Seth attacks over and over (16 strikes; Z swings sooner) through the wilt and dissolve frames until he's dust.
  - Silence, then "Somewhere, a file is still saved." and THE FLOWER IS DUST.

## 2026-10-27 — Flowey: false genocide (the second neutral)

The second Flowey version is built, as a FALSE GENOCIDE variant on the Flowey card (`games/flowey-genocide.html`). Seth killed everyone, then spared Aqua; she broke and ran. Flowey wants Seth gone so she gets her game back.

- **Script:** the S-tier revision, with every kept line verbatim. He opens in his canon register and cracks early; by act three he's raging, and at the end he begs.
- **Seth is LV 10 / 56 HP.** On Normal a hit costs 7 HP (4 on Gentle, 9 on Hard).
- **Act one:** the same structure, re-aimed at a killer:
  - NO MORE LESSONS, EXP RECEIVED, YOUR FAVORITE BUTTON (every falling button says FIGHT), JUST ONCE, COUNT THEM (numbers counting the dead), TURN THE KNIFE, LOVE LETTER, THE WORD YOU KEPT (MERCY deleted), THE ABSENT PLAYER (the other heart is his), and the rest.
  - **The rigs:** your EXP drains into his health, then the bar is relabelled AQUA, then ATK 0 / LOVE 0.
- **The chases:** the rooms are emptied. They're drained of colour, with dust where the monsters were, and Waterfall's hazards are Gerson's arrows. Chase difficulty matches the false-pacifist fight: the same hits for the same bot, at a slightly smaller share of HP.
- **Act three replays only genocide bosses**, each with its own mechanics and art:
  - Encore's emptied theatre.
  - Rift's cataclysm: a lattice with one open column, orbiting blades, opposite hearts.
  - Gerson: arrows from four sides, his hammer turning the box, shells on the strings.
  - Spamson NEO: upright strings, receivers, falling heads and one cannon sweep.
  - Muffet: spider processions, donuts, the pet eating a column.
  - Sans + Alphys: bones to jump, blasters, the CORE's blue and orange beams.
  - The last attack, I CAN FIX THIS, runs through all of it, and near the end he says "Please."
- **The pages are Seth's route.** The sixth page is the spare; once it is back, his strikes stop pulling back (×2.2 damage).
- **The ending:**
  - Seth tears out of him. Flowey is small again and pleads.
  - Only FIGHT works; the other buttons answer "The notebook is still in your hand."
  - The Notebook strike lands, then his hurt cry and the canon wilt and dissolve frames.
  - About 2 s of silence, Seth's epilogue, and THE FLOWER IS GONE.
- **Difficulty:** measured with 8 seeds per attack, as share of HP lost per minute versus the false-pacifist fight:
  - Act one and the replays: about 1.46× for a random dodger and about 1.30× for a player who stands still.
  - The pages: about 1.27×.
- **Hub:** the Flowey card has FALSE PACIFIST and FALSE GENOCIDE buttons, each with its own subtitle, tag and copy.
- **Build:** the sources and build script are in `tools/flowey-genocide/`. The build starts from `flowey.html`, so rebuild the genocide file whenever that changes.

## 2026-10-27 — Aqua R35: the spare

TALK opens only once her final attack ends. Until then, nothing changes.

- **Three talks:** Partners, The Nest and Not Enemies. Each is answered, then she tries an attack that falls apart:
  - MAKE IT FUN restarts twice, and half its warnings fizzle.
  - SEVEN PLANS is fragments of her old attacks, each abandoned.
  - THE LAST TURN is one wobbling knife that drops before it reaches you.
- **The breakdown attacks are weaker:** 60% damage, never below 1 HP, longer invincibility frames. A player who never moves loses about 18 of 56 HP across all three.
- **SPARE:** it turns yellow after the third talk. Pressed earlier, it gets one of three dismissals.
- **Sparing her:** she runs off-screen (with reduced motion, she fades), and the card reads NEUTRAL / FLOWEY: FALSE GENOCIDE.
- **FIGHT after a talk** gets one line, then the existing kill ending.
- **Narration lines** in her dialogue (face −1) now draw without a portrait, in the main box, with a plain click.
- **Stamp:** both `aqua.html` and `aqua-final.html` are R35.

## 2026-10-27 — Flowey: vines instead of laser beams

His own straight-line attacks are now thorned vines instead of white laser beams. Lines, timings and hitboxes are unchanged.

- **The warning** flickers along the line, as a blaster's does. It brightens as the strike nears; with reduced motion on, it's steady.
- **The strike:** the vine whips in from off-screen, out of the dark, and draws back.
- **Nothing on screen is the source.** Inside him, the vines come in from the sides rather than from his eyes or body.
- **Coverage:** the crossed lines, the beams in his tricks and traps, and act three's vine strikes.
- **Replayed bosses keep their own beams:** Encore's spotlight, Rift's, and Sans's blue and orange.

## 2026-10-24 — Flowey: mouths fly jaws-first

The biting mouths (MOUTH OF THE WORLD and the FALL UP floor jaws) were drawn backwards, opening away from where they were going. They now face the way they move.

## 2026-10-24 — Flowey: harder attacks (chases unchanged)

The designer asked for harder attacks, leaving the chases alone.

- **Every non-chase attack:** repeating spawns come about 28% more often, replays included, and his bullets fly 18% faster.
- **Page phases:** a real barrage now, with a heavier pellet rain plus aimed volleys from the sides. Before, a player who stood still took almost nothing.
- **The third face barrage:** aimed volleys added; before, standing still took no hits.
- **Measured** with 8 seeds per attack, Normal, damage taken repeatedly without dying:
  - Random dodger: about 1.4× more hits on average. Most attacks rise 10–60%. The page phases rise 1.5–2.3×, from 8–13 hits a minute to 17–20.
  - Player who stands still: up 0–60% on most attacks. The page phases go from 3–6 hits a minute to 22–32, and the third face barrage from 0 to 47.
  - The dodging bot's results in the chases are unchanged.

## 2026-10-23 — Flowey: act three is big canon Flowey

The designer rejected the original TV-headed creature. Inside him, Flowey is now his own canon battle sprite at 5×: talking, with his hurt face, and tearing into offset bands more often as his health drops. Thorned vines reach out from behind him. During boss replays he dims, and the boss appears in front of him. The HOWDY, INSIDE attacks now come from his own eyes, face and vines.

## 2026-10-23 — Flowey, second pass: his voice, a real body, and FIGHT that pays off (until he rigs it)

The designer found the first redo short of the other fights, his talking weird, and the sprites weak. They supplied his voice blip, his evil blip, his hurt cry and his evil laugh.

- **Talking:** his mouth now just opens and shuts on whatever face he's making. Before, it flipped between two different expressions. Two talking frames are canon twins; the rest were opened from their own resting frame, so the eyes never change. The creepy and blank faces stay still.
- **Voice:** he gets a blip per letter. The evil blip plays when he drops the act, and always inside him. His hurt cry plays on every hit, and his laugh plays when he rigs the fight and on his "Hee hee hee" lines.
- **FIGHT pays off:**
  - **Act one:** he has a 600 HP bar. Notebook hits land for 36–164 damage, with his hurt face, the hurt cry, a burst of petals and a red damage number.
  - **The rigs:** each act-one cycle ends with him rigging the numbers. First he LOADs his health back. Then he adds zeros (MAX HP 600 → 99999). Then he sets your attack to 0.
  - **Act three:** your hits stick. He has 4200 HP, and damage grows with each page you've recovered. His television cracks in three stages as it drops.
- **His body (act three):** new original pixel art. It's a television head that plays his real faces (and, during replays, the bosses he's stealing), with two rings of yellow petals, a toothed jaw, eyes on stalks and thorned vine arms. It breathes, blinks, opens its jaw when he laughs or bites, flashes and shakes when hit, and stays above the play area.
- **New phase, HOWDY, INSIDE (18 s):** opens act three by attacking with each part in turn: eye lasers (the eye glows first), petal volleys, rows of teeth from the jaw, and thorned vine bars swept in by the arms. Then all of it together.
- **Act one escalates:** thorned vines grow behind him in the second cycle. In the third he's larger. When he rigs the numbers, his sprite glitches through his melting frames.
- **Chase rooms:** each area has its own textured floor: Ruins brick with red leaves, Snowdin snow, Waterfall glowing grass, cracked Hotland rock, CORE plating.

## 2026-10-23 — Flowey redone: three acts, his real sprites, a false-pacifist neutral

The designer asked for a redo, using their Undertale Yellow reference and Undertale's own Flowey sprite sheet. The study is in `docs/reference-study/flowey-study.md`.

- **Story:** this is the false-pacifist neutral (one of two planned neutral versions). Flowey is disappointed: two humans fell, and Seth chose to be a sentimental sap when the two of them together might have threatened the king. So he takes Seth's soul, and maybe then Aqua will stop being so disappointing. All dialogue is rewritten for this. The ending choice and both endings stay, and refusing him now closes on small Flowey turning his attention to Aqua.
- **Act one, his battle:** twelve short attacks (10–13 s, down from 26–38 s) built from the existing tricks. His buttons still move, MERCY is still disconnected, and the fake Game Over is still there. Three times he SAVEs: a giant-face barrage over white grass. Then he LOADs a room from the journey: a 26 s top-down chase through the Ruins (Encore's curtains), Snowdin (Rift's shards) and Waterfall (Mettalot's tears). Vines creep up from behind, and the door at the far end lets you out early. A short montage runs through Hotland and the CORE.
- **Act two:** the rooms stop, and in the dark he takes the soul.
- **Act three, inside him:** no box, and a giant Flowey over his roots. Six ~20 s phases replay the pacifist-route bosses and his own tricks, alternating with the six pages of Seth's life. The finale is a 40 s gauntlet (it was 133 s). The Torn Notebook acts on Seth's turns.
- **Pacing:** the whole fight now takes about 11 minutes in god mode. Before, it didn't finish in 25.
- **Removed:** the Spamson NEO replay (a genocide-route boss).
- **Sprites:** his canon battle frames, cut pixel-exact from the sheet, with a talking frame for every expression. The same sprites replace the old art in Gerson and in Sans + Alphys.
- **Also fixed:**
  - Pressing Z on a page phase recovered the page instantly. Calling it back now works from 7 s, when the prompt appears.
  - His text box inside him wrapped as if it were the narrow speech bubble.
- **Difficulty:** this is a structural redo, so per-attack comparisons don't apply. On Normal, a dodging test bot (~0.15 s reactions) clears every chase, taking 2–8 hits of 3 HP. The random test bot now gets 12–18 steps in before dying (old fight: 12–14 of 25 attacks), but dies more often, because random wandering can't walk a chase.

## 2026-10-23 — Sans — No Promises: phrased attacks and the Sans + Alphys lessons

Every attack keeps its 18 s and the final its 68 s. All mechanics stay (lock lines, `!` markers, ghost bones, the rotating rig, break-a-blaster gates).

- **Rhythm:** attacks build, tighten, breathe and end on their biggest beat (a full-jump BIG ONE hill, a blue string chasing the last curtain, a DOUBLE RING).
- **Nothing is deleted mid-flight:** gate breaks, gravity flips and section changes no longer wipe live bones; unfired skulls pull back and fade, firing beams finish.
- **Skull rings:** fast, sparse chains (45 ms apart, rings of 4 or 6, double ring 4 + 4) that all meet at the lock point, replacing 12 skulls 95 ms apart.
- **Skull look:** spin in, hold, tremble, open the jaw on the fire frame; beams start thin, widen, recoil and fade grey. Beams outside the box are drawn at half strength.
- **Ceiling:** gravity flips are thrown slams with bones growing out of the wall, closing on faster slams and "LAST DROP". A player who never jumps takes about 50% more damage here (40 → 60 per minute), the largest change in the fight.
- **Black cuts** before the final's skull section, and a 0.45 s stretch into the corridor instead of a snap. Hit shake at most every 0.5 s; one `!` per bone formation.
- **Dialogue:** three repeated words trimmed, two faces matched to grim lines, the shrug on "the job came with both" now plays (its trigger looked for older wording), and the menu no longer claims his hands never left his pockets.
- **Reduced motion:** no skull spin or tremble, no box tween, no slam kick (it shook before), black cuts become a dim.

## 2026-10-23 — Dialogue pass on the reworked fights

Gerson, Sans + Alphys, Aqua, Muffet, Ant Tenna + Spamson and Spamson NEO. Lines were brought closer to each character's canon voice; designer-authored and reference lines are kept as written. Sans + Alphys: Alphys's panel now follows what she's doing (console and typing during attacks, alarm on a broken relay, cell or gate, startled on Flowey's hack), and lines can choose her face.

## 2026-10-23 — Designer decisions on the new reworks

- **Muffet:** only one grab per actor lands each turn. Later attempts still reach in but close on nothing, so a player standing still takes steadier damage from turn to turn.
- **Ant Tenna + Spamson:** the finale's stage title cards (RECOIL, UNSTABLE, OVERLOAD, THE BIG ONE) sit just inside the top of the box instead of over the hosts.
- **Left as designed (confirmed):** T5 THE THREE-CUP SOUL and T15 THE FALLING PUNCHLINE stay harder for a player who stands still. Spamson NEO's assist-mode swings (READ, practice) stay.

## 2026-10-23 — Ant Tenna + Spamson: phrased acts, visible props, a staged finale

Reworked from the reference study (`docs/reference-study/spamton-tenna-study.md`). Every turn keeps its length, and the finale is still 162 s. Kept as confirmed: the deliberately harsh WARM-UP PHRASE, the eleven-slot Falling Punchline fix, every mechanic, and the hub's DUO / NEO + UPGRADES modes.

- **Rhythm:** each turn runs intro → build → a short rest (often a cash box) → peak → a warned finisher, then an empty box. Before, 246 objects across the fight were deleted mid-flight; now none are.
- **Residents:**
  - Mothlark: notes fly out of her mouth in bars and end on a held chord.
  - Presto: plays a three-cup shell game.
  - Stephex: counts in 5-6-7-8 and dances swung steps with floor ripples.
  - Boing: THE FALLING PUNCHLINE is staged as a joke (setup, setup, pause, punchline), with anvils hanging on visible ropes.
- **Duo turns 17–26:**
  - Spamson's merchandise is thrown from his hand, and Tenna's rows flash down from his antenna.
  - Each turn has its own sections and finisher: head trios, spotlight stars, smash cuts with a seam and a clap, a rimshot, a ringing phone before pipis, a chained heart, an inhale before each pull, accelerating channel changes, a marquee double feature, and a five-quote medley.
- **Finale:** four staged acts (demonstration, recoil, unstable, overload), each opened by Tenna's title card. It ends on THE BIG ONE: a 2 s charge, then a telegraphed full-box sweep with two safe pockets, a white frame, and silence before the explosion. Crossfire now comes between waves.
- **Size and speed:** Spamson's heads, cards, mail and pipis are about 1.15–1.3× larger with matching hitboxes. They travel faster after the same warnings. The SOUL is drawn larger, with its hitbox unchanged.
- **Feel:** a muzzle star on every shot (the old flash was never drawn), knock-back on armoured hits, generator-break flashes, visible guard blocks, a full-charge ping, and a cosmetic graze glint and tick.
- **Also fixed:**
  - The guard-block and Addison cues were never drawn.
  - Smash Cut caused a console warning and ignored screen shake.
  - The finale stage label ran off the edge.
  - Spawns that couldn't finish before the box closed are no longer created.
- Reduced motion: static is a flat frame, and marquee chasing, wash pulsing and rope sway stop. The white-out is dimmed.
- **Verified:**
  - God-mode bots reach victory at turn 27 on every seed with no errors.
  - All 27 attacks run cleanly in both motion modes, and the hub modes still boot.
  - Most turns are within ±50% of their old damage; duo turns are 10–43% lower.
  - **T5 THE THREE-CUP SOUL:** standing still +100%, moving +54%.
  - **T15 THE FALLING PUNCHLINE:** standing still +100%, moving −5%.
  - Both come from the study's anti-camping changes; kept by the designer's decision.

## 2026-10-23 — Spamson NEO: phrased attacks with visible sources and a staged final

Reworked from the reference study (`docs/reference-study/spamton-tenna-study.md`). Every turn keeps its length (11.5 s, 14.5 s, final 52 s). The phase-2 crossfire aim is unchanged (the confirmed "don't move" pattern).

- **Rhythm:** each attack runs intro → build → rest → peak → finisher instead of one cast every 1.9 s. Invoice rows, pods, sweeps, relays, wings and the gauntlet each have their own phrase and finisher. Nothing is spawned and then deleted at the end of a turn any more (phase-2 turns used to lose 3–7 hazards, and the final 13 at its flips).
- **Hazards come from him:** cards and pods leave his free hand. Receipts print from his chest. Feathers peel off the wings, and crossfire pellets leave the wing tips. Mortgage beams start at his eye. Relay rain falls from cannon smoke, with a dashed control lead to his arm. Each projectile flies to its entry point during its unchanged warning and can't hurt until it lands.
- **Sweeps:** a short wind-up with a dashed wedge before the existing warning. The cannon kicks back on firing.
- **Gauntlet:** the box narrows for the turn.
- **Final:** four acts that tighten (casts every 1.6 s → 1.0 s), with a breath after every third cast in act 3. He fades between screen edges instead of jumping, then looms full-size behind the box. The last 3 s stop casting for three determination-pink pulses and a white frame.
- **Size and speed:** cards, receipts and feathers are 1.3× with matching hitboxes. The SOUL is drawn larger (hurtbox unchanged). Rows and fans travel faster after the same warnings (155 → 210/230 px/s), and gauntlet cards go 135 → 200 px/s.
- **Feel:** a muzzle star on each shot, knock-back on targets, a lane flash when a relay breaks, and a cosmetic graze arc and tick.
- **Also fixed:** receipts were drawn 5.5 px off their hitbox. The final's edge boss ignored its transparency. The hit and BAIT recoil effects were never drawn. Single-lane relays showed a misleading SAFE label, and SAFE labels stacked. The CUT WIRES line repeated every cast. BAIT + READ + practice sweeps could be cut short. Cards now read over the strings.
- Reduced motion: no flights, swings, kicks, rims or box tween; the white frame is dimmed.
- Verified: god-mode bots win every seed with no errors; at normal difficulty every pattern is within ±50% of its previous damage (16-run probe). Larger swings appear only in assist modes (READ, practice), where late spawns that used to be deleted now resolve; kept by the designer's decision.

## 2026-10-23 — Muffet: phrased turns, hands that release spiders, a staged pet

Reworked from the reference study (`docs/reference-study/muffet-study.md`: Undertale and Underswap Muffet, plus a fan-made giant-Queen fight for staging). Every turn keeps its length and the whole HANDOFF contract stays. That includes the captives, six hands, the four connected silk layouts, Aqua's choices and escape, SIT TIGHT survival, and the fatal turn-60 trap.

- **Rhythm:** turns are built from phrases. That means same-side trains, swung gaps, 0.6–1.9 s rests and a finisher, then a clean empty box of at least 0.6 s. No hazard is deleted mid-crossing any more.
- **Visible sources:** spiders are released by Muffet's gripping hands and walk a short strand onto their string. Donuts roll in from past the edge. Spiders crawl off when they finish.
- **Readable hazards:** spiders are larger on 3–4 string layouts and the full web (hitbox unchanged), and every hazard has a crisp dark outline.
- **Pet turn:** the pet climbs onto the box edge, leaps onto its marked circle, and stomps faster each time (1.9 s → 1.2 s), finishing on a double stomp. Each landing nudges the box and bows the silk.
- **Chase** runs in three acts and ends on a harmless finisher ring. **SIT TIGHT** landings are phrased, with accent flashes on landings 4, 8 and 11 and chevrons warning 0.5 s before each kick. **Turn 60** holds a long, glowing hover before the crush (still fatal).
- **Other turns:** grab and smash turns get long/short cadences and a cupped pincer. Hips accelerate to a final hip. *Turn the table* becomes four quarter-turns. White tea sweeps, rests, then brackets the SOUL.
- **String switching** is snappier (0.10 s hop, 0.12 s lockout; was 0.17 s and 0.20 s), with squash, stretch and a string twang. Forced hops are unchanged.
- **Previews:** a small silk tag previews milestone turns (every 5th, and 60) during the menu. Purple orb-webs breathe at the sides on full-web milestone turns.
- **Also fixed:** knots on string layouts could close invisible links and block nothing; they now really block. Anti-camp responses no longer wind up and then get deleted at turn end. The chase's last grab, which never resolved, is gone. The web "READY" countdown no longer overlaps the attack title.
- Reduced motion: no flashes, squash, twang, bow, bob, nudge, shake or orb spin; all warnings remain.
- **Verified:**
  - The god-mode bot reaches turn 60 on every seed with no errors.
  - Normal-play deaths are similar to before.
  - For a moving player, every turn's damage is within ±50% (the largest change is +9%).
  - Aqua takes less SIT TIGHT damage (12 → 4 and 8 → 4 per turn).
  - For a still player, ten turns move beyond ±50%. Each comes down to whether one 28-damage anti-camp bite lands inside that turn; the run total is unchanged.

## 2026-10-22 — Sans + Alphys: faster, sparser skull rings

- Skull rings chain 45 ms apart (was 75 ms) and use fewer skulls: ring waves build 3 → 4 → 6 (was 4 → 6 → 8), the closing double ring is 4 + 4 (was 6 + 6), and cover rings have at most 4. The open lanes between beams are now easy to read, and a player standing still can no longer be hit several times by one ring.
- Damage per minute against the original, pre-rework fight, standing still / moving: wave 33 39 → 42 / 47 → 35; wave 34 90 → 127 / 63 → 64; wave 37 108 → 138 / 86 → 65; wave 39 30 → 45 / 41 → 32. All are within ±50%, where the first rework had pushed waves 33, 34 and 39 past it for a player standing still. Other ring waves dropped 10–30% from the first rework.
- Flowey's save labels no longer repeat over the SOUL inside the box; the top banner already shows them.

## 2026-10-22 — Sans + Alphys: phrased waves, chained skulls, visible machinery

Reworked from the reference study (`docs/reference-study/sans-alphys-attacks-lookfeel.md`). All 40 waves keep their lengths, the finale is still 75 s, the charged-skull gates are still required, and every mechanic in the contract is unchanged. Our lock lines, `!` markers, ghost bones and dashed core lines stay.

- **Rhythm:** waves tighten, take a short breath and end on their biggest beat instead of running at one steady interval. Empty-box time dropped sharply (wave 1: 28% → 6%; wave 40's empty tail: 7.8 s → 0.7 s). Slam waves speed up from 1.5 s to 1.0 s between slams, with a light ripple of bones filling the early gaps.
- **Skull rings** fire one skull after another instead of all at once, growing 4 → 6 → 8, then closing on a double ring.
- **Skulls:** one shared lifecycle (spin in, hold, tremble, open the jaw on the fire frame, beam widens from a thin line, recoil, narrowing grey fade); set-piece skulls are larger. Beam damage width-time is unchanged. Beams outside the box are drawn at half strength so Sans and the HUD stay readable.
- **Slam bones** show an outline, then grow out of the wall and pull back.
- **Alphys's machinery has bodies:** carriages on the box rim, projectors for lit zones, a hopper for falling cells and a cabled rotor. Her console keys light when a device fires.
- **Finale:** sections are separated by black cuts. If the gate breaks early, slams keep coming until 75 s, so the fight never ends on an empty box.
- **Polish:** box resizes ease; world labels stack instead of overlapping; hit shake is capped to once per 0.5 s; Flowey's first wave opens with a burst of static and vine shadows.
- **Also fixed:** box slam kick now respects reduced motion; near-miss sparkle no longer awarded off a burnt-out after-image; the THREE STRINGS cue clears on mode change.
- Reduced motion: no spin, tremble, box easing or tremor; black cuts become a dim.
- Verified: no errors in bots or the browser; god-mode bots win at least as often as before (5/6 seeds vs 4/6). For a moving player every wave is within ±50% of its old damage. For a player standing still, waves 33 (+131%), 39 (+79%), 34 (+63%) and 37 (+50%) rose because chained rings spread their beams over ~0.9 s, so a SOUL that doesn't move can be hit 2–3 times per ring. Resolved the same day by faster, sparser rings (see above).

## 2026-10-22 — Aqua R34: readable knives, staged beams, parry callouts

Reworked from the reference study (`docs/reference-study/aqua-attacks-lookfeel.md`). Every wave keeps its length, and all mechanics and prices are unchanged. Both builds (full duel and finale practice) are re-stamped **R34**.

- **Warnings you can see:** knives that start outside the box now show their warning there, with a ghost that firms up and a glint just before launch, and a cyan bracket where a wall knife will cut in. Before, side cuts, curtains, fans and the STOP walls arrived with no visible warning.
- **Knives strike:** aimed knives hover, pull back slightly, then accelerate, arriving at exactly the same moment as before. Fans and multi-knife casts spread along the wall instead of stacking, and knives have a thin dark inner line so overlaps stay readable.
- **Beams:** a flickering warning line with edge lines at the true width, then a live beam that opens, swings slightly and thins, drawn from Aqua's hand. Its drawing and hitbox match. Her pose points while it aims and slashes when it fires.
- **Aqua reacts:** she reaches when casting, guards when parrying and flinches when hit.
- **Parries:** a "PARRY n/3" callout ("LAST PARRY" on the third) pops up at the parry for 0.7 s on a black plate, with a cyan ring and a brief freeze of her SOUL. The HUD counter blinks red when she's out.
- **Arena:** the battle box tweens into and out of each arena instead of snapping.
- **Rhythm:** each phrase opens with a faint cyan tell, casts speed up within a phrase, phrases are separated by short lulls, and the wave builds overall. Most waves end on one warned finisher slash.
- **Finale (ONE MORE TIME):** a hard cut, a ~2 s close-up card with HP still visible, chapter breaks with a flash and an empty-box hold, and a closing cyan "HOLD STILL" ring. By the cyan rule, the ring only cuts a moving SOUL.
- **Also fixed:** a cast-order bug introduced mid-rework, which would have changed which casts carry beams; the finale ring now has real hitboxes matching what is drawn; the wave title no longer crosses the close-up; Aqua's body follows box tweens; the HOLD STILL text no longer overlaps the rotated box.
- Reduced motion: steady warning lines, no chapter flashes, no kicks.
- Verified: god-mode bots win every seed in both builds, passing the finale gate, with no errors; normal-play deaths match the original. Per-pattern damage (12 runs per pattern, old → new): every pattern is within ±50%. The largest changes: ribbon +49% for a player standing still, reverse +40% for a randomly moving player, mirror and scare +32%.

## 2026-10-21 — Gerson: phrased attacks and real impacts

Reworked from the frame-by-frame reference study (`docs/reference-study/gerson-attacks-lookfeel.md`). Every turn keeps its exact length (16–25 s, finale 58 s) and all mechanics.

- **Rhythm:** attacks follow phrases instead of fixed timers. Shield turns open with slow arrows, then left/right pulses, then same-side runs of 2–4 with real rests between. THE OLD GUARD widens from left/right to all four sides mid-turn. String and hybrid turns run in phases and build to their busiest stretch at the end.
- **Finishers:** every turn ends on a readable finisher (a heavy blinking arrow, or a double hammer strike), then settles before the box leaves. Bullets are no longer deleted mid-flight, and no hammer winds up after its turn ends.
- **Hammer strikes:** the lane fills like a fuse, flashes before landing, then lands with a white lane flash, after-images, dust, a small shake and a thud. Gerson swings on the strike frame.
- **Box:** spins in and out quickly, and each mid-turn spin is caused by a visible swing (0.45 s, slight overshoot) instead of a slow drift. The first hazard comes ~0.55 s after the box is ready.
- **Blocks:** white-then-purple shield flash, gold sparkles, a small recoil and a visible (capped) jolt.
- **Readability:** arrows are amber so they no longer match the green shield, SOUL and box; the next arrow due turns red. Shells show a grey ghost before moving. Gerson gestures on each run and wall, breathes when idle, and stays on screen through the finale. The finale is five phases ending in a ring that closes with one opening, then bursts.
- **Also fixed:** the SOUL no longer flickers at the start of every turn; the 7-lane box no longer covers the enemy HP bar; "+5 HP" no longer covers the SOUL; finale arrows always get their full warning time.
- Reduced motion: no rotation, after-images, smear, shake or bursts.
- Verified: god-mode bots win at turn 17 on every seed with no errors; normal-play bots now reach turn 17 on every seed (fewer deaths, because the rests are real); per-attack damage mostly within ±25% of before; a careful-play bot took 8 hits over the fight versus 17 before.

## 2026-10-21 — Aqua: Notebook panel clears the TP bars

- **Aqua (full duel and finale practice):** the Torn Notebook panel was drawn across the inner edges of the SETH and AQUA TP bars, hiding them and their percentages while it was open. It is now narrowed to x 44–724, between the bars; the timing bar (x 67–701) still sits inside it.
- The shared Notebook module (all 13 builds) gains optional `game.notebookPanelX` / `game.notebookPanelW`, alongside the existing Y/H overrides. Every other fight keeps the default position.
- Aqua builds re-stamped **R33**.

## 2026-10-21 — Tenna's "determined" face redrawn

- The truncated `tenna-determined.png` (see Pixel pass 3) is now complete, so the expression shows its own face again instead of borrowing the cocky head. Rows 0–168 are the original pixels, unchanged. Rows 169–241 are a redraw that continues the surviving lines: the teeth box's sides and its two tooth separators run down to a rounded bottom edge parallel to the smile line (a wide, gritted grin), the left cheek mark is finished, and a matching right one is added. The chin outline is Tenna's own, taken from the clenched head (the same depth below the mouth) and fitted to this head's width. The fill is sampled from the original lavender (the same color and grain to within a level). The sprite config notes which rows are redrawn. Spamtenna, Flowey and Muffet carry the same file.
- Balance items 2 (Spamson NEO crossfire) and 3 (the Ant Tenna + Spamson warm-up turn) stay as designed, as confirmed.

## 2026-10-21 — Animation pass: typewriter wrap and Mettalot's sway

Stepped every fight frame by frame on a fixed 60 fps virtual clock (rAF and `performance.now` driven by hand). Captured four 48-frame bursts per fight (menus, dialogue, attacks), then scanned them for one-frame flicker (pixels going A→B→A, with shakes and flashes excluded), sprite pops and anchor jumps, and reviewed motion strips by eye.

- **Typewriter text no longer jumps lines (all 13 fights).** Every typewriter wrapped only the part typed so far, so a word reaching the end of a line was typed there and then jumped to the next line once it no longer fit ("almost n" → "almost / no"). Each fight now lays out the whole line with its own wrap rules and then reveals the first characters, so every word is typed where it ends up. A shared `typedLines` helper in each page maps characters back through the wrap. It was checked against every reveal length for greedy, indented (Battle Lab) and whitespace-collapsing (Ant Tenna + Spamson) wraps: lines only grow, never move. Muffet keeps measuring its smart-quote/ellipsis substitutions as drawn.
- **Mettalot's ghost, gloves, Blooky and stage glow swayed unevenly.** They were animated straight from the music element's clock, which in Chromium advances 9–27 ms per 16.7 ms frame, so the beat-driven motion sped up and slowed down every frame and the gloves stepped back and forth. They now follow a frame-rate clock eased toward the song: frame steps 16.67 ± 0.3 ms (was ± 4.2), within −0.7 ms of the music on average, snapping on pause, loop and restart. The rhythm notes still schedule from the real music time, so timing is unchanged.
- **Checked and fine:** idle loops and pose changes in every fight (no anchor pops or one-frame sprite drops), Encore's leaps (smooth, about 17 px per frame), Notebook timing bars, hurt shakes and flashes, Muffet's hands, Flowey's vines, the falling knives and blasters.

## 2026-10-21 — Pixel pass 3: broken Tenna head

- **Tenna's "determined" head was cut off mid-mouth.** Decoded all 228 images embedded in the fifteen games; one is damaged: `tenna-determined.png` (Spamtenna, Flowey, Muffet) stops after 169 of its 242 rows. It was already damaged in the original v60 hub, and no intact copy or source atlas exists anywhere in the project. Chromium draws the surviving rows, so Tenna appeared with the bottom of his head sliced off: for 0.7 s on every other wave cue in Ant Tenna + Spamson, and often during Flowey's Spamson NEO memory. The expression now uses Tenna's intact **cocky** head (the nearest face: a confident toothy grin), with a note in the sprite config. The damaged data is left in place. Muffet never shows this face, so its change is config only.
- Not redrawn: completing the lost rows would be new art. Ask if a redrawn "determined" face is wanted.

## 2026-10-21 — Pixel pass 2: Encore

- **Encore's expression overlay drew a black rectangle.** To swap in the authored expression, both of Encore's draw paths painted a solid black box over the face and then pasted the portrait crop, including a grey sliver of the hat band. The box was bigger than the face, so it cut through the hat brim, feather and collar. The expression is now cut out as the face itself: the connected face shape plus the eyes and mouth inside it, unioned with the neutral face shape so the old face is always fully replaced. The lifted-mask "void" expression becomes face-shaped darkness with eyes.
- **Encore's moving poses** were 1/3-scale sprites enlarged 1.27× times the animated boss scale, so pixels were uneven and crawled as the scale changed. They are now built at exactly their on-screen size with Encore's own coverage rule (cached per size) and drawn on whole pixels, with the face overlay aligned to the same pixels.
- Tried and rejected: area-averaging Encore's standing pose washed out its thin black interior lines (eyes, buttons, seams), so that pose keeps its original sampling.

## 2026-10-21 — Pixel pass 1: even pixels and crisp line art

Audited every sprite draw in every fight: smoothing state, effective scale, stretch, source rectangles and call site. Then inspected each boss at its native canvas resolution, enlarged 3–12× with hard pixel edges. No fight upscaled with smoothing on. The problems were uneven pixels from fractional enlargements, and soft source art sampled too sparsely.

- **Aqua (portraits and battle poses):** were reduced to 128 px and then enlarged 1.05–1.53×, so outlines alternated between 1 and 2 pixels thick and broke into dots. They are now reduced straight from the full sheet to their on-screen height with area averaging, then snapped to the same flat palette: one even pixel per canvas pixel, continuous outlines, clearer eyes, mouth and bow. Props (knife, bow, clock, …) already used whole-number scaling and are unchanged.
- **Rift (Hollow Crown and its props):** were nearest-sampled from a 1536 px sheet at about 0.1×, catching scattered soft edge pixels, so the crown's white outlines came out thin, grey and broken. Now area-averaged to the exact size and snapped to white-on-black: solid, crisp lines.
- **Mettalot, Blooky and the gloves:** were 64 px frames enlarged 2.44× (mixing 2- and 3-pixel columns). Frames are now rebuilt at the exact number of game pixels they show (78 for the 156 px ghost) and enlarged by a whole number: the same size and chunky style, with every pixel even and the outline continuous.
- **Torn Notebook sprite (all 13 Notebook builds):** the 44 px frames were drawn at 2.4–2.58× in the 768 px fights. They now snap to whole-number scales: 2× while spinning (the size the 640 px fights already used), 3× on impact.
- **Checked and left as is:** Encore, Gerson, Sans, the blasters, Muffet, Spamtenna's moth and the in-battle SOUL were already crisp. Spamson NEO's softness is mostly its black anti-aliased outline against black; the alternatives tried were not clearly better, so it is unchanged.
- Aqua builds re-stamped **R32**.

## 2026-10-21 — Punchline camping fix

- **Ant Tenna + Spamson, THE FALLING PUNCHLINE** (and ONE LAST LITTLE THING, which shares its drops): anvils now land on eleven staggered slots across the whole floor, shifted half a slot on alternate waves, so standing in a wall band or a column gap no longer avoids every drop. This also fixes the column formula repeating the first anvil's column for the third, so each wave now really has three distinct drops (two with BRACE). Warnings, timing, speed and damage are unchanged. Verified: still bot 0 → 40 damage/min, random dodger 60/min; god-mode bots still reach victory at turn 27 with no errors.

## 2026-10-21 — Bug and balance hunt, simulation harness

- Added `tools/sim/`: a Node harness that loads each fight's engine straight from `games/*.html` and plays it with bots (chaos/progress bot, balance probe), plus an in-browser bot for Muffet. See its README.
- Ran ~40 simulated hours of bot play across all 12 engines, Muffet's engine in the browser, a balance probe of every fight, and ~9,500 random key presses against the real exported pages. **No crashes, invalid numbers, soft-locks or page errors.** Every fight was completed in god mode.
- Found three balance/design questions, reported for a decision and not changed: a camping hole in Ant Tenna + Spamson's "THE FALLING PUNCHLINE", Spamson NEO's "crossfire" being safe for a still player, and Ant Tenna + Spamson's unusually harsh opening turn. Full details are in [docs/Bug-and-Balance-Report-2026-10-21.md](docs/Bug-and-Balance-Report-2026-10-21.md).

No game files changed in this step.

## 2026-10-21 — Location atmosphere

Each fight now has a light, location-themed atmosphere behind the battle (`AmbientFX`, in the shared Notebook module). It is drawn right after the fight's own background, so the arena, text boxes and sprites paint over it. That means it never shows inside the box where it could be mistaken for a hazard; verified at full resolution during attacks.

| Fight | Atmosphere |
| --- | --- |
| Encore | A warm stage light from above, with dust turning in it. Genocide: the light stutters and the dust greys out. |
| Rift | Quiet snowfall under a cold light. Cataclysm: muted, and the snow drifts upward. |
| Gerson | Waterfall's ceiling crystals twinkle cyan; a few motes drift up. |
| Mettalot | Pink and white glitter rising through her spotlights. |
| Sans, Sans + Alphys | Orange and blue CORE energy rising, with a heat glow from below. |
| Ant Tenna + Spamson | Hotland embers and a flickering heat glow from below. |
| Spamson NEO | A few neon pink and violet sparks hanging in the dark. |
| Muffet | Purple spores drifting under a faint haze over the nest. |
| Aqua | Ash settling in a cold light, with the odd cyan glint. |

Flowey (already has its living vine layer) and Battle Lab are unchanged. The atmosphere freezes when paused, holds still under reduced motion, and is off on title, death and Game Over screens. Aqua builds re-stamped **R31**.

## 2026-10-21 — Phone landscape

Phones (and tablets) held sideways now get a proper battle layout in every fight. The game fills the screen height, the D-pad sits in the left margin, and action buttons sit on the right. Before this, Mettalot, Muffet, Spamson NEO and Ant Tenna + Spamson had every control below the fold, both Sans fights rendered a 264×220 game, and Encore/Rift/Gerson scrolled.

- **Sans, Sans + Alphys, Mettalot:** controls float in the side margins; the Z button is large, with X beside it and ♪/Ⅱ/↻ above.
- **Ant Tenna + Spamson, Spamson NEO:** D-pad left, X and FIRE stacked right, PAUSE/SOUND in the top corners; the footnote is hidden in landscape.
- **Muffet:** three columns. Left: toolbar and D-pad. Centre: the arena. Right: the action panel (FIGHT/ACT/ITEM/MERCY and choice lists, scrollable if long), with BACK/CONFIRM below it.
- **Encore, Rift:** title and PACIFIST/GENOCIDE on the left, toolbar on the right, D-pad and X/Z in the bottom corners.
- **Gerson:** MOVE pad left, SHIELD pad and utilities right.
- On small phones (667×375, 740×360) the arena shrinks just enough for the side controls to fit, rather than overflowing.
- Landscape pages no longer scroll at all.

Applies only to `(pointer:coarse) and (orientation:landscape)`, so desktop and portrait layouts are unchanged (re-measured). Verified at 667×375, 740×360, 844×390, 932×430 and 1180×820: nothing off-screen, and tapping the on-screen confirm button advances every fight. Aqua and Flowey already had this layout and are unchanged.

## 2026-10-21 — Spectacle pass 1: impact and feedback

A shared effects layer (`ImpactFX`, inside the shared `notebook-visual.js` module in all 13 Notebook builds) runs as the last step of every frame. It re-blits the finished frame for camera shake (slightly enlarged so no bare edge shows), then draws shockwave rings, pixel shards and flashes. It is purely visual and never touches encounter state, timing, hitboxes or damage.

- **Torn Notebook impact:** strength scales with timing quality. Perfect strikes get gold shards, a stronger shake, a warm flash and a second shockwave ring. Ordinary shots that land on Aqua get a light version.
- **Timing stops:** each press answers on the bar: a gold spark burst for a perfect stop, a soft purple ring otherwise.
- **Seth hurt:** a short jolt plus a red glow pressing in from the screen edges, layered on each fight's existing hurt shake.
- **Set pieces, per fight** (via `fx.bind(game, map)` on each fight's own event names):
  - Gerson: hammer landing, shatter, vine-wall break, Aqua stealing the kill; a tiny tick on shield blocks.
  - Ant Tenna + Spamson: the explosion, transformation, menu blast, cannon shots and impacts.
  - Spamson NEO: the injection (pink flash), transformation, menu blast, cannon shots.
  - Muffet: slams, captures, the cannon, soul break. Only Seth's damage triggers the hurt effect, not Aqua's.
  - Sans / Sans + Alphys: blasters firing, gravity slams, gate breaks, CORE beams, Aqua's slashes.
  - Flowey: blaster blasts, control-warp flashes.
  - Aqua: Seth's special skills landing, her assault, parry ticks.
  - Every fight: a hard jolt on Game Over.
- **Fairness guard:** effects triggered by hazards during dodging (blasters, cannon fire, beams, slams) are capped to a gentle shake, so they never make the arena hard to read.
- **Reduced motion:** each fight's own "reduce flashes/motion" toggle is honoured (Encore, Rift, Flowey, Gerson, Aqua, both Spamson builds, Muffet), as is the system reduce-motion preference everywhere. With it on there is no shake, and flashes drop to 30%.
- Aqua full and finale practice re-stamped **R30**.

Verified with no page errors in any build, the hurt effect captured firing in all 12 Notebook fights, impact and timing-stop effects captured frame by frame, and all 17 hub entries launching.

## 2026-10-21 — Polish pass 1: visual defects and screen fit

Found by playing every build headlessly at desktop (1280×800) and phone (390×844) sizes and reviewing the frames. No mechanics, damage, timing, dialogue or art were changed.

### Torn Notebook overlay (all 13 builds that use it)

- **Empty frame lingering after the strike.** During the 0.52 s impact phase the overlay kept drawing its black panel and white border at full opacity, so an empty box sat over the encounter's next panel (Gerson's GUARDED readout, Aqua's duel arena, Sans's dialogue). The panel now clears in 0.14 s once the strike resolves. Encore, Rift and the Tenna/Spamson duo keep it, because they deliberately present their pre-strike state during impact and the next panel there is the same box.
- **Wrong position on 768×640 canvases.** The panel assumed a 4:3 canvas, so in Sans — No Promises, Sans + Alphys and Mettalot it sat ~45 px low, hid the HP row, and the encounter's own box peeked out around it. Builds can now set `game.notebookPanelY` / `game.notebookPanelH`; those three align it to their box. The timing content stays centred in the panel.
- **Contextual cue line.** Builds can set `game.notebookCue()`; Mettalot uses it to keep its pink "STRIKE A POSE" cue visible above the Notebook.
- Each installed Notebook now records its encounter `kind`.

### Encounter fixes

- **Mettalot:** the menu narration ("Three strings and a ghost who wants her name in lights.") was one centred line wider than the 420 px box; it now wraps inside it. The "GAP n" lane cue no longer prints over the METTALOT name tag — the tag fades out while a cue shows and the two cross-fade.
- **Sans — No Promises / Sans + Alphys:** the attack caption (e.g. "IMPACT · JUMP AWAY FROM THE BONES") was drawn straight over Sans's sprite; it now has a dark backing plate.

### Fit the screen (desktop, mouse + hover devices only)

At common laptop sizes (1024×700 to 1920×1080) seven builds were taller than the window, pushing the command row or controls below the fold. All battle builds now fit the window with no scrolling, at those sizes and inside the hub player:

- **Gerson:** both touch D-pads are hidden on desktop (WASD/arrows already drive them); the stage scales to the window height. Sound/pause/reset/X/Z buttons remain.
- **Ant Tenna + Spamson, Spamson NEO:** their "hide touch pad on desktop" rule was written `@media(...)and(pointer:fine)`. CSS parses `and(` as a function token, so the query was invalid and never applied; the syntax is fixed and the stage scales to the window height.
- **Mettalot:** D-pad hidden on desktop; stage scales to the window height.
- **Muffet:** stage scales to the window height.
- **Encore, Rift:** sizing formula was 5 px short; corrected.

Phone portrait and landscape layouts are unchanged (verified identical before/after with touch emulation).

### Builds

- Aqua full and finale practice re-stamped **R29** (`2026-10-21-R29`) on the HUD, title, pause build line and meta tag. The R29 changes are only the Notebook overlay fixes above. `AQUA_BUILD` is display/snapshot only, so no saved memory is invalidated.
- Hub rebuilt from `games/`; all 17 hub entries (15 files, three Tenna/Spamson variants) launch without errors, and extraction round-trips exactly.

### Verification limits

Automated headless Chromium only: scripted input, screenshots, layout measurement, console/page-error capture. Not a human playtest, not phone hardware, and no audio audibility check.

### Known, not yet addressed

- Phone **landscape** still scrolls in Mettalot, Muffet, Spamson NEO and Ant Tenna + Spamson (unchanged from before this pass).
- In Aqua the Notebook panel covers the TP bars while it is open. (Fixed in R33.)
