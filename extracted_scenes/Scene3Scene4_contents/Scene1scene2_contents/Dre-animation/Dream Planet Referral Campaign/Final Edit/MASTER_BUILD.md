# Dream Planet Master Build

## Release history

### Master v2 — Approved 2026-08-06 (tag: `master-v2-approved`)

**5-scene campaign — Scenes 1–5 (41.300s)**

| Scene | Label | Start | End | Duration |
|-------|-------|-------|-----|----------|
| 1 | Tattoo Reveal | 0.000s | 3.000s | 3.000s |
| 2 | Creator Discovery | 3.000s | 6.000s | 3.000s |
| 3 | Referral Journey (v3) | 6.000s | 19.433s | 13.433s |
| 4 | Leaderboard | 19.433s | 28.433s | 9.000s |
| 5 | Community & Participation | 28.433s | 41.300s | 12.867s |

**What changed from v1:**
- Scene 5 added (Creator Portfolio → Community Forum → Engagement interactions)
- Scene 3 rebuilt to v3 (readability pass); trim updated 3.0s → 0.7s for standalone capture
- Build script: `build_master_v2.sh`
- Baseline snapshot: `archive/scene5_v1/MASTER_V2_BASELINE.md`

### Master v1 — Approved 2026-08-05

**4-scene campaign — Scenes 1–4 (21.533s)**  
Build script: `build_master.sh`. Files preserved as `DreamPlanet_Master_v1*.mp4`.

---

`build_master_v2.sh` regenerates the Master v2 campaign deliverables
(`DreamPlanet_Master_v2.mp4`, `_audio.mp4`, `_no_audio.mp4`) deterministically
from the authoritative scene sources — no manually typed FFmpeg commands, no
one-off temp files. Verified reproducible against the approved master (2026-08-06).

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

### Built-in (build_master.sh)

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

### Standalone validator (validate_master.sh)

`validate_master.sh` is a CI/pre-push-ready command that validates the
campaign master independently of the build. It exits 0 on full pass, 1 on
any failure. No arguments needed for everyday use.

**Quick mode** (default, ~5s) — probes the existing approved masters and
source assets without rebuilding anything. Safe to run at any time:

```sh
cd "extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Final Edit"
./validate_master.sh
```

**Full mode** (~60s) — runs a clean rebuild via `build_master.sh` to a temp
dir, then validates the rebuilt output. Use this before approving a new master:

```sh
./validate_master.sh --full
./validate_master.sh --full --out /tmp/my_verify_dir   # keep the rebuilt files
```

**Verbose output** — prints each individual check (even on pass):

```sh
./validate_master.sh --verbose
```

**Checks performed:**

| # | Check | Mode |
|---|-------|------|
| 1 | All source assets exist and are non-empty | quick + full |
| 2 | scene3_final.mp4 and scene4_final.mp4 are readable by ffprobe | quick + full |
| 3 | Music track exists | quick + full |
| 4 | All three master deliverables exist and are playable | quick + full |
| 5 | Resolution is 1080×1920 (or ≥1080p in 9:16) | quick + full |
| 6 | Frame rate is 30fps | quick + full |
| 7 | Total duration is within expected bounds | quick + full |
| 8 | `_audio.mp4` has an audio stream | quick + full |
| 9 | `_no_audio.mp4` has no audio stream | quick + full |
| 10 | Audio/video duration match within 0.5s | quick + full |
| 11 | `_v1.mp4` and `_audio.mp4` durations match | quick + full |
| 12 | Normalized scene clips exist and sum to master duration | full (quick if work dir present) |
| 13 | Scene 3 blank-intro guard: first frame after ss=3.0 is not near-white | quick + full |

**Exit codes:** `0` = all pass · `1` = validation failure · `2` = usage/prereq error

### Pre-push hook

To automatically validate before every `git push`:

```sh
./install_hooks.sh             # install
./install_hooks.sh --status    # check if installed
./install_hooks.sh --remove    # uninstall
```

The hook runs `validate_master.sh --quick` and blocks the push if any check
fails. It appends to an existing pre-push hook rather than replacing it.

### CI integration

Add a validation step to your CI pipeline (GitHub Actions example):

```yaml
# .github/workflows/validate-master.yml
name: Validate Dream Planet Master

on:
  push:
  pull_request:

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: |
          sudo apt-get update -qq
          sudo apt-get install -y ffmpeg imagemagick

      - name: Validate master (quick)
        working-directory: "extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Final Edit"
        run: bash validate_master.sh --quick --verbose

      - name: Full rebuild + validate (on main only)
        if: github.ref == 'refs/heads/main'
        working-directory: "extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Final Edit"
        run: bash validate_master.sh --full --verbose
```

For other CI systems (CircleCI, Bitbucket Pipelines, GitLab CI), the
equivalent is: install `ffmpeg` and `imagemagick`, then run
`bash validate_master.sh --quick` from the `Final Edit/` directory.

## Adding Scene 5 / Scene 6

### In build_master.sh

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

### In validate_master.sh

The validator has a dedicated **SCENE REGISTRY** section (clearly marked near
the top) — the only section that needs updating when adding a new scene:

1. **Flat video source**: add to `FLAT_SCENE_SRCS`:
   ```sh
   FLAT_SCENE_SRCS[scene5]="$S34_BASE/Scene 5/Final Animation/scene5_final.mp4"
   ```
2. **Procedural scene** (generated from assets like S1/S2): add its input
   assets to `PROC_ASSETS` instead.
3. **Trim guard** (if the scene has a baked-in blank intro): add to `TRIM_GUARDS`:
   ```sh
   TRIM_GUARDS[scene5]="2.0"   # seconds to skip before first real frame
   ```
4. Add the scene name to `SCENE_ORDER`:
   ```sh
   SCENE_ORDER=(scene1 scene2 scene3 scene4 scene5)
   ```
5. Adjust `MIN_DURATION` / `MAX_DURATION` if the total duration changes
   significantly.

Nothing outside the SCENE REGISTRY section needs to change.

## Troubleshooting missing assets

The script fails fast (`set -euo pipefail`) with FFmpeg's own "No such file
or directory" error naming the exact missing input. Common causes:

- A source scene file was moved/renamed under `Scene N/Final Animation/`.
- The hero frame, font, or icon assets used by `build_scene1()`/
  `build_scene2()` were moved under `Scene 1 (LOCKED)/` or `Scene 2/`.
- The music file under `Replit-Design-Project/attached_assets/` was renamed.

Update the corresponding `*_SRC`/`MASTER_FRAME`/`FONT`/`DP_ICON`/`MUSIC`
variable at the top of the script to match the new path, then re-run.
Also update the matching variable in `validate_master.sh`'s SCENE REGISTRY.
