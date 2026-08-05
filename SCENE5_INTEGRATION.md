# Scene 5 Integration Guide

**Status: Ready to integrate — awaiting approved Scene 5 export.**

Scenes 1–4 are locked, validated, and reproducible. This document defines
the exact integration points so Scene 5 can be dropped in cleanly once its
export is approved.

---

## What needs to exist before integrating Scene 5

1. An approved, exported Scene 5 video file at the canonical source path (see below).
2. The Scene 5 export must pass a manual QA check matching the Scene 3/4 standard:
   - 1080×1920, 30fps, h264/yuv420p
   - Clean first frame (no blank white intro — or a documented trim point if one exists)
   - Confirmed visual content matches the approved creative brief

---

## Canonical source path convention

```
extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/
  Dream Planet Referral Campaign/
    Scene 5/
      Final Animation/
        scene5_final.mp4          ← place the approved export here
```

This follows the same layout as Scene 3 and Scene 4.

---

## Expected scene position and timing

| Scene | Start     | End       | Duration | Notes |
|-------|-----------|-----------|----------|-------|
| 1     | 0.00s     | 3.00s     | 3.00s    | locked |
| 2     | 3.00s     | 6.00s     | 3.00s    | locked |
| 3     | 6.00s     | 12.53s    | 6.53s    | locked |
| 4     | 12.53s    | 21.53s    | 9.00s    | locked |
| **5** | **21.53s**| **TBD**   | **TBD**  | append after Scene 4 |

Scene 5's `endTime` and duration are determined by the approved export.

---

## Integration checklist (4 files, 4 edits)

### 1. `build_master.sh`

Add a source variable near the existing scene source declarations (line ~56):

```sh
SCENE5_SRC="$REPO_ROOT/extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Scene 5/Final Animation/scene5_final.mp4"
```

Add a `build_scene5()` function. Copy `build_scene4()` and swap the source:

```sh
build_scene5() {
  echo "── Building Scene 5 (normalize) ──"
  ffmpeg -y -i "$SCENE5_SRC" \
    -vf "scale=${TARGET_W}:${TARGET_H}:force_original_aspect_ratio=decrease,pad=${TARGET_W}:${TARGET_H}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=${TARGET_FPS}" \
    -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -an \
    "$WORK/scene5_normalized.mp4" -loglevel warning
  echo "  done"
}
```

Update `SCENE_ORDER` (line ~80):

```sh
SCENE_ORDER=(scene1 scene2 scene3 scene4 scene5)
```

If Scene 5 has a baked-in blank intro (like Scene 3's 3.0s), add a trim constant
and a post-trim brightness check inside `build_scene5()` — see `build_scene3()`
for the exact pattern.

### 2. `validate_master.sh` — SCENE REGISTRY section

Add to `FLAT_SCENE_SRCS` (line ~101):

```sh
FLAT_SCENE_SRCS[scene5]="$S34_BASE/Scene 5/Final Animation/scene5_final.mp4"
```

Add to `SCENE_ORDER` (line ~94):

```sh
SCENE_ORDER=(scene1 scene2 scene3 scene4 scene5)
```

If Scene 5 needs a trim guard, add to `TRIM_GUARDS`:

```sh
TRIM_GUARDS[scene5]="<trim_start_seconds>"
```

Update `MAX_DURATION` if Scene 5 makes the total exceed 120s (unlikely but worth checking).

### 3. `artifacts/api-server/src/config/master.ts` — SCENES array

Append after Scene 4 (use `endTime` of Scene 4 as Scene 5's `startTime`):

```ts
{
  id: "scene5",
  label: "Scene 5",
  startTime: 21.533,          // ← Scene 4's endTime (update if master is rebuilt)
  endTime: 21.533 + <SCENE5_DURATION>,  // ← fill in once export duration is known
  description: "<Scene 5 description — to be filled in>",
  source: "video",
},
```

Also update `MASTER_META.duration` and `MASTER_META.durationFormatted` to reflect
the new total length.

### 4. Run and verify

```sh
# 1. Build new master (to a temp dir first to preserve approved files)
cd "extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Final Edit"
./build_master.sh /tmp/dp_scene5_verify

# 2. Validate the rebuild
./validate_master.sh --full --verbose

# 3. If all checks pass, run the build targeting the real output dir
./build_master.sh

# 4. Restart the API server, open /review and confirm Scene 5 appears in the timeline
```

---

## Files to edit at a glance

| File | What to change |
|------|---------------|
| `Final Edit/build_master.sh` | Add `SCENE5_SRC`, `build_scene5()`, append to `SCENE_ORDER` |
| `Final Edit/validate_master.sh` | Add to `FLAT_SCENE_SRCS`, append to `SCENE_ORDER` (and `TRIM_GUARDS` if needed) |
| `artifacts/api-server/src/config/master.ts` | Append to `SCENES`, update `MASTER_META.duration` |
| _(Optional)_ `Final Edit/MASTER_BUILD.md` | Update the scene timeline table |

No other files need to change. The concatenation, audio handling, and review
page all pick up the new scene automatically from `SCENE_ORDER` / `SCENES`.

---

## Current baseline (locked, Aug 5, 2026)

- Master: `DreamPlanet_Master_v1.mp4` / `_audio.mp4` / `_no_audio.mp4`
- Duration: 21.533s  |  Resolution: 1080×1920  |  FPS: 30  |  Audio: present
- Build: `Final Edit/build_master.sh` (deterministic, verified byte-for-byte reproducible)
- Validation: `Final Edit/validate_master.sh --full` → 22/22 checks pass
- Review: API server port 8080 `/review`
