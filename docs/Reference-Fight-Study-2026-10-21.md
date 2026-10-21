# Reference fight study — 2026-10-21

The user supplied five YouTube videos as references for timing and attack design. YouTube refuses video downloads from this cloud server (bot check), so the study uses each video's **storyboard**: YouTube's preview thumbnails, one frame every 1.9–9.8 s at 320×180 or 240×180. That is enough to map each fight's structure (attack order, arena shapes, telegraphs, turn lengths) but not frame-exact timing inside an attack. No audio was available. Every duration below is approximate (frame count × interval).

The full timelines are in [reference-study/](reference-study/): [Gerson](reference-study/gerson-report.md), [Sans and Alphys](reference-study/sans-alphys-report.md), [Love Maniac and Chara](reference-study/aqua-refs-report.md). Our own numbers come from god-mode bot runs of the shipped engines (`tools/sim/`).

| Our fight | Reference | Video | Frame spacing |
| --- | --- | --- | --- |
| Gerson — What For? | Deltarune Ch4 secret Gerson ("Hammer of Justice"), no-hit run by Kippy | `4pG-raMF9P4`, 4:33 | ~1.9 s |
| Sans + Alphys — Misery Likes Company | Undertale Sans, genocide run (Suwako Moriya) | `Vr4IYjeplJA`, 14:48 | ~5 s |
|  | Fan-made Alphys fight "OUT OF CONTROL" (Cupcake Bruh [Archive]) | `TlaX2fIrUpA`, 11:01 | ~5 s |
| Aqua — Last Playmate | Love Maniac v0.3.3.0 (fan game, LoveSS69) | `Bnfs415pCsg`, 7:17 | ~5 s |
|  | "No More Deals" Chara fight (fan game, JustALazy) | `TT8vxmH4jIg`, 23:03 | ~10 s |

Our own mechanics (Torn Notebook, KR, TP economy, parries, charged-skull gates, Aqua as a rival player, Flowey's transactional help) are the point of these fights. Nothing below proposes replacing them; the suggestions are about timing, telegraphs and readability around them.

## Gerson

**Reference:** strict alternation, 14 player and 14 enemy turns in ~4.3 min. Enemy turns are **~8–10 s early, ~11–13 s later, ~20 s for the last**. Breaks (player turns) are ~2–8 s.

- The **box shape tells you the attack**: square with an inner frame = green shield; diamond = hammer storm; wide strip = dives.
- **Shield (green SOUL)** is the core (10 of 14 turns). Escalates *inside* the pattern: 4 block directions become 8 (octagon) at ~36 s, then spinning shells join.
- **Dives** get a double warning: a white Gerson silhouette plus a grey lane, then the dive. They grow from one lane to diagonal lanes with ~7 clones.
- No visible phase change; difficulty grows within each pattern. Blocking and grazing build TP for Rude Buster.

**Ours:** 12 attack scripts (green → purple strings → hybrid → air finale) at **16–25 s each, rising; the finale is 58 s**. Breaks ~5 s. The approved 17-turn pacing is preserved.

**Observations**
1. Our enemy turns are about **twice the reference length**, and the finale nearly 3×. Shortening to ~10–15 s (finale ~25–35 s) would keep the 17 turns but make the fight much brisker. This changes tuning the user approved, so it needs a decision.
2. Worth adopting: **box shape as the attack's tell**, and the **silhouette + lane double telegraph** for any committed dash/slam.
3. Worth adopting: **escalate inside a pattern** (e.g. the green shield's block directions widening mid-turn) rather than only between turns.

## Sans + Alphys

**Sans reference** (matches the Undertale wiki):
- Sans attacks first. Phase 1: blue SOUL, wide box, one new pattern per turn (bone lines, blue bones, platforms 1–4, blasters), a full cycle every **~15 s**.
- False mercy at ~3.5 min. Phase 2: a black **flicker frame** and the box shifting at transitions, red/blue swaps, **wall slams flagged by thin red lines**, blasters, and **bones attacking the menu** (can't kill). Turns stretch to ~20 s.
- A ~45 s final attack (full-width box, a ring of blasters, slams down to 1 HP), then the long sleep-and-drag ending.

**Fan Alphys reference:** all lab machinery (drones, pods, laser pylons, wire bombs, remote-fired turrets ramping 1→5), **dotted crosshair / dashed red warnings before attacks**, the box **changing shape** (hexagon, octagon, notched) as its difficulty lever, and phase 2 with Amalgamates taking over menu buttons. Turns are ~25–35 s but mostly dialogue in an empty box; FIGHT shocks the player (~7–11 HP).

**Ours:** 40 waves, median **18 s** (12–28 s), with only **~2 s** between waves. That's denser than either reference.

**Observations**
1. The two references are complementary and our duo already combines them. One structural idea from the comparison: **one character talks while the other attacks**. Sans talks over his attacks; Alphys stops everything to talk. Interleaving keeps dialogue without empty boxes.
2. Phase-transition grammar worth borrowing: a **one-frame flicker / box shift** when the fight escalates, and **thin red warning lines before slams**.
3. Colour language: Sans's light-blue bones and Alphys's cyan lasers obey the same "stand still" rule. Keep blue = still, orange = move consistent across both characters' hazards.
4. Pacing: the ~2 s gap between our waves is much shorter than either reference. Slightly longer breathers at phase boundaries would help readability without touching the wave count or the 75 s finale.

## Aqua

**References:** both are knife-duelist fights. Chara ("No More Deals") is the better rival-human reference. Shared traits:
- **Full-screen warning lines before every slash**, then the live slash.
- A **visible "BLOCK"** callout when the enemy parries the player's FIGHT.
- An **announced special attack** ("I guess I have no choice…").
- A **finale with the UI stripped away** (beams, a ring of ~24 knives).
- Phases marked by **menu changes** (MERCY disappearing).
- A tight palette (black/white line art, red accents, orange/cyan knives).

Neither shows the enemy dodging, grazing, using items or a TP gauge. Aqua already goes beyond both there.

**Ours:** attacks of **14–18 s**, each preceded by a ~6 s duel segment; the full duel won at ~15 min in the bot run.

**Observations**
Aqua already shows a **PARRY n/3** counter on her HUD and warns before some slashes. Not checked in this study: how visible each spent parry is at the moment it happens, and whether her finale hides the battle UI.

1. Make each spent parry as legible in the moment as Chara's BLOCK: a **large callout at the point of the parry**, on top of the HUD counter.
2. Use **full-screen telegraph lines before every large slash**, matching the reference grammar (warning colour first, white when live), if any slashes currently lack one.
3. Her finale could **strip the battle UI** for its climax, as both references do, while keeping what the player needs (HP).
4. An **announced special** before her banked-TP release would sell it as a deliberate rival move.

## Limits

Storyboard frames are 2–10 s apart and low resolution, so short patterns can fall between frames; nothing between frames was seen. No audio, so beat sync wasn't judged. The fan games' internals are unknown; only what's visible was used. Our numbers are from bots, not human play.
