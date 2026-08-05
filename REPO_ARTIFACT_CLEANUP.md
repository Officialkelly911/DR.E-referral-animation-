# REPO_ARTIFACT_CLEANUP.md

Dream Planet Referral Campaign — Repository Artifact Cleanup Report  
Performed: August 5, 2026

---

## Summary

Removed 406 MB of regenerable, superseded, and duplicate video/build artifacts from Git
tracking. The canonical master-build pipeline (`build_master.sh`) was verified clean
after cleanup. No source assets were removed.

| Metric | Value |
|--------|-------|
| Before tracked size | ~650 MB |
| After tracked size | ~244 MB |
| Reduction | ~406 MB (~62%) |
| Build verification | ✅ All 5 checks PASS |
| Approved master integrity | ✅ Duration 21.533s — matches pre-cleanup master |
| Scene 3 blank-intro guard | ✅ First-frame brightness 0.685 (< 0.95 threshold) |
| Source assets verified | ✅ All required inputs present |

---

## Files / Directories Removed from Git Tracking

### 1. Root-level duplicate `.gz` archives (~107 MB)

| File | Size | Reason |
|------|------|--------|
| `Scene1scene2.gz` | 64 MB | Byte-identical copy of `extracted_scenes/Scene1scene2.gz` |
| `Scene3Scene4.gz` | 43 MB | Byte-identical copy of `extracted_scenes/Scene3Scene4.gz` |

The authoritative copies remain at `extracted_scenes/Scene1scene2.gz` and
`extracted_scenes/Scene3Scene4.gz`.

### 2. Extracted tar blobs (~114 MB)

| File | Size | Reason |
|------|------|--------|
| `extracted_scenes/Scene1scene2` | 65 MB | Raw tar archive extracted from the `.gz`; regenerable |
| `extracted_scenes/Scene3Scene4` | 49 MB | Raw tar archive extracted from the `.gz`; regenerable |

To re-extract:
```sh
gzip -dc extracted_scenes/Scene1scene2.gz > extracted_scenes/Scene1scene2
gzip -dc extracted_scenes/Scene3Scene4.gz > extracted_scenes/Scene3Scene4
```

### 3. `tmp_dp_build/` intermediates (~77 MB)

All 10 files in this directory were temporary outputs from the old
`build_visual_review.sh` pipeline (hero frames, normalized scene clips, and
the visual-review master). The canonical pipeline (`build_master.sh`) now
uses `tmp_dp_master_build/` instead, which is also gitignored.

Files removed: `contact_sheet.jpg`, `hero_9x16.jpg`, `master_no_audio.mp4`,
`master_with_audio.mp4`, `s1_9x16.mp4`, `s2_9x16.mp4`, `s3_trimmed_30fps.mp4`,
`s4_30fps.mp4`, `streak_s1_1920.png`, `streak_s2_1920.png`.

Regenerate with:
```sh
./extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/\
"Dream Planet Referral Campaign/Final Edit/build_visual_review.sh"
```

### 4. VisualReview exports (~58 MB)

| File | Size | Reason |
|------|------|--------|
| `Final Edit/DreamPlanet_Master_v1_VisualReview.mp4` | 29 MB | Regenerable higher-bitrate preview; not a canonical deliverable |
| `Final Edit/DreamPlanet_Master_v1_VisualReview_no_audio.mp4` | 29 MB | Same |

Regenerate with:
```sh
cd "extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Final Edit"
./build_visual_review.sh
```

### 5. Pre-QA-fix archive (~50 MB)

| File | Size | Reason |
|------|------|--------|
| `_archive_pre_qa_fix/DreamPlanet_Master_v1_HAD_WHITE_GAP.mp4` | 17 MB | Superseded — had 2.9s blank white gap after Scene 2 |
| `_archive_pre_qa_fix/DreamPlanet_Master_v1_audio_HAD_WHITE_GAP.mp4` | 17 MB | Same |
| `_archive_pre_qa_fix/DreamPlanet_Master_v1_no_audio_HAD_WHITE_GAP.mp4` | 17 MB | Same |

These were explicitly archived to document the pre-fix state. The fix is now
permanently encoded in `build_master.sh` via `SCENE3_TRIM_START=3.0` and the
automated brightness guard, so the archive serves no ongoing purpose.
The fix is documented in `replit.md` "Final master QA" and in `MASTER_BUILD.md`.

### 6. Browser capture intermediates (~5.5 MB)

| File | Reason |
|------|--------|
| `captured/page@b44eb45a0965dea26f7f18b44bfb49c2.webm` | Browser-recorded scene capture; regenerable |
| `captured/page@fa17d1f7d8d619f48f514e6e6a24de08.webm` | Browser-recorded scene capture; regenerable |
| `captured/master_concat.txt` | FFmpeg concat manifest; regenerable |

Location: `extracted_scenes/Scene3Scene4_contents/Replit-Design-Project/artifacts/dream-planet-scene3/captured/`

---

## Files Intentionally Retained and Why

### Canonical deliverables (approved masters)
- `Final Edit/DreamPlanet_Master_v1.mp4` (19 MB) — approved campaign master
- `Final Edit/DreamPlanet_Master_v1_audio.mp4` (19 MB) — same with explicit audio track
- `Final Edit/DreamPlanet_Master_v1_no_audio.mp4` (18 MB) — no-audio version for re-mux workflows

### Source scene files
- `Scene 3/Final Animation/scene3_final.mp4` (4 MB) — authoritative Scene 3 source; contains the pre-trim blank intro by design
- `Scene 4/Final Animation/scene4_final.mp4` (5 MB) — authoritative Scene 4 source

### Source media and assets
- `scene1_master_frame.jpg` (451 KB) — hero frame used to procedurally render Scenes 1 & 2
- `dp_icon.png` (285 KB) — Dream Planet icon overlaid in Scene 2
- `Inter-SemiBold.ttf` (511 KB) — font used in Scenes 1 & 2 text overlays
- `Ai_music_for_dream_planet_video__*.mp3` (2.3 MB, canonical copy) — campaign music applied at master level
- All logo PNGs, memoji avatar PNGs, referral UI screenshots

### Build pipeline
- `build_master.sh` — canonical deterministic build script
- `build_visual_review.sh` — higher-quality preview generator
- `MASTER_BUILD.md` — full pipeline specification

### Captured reference frames (kept — small, useful as QA references)
- `captured/scene3_end_frame.png`, `scene3_start_frame.png`, `scene4_start_frame.png`,
  `scene4_end_frame.png`, `scene3_mobile_review.jpg` — visual QA reference stills

### Visual review reference images
- `public/review/*.jpg` — static frame grabs used as visual reference for the review page

### `.gz` archives (authoritative)
- `extracted_scenes/Scene1scene2.gz` (64 MB) — authoritative archive for Scene 1 & 2 workspace
- `extracted_scenes/Scene3Scene4.gz` (43 MB) — authoritative archive for Scene 3 & 4 workspace

---

## `.gitignore` Changes

A new `.gitignore` was created at the repository root with the following sections:

1. **Root duplicate gz files** — `/Scene1scene2.gz`, `/Scene3Scene4.gz`
2. **Extracted tar blobs** — `/extracted_scenes/Scene1scene2`, `/extracted_scenes/Scene3Scene4`
3. **Temporary build workspaces** — `/tmp_dp_master_build/`, `/tmp_dp_build/`
4. **VisualReview exports** — `DreamPlanet_Master_v1_VisualReview.mp4`, `*_no_audio.mp4` variant
5. **Pre-QA-fix archive** — `*/_archive_pre_qa_fix/`
6. **Browser capture intermediates** — `captured/*.webm`, `captured/master_concat.txt`
7. **Node/pnpm** — `node_modules/`, `.pnpm-store/`, `dist/`, `.cache/replit/`

---

## Build Verification Results

Run from clean state after removing all tracked artifacts:

```
Repo root:   /home/runner/workspace
Work dir:    /home/runner/workspace/tmp_dp_master_build
Output dir:  /tmp/dp_verify_build

── Building Scene 1  ✅
── Building Scene 2  ✅
── Building Scene 3 (trim blank intro @ ss=3.0)  ✅
   First-frame brightness check passed: 0.685419 (< 0.95 threshold)
── Building Scene 4  ✅
── Concatenating scenes: scene1 scene2 scene3 scene4  ✅
── Applying campaign music  ✅

── Validating build ──
  [PASS] resolution is 1080x1920
  [PASS] frame rate is 30/1
  [PASS] audio stream present
  [PASS] audio duration (21.532993s) matches video duration (21.533333s) within 0.2s
  [PASS] scene ordering/completeness: 21.533333s matches master within 0.05s

  Timeline:
    scene1     0.00s -   3.00s  (3.00s)
    scene2     3.00s -   6.00s  (3.00s)
    scene3     6.00s -  12.53s  (6.53s)
    scene4    12.53s -  21.53s  (9.00s)
```

Rebuilt master duration: **21.533s** — matches approved master exactly.

---

## Files Left for Manual Review

None. All removed files were categorically confirmed as:
- byte-identical duplicates (verified with `md5sum`), or
- outputs of documented build scripts (verified by re-running those scripts), or
- labeled pre-fix archives (verified against git history in the previous task).

---

## How to Regenerate Removed Assets

### Full campaign master (canonical deliverables)
```sh
cd "extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Final Edit"
./build_master.sh
```

### Higher-quality visual review version
```sh
./build_visual_review.sh
```

### Re-extract the `.gz` tar archives (if needed for workspace setup)
```sh
gzip -dc extracted_scenes/Scene1scene2.gz > extracted_scenes/Scene1scene2
gzip -dc extracted_scenes/Scene3Scene4.gz > extracted_scenes/Scene3Scene4
```
