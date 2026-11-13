# Flowey reference study

The designer supplied two references for the Flowey redo:

- **Video:** Undertale Yellow, Flowey no-hit, neutral route (`YJVKi7fnCKM`, 960×720, 30 fps, 16:30). The designer named it the strongest inspiration for structure and spritework.
- **Sprites:** a fan-compiled reference sheet of Undertale's own Flowey battle frames (nochocolate, 2016).

The video was measured with ffmpeg: a 10 fps scene classifier, then 2-second contact sheets checked by eye. Neither the video nor its frames are in the repo.

## Structure measured

| Part | Time | What happens |
| --- | --- | --- |
| Opening talk | 0:00–0:22 | Small white Flowey above a small square box. "Remember what I taught you." |
| Cycle 1 | 0:24–1:07 | Three attacks of 9.1, 10.0 and 7.5 s; player turns ~1 s; then a ~12 s barrage under a giant line-art face; then a white swirl ("load"). |
| Chase 1 | 1:08–1:36 | ~28 s top-down run through an earlier area. Vines rise from the floor, pellets cross the corridor. |
| Cycle 2 | 1:40–2:24 | Attacks of 10.5, 8.6, 11.0 and 6.0 s, then a ~12 s face barrage. |
| Chase 2 | 2:26–2:56 | ~27 s run through a second area. |
| Cycle 3 | 2:58–3:56 | Attacks of 10.6, 8.5, 10.1 and 11.7 s, then a ~15 s face barrage. |
| Chase 3 and montage | 3:58–4:48 | ~27 s run, then 2–6 s flashes of the other areas. |
| The dark | 4:48–8:38 | Alone in the dark, voices, a flashback. |
| Inside Flowey | 8:40–15:20 | Giant Flowey, no box. ~20 s base phases alternate with six ~20 s "soul" phases; the last is ~38 s. Ends on "Hey." … "WHAT IS WRONG WITH YOU???" |
| After | 15:28–16:22 | Small Flowey again, talking. |

Other measured points:

- Attacks are 6–12 s.
- Between attacks, the player's turn and Flowey's line take 1–3 s.
- Each face barrage leads straight into its chase, with no menu in between.

## How the redo uses it

The redo follows the reference's structure. Our own story, characters and mechanics fill it:

- **Act one, his battle.** Twelve short attacks (10–13 s) made from our existing tricks: rigged buttons, save/load, reversed controls, the fake Game Over, the stolen name.
- **SAVE and LOAD.** A giant-face barrage (12–13 s) "saves" a file. A chase (26 s) then "loads" a room Seth already walked through: the Ruins theatre (Encore's curtains), Snowdin's door (Rift's shards) and Waterfall (Mettalot's tears). A short montage follows: Hotland (Tenna's rays), the CORE (Sans's bones) and the void.
- **Act two, the dark.** Flowey takes the soul.
- **Act three, inside him.** No box. Six ~20 s phases replay pacifist-route bosses (Encore, Rift, Mettalot, Ant Tenna + Spamson, Sans) and his own tricks. They alternate with the six pages of Seth's life. The closing gauntlet is 40 s. Seth fights back with the Torn Notebook on his turns. The ending choice is unchanged.

Every replayed boss comes from the pacifist route. The old fight also replayed Spamson NEO, a genocide-route boss; that replay was removed.

## Sprites

The 90 frames on the sheet were cut at native size: an exact 2× grid, zero mismatched pixels. They form one 56×56-cell atlas with the eyes and mouth kept opaque. Flowey's twelve story faces map to canon frames, each with a talking frame. The giant face in the barrages is the same frames scaled up and dimmed. Every expression has a talking frame that only opens the mouth. Inside him, he is the same canon sprite at 5×, with thorned vines behind him.

No Undertale Yellow art was copied. The chase rooms and the vines are original. His voice blips, hurt cry and laugh are the designer's supplied sounds.
