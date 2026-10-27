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
| Ruins | Encore — Last Curtain | Encore's emptied-theatre variant |
| Snowdin boundary | Rift — The Hollow Crown | Rift's cataclysm variant |
| Waterfall | Mettalot — Waterfall After Dark | Gerson — What For? |
| Hotland | Ant Tenna + Spamson — The Next Big Thing, currently pacifist only in launcher | Spamson NEO — A Deal in the Dark, then Muffet — The Dark Nest |
| CORE | Sans — No Promises | Sans + Alphys — Misery Likes Company |
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

Only pacifist-route bosses return as replayed attacks. The six fragments are pages from one Purple SOUL's life, not six human souls. Keep the functional false/moving commands, fake Game Over and stolen mechanics. Seth can deny him the soul; the body does not stand up and leave, and the king eventually receives it. Flowey uses his canon Undertale battle frames, here and in Gerson and Sans + Alphys; when talking, only his mouth moves. His supplied voice blip, evil blip, hurt cry and laugh are in the fight. His own line attacks are vines, not laser beams: a flickering warning, then the vine whips in from off-screen (never from his eyes or body); replayed bosses keep their own beam art. FIGHT must feel rewarding: in act one his health bar takes real damage until he rigs it at the end of each cycle (LOAD, extra zeros, your attack set to 0); in act three the hits stick. In act three he is his canon sprite, huge (5×), with original thorned vines behind him; the designer rejected an original creature design, so don't invent a new body for him.

**False genocide (`flowey-genocide.html`).** Seth killed everyone, then spared Aqua at the end of Last Playmate. That spare shattered her point of view and she ran off somewhere in the Underground. Flowey has run this over and over, trying to get his perfect ending, and he WILL. He put Seth and Aqua in each other's paths and held every door. They were hopeless brats who needed his help, but they started getting stronger. If they had finished the job, he would have left them alone. Now it isn't a fight, it's course correction: even if Seth wins, he just goes back. The false-pacifist Flowey was bored; this one is furious. The designer wants this route dire, hopeless and overwhelming. Contract:
- **Tone:** cruel and sardonic throughout, never begging. The theme is the designer's supplied track (Inverted Fate "Checkmate").
- **Static:** every SAVE, LOAD, rig, rug, death retry, chase LOAD and act change tears the screen with static and a hiss. LOADs carry a counter in the thousands (`LOAD #4,813`…). He also SAVEs and LOADs inside attacks, rewinding Seth and every bullet.
- **Seth is LV 10 / 56 HP:** attacks cost about 1.4× the false-pacifist fight's HP per minute.
- **Chases:** crowds of laughing Floweys line the walls and throw aimed pellets. That makes the escapes about 25% harder than false pacifist; the designer asked for it.
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
- **Seth survives** (still the designer's call to change). The king is still ahead.

The script is the designer-approved S-tier revision. Lines marked kept are verbatim. The sources and build script live in `tools/flowey-genocide/`: run `geno_assets.py` to recrop the replayed bosses' art from their own games, then `geno_build.py games/flowey.html games/flowey-genocide.html`. `track.mp3` there is the route's supplied theme.

### Tenna/Spamson, Spamson NEO, Encore and Rift

Lobby residents seek stardom/hero status by capturing the human. Spamson wears only the stolen cannon arm there, not the entire robot. Tenna/Spamson partnership matters; Purple with Yellow+Purple duo mechanics. Distinguish this from genocide winged Spamson NEO.

Genocide Spamson injects stolen determination only after0HP. Muffet captures him before Seth finishes him. Persistence/no dust/strange taste explain her curiosity, not automatic scientific knowledge of determination.

Encore: preserve letter, audience, curtain, final bow and route-specific mercy. Rift: armor is a lock around dangerous space, sleeping child and small light; breaking it isn't automatically mercy. Their genocide variants must materially differ.

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
