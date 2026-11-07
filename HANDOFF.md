# PURPLE — The Underground: developer handoff

Prepared October 20, 2026 (Puerto Rico). Read this before changing the games.

## Start here

This is an existing collection of elaborate Undertale-style browser encounters. The user wants to explore coding at a larger scale. Their next large feature has **not** been specified: ask what they want to build after inspecting these files. A wholesale rewrite, engine migration or continuous campaign is not automatically authorized.

Open `originals/Purple-The-Underground.html` for the complete launcher containing all fifteen playable builds, including Extras and finale practice. Each embedded game contains its runtime code, music, sprites and fonts. This lean package deliberately omits duplicate separate game HTMLs and standalone versions. Use `python3 tools/extract_hub.py originals/Purple-The-Underground.html games` from this folder to recover all fifteen exact game HTMLs on demand without running JavaScript. No additional download is required.

`originals/` also preserves project records, the original Claude rewrite ZIP and the R28 verification report. Unzip the dialogue archive when needed; a redundant expanded copy is omitted. `references/` holds the four supplied Aqua design images. `MANIFEST.json` and `SHA256SUMS.txt` describe this lean package.

The original editable Git repositories and original test trees were not recovered into this package. The packed games contain runtime code, not complete repository history/tests. Working paths in older notes may no longer exist. The dialogue-only JS files in Claude's ZIP are not complete game sources.

## Included files and authority

| File | State and purpose |
| --- | --- |
| `originals/Purple-The-Underground.html` | Current recovered hub, version 60; all fifteen playable builds |
| `originals/Game-Continuity.md` | Version 40; development decisions, history and verification limits |
| `originals/Game-Dialogue-Lore-and-Character-Guide.md` | Version 1; October 9 exact script archive with October 13 voice guidance |
| `originals/purple-soul-dialogue-rewrite.zip` | Claude's later character voice pass and README |
| `originals/Aqua-R28-Verification.txt` | Historical R28 standalone verification and identity; that separate standalone is omitted here |
| `references/` | Four user-supplied Aqua design images and their descriptions |
| `tools/extract_hub.py` | Extract all fifteen exact game HTMLs from the included hub |

Separate standalone versions recorded in the previous full handoff were Aqua full R28/canonical version28, Aqua practice version11 and Sans Misery version9. They are omitted to avoid duplicates. The hub has its own accepted dialogue variants; extracting its payloads preserves those variants rather than manufacturing byte-identical standalone copies.

Authority: latest explicit user decisions > accepted current implementation > relevant recent continuity entry > interpretations > historical drafts. The continuity document is not uniformly chronological: apply dates and explicit supersession, rather than blindly selecting the first or last paragraph. Current executable code shows implementation, not proof that every bug is fixed.

The hub has a later Claude dialogue pass than some standalone sources. Aqua hub and standalone HTMLs intentionally differ in authored dialogue. Preserve each build's accepted wording instead of overwriting newer hub modules with older standalone ones. The supplied rewrite has largely already been integrated into the hub: do not blindly apply it again over later mechanics/dialogue.

## Working with the user

- Treat requests as instructions to act, and carry work through implementation, verification and concrete delivery.
- Avoid repeatedly requesting permission for routine authorized work. Ask about genuinely missing creative scope rather than inventing it.
- Give meaningful progress updates; do not disappear during long tasks.
- The user calls assistants servants, tests the games personally, and uses Claude to inspect/record builds independently.
- Treat playtest reports as evidence even when simulations pass. Reproduce the actual path and exact exported file.
- Preserve their ambitious mechanics. Do not silently simplify, nerf or replace them for convenience.
- Be concise and candid about what changed, what ran and what remains uncertain. Never report a failed test as a pass.
- Update downloadable HTMLs as well as affected websites. An old export does not update with source changes.

## Shared canon

Seth is the living Purple SOUL human, associated with perseverance, wielding the Torn Notebook. This is an earlier human's journey through the Underground, before Frisk.

Aqua is another living human: Cyan SOUL, patience. She is stronger and more experienced than Seth, treats the Underground as a playground, and behaves like another skilled player who understands the system. Patience is active predation, not gentleness. They do not pity each other.

They split the finite genocide EXP/LOVE pool. Both are individually far weaker than genocide Frisk. Skill, strength, LV and determination are distinct. Neither human individually exceeds Flowey's determination.

Aqua **believes** killing Seth may give her Flowey's control over time. This is a motive, not a confirmed law. Adaptive memories do not automatically give her independent RESET ownership.

The hub is currently an encounter launcher, **not a continuous campaign save**. Do not invent imported choices, kills or deaths without adding real state and agreeing on scope.

## Route map

| Region | Pacifist / neutral | Genocide |
| --- | --- | --- |
| Ruins | Encore — Count Anansi: THE SHOW (spare after the letter; he can be killed after 5 attacks) | Encore — THE LAST SHOW |
| Snowdin | Marigold — The Forgotten Memorial: THE TRAP (pacifist only; no neutral fight) | Marigold — THE HUNT |
| Waterfall | The White Roaring Knight — A New World (pacifist only), then Mettalot — Waterfall After Dark (pacifist and neutral) | Gerson — What For? |
| Hotland | Ant Tenna + Spamson — The Next Big Thing, currently pacifist only in launcher | Spamson NEO — A Deal in the Dark, then Muffet — The Dark Nest |
| CORE | QU5EN — Quantum 5 Engine (pacifist only), then Sans — No Promises | Sans + Alphys — Misery Likes Company |
| New Home | Flowey — two neutral versions: FALSE PACIFIST (Inside Your Best Friend) and FALSE GENOCIDE (She Gets Her Game Back) | Aqua — Last Playmate (KILL or the R35 SPARE) |

Aqua finale practice is a shortcut into the same canonical fight. Battle Lab, LAST BELL and Ant vs Termite are Extras. LAST BELL's separate universe and the colony simulation do not establish Underground lore.

## Presentation and difficulty preferences

The battle is the interface: black space, crisp white borders, actual supplied Undertale font, recognizable orange FIGHT/ACT/ITEM/MERCY buttons, readable HP/LV/resources, practical keyboard/touch controls. Avoid website dashboards, landing-page clutter, developer jargon and tutorial walls. Introduce novel controls with short contextual cues.

Dialogue usually belongs near the speaker's head; narration has its own battle area. Expressions match individual lines and real conditions. Story develops throughout the fight. Boss positioning should explain attack origins. Preserve Seth's purple and Aqua's cyan identity outlines even when mode fills change.

Hard means overlapping decisions, geometry, resources, commitment, deception and mechanical personality—not merely speed, health or duration. The user loves stage manipulation, fullscreen spectacle and bosses bending familiar rules. Invisible damage, impossible mode combinations and arbitrary controls are implementation defects, not good horror.

Progress must matter. Avoid secret HP restoration, unlimited healing or mandatory extra rounds that punish good damage. Use warnings, reachable openings and honest collision silhouettes. Counter camping/tiny shuffles with varied observed responses rather than repeating one cheap answer forever.

## Art and audio

Preserve supplied assets/music. Current Aqua: black bob, red bow and eyes, black dress, white collar/hem; eight body poses and twelve portraits on transparent atlases. Use correct bounds/anchors, limited palette, nearest-neighbor scaling and unstretched crouches. Inspect actual composed scenes and alpha: backed rectangles, wrong crops, mismatched eyes, extra faces or a face on the back of a head are defects.

The four reference images are inspiration for grazing, TP bars, Notebook assault composition and large white guarded knives. Do not use them as replacements for Aqua's character art. Her ordinary knives are visibly substantial; fullscreen blades are larger. Visual tips, warning geometry and live hitboxes must agree.

Browser audio needs a real user gesture. Handle music/effects separately, pause/mute/blur and playback failure. Aqua's jumpscare plays the full original clip even when its picture ends sooner. Reserve special slash audio for meaningful cuts/parries/finishing strikes; don't spam it for every knife. Distinguish shots, hits, shield blocks and damage. Scheduling checks do not prove phone audibility.

The Torn Notebook is a real timed multi-stop weapon. Preserve spin, confirm ticks, BLAM, damage feedback and encounter-specific adapters. Sans can disable timing lines before the strike. Test installed input/impact handlers, not just an isolated damage function.

## Aqua — Last Playmate: current contract

Seth LV10 / 56 HP; Aqua LV14 / 72 HP. Make it feel like two real players. Aqua dodges gracefully with rhythmic acceleration, grazes strategically, conserves supplies, chooses cheap tactics, gets frustrated and can bank TP for a dangerous release. She has finite supplies, stamina and TP, not cosmetic resource bars.

### Turn parity, damage and TP

Every Aqua support action consumes her whole attack opportunity: healing, recovery, preparation, failed/interrupted actions and techniques. Every attack pattern is purchased with TP. During Seth's ordinary attack she defends; she gets no unrelated free damaging barrage.

DOUBLE TURN costs 40 TP for either human. Aqua must afford support + 40 + attack, with actual item consumption and no overdraft. Seth's second action ends his turn. Status preparations wait for the next appropriate paid attack.

Current ordinary pages deal 2 damage, READ/recovery counters 3, green/reflected shots 2, timed Notebook 2/4/6. Seth grazing earns 6 TP/second; Aqua 60. Repeated proximity to the same active damaging hitbox earns continuously, with one aggregate amount per simulation tick. No overlap multiplication, warning/harmless-contact/paused farming or graze reward on a hit. Preserve hollow SOUL outline and independent slanted orange/red TP bars.

Aqua has three actual parries per exchange, including local defensive cuts. Wards must not replenish the budget. After that she relies on movement and real vulnerability.

### Seth's seven offensive TP skills

| Skill | TP |
| --- | ---: |
| PAGE STORM | 25 |
| MARGIN TRAP | 40 |
| OMEGA NOTEBOOK | 100 |
| SHELL PRESS | 35 |
| WEB SCRIPT | 45 |
| NEO BURST | 60 |
| CORE CROSSING | 55 |

First three: original Purple/Notebook patterns. Others: recognizable prior-boss mechanics recreated through pages/ink/weapon assets, not established stolen monster magic. GUARD costs 20 for one real next-wave hit block.

An offensive skill replaces Seth's attack for the turn. His SOUL/hurtbox is absent; Aqua dodges actual geometry with finite parries/stamina. These should be powerful, overwhelming rewards requiring frantic defense, while actual collision determines damage. No scheduled HP deductions. Existing targeting/volley controls and READ/BAIT/BIND remain meaningful.

### Aqua's current prices

| Action | Price / effect |
| --- | --- |
| RECOVER | 35 TP; +0.7 stamina; no TP reward |
| SECOND WIND | 45 TP; full stamina refill |
| MEND | 30 TP; +16 HP |
| EDGE GUARD | 15 TP |
| CROSSCUT | 25 TP |
| FOCUS | Whole turn; +30 TP, no stamina refill |
| DOUBLE TURN | 40 plus actual support and attack |
| STILL WATERS | 100 TP |

Current 24-pattern prices in existing declaration order:

```text
4,5,5,5,6,6,6,6,7,8,7,8,8,9,9,9,9,10,10,11,11,12,15,35
```

Frustration's first/second pattern switches cost 5/7; impulsive Cyan costs 3. Preserve affordable planning, no free recovery, genuine TP charging and no MEND/FOCUS loop that prevents finale purchase.

### Motion and choreography

Ordinary motion remains 196 px/s, acceleration 1200 px/s². Warned lunges travel at 760 px/s on a snapshot-locked ray across the arena, not a curving homing dash. Ordinary dodging stays physical. Forecast actual delayed/curved threats, fatigue, walls and second escape directions; don't read future player input or teleport.

Cyan should matter: visibly drive stage rotation mid-attack. Frustration can buy telegraphed pattern changes without deleting existing projectiles. BIND/forced routes/incompatible modes exclude unsuitable changes. Aqua borrows previous mechanics but uses her own knives and personality.

At low HP, local defensive cuts are warned and share the three-parry/stamina budget: 58 px reach; they do not clear remote threats or beams. Preserve current preparation, active/cooldown windows and exclusions.

Fairness corrections already made: Green blocks the actual long knife tip; opposing curtains share reachable gaps; fullscreen knife fields occur in the free Yellow finale section with a persistent warned diagonal lane; inappropriate lunges/potshots/CROSSCUT stacks are excluded. Do not restore older unavoidable stacks.

### Critical recall and earned finale — newest rule

This overrides historical mandatory-23-chapter, free-refill and earlier protected-barrage rules.

Aqua has ten finite healing items. Before finaleFinished, a real hit leaving her at <=12 HP triggers a visible approximately .65-second SOUL recall. Otherwise-lethal damage leaves 1 HP for withdrawal. It interrupts the attack; it does not allow her to continue an invincible barrage. It applies to normal pages, actual timed Notebook, all paid skills and counter/self projectile damage.

- Recall from Seth's turn cancels remaining assault hazards, then gives Aqua exactly one ordinary resource/action choice. No enemy-wave completion/reward or TP refund.
- Recall from Aqua's turn stops hazards immediately and completes the already-paid wave once.
- Keep actual HP loss, TP spending, stamina and consumed items; no free healing, replay or extra turn.
- During recall from a special only Aqua's SOUL is shown. Notebook impact presentation must respect recall state.

The actual final pattern **ONE MORE TIME** is eligible only when:

```text
enemyItems.length === 0
AND enemyInventoryUsed >= 10
AND enemyHP > 0 && enemyHP <= 18
```

It additionally needs its earned queue and actual 35-TP purchase. Completing 23 normal waves does not auto-unlock it; playing every normal pattern is not required. After ordinary patterns are exhausted, tactical normal replay choices remain available. Finite emergency healing takes priority over endlessly preserving unused supplies with renewable MEND. If her last item heals above 18, ordinary play continues until HP is pushed low again.

STILL WATERS is a separate 24-second 100-TP super, not the finale: no chapter skip, health refill or finisher unlock. The authored true finale can last 40 seconds, but actual recall can break it early. Completing/breaking it opens one next-turn 999999 Notebook finisher and the original ending. Practice explicitly bypasses full-fight progression.

R28 centralizes finaleEligible and guards queue, catalog, purchase, actual beginWave starter and final completion. A direct starter fallback previously bypassed planner checks. Preserve defense in depth and test real exported startup rather than only new AquaBattle fixtures.

R28 appears on HUD and in pause; for historical reference, the omitted full standalone SHA-256 is:

```text
5d81c296922cb14ebeddfbeb1619260217affe8b2e8ad72be9cdc0ad38600550
```

The prior saved standalone R28 file was downloaded again and matched tested bytes. Its digest above is historical reference; the lean package contains the hub variant instead, which intentionally has different dialogue and bytes. The user's older received bytes were not available; do not claim caching was proven or that their report was mistaken.

### The spare (R35)

After her final attack ends, ACT becomes TALK. Before that, nothing changes: SPARE gets the usual dismissal and FIGHT still leads to the kill.
- **Three talks:** Partners, The Nest (Muffet's nest; he could have let her die there), and Not Enemies. Each is answered, then she tries an attack and it falls apart. Those are three new weaker, shakier attacks: MAKE IT FUN (restarts twice, half its warnings fizzle), SEVEN PLANS (fragments of her old attacks, each abandoned) and THE LAST TURN (one wobbling knife that drops before it reaches him). They hit for 60% damage, never below 1 HP, with longer invincibility frames.
- **SPARE turns yellow after the third talk.** Pressed earlier, it gets "Nice try." / "Is that a bit?..." / "Stop pressing that...".
- **Sparing her:** her kept lines play, then she runs off-screen (with reduced motion she fades instead), and the card reads NEUTRAL / FLOWEY: FALSE GENOCIDE. Ending id: `spared`.
- **FIGHT after any talk** gets one line, then the existing finisher and kill ending.
- **Narration pages** inside her dialogue use face −1: no portrait, the text sits in the main box, and a plain click replaces her voice.

## Other encounter contracts

### Muffet — The Dark Nest

Genocide Hotland infestation, with Aqua/Spamson/Tenna visibly captive. Six anatomical hands. Four connected silk layouts: horizontal, vertical, grid, fullscreen web. Visual crossings are not automatically traversable junctions.

Win by real persistent damage forcing Muffet to withdraw; she survives. Turn 60 is fatal, not survival victory. Turn50 tea speech, silence51–58, turn59 taunt and turn60 trap remain. An already-earned withdrawal takes priority.

Spamson's three finite NEO shots: 160 → 240 → 360. Reweb after every shot; later shots need renewed arm release/readiness. Tenna proof doesn't require complete rescue. Removed lamp webs stay removed. SIT TIGHT has damaging sweat and physical compression/kicks, **no spiders**. HIP CHECK tosses stage/souls along valid connected paths. Fatal last crush cuts to black then Game Over with Muffet's smile: no restored box, extra pose or face on the back of her head. Older fatal-grab proposals were superseded by accepted 28-damage bites/10-damage palms.

Aqua chooses independently, forecasting current HP/supplies/damage, exit preparation and physical travel before the deadline. She may leave Seth; her escape does not automatically win his encounter. Preserve competent restored navigation and SIT TIGHT survival. Green pity tea requires no usable player healing items and Muffet strictly above 50% HP.

### Sans + Alphys — Misery Likes Company

Forty waves with Aqua, Alphys machinery and later transactional Flowey support. Finite resources, TP and percentage interest. Fixed visible-tip Yellow shots, no homing or shooting heat. Real linked machinery, shootable white/gold cells, bullet-proof steel, rotating emitters and required charged-skull objectives.

Later readable-pressure/phase-one nerfs supersede the earlier maximum-density figures. Solo jump waves use fixed nontracking beam rows, readable grounded/jump beats and a real landing window. Keep 75-second finale and real charged-skull gates. Aqua/Flowey support cannot automatically complete required gates.

Aqua has hidden neutral-start morale: never expose its number. Reciprocal support, paired Notebook quality and shared hardship matter. Repeated warned neglect can produce resentment, real pie theft and warned nonlethal shoves. Mutual severe danger triggers a finite once-per-life berserk response. Finale local slashes can cause real lethal friendly fire; staying away avoids them. Help uses actual stamina/items/cooldowns, not infinite rescue.

In-game phase code: up up down down left right left right X, then selector and Z, on title/pause. Up = wave1, right = Aqua11, down = Alphys21, left = Flowey31, X = final40. Preserve touch/keyboard recognition and cleanup.

Sans survives via remote projection. His data/Asgore/million-resets boast is an intentional intimidation bluff. The private Alphys/Sans epilogue reveals it; it helps fracture Seth and Aqua's alliance, not objectively upgrade Asgore or transfer RESET.

### Gerson, Mettalot and Flowey

Gerson: approved 17-turn pacing; Flowey helps but is absent from the middle. Seth exhausts him, Gerson blocks the final blow, Aqua steals the kill/EXP. Preserve the user-authored Aqua line and zero-EXP consequence.

Mettalot: Purple SOUL, showmanship/ratings, Napstablook, distinct quiz/rhythm/dance. Phase2 at750, finale around1500–1750, target2000. Spin controls, seeking tears and laser pointer must function.

Flowey: both Flowey fights are neutral, not pacifist, and both are built: two variants on one hub card. The false-pacifist neutral (`flowey.html`) is the one where Seth spared everyone. Flowey is disappointed: two humans, and Seth chose to be a weak, sentimental sap. Together, Seth and Aqua might have been a real threat to the king. As things stand, he takes Seth's soul, and maybe then Aqua will stop being so disappointing.

Three acts, following the designer's Undertale Yellow reference (`docs/reference-study/flowey-study.md`):
1. His rigged battle in the box. Short attacks; face-barrage SAVEs that lead straight into chase LOADs through rooms Seth walked.
2. The dark, where he takes the soul.
3. Inside him, boxless. Phases alternate with the six pages, and Seth's Torn Notebook acts on his turns.

Only pacifist-route bosses return as replayed attacks. The six fragments are pages from one Purple SOUL's life, not six human souls. Keep the functional false/moving commands, fake Game Over and stolen mechanics. Seth can deny him the soul; the body does not stand up and leave, and the king eventually receives it. Flowey uses his canon Undertale battle frames, here and in Gerson and Sans + Alphys; when talking, only his mouth moves. His supplied voice blip, evil blip, hurt cry and laugh are in the fight. His own line attacks are vines, not laser beams: a flickering warning, then the vine swooshes in from off one screen edge and travels across to the other, visibly and with the Omega yowl. Only the covered length hits. It never comes from his eyes or body; replayed bosses keep their own beam art. FIGHT must feel rewarding: in act one his health bar takes real damage until he rigs it at the end of each cycle (LOAD, extra zeros, your attack set to 0); in act three the hits stick. In act three he is his canon sprite, huge (5×), with original thorned vines behind him; the designer rejected an original creature design, so don't invent a new body for him. Every boss Flowey borrows uses its source fight's current art: Sans and the Gaster Blasters (`sans.html`), Marigold (`marigold.html`, her frames), Mettalot (`mettalot.html`), and Encore's attack atlas and body (`encore.html`). Spamton/Tenna, Gerson, Muffet and Alphys are cropped from today's games. The false-genocide theatre replays Encore's genocide timeline, not his pacifist one. Sync with `tools/sync_borrowed_art.py games/flowey.html`, then rebuild the false genocide. Never ship older art than the source fights. Sprites cut out on black (Sans, Encore, Alphys) are drawn with their insides filled black (`backed()` in the page script), so nothing shows through them.

**False genocide (`flowey-genocide.html`).** Seth killed everyone, then spared Aqua at the end of Last Playmate. That spare shattered her point of view and she ran off somewhere in the Underground. Flowey has run this over and over, trying to get his perfect ending, and he WILL. He put Seth and Aqua in each other's paths and held every door. They were hopeless brats who needed his help, but they started getting stronger. If they had finished the job, he would have left them alone. Now it isn't a fight, it's course correction: even if Seth wins, he just goes back. The false-pacifist Flowey was bored; this one is furious. The designer wants this route dire, hopeless and overwhelming. Contract:
- **Tone:** cruel and sardonic throughout, never begging. The theme is the designer's supplied track (Inverted Fate "Checkmate").
- **Static:** every SAVE, LOAD, rig, rug, death retry, chase LOAD and act change tears the screen with static and a hiss. LOADs carry a counter in the thousands (`LOAD #4,813`…). He also SAVEs and LOADs inside attacks, rewinding Seth and every bullet. Tenna-footage-style static cuts: hard cuts through static to a red-tinted, VHS-captioned frame of the past at every attack, chase, page and LOAD. They also hit his slashes (a red X-marked band, then a static gash) and every box break (the old box shatters). The fight freezes during each cut, so cuts never hide a hit.
- **Seth is LV 10 / 56 HP:** attacks cost about 1.4× the false-pacifist fight's HP per minute.
- **Chases:** crowds of laughing Floweys line the walls and throw aimed pellets. Each one laughs once as it comes into view: one of two supplied laughs, at random pitch, overlapping. That makes the escapes about 25% harder than false pacifist; the designer asked for it.
- **The rigs are aimed at a killer:** EXP → his HP, then a bar named AQUA ("...Huh. It didn't."), then ATK 0 / LOVE 0. The chase rooms are emptied, and act three replays only genocide bosses with their own mechanics and art. His own line attacks stay vines. The sixth page, the spare, makes Seth's strikes ×2.2.
- **The ending must kill Flowey, in this order:**
  1. Seth tears out of him.
  2. Small again, Flowey taunts him ("Even if you win here? I'll just go back.").
  3. Only FIGHT works.
  4. The first slash really gets him.
  5. He laughs in Seth's face: "Sans was right, you know? You might as well have let Sans win. Aqua's gone. And Asgore's ahead..."
  6. YOU'RE ALREADY DEAD.
  7. Seth, in anger, attacks over and over until he is dust (16 strikes; mashing Z swings sooner).
  8. Silence, then the epilogue: "Somewhere, a file is still saved."
- **Determination:** 5 points, internal (shown only on GAME OVER and in CHECK). Each death spends one; dying with none RESETs the fight to the intro. It refills once, on first reaching COURSE CORRECTION.
- **ACTs:**
  - REMEMBER: +1 determination, at most every 4 turns.
  - RESIST: the next attack's hits cost 2 on Normal (30%).
  - THINK OF AQUA: +1 STOLEN PIE, 3 at most.
  - CHECK: shows determination.
- **Seth's slash sound** plays on every strike of his final frenzy.
- **Page phases** are Seth's Aqua-fight specials turned on him (PAGE STORM, MARGIN TRAP, SHELL PRESS, NEO BURST, WEB SCRIPT, OMEGA NOTEBOOK). The page is sealed in thorns for 9 s, then drifts; Z calls it from 12 s. These "omega" attacks are never fatal: they stop at 1 HP.
- **Chase Floweys** use the designer's overworld sprite (`tools/flowey-genocide/art/overworld-flowey.png`) and sprout procedurally as they come into view.
- **Glitch frames:** occasional laughing-face cuts; Muffet's frame is her CRUEL GLEE face.
- **Seth survives** (still the designer's call to change). The king is still ahead.

The script is the designer-approved S-tier revision. Lines marked kept are verbatim. The sources and build script live in `tools/flowey-genocide/`: run `geno_assets.py` to recrop the replayed bosses' art from their own games, then `geno_build.py games/flowey.html games/flowey-genocide.html`. `track.mp3` there is the route's supplied theme (Checkmate), trimmed to 0:02.5–2:24 so it loops cleanly.

### Tenna/Spamson and Spamson NEO

Lobby residents seek stardom/hero status by capturing the human. Spamson wears only the stolen cannon arm there, not the entire robot. Tenna/Spamson partnership matters; Purple with Yellow+Purple duo mechanics. Distinguish this from genocide winged Spamson NEO.

Genocide Spamson injects stolen determination only after0HP. Muffet captures him before Seth finishes him. Persistence/no dust/strange taste explain her curiosity, not automatic scientific knowledge of determination.


### QU5EN — Quantum 5 Engine (CORE, pacifist only)

A unique pacifist fight, so the pacifist route has something genocide never gets. She is the CORE's own intelligence, an Undertale-side analog of DELTARUNE's Queen (as Spamson and Mr. Ant Tenna are of theirs). On pacifist she comes first in the CORE, then Sans's *No Promises*. There is no genocide or neutral version. Sources and build: `tools/qu5en/` (see its README).

**Who she is (designer canon):**
- QU5EN = Quantum 5 Engine. Built by the previous royal scientist to run the CORE and finish his research: tapping into the nature of the SOUL, and finding what he theorised was the SOUL of pure determination, the red SOUL.
- **Never name him.** He was erased from history: on screen he is only ever "the previous royal scientist". She can't remember him.
- He is played for laughs as the quirk of a defective machine, like Atua for Angie: her creator has whatever traits she decides, in the moment, are the coolest and most convenient ("HE LOVED HUMANS!" / "Then why are we fighting?" / "COMPUTING: AH, MY BAD, I MEANT HE LOVED *STUDYING* HUMANS. HATES THE LITTLE BRATS. PROBLEM: SOLVED!").
- She doesn't like Alphys and doesn't think she lives up to her master: Alphys's calls are declined.
- Voice: DELTARUNE Queen's (Every Word Capitalised, almost no punctuation, colons in odd places, stage directions in brackets, chat-speak) mixed with the Forgotten Man's (gentle ALL CAPS, seasons, lists, eggs as keepsakes). The ALL-CAPS lines are where the older code surfaces.
- The scan's answer: Seth is **Variant Perseverance**, the closest trait to determination as a pure trait, yet lacking. She isn't wrong that the red SOUL exists; she is centuries early. She is let down, then decides to wait ("I WILL KEEP THE CORE WARM FOR THEM.").

**Contract:**
- **Structure (two acts, 22 turns):** Act 1, six single-mode quiz experiments and two minigames; Act 2, PHASE 2: THE DOUBLE-BLIND TRIALS, six quiz experiments that each combine two modes and two minigames; punch-out bouts in her arcade cabinet after every three rounds (four bouts), then the FINAL ROUND and THE FINAL SCAN. Checkpoint (full HP and supplies) every 4 turns and at the start of Act 2.
- **Every experiment is a SOUL mode, a quiz and a minigame at once.** Each round opens on a title card naming its SOUL modes and their controls (held longer the first time, and for every two-mode round); during the round they stay as chips beside the TIME count, and a two-mode round's SOUL is two-coloured. A question shows over the box with a TIME count; the answer is wherever the SOUL is when TIME runs out (or what you shoot or dash through), and the wrong answers are where the round hurts.
  - Act 1: HERE IS QU5EN (purple: stand in your column; her fighter strolls through; her boot stomps every wrong column), GRAVITY TEST (blue: stand on your platform over rising acid; wrong ones crumble), RING TOSS (cyan, Aqua's ring: be in your sector; her laser screens aim ahead; wrong sectors are fired on), SHOOTING GALLERY (yellow: shoot the head with your answer), GUARD THE EGG (green: shield the egg; at TIME face your answer's side), COMMENT SECTION (orange: spam hurts; dash through your answer; standing still burns).
  - Act 2: TARGET PRACTICE IN FREEFALL (blue + shooting), RING STOMP (cyan under her boots), COMMENTS ON A STRING (Seth's strings + the orange dash and heat), EGG ROULETTE (green; the answers change sides on the beat), THE SHUFFLE (purple; the columns shuffle on the beat, lasers track you), STRING SHOOTER (strings + shooting). Every question is answerable from UNDERTALE itself or from something she has already said in this fight (callback questions only appear after their line has played). Shuffling stops three beats before TIME.
  - **Minigames (no question), after Mettalot's ACT minigames,** each still in a SOUL mode under her hazards, scored for up to 10 DATA (full at 85%), with her own verdict lines (great / fine / badly):
    - REACTOR SYNC (Act 1, green; Mettalot's RHYTHM): notes ride four tracks into the shield, landing on beats, later on half-beats too. Press the note's arrow as it arrives: PERFECT (±0.075 s) or GOOD (±0.16 s). A note the shield already faces is blocked for nothing; any other note chips 1 HP. The shield faces the arrow pressed last.
    - FIND THE EGG (Act 1, purple; Mettalot's SHELL SHOW): the EGG drops into one of her three monitors; they close and trade places on the beat (three slow swaps, five fast), then stop. At TIME stand under the EGG; her boots stomp the others. Her fighter strolls the floor; heads burst.
    - MEMORY UPLOAD (Act 2, purple + lasers; Mettalot's DANCE): her four panels (one per side, each with its own shape and note, since she is colour blind) light up in a sequence on the beat (3, 4, 5 long; 3, 4, 4 on Gentle). Then touch them in that order; a wrong panel zaps. Heads burst while you watch; lasers track you while you repeat.
    - DATA HARVEST (Act 2, blue + boots): data bits rain down; catch them before they hit the floor, on three ledges, while her boots stomp and heads fall.
- **She is colour blind,** which is why she can't just look at Seth's SOUL and has to test it (intro, CHECK, a flavour line, ASK ABOUT HIM, the minigame lines, the scan result). No question asks for Seth's trait or SOUL colour: she doesn't know them until THE FINAL SCAN.
- **The bouts:** DELTARUNE's arcade punch-out (Chapter 2's Queen arcade fight, studied from the full video), full-screen in her cabinet and laid out like it: her vector fighter above, Seth's below (the sheet's blue fighter, recoloured purple, his SOUL on its chest), the globe behind; TIME counts down from 99, HERO HP (Seth's HP) and QU5EN HP bars. LEFT / RIGHT move freely, DOWN ducks, Z or X lunges up for a punch that lands when Seth is under her (she sways to a new spot every two beats, so he follows her). She flashes white on each beat of a tell, and every attack lands on a beat: STOMP (green arrows either side of Seth and a marker where he stood; her leg comes down there, step aside), WHEELS (wheels wait at both edges with DOWN arrows, then roll across at head height; duck), HIT IT (a crosshair drops from the top; punch it once it glows for 8 damage and +2 HP, or step clear before it lands). Every 5 punches that land heal 1 HP. White tutorial bubbles ("Z OR X: PUNCH!", "LEFT / RIGHT: DODGE!", "DOWN: DUCK!") appear in the early bouts. At 0 QU5EN HP: K.O., +6 HP (+6 more if Seth took no hit) and a bonus in turn: HINT (the next answer flickers), ARMOR (blocks the next hit), SNACK (+1 GLAMBURGER), DATA (+6). Time out: draw, +2 HP. Later bouts: wheels and combos of 2 (bout 2), shorter tells (bout 3), combos of 3 (bout 4), and a 100-HP FINAL ROUND whose K.O. restores all HP.
- **Her head:** the big head keeps a closed smirk (`head_closed`, redrawn from the screenshot by `extract_qu5en.py`); her mouth opens only while she talks (flapping with the text) or is hit.
- **The final scan** (purple strings): its question has no wrong answer. RESULT: VARIANT PERSEVERANCE. SPARE turns yellow.
- **The fight follows her theme** ("QU5EN": 130.08 BPM, first beat 0.277 s, kicks on beats 1 and 3, measured from the file). The battle's song clock follows the playing track. Rounds start on a beat; hazards land on beats: heads burst, boots stomp (the answer stomp lands on the TIME beat), lasers fire, messages reach the shield, her fighter punches, and in the arcade her tell starts on the off-beat and her attack lands on the beat. Around the arena the CORE's machinery pounds in time: pistons slam in turn on every beat, side rams punch on the kicks, cogs tick a notch per beat, floor vents glow on each bar, and the box, her head and the screen pulse on the beat (no pulses or shake with reduced motion).
- **DATA:** answers fill her research bar (correct +8, wrong +2, each experiment +1, final K.O. +10). After the final round she runs the scan only at 100%; short of it, more Double-Blind trials until it is.
- **ACTs change the fight:** ASK ABOUT HIM (she invents a trait, then crosses out a wrong answer next round); HYPE CHAT (+6 DATA, next round wilder); CALL ALPHYS (declined; the third call gets a text through with the next answer). FIGHT is percussive maintenance: it can't end the fight (chassis never below 1%), but a clean hit makes the next correct answer flicker (+3 DATA).
- **The EGG:** she gives Seth one partway through; using it is +10 DATA and a moment she can't explain.
- **Seth:** LV 1 / 30 HP, 2 damage per hit on Normal (1 Gentle, 3 Hard). Game over is her cabinet's: YOU LOSE! / FIGHT AGAIN (Z) / GIVE UP (X, from the top).
- **Measured (test bot, Normal, answering 75% right):** spared in 22 turns (about 7 minutes of dodging) with no deaths on Gentle, Normal or Hard (Hard with 50% right too). The toughest rounds are REACTOR SYNC (about 4 chip hits of 1 HP for a bot that misses 12% of notes), TARGET PRACTICE IN FREEFALL (about 3.5) and DATA HARVEST (about 2); the bouts give it back (a strong bot K.O.s her in every bout, taking 0–3 hits, mostly from wheels).
- **Art and music:** her giant head is traced from the designer's screenshot; her fighter, talk heads, the blue fighter, the globe and the arcade text are cleaned from the designer's sheet (`tools/qu5en/tools/extract_qu5en.py`). Music: the designer's "QU5EN". Effects are UNDERTALE's own sounds plus synthesized arcade blips; her text is the designer's snd_txt1 with a square chirp.

### Encore — Count Anansi

Count Anansi replaced the old Encore in the Ruins. ENCORE is the battle's name; he is Count Anansi. The old Encore's art and fight are gone (still in git history). Sources and build: `tools/anansi/` (see its README). The build writes `games/encore.html`, so the hub, Flowey and the file name are unchanged.

**Who he is (designer canon):**
- A vampiric spider count, owner of the theatre in the spiders' wing of the Ruins. Designed after DELTARUNE's Shadow Mantle holder and Muffet.
- Half fire monster, cousin of a fire monster (a quiet nod to Grillby). His bloodline taught the Dreemurrs fire magic. He was never a good king for spiders, being half fire.
- His wife was the human Mage of Perseverance, Muffet's mother. She helped seal monsters in, saying the humans would otherwise have finished their genocide. Her letter to him prayed he would leave the Underground one day so they could kill each other. The story that she did it out of love is a fiction he made up so Muffet could sleep at night.
- Muffet is his daughter. He ruled the spiders with an iron fist and made them perform. She led them away with "that crazy woman and her pet"; the walls collapsed behind them. She beat him in his old age, and he could not be prouder. He misses her. He is trapped in the Ruins with the spiders who stayed, by "that damned woman" (Toriel, the exiled queen, who beat him).
- He sees life as a game you enjoy, even when cruel; under that, a war veteran who only feels monsterkind's emotions in full by fighting. Seth, a Purple determination mage (Perseverance, like her), is his wife's stand-in ("I suppose you'll have to do!"), and he wonders whether she is fighting him through Seth.
- Voice: the Shadow Mantle holder's quirks. He savours a name ("Seth... oh... Seth..."), capitalises only the prize, asks accusing questions, wears mock hospitality, laughs and pivots with "~!", laughs FUHUHU, and leaves notes in empty rooms (the seat notes).

**Contract:**
- **Routes:**
  - THE SHOW (pacifist): the route's only look at what genocide may look like. Fun and dynamic over difficulty: every foreshadowed mechanic is greatly nerfed. REFUSE three times (he wants you to hate him); after THE COUNT'S INVITATION he reads Muffet's letter, expecting cruelty, finds sincerity ("Perhaps I'm too old to be playing games"), and SPARE turns yellow. The spiders return to the seats and cheer through the finale. Aqua: "You didn't kill him... SO much EXP... not leaving the Ruins without you... Toriel's asleep, the doors."
  - Killing him on THE SHOW is possible after 5 attacks (the neutral outcome). There is no separate neutral fight.
  - THE LAST SHOW (genocide): fun but hard. The spiders flood the box, some burning, and the house starts to burn. He hits 0 HP and reignites twice (three lives), dimmer each time, while the fire rises (the floor, then the walls). His second life is purple strings plus orange; then the strings burn away to orange alone. His death lines are the designer's; the house burns, some spiders make it out. Aqua: "...What the hell", proud of the EXP, "Toriel wants to see us."
- **The walk:** the spiders' wing (bake sale, a spider's web, the playbill) → the theatre aisle with three seat notes → halfway down the aisle he turns from the stage. "Skip the walk" in options. The route's theme plays muffled through the walls on the walk.
- **ORANGE SOUL (both routes):** the tea is the soul change, once. At the start of his first attack his teapot pours over Seth's SOUL and it turns orange for the rest of the fight. From then on, keep moving: a still SOUL heats up (a ring fills around it; full in 1.6 s on THE SHOW, 1 s on THE LAST SHOW) and at full heat it burns 1 HP every 0.55 s / 0.4 s until it moves (never lethal on THE SHOW). Holding a direction counts as moving, even into a wall. Moving cools it fast.
- **Burn stacks (fire attacks):** fire-based hazards (burning spiders, their flame trails, embers, candelabra flames, the genocide floor and wall fire) don't hit; they set the SOUL alight. Each hit adds burn stacks (+1 on THE SHOW, up to 3; +2 on THE LAST SHOW, up to 6; the floor fire adds 1). One stack burns off every 0.32 s and takes 1 HP (never the last HP on THE SHOW). Each dash shakes off 2 stacks. Flames on the SOUL show the stacks; the HP they will still take blinks orange at the end of the HP bar.
- **Dash:** Z (or a quick tap on touch) dashes the way you are pressing at that moment (or your last direction if none), straight through bullets. A DASH box beside the HP bar is lit when it is ready and fills while it recharges (0.6 s / 0.9 s); a press during the recharge or during the attack's title is kept and fires as soon as it can. Seth's SOUL keeps its purple rim.
- **His attacks:** spiders on threads, wine spills, swinging candelabras, Seth's own specials staged back at him (PAGE STORM, MARGIN TRAP), Muffet-like MANY HANDS from the wings, the REVOLVING STAGE (the box turns; controls turn with it), BLOOD BALLET, WEB CURTAIN, and the finale THE COUNT'S INVITATION. THE LAST SHOW adds THE HOUSE BURNS, ON A STRING, THE STRINGS BURN, THE PYRE.
- **Seth:** THE SHOW LV 1 / 25 HP, 2 damage per hit on Normal (1 Gentle, 3 Hard). THE LAST SHOW LV 3 / 28 HP, 3 per hit (2 / 4). Checkpoint with full HP and supplies every 4 attacks; on THE LAST SHOW also at each reignition.
- **His HP:** THE SHOW 900 (FIGHT 30–80). THE LAST SHOW 1100 / 650 / 420 across three lives (FIGHT 90–180); his first life can't fall before 7 attacks.
- **Measured (test bot, Normal):** THE SHOW: spared in about 10 turns, no deaths (a random dodger takes 26–39 hits and still survives). THE LAST SHOW: killed in 14–17 turns; the strong bot (which dashes off its burns) no longer dies.
- **Art and music:** his frames are cleaned from the designer's three sprite sheets (battle poses, overworld walk, hands, 24 portraits). Rooms and the battle backdrop are pixel art painted at 1x by `tools/anansi/tools/paint_rooms.py`, with SHOW and LAST SHOW variants. Music: the designer's "COPY-CAT PANIC" (THE SHOW) and "FRENETIC FOLLIES" (THE LAST SHOW). Effects are UNDERTALE's own sounds; text uses the designer's snd_txt1, pitched low for him.

**In Flowey's fights:**
- **False pacifist:** the Ruins replay, ENCORE! ENCORE!: his web curtain with one gap, then TEA FOR TWO (his teapot's pour and his many hands, wherever you stand). The memory page is THE STAGE ("The count's teacup. A letter he finally opened.").
- **False genocide:** THE EMPTIED THEATRE: burning silk strands (THE HOUSE BURNS), the cross with wheels of burning spiders (ON A STRING), his cape from every wall (CURTAIN CALL). The FILE 1 cut shows his face. NO ENCORE in Flowey's last gauntlet is his web curtain.
- Flowey borrows `anansi-art.js` live from `encore.html` via `tools/sync_borrowed_art.py`.

### The White Roaring Knight — A New World (Waterfall, pacifist only)

The designer revived their White Roaring Knight concept (a union of DELTARUNE's three heroes) as an Undertale-side encounter. Sources and build: `tools/knight/` (see its README). It is not Rift, which stays retired.

**Who it is (designer canon):**
- There is a big, pure crystal hidden off Waterfall's old path. For ages it has absorbed monsters' hopes and dreams: everyone who stared into it and wished, and every wish the echo flowers there repeat.
- Gerson (retired, running his shop) tells Seth about it, including that it is a glimpse into another world. Seth goes **alone**, gets curious and wakes it by accident with his human magic SOUL.
- It manifests as the Delta Rune's Angel, the good kind, as monsterkind dreamed it: one knight with three hearts, a human's blade (cyan), a monster's wild heart (pink) and a prince's hope (green).
- It wants to fight Seth, because a fight was always part of monsterkind's dream. It also sends hearts and tries to spare him, and takes ACTs of its own.
- Being a glimpse into another world is where its DELTARUNE moves come from (RUDE BUSTER, PACIFY, HEAL PRAYER, X-SLASH). Partway through, it breaks the Undertale battle UI and the battle turns into a DELTARUNE battle.
- It knows Seth is not the Angel ("YOU ARE NOT THE ANGEL. WE ARE SORRY WE HOPED YOU WERE.") but values that he was kind to a dream.

**Contract (designer choices):**
- **Pacifist only.** It does not appear on neutral or genocide. Seth is LV 1 / 30 HP; 2 damage per hit on Normal (1 Gentle, 3 Hard).
- **The walk is the crystal room only.** Seth arrives at the crystal and remembers what Gerson told him in his shop (the lore, in Gerson's voice). Four echo flowers round the room hold the wishes; touching the crystal plays the manifestation. "Skip the walk" is in options. (The designer cut the shop and the old path.)
- **Undertale half (4 waves):** FIGHT / ACT / ITEM / MERCY with the Torn Notebook. Its ACTs are CHECK, WISH, LISTEN and ROAR BACK. Both MERCY bars already fill, hidden.
- **The break:** after the fourth wave the Knight roars. Rings, then cracks through the box and buttons; the UI shatters and falls; a white flash; then the DELTARUNE battle builds in (grid backdrop, Seth on the left, the Knight on the right, the TP bar, the party panel, the text box). It takes about 4.6 s, and reduced motion keeps it calm.
- **DELTARUNE half:**
  - The full kit: FIGHT (DELTARUNE's timing bar), ACT, ITEM, SPARE, DEFEND.
  - TP comes from grazing: 6 TP a second while near a damaging hitbox, one aggregate amount per tick, as in Aqua's fight. DEFEND gives +16 TP and halves damage for the wave.
  - Seth's own spell is **PERSEVERE** (40% TP): +6 HP, damage halved for the wave, and the Knight's MERCY +9.
- **Built on the designer's references:** DELTARUNE's Roaring Knight fight (the designer's "Kaizo Roaring Knight - No-Hit" video) and the secret Gerson fight (DELTARUNE Chapter 4, "Hammer of Justice"), both downloaded and studied in full. Their sprites are reference only; everything is drawn new.
  - **Look of the Deltarune half:** black, with an arch overhead that changes colour every turn, and violet fog on the floor under the Knight. The Knight has a red, cyan and gold chromatic fringe.
  - **The UI is DELTARUNE's own:** cut from the reference videos at native 640 x 480 (`tools/knight/tools/extract_dr_ui.py`) and laid out at the measured positions: Seth's one-member party row (as in the Gerson fight, with his head icon from his pack), which rises into his purple panel with Kris's five command icons on his turn and stays open while picking a target or an ACT; the TP glyphs and slanted bar; the enemy row with the real HP and MERCY labels; the two-column ACT / ITEM lists with the description and TP cost on the right; the PRESS timing bar. Text in the text area is the game's size (3). The Knight's turn is narrated one heart at a time. The green box spins into each new shape.
- **One knight, three turns:** each enemy turn, the three hearts act in order and the text box names what each did. The moves follow the Roaring Knight's:
  - **Blade:** ENCIRCLING BLADES (swords circle the box, then stab in one by one), SWORD RAIN, a SWORD VOLLEY with one gap, and the DASH (a slash across the whole screen at Seth's height).
  - **Wild heart:** CRESCENTS swept through a tall, narrow box, CRYSTAL ERUPTIONS (a shadow on the floor, then a crystal and its shards), the BAR CURTAIN (white bars with a winding gap; blue bars only hurt if you move), and RUDE BUSTER.
  - **Hope:** the LIGHT CONE from its sword (leave it before it shines; stars bloom in it and burst), HEAL PRAYER hearts and PACIFY Zs.
- **UNIFIED waves** start once the Knight's MERCY reaches 70%, cycling through four:
  - the night sky (cone, then star bursts, then encircling blades);
  - bars, then eruptions;
  - the **HAMMER OF JUSTICE**: the dream's memory of the old hero Gerson. Seth's SOUL turns green (purple rim kept) in a small box, with a shield facing the arrow pressed last. Spears come from four sides, and gold trick spears swing round and come in from the opposite side. Gerson's shop lines set it up ("Saw an old hero in there too. Carried a hammer.");
  - a split box with a seam slash, blue lasers and sword rain.
- **Finale, A NEW WORLD:** the box falls away into the Knight's star void (Seth moves freely across the whole field while stars spiral out of the Knight), then a web of red light, then a shower of hearts.
- **Mutual spare:** there are two MERCY bars.
  - The Knight's MERCY is raised by Seth's ACTs, PERSEVERE, FIGHT (hitting it is part of the dream) and each wave survived.
  - Seth's MERCY is raised by the Knight: each wave the hope heart tries to spare him, the HEAL PRAYER hearts he catches, the PACIFY Zs he touches (harmless but sleepy), and his own SPARE and DEFEND.
  - When both reach 100%, the finale A NEW WORLD plays. It ends in a shower of hearts, then they spare each other.
- **HP:** the Knight can't be killed (HP floor 1). Below 30% it is TIRED and ACTs move its MERCY 1.5× as far.
- **Checkpoint** with full HP and supplies every 4 waves and at the break.
- **Measured (test bot, Normal):** spared in 17 to 18 turns (about 4.3 to 4.6 minutes of dodging) with no deaths, about 42 to 45 hits a fight. Gentle has no deaths either. A deliberately sloppy bot on Hard dies 1 to 6 times (it was 1 to 2 before the rebuild).
- **Art:**
  - **The Knight:** the designer's sprite sheets. 24 eight-frame animations; each move plays its own (the orbiting-blade cast for ENCIRCLING BLADES, ground slam for the eruptions, dash, thrust, cleave, star and diamond storms, the roar during the UI break, hurt, the vanish at the spare, the finale ascend), and the arrival animation plays as it forms from the crystal. Its effect sprites draw the swords, stars, diamonds, heal hearts, reticles, the vortex in the finale and the hammer beside the GREEN SOUL box. Cut by `tools/knight/tools/extract_sheets.py`; only the dialogue portrait is still from the concept sheet.
  - **Side-on Knight:** in the Deltarune half the Knight is the designer's side-on battle set (16 animations, facing left toward Seth, 2x); the roar, the finale's ascent and its vanish use the front sprites.
  - **Whole pixels only:** every sprite is drawn at a whole-number scale. The front sheets and Seth's pack are snapped to flat palettes and despeckled at extraction, and effects are pre-shrunk to their drawn size.
  - **Human Seth:** the designer's Human Seth pack, at 1x (Deltarune party size) and mirrored on the Deltarune side so he faces the Knight. He walks with its walk cycles and talks with its portraits. On the Deltarune side he reads (WISH), adjusts his glasses (LISTEN), laughs (ROAR BACK), casts his glasses (PERSEVERE), casts a notebook page (FIGHT), kneels behind the glasses shield (DEFEND), flinches when hit, and offers his hand (SPARE).
  - Gerson is cropped from `games/gerson.html`; rooms are painted by `tools/knight/tools/paint_rooms.py`. Music: the designer's "Quiet Water" in the crystal room, and "Your Humble Service" (a DELTARUNE fan track) through both halves of the battle and the finale; it pauses for the roar and resumes. **Sound effects are only supplied recordings, never synthesized:** UNDERTALE's hurt, select, slash, ding and heavy; Seth's notebook slash for his FIGHT; the Sans fights' teleport (spell, spare, awakening), encounter, blaster (lasers and the light cone) and vine (crystal spikes); Omega Flowey's yowl slowed for the Knight's roar.

### Marigold — The Forgotten Memorial

Marigold replaced Rift in Snowdin. The designer retired Rift ("doesn't fit the lore of Undertale cleanly"); Rift is gone from the game and the repo (it is still in git history). Sources and build: `tools/marigold/` (see its README).

**Who she is (designer canon):**
- A ghost monster. In Undertale ghosts are a kind of monster, not the dead. Her lineage held bodiless form to be improper and wore vessels symbolic of who they were. In the war that meant suits of armor.
- She was a knight of the King's Royal Guard of ghosts, led by a wise, long-lived turtle (Gerson).
- Ghosts were valued because they couldn't die, until a rare kind of human mage (determination turned into magic) learned to kill them. Those mages also built the Barrier.
- The humans eradicated ghost-kind first. A family of farmers (the Blooks) survived by fleeing early. Of the warriors, one known survivor, forgotten: her.
- She knew Chara and idolised her: "a true monster at heart", the only good human, trapped in flesh and bone. She cannot understand leniency.
- She possessed Chara's copper memorial (oxidised green, buttercups, a crown that grows thorns, one hollow socket, red and green eyes). Some of Asriel's dust is on it, and through it traces of Chara's SOUL. That is her identity bleed: sometimes she forgets she isn't Chara. She barely remembers her own life, and she would have it no other way.
- She devotes herself to the Dreemurrs. She does the killing so Asgore doesn't have to, and calls Toriel a COWARD for leaving him.
- She learned of the lab experiments, believes the Prince (Flowey) lives on and believes in the plan, and promised him a human SOUL so he could feel again. She thinks herself unworthy to absorb SOULs; he is. Flowey is vulnerable to her and avoids her: she once made him cry, kneeling to tell him it wasn't his fault.
- Seth is a determination mage: the same kind of human that killed her people. Determination alone isn't enough to make magic (Frisk).

**Contract:**
- **Routes:**
  - THE TRAP (pacifist): Flowey lures Seth down the old path and Marigold is overjoyed that his plan worked.
  - THE HUNT (genocide): she sought Seth out herself, furious and vindicated. It is much harder.
  - Neutral: no fight (Flowey talks her out of it).
- **The walk:** forest (Flowey sprouts in his canon frames and friendly face for the lure, on the trap) → the Forgotten Gallery (six murals of the designer's text) → the ledge with its SAVE star → the memorial (trap) or her ambush on the ledge (hunt: a thorn wall rises behind Seth and she walks out of the cave). Reading all six murals adds a line from her. "Skip the walk" in options.
- **Seth:** pacifist LV 1 / 30 HP, 2 damage per hit on Normal (1 Gentle, 3 Hard). Genocide LV 5 / 36 HP, 4 per hit (3 / 5). Checkpoint with full HP and supplies every 4 attacks.
- **Poison:** buttercup pollen drains HP over time, never below 1 HP.
- **CYAN:** RING AROUND THE ROSIE (attack 11 on both routes) uses Aqua's cyan exactly: ring at 38% of the box, drift, arrows push, Z reverses. It is sung as the rhyme's four verses; "we all fall down" drops every posy, including the outer ring that was harmless until then.
- **CALL AQUA:** every call angers Marigold.
  - On the trap: a little more speed, and +1 damage from the fourth call. Four calls of banter talk Aqua round; she arrives two attacks later and defends Seth, cutting away the projectile nearest him every couple of seconds. This is a step in her pacifist redemption arc, which runs across the pacifist fights.
  - On the hunt: the first call is a brush-off (she's grinding in Waterfall). Later calls are advice from Seth's notes:
    - the next attack's warnings run 40% longer;
    - strikes do +35% (hit the cracked copper);
    - poison is weaker;
    - lance warnings run longer.
  - The hunt's anger cost is steep: +5% speed and +6% density per call, and +1 damage from the third call.
- **Spare (trap only):** TALK about the statue, the Prince, then (only once Aqua is there) who she was. Then SPARE is yellow. Her ending: "Because I think it's pretty." On the hunt, mercy is refused.
- **Kill:**
  - The trap can kill her after 6 attacks.
  - The hunt can't kill her until THORNS OF AGONY (its 13th attack) has been survived.
  - She leaves no dust: the statue is empty.
- **Art and music:**
  - Her frames are cleaned from the designer's example sheet.
  - Human Seth is an original sprite after the Flower Seth sheet.
  - Aqua's art is copied live from `aqua.html`.
  - Music: the designer's themes. THE TRAP plays "The King's Dream" (a Deltarune fan track); THE HUNT plays "Thorns of Agony" (a fan remaster). The walk plays the designer's "Glowing Snow" (DELTARUNE) over synthesized wind: 1.15× faster and higher on the trap, as supplied on the hunt.
  - Effects are UNDERTALE's own sounds that PURPLE already uses (hurt, select, slash, ding, heavy hit). All text uses the designer's snd_txt1, pitched per speaker.
  - The rooms and the battle backdrop are pixel art painted at 1x by `tools/marigold/tools/paint_rooms.py`, with trap and hunt variants.

**In Flowey's fights:**
- **False pacifist:** she is the Snowdin replay, SHE KEPT THE FLOWERS: thorn rows, her lance, buttercups bursting into petals, the flower shower. The memory page is THE STATUE.
- **False genocide:** she is THORNS OF AGONY: her hunt, with the ghost Royal Guard marching both ways. The memory page is THE EMPTY STATUE, and the FILE 2 cut shows her face.
- **Colour:** replays stay grey, except her buttercups, which keep their yellow.
- **Flowey and her:** she is his soft spot. On false pacifist his cruelty cracks ("She knelt down in the snow... Told me it wasn't my fault." / "Stop looking at me like that!"). On false genocide the static cuts him off mid-sentence about her ("SKIP", then "NEXT.").

## Dialogue voices

Claude's README explains trigger-preserving replacements and deliberate verbatim scenes. Preserve runtime substitutions, speaker/face tags, scene purpose and knowledge limits. Later accepted dynamic lines override old banks.

- Spamson is a polished Addison salesman, **not bracketed/glitchy Spamton speech**. NEO is the same salesman grieving.
- Aqua is casual, teasing and cold; threatening intimacy, actual habit observations, not a loyal sidekick.
- Sans is lowercase and economical; not a pun every line. Preserve his bluff as a character claim.
- Alphys is technically specific and decisive; stammers under pressure, not every syllable.
- Flowey's help is transactional; mock friendliness can turn petty/cruel.
- Gerson's warmth/humor serves protective stalling, not a detached lecture.
- Muffet is cruel, coy, predatory and expressive; cadence and silence matter.

## Engineering, testing and delivery

Inspect current code before proposing architecture. Separate deterministic simulation/state from Canvas, input, assets and audio. Use explicit state transitions owning cleanup. Fixed steps/bounded deltas help but don't prove geometry correct. Make arena/camera/pointer transforms explicit. Prevent one input from simultaneously confirming, firing and countering. Clear held keys on blur/pause/retry. Preserve only intentionally persistent state.

Verify damage/resource/turn conservation, modes and reachability, pause/retry, alpha/crops, actual packed startup, installed Notebook input/impact, keyboard/touch and hosted/offline parity. Protected schedule sweeps are not survivability proofs. Native Canvas/DOM isn't human/browser/phone QA. Some historical full CORE stress runs failed; don't claim universal passes from focused checks.

Prior R28 coverage:135 finale boundary cases, actual named packed startup/Notebook, critical recall with10 supplies, forged starter rejection, last-item heal followed by later paid finale; 72 protected schedules; bounded protected-Seth real-projectile ending used10 items in34 exchanges/111 hits/17 ordinary waves. These are recorded prior tests, **not rerun by the packaging task** and not a human/no-hit clear.

For delivery: rebuild affected actual exports, test exact bytes, stamp builds and distinguish full/practice. Preserve unrelated hub payloads and current dialogue variants. Publish only intended revisions and keep existing audiences. Do not embed credentials. Include licenses/credits. Never say fixed live/sent until concrete delivery succeeds.

Existing projects: https://purple-underground.lonesouls.chatgpt.site ; https://aqua-last-playmate.lonesouls.chatgpt.site ; https://sans-core-misery-likes-company.lonesouls.chatgpt.site ; https://muffet-dark-nest.lonesouls.chatgpt.site . These are known project entry points; live availability was not rechecked for this packaging task.

## First session checklist

1. Read this file and inspect the hub/game inventory.
2. Ask which larger-scale feature the user wants; don't assume a rewrite.
3. Read relevant current code and dated continuity; identify superseded rules.
4. Preserve original exports and hashes before modifying them.
5. Recover editable repositories/test trees if available; otherwise label any unpacking/reconstruction honestly.
6. Implement the requested change with targeted real-behavior checks.
7. Verify the exact generated HTML and deliver concrete updated files.
