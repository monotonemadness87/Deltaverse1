# Reference fight study — 2026-10-21

The user supplied five videos as references for timing and attack design. They were downloaded as full-quality MP4s (via a converter site, since YouTube refuses direct downloads from this server) and measured frame by frame with ffmpeg: every frame decoded and scanned automatically, then each turn boundary and telegraph checked by eye on full-rate frame sheets. Times are exact to about one game frame (1/30 s). The videos themselves are not in the repo; only measurements are.

Full measurement reports: [Gerson](reference-study/gerson-precise.md) · [Sans and Alphys](reference-study/sans-alphys-precise.md) · [Love Maniac and Chara](reference-study/aqua-refs-precise.md). Our own numbers come from god-mode bot runs of the shipped engines (`tools/sim/`) and warning constants in the code (approximate where warnings are computed at run time).

| Our fight | Reference | Video |
| --- | --- | --- |
| Gerson — What For? | Deltarune Ch4 secret Gerson fight, no-hit run | `4pG-raMF9P4` · 1280×720 · 60 fps · 4:33 |
| Sans + Alphys — Misery Likes Company | Undertale Sans, genocide run | `Vr4IYjeplJA` · 962×720 · 24 fps · 14:48 |
|  | Fan-made Alphys fight "OUT OF CONTROL" | `TlaX2fIrUpA` · 1280×720 · 30 fps · 11:01 |
| Aqua — Last Playmate | "No More Deals" Chara fight (fan game) | `TT8vxmH4jIg` · 960×720 · 60 fps · 23:03 |
|  | Love Maniac v0.3.3.0 (fan game) | `Bnfs415pCsg` · 1280×720 · 60 fps · 7:17 |

Our own mechanics (Torn Notebook, KR, TP economy, parries, charged-skull gates, Aqua as a rival player, Flowey's transactional help, the approved turn/wave counts) are the point of these fights. Nothing here proposes replacing them. The proposals are about timing, telegraphs and readability around them, and each needs the user's decision before it is built.

## Headline comparison

| | Reference | Ours |
| --- | --- | --- |
| Gerson enemy turn | 7.9–8.9 s early, 10.5–13.9 s later, 19.7 s finale | 16–25 s rising, 58 s finale |
| Gerson break (player turn) | 3.6–3.9 s after FIGHT, 6.4–9.3 s after a spell | ~5 s |
| Sans attack | 6.5–9.9 s; full cycle (player turn + talk + attack) ~14–15 s | wave median 18 s (12–28 s) |
| Sans break between attacks | 3.2–4.2 s player turn, plus 1.7–5 s of talk | ~2 s |
| Chara attack | median 16 s (8–30 s) | Aqua 14–18 s, after a ~6 s duel segment |
| Warning before a hit | Gerson 0.4–0.7 s · Sans 0.35 s (slams), 0.6–0.8 s (blasters) · Alphys 1.4 s (long lasers) · Chara 0.9–1.0 s (slashes/beams) | Sans + Alphys ~0.26–0.95 s · Aqua ~0.07–1.35 s (code constants) |

The warnings are broadly comparable. The biggest differences are **turn length** (Gerson about 2×, Sans + Alphys waves about 2× the real Sans attacks) and **breathing room** (Sans + Alphys).

## Gerson

**Measured (reference):**
- Every turn is framed the same way: SOUL launch → box drawn (0.17 s) → spin-in 0.23 s … spin-out 0.23 s → menu 0.25–0.35 s later. The first hazard arrives 0.4–0.7 s after the box is complete (~1.0 s in spectacle turns).
- **Shield turns** block *arrows* (not hammers). Each arrow arrives ~0.6–0.7 s after it appears; the next one to hit turns **red 0.18–0.33 s before impact**. Median 0.37 s between blocks, at least 0.23 s when the shield must turn.
- The guard **widens from 4 to 8 directions mid-turn** (square → octagon at 36.6 s); diagonals are routine from turn 7; shells that bounce back join at turn 8.
- **Dives:** a grey lane **0.40 s** before an effectively instant strike (0.47–0.50 s in the wide box, 0.37 s in the finale); lanes are about half the box wide. Chains: 7 dives 0.53 s apart, sweeps every 0.17–0.27 s, 14 dives ~0.41 s apart in the finale.
- A slow **big hammer** (≈6.5 s on screen, falling 0.2 box widths/s) works as a visible countdown and ends three turns; blocking it flashes white and switches to red SOUL for dives.
- The box shape announces the attack: square with inner frame = shield; diamond = hammer storm; wide strip = dives.
- Each block: +1% TP, white shield flash and gold sparkles. Grazes in red-SOUL turns add 6–18% TP per turn.

**Proposals:**
- **G1. Shorter enemy turns.** Scale our 16–25 s scripts to ~9–14 s and the 58 s finale to ~20–25 s, keeping all 17 turns and their content order. This changes approved pacing, so it is the user's call.
- **G2. "Next to hit" colour.** Turn the next blockable projectile red ~0.25 s before it lands in our green shield modes, if not already.
- **G3. Box shape as the tell.** Give each of our modes (green, purple strings, hybrid, air) a distinct box shape on entry.
- **G4. Escalate inside a turn.** Widen the green shield's directions or add a second projectile type partway through a turn, rather than only between turns.
- **G5. Countdown hazard.** A slow, visible object whose arrival ends the turn, so the player can see how long is left.

## Sans + Alphys

**Measured (Sans):**
- Phase 1: player turn 3.2–4.2 s, Sans talks 1.7–5 s, attack 6.5–9.9 s; a full cycle ~14–15 s. Bullets are on screen 55% of combat time, dialogue 21%.
- Opening: 2 black frames, SOUL slammed blue (lands 2 frames later), red rectangle **0.25 s** before floor bones, then four blaster volleys 0.83 s apart. Blasters appear **0.75–0.79 s** before firing; the big final beam is solid 0.92 s.
- Phase 2: transitions are **fully black frames**, ~0.4 s (9–11 frames) at first, six per medley, later 2–3 frames. Slam warnings **0.33–0.38 s**; slam spacing tightens 1.04 → 0.83 → 0.65 s. Barrages add a blaster about every 0.6 s, each appearing 0.6–0.8 s before firing, beam solid ~0.21 s then fading ~0.25 s. Menu bones cross at ~209 px/s and cannot kill.
- Bone lines move ~0.6–0.7 box widths/s; tap jumps last 0.46–0.63 s, full jumps ~1.2 s.
- Final attack 51.4 s in six parts.

**Measured (fan Alphys):** dialogue averages 15.0 s per turn, attacks 10.5 s (47% vs 33% of the cycle; 24–35 s per cycle). Long laser warning lines **1.4 s**; pods and turrets fire 0.4–0.67 s after appearing; the crosshair lightning has no warning. Phase 2 takes the menu buttons one per turn, each as the attack starts.

**Proposals:**
- **S1. Breathing room.** Lengthen the ~2 s gap between our waves toward 3–4 s, at least at phase boundaries. The wave count and the 75 s finale stay.
- **S2. Talk while attacking.** Have Sans or Alphys speak over the other's attack, as real Sans does, instead of empty-box dialogue.
- **S3. Black-cut transitions.** Use ~0.4 s black cuts when the fight escalates, shortening to ~0.1 s in later phases.
- **S4. Barrage cadence.** For blaster barrages, ~0.6–0.8 s from appearing to firing and ~0.6 s between blasters; keep slam warnings ~0.35 s and give long full-screen lasers ~1.0–1.4 s.
- **S5. Wave length.** Optionally trim waves toward ~10–14 s (real Sans attacks are 6.5–9.9 s). This changes tuning the user approved, so it is the user's call.

## Aqua

**Measured (Chara, the stronger reference):**
- 26 player turns (21 FIGHT, 5 ITEM, no MERCY). Attacks median 16 s (8–30 s); menus median 2.7 s; the box resizes in ~0.75 s.
- **Warnings**: thin 1–2 px lines flickering yellow/red at 6 Hz; beams marked by two parallel lines at the beam's width. Lead time **0.9–1.0 s** in almost every attack (0.30–0.64 s only for beams along lines already shown; ~2.0 s for a ~16-line lattice).
- **Live hazards**: slashes 0.25–0.33 s, beams 0.18–0.23 s, 10–18% of the box wide. Slashes every 1.00 s (up to 3 live plus 3 warnings); beam volleys every 1.50 s. Knife lunges ~6.2 box widths/s after a 0.3–0.5 s hover.
- **BLOCK parry**: guard pose 0.1 s after the attack bar appears, a box-wide label above her head at +0.64 s, held a median 1.49 s with a small pop.
- **Special**: ~10 s from announcement to first hazard.
- **Items**: each heal is followed by a shorter, no-dialogue attack (a built-in breather).
- **Finale**: ~34 s with no UI or HP shown: cut-in 2.9 s, empty box 1.6 s, horizontal beams ~6 s, transition ~1 s, vertical beams ~6 s, knife ring ~13 s, a "hold still" ring ~2.5 s.

**Measured (Love Maniac):** no parry. Warnings ramp red → orange/yellow → white with the lead shrinking 0.85 → ~0.6 s (first volley of an attack 1.12–1.17 s); live ~0.30 s; cycle 1.35 → 1.15 s. A grey band gives ~1.2 s before the giant knife sweep. Finale ~22 s, box only, HP kept visible.

Aqua already shows a PARRY n/3 counter and warns before slashes, and she already dodges, grazes and uses items, which neither reference does.

**Proposals:**
- **A1. Parry callout.** A large callout at the moment Aqua spends a parry: guard pose immediately, label for ~0.6–0.8 s. That's shorter than Chara's 1.5 s, because Aqua parries up to three times per exchange.
- **A2. Consistent slash warnings.** Big slashes and beams get ~0.9–1.0 s of warning (thin flickering line, white when live, live ~0.25–0.3 s); repeat volleys can shorten toward ~0.6 s, as both references do. Our code currently spans ~0.07–1.35 s.
- **A3. Finale staging.** Structure her finale as distinct ~6 s segments with ~1 s transitions and an opening cut-in, ~30–35 s in total. Strip the UI except HP (Love Maniac keeps HP visible; Chara hides it).
- **A4. Announced special.** A short announcement before her banked-TP release, then the hazard within ~2–3 s. Chara's ~10 s is too long for repeated use.
- **A5. Post-heal breather.** After either human heals, the next attack is a shorter, dialogue-free one.

## Limits

The recordings are other players' runs, so they show one path through each fight; the Gerson and Sans runs take no damage, so damage values aren't visible. The fan games' internals are unknown, so only what is visible was measured. No audio analysis. Our side is measured from bots and code constants, not human play.
