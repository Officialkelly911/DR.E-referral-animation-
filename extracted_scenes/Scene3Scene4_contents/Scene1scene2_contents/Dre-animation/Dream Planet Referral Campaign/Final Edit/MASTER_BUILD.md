# Dream Planet Master Build

`build_master.sh` regenerates the campaign master deliverables
(`DreamPlanet_Master_v1.mp4`, `_audio.mp4`, `_no_audio.mp4`) deterministically
from the authoritative scene sources — no manually typed FFmpeg commands, no
one-off temp files. Verified byte-for-byte reproducible against the current
approved master (Aug 5, 2026).

## Authoritative inputs

| Scene | Source | Notes |
|---|---|---|
| Scene 1 | `Scene 1 (LOCKED)/Final Master Frame/scene1_master_frame.jpg` + `Project Files/fonts/Inter-SemiBold.ttf` | Procedurally rendered (ken-burns zoom, light streak, headline text) — there is no flat scene1 video source. Render logic lives in `build_scene1()`. |
| Scene 2 | Same hero frame + `Scene 2/Project Files/assets/dp_icon.png` | Procedurally rendered, continues Scene 1's zoom. Render logic lives in `build_scene2()`. |
| Scene 3 | `Scene 3/Final Animation/scene3_final.mp4` | Flat video file. **Must be trimmed at `ss=3.0`** — see "Scene 3 trim" below. |
| Scene 4 | `Scene 4/Final Animation/scene4_final.mp4` | Flat video file, used as-is (normalized only). |
| Music | `Replit-Design-Project/attached_assets/Ai_music_for_dream_planet_video__1785842118219.mp3` | Applied once at the master level — see "Audio handling" below. |

All paths are resolved relative to the repo root inside the script; you don't
need to edit paths to run it from a fresh checkout.

## Running it

```sh
cd "extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Final Edit"
./build_master.sh
```

This overwrites the three deliverables in this directory. To check what a
rebuild would produce **without** touching the approved masters, pass an
alternate output directory:

```sh
./build_master.sh /tmp/dp_master_verify
```

Intermediate/normalized clips are written to `tmp_dp_master_build/` at the
repo root. That directory is fully regenerated on every run (the script
`rm -rf`s it first) and is not a deliverable — safe to delete anytime between
runs.

## Scene order & durations (current approved master)

```
scene1    0.00s -  3.00s  (3.00s)   generated
scene2    3.00s -  6.00s  (3.00s)   generated
scene3    6.00s - 12.53s  (6.53s)   scene3_final.mp4, trimmed at ss=3.0
scene4   12.53s - 21.53s  (9.00s)   scene4_final.mp4
```

All transitions are hard cuts (no crossfade/dissolve) — this matches the
approved master exactly. The Scene 3→4 cut (Levels page → Leaderboard) looks
abrupt because the two pages have different background colors, not because
of a rendering defect (confirmed via frame-by-frame brightness sampling
during QA).

## Scene 3 trim (do not remove)

`scene3_final.mp4` has ~3.0s of blank/white content baked in before the
Referral Home UI appears. A previous build shipped this untrimmed, producing
a multi-second dead white screen with music but no UI right after Scene 2.
`build_master.sh` hard-codes `SCENE3_TRIM_START=3.0` and, after trimming,
automatically checks that Scene 3's first frame is no longer near-blank-white
(mean grayscale > 0.95 fails the build). If that check ever fails, the
source file has likely changed — inspect
`tmp_dp_master_build/scene3_first_frame.png` before touching the trim value.

## Audio handling

The campaign music track is applied exactly once, after all scenes are
concatenated — never per-scene. Scene sources are stripped of audio during
normalization (`-an`). This guarantees one continuous soundtrack with no
restarts or duplicate audio at scene boundaries, and a clean 1s fade-out
timed to the final master duration (not a fixed timestamp), so the fade
still lands correctly if scene durations change.

## Validation

After every build, before any deliverable is copied out, the script checks
(via `ffprobe`):

- Resolution is exactly 1080×1920
- Frame rate is exactly 30fps
- An audio stream is present
- Audio duration matches video duration (within 0.2s)
- Scene ordering/completeness: the sum of each normalized scene's own
  duration matches the concatenated master's duration (within 0.05s) —
  catches a skipped, duplicated, or truncated scene
- (Scene 3 only) the trimmed clip's first frame isn't still blank white

If any check fails, the script exits non-zero and does **not** overwrite the
deliverables in the output directory — the previous approved files are left
untouched. A build report (resolution, frame rate, durations, per-scene
timeline, output paths) prints on success.

## Adding Scene 5 / Scene 6

1. Add a source variable near the top of the script, e.g.:
   ```sh
   SCENE5_SRC="$REPO_ROOT/.../Scene 5/Final Animation/scene5_final.mp4"
   ```
2. Write a `build_scene5()` function following the existing contract: it
   must produce `"$WORK/scene5_normalized.mp4"` at 1080×1920, 30fps,
   h264/yuv420p, with no audio. For a flat video source, copy `build_scene4()`
   and swap the source path. For a procedurally rendered scene, copy
   `build_scene1()`/`build_scene2()` and adjust the filter graph.
3. Call your new builder in the `SCENE_ORDER` array at the top of the
   script: `SCENE_ORDER=(scene1 scene2 scene3 scene4 scene5)`.
4. Re-run `./build_master.sh`. Concatenation, audio, validation, and the
   build report all pick up the new scene automatically — nothing else in
   the script needs to change.
5. If Scene 5 needs a trim guard (like Scene 3's blank intro), copy the
   pattern in `build_scene3()`: a named trim-point constant plus a
   post-trim sanity check (e.g. brightness, or a known-good duration range).

## Troubleshooting missing assets

The script fails fast (`set -euo pipefail`) with FFmpeg's own "No such file
or directory" error naming the exact missing input. Common causes:

- A source scene file was moved/renamed under `Scene N/Final Animation/`.
- The hero frame, font, or icon assets used by `build_scene1()`/
  `build_scene2()` were moved under `Scene 1 (LOCKED)/` or `Scene 2/`.
- The music file under `Replit-Design-Project/attached_assets/` was renamed.

Update the corresponding `*_SRC`/`MASTER_FRAME`/`FONT`/`DP_ICON`/`MUSIC`
variable at the top of the script to match the new path, then re-run.
