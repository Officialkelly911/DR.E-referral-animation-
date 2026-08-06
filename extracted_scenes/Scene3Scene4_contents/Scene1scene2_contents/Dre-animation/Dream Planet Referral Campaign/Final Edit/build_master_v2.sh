#!/usr/bin/env bash
# ══════════════════════════════════════════════════════════════════════════
# Dream Planet Referral Campaign — Canonical Master Build v2
#
# Regenerates DreamPlanet_Master_v2(.mp4|_audio.mp4|_no_audio.mp4) from the
# authoritative scene sources listed below.
#
# What's new vs. v1:
#   • Scene 5 added (Creator Portfolio → Community Forum → Engagement)
#   • SCENE3_TRIM_START updated: 3.0→0.6s
#       Scene 3 v3 was captured with capture-scene3-only.mjs (standalone
#       Playwright context). That context has ~0.6s of browser preamble before
#       the animation begins — far shorter than the ~3.0s preamble baked into
#       the original VideoTemplate capture that v1 was built against.
#
# Master v1 files (DreamPlanet_Master_v1*.mp4) are NOT touched by this script.
#
# Usage:
#   cd "Final Edit" && ./build_master_v2.sh
#   ./build_master_v2.sh /path/to/dir   # write deliverables elsewhere
# ══════════════════════════════════════════════════════════════════════════
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../../../.." && pwd)"

# ── Output location ──────────────────────────────────────────────────────────
OUT_DIR="${1:-$SCRIPT_DIR}"
mkdir -p "$OUT_DIR"

# ── Build workspace ──────────────────────────────────────────────────────────
WORK="$REPO_ROOT/tmp_dp_master_v2_build"
rm -rf "$WORK"
mkdir -p "$WORK"

echo "Repo root:   $REPO_ROOT"
echo "Work dir:    $WORK"
echo "Output dir:  $OUT_DIR"
echo ""

# ── Authoritative sources ────────────────────────────────────────────────────
S1_LOCKED="$REPO_ROOT/extracted_scenes/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Scene 1 (LOCKED)"
S2_DIR="$REPO_ROOT/extracted_scenes/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Scene 2"
MASTER_FRAME="$S1_LOCKED/Final Master Frame/scene1_master_frame.jpg"
FONT="$S1_LOCKED/Project Files/fonts/Inter-SemiBold.ttf"
DP_ICON="$S2_DIR/Project Files/assets/dp_icon.png"

SCENE3_SRC="$REPO_ROOT/extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Scene 3/Final Animation/scene3_final.mp4"
SCENE4_SRC="$REPO_ROOT/extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Scene 4/Final Animation/scene4_final.mp4"
SCENE5_SRC="$REPO_ROOT/extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Scene 5/Final Animation/scene5_final.mp4"

MUSIC="$REPO_ROOT/extracted_scenes/Scene3Scene4_contents/Replit-Design-Project/attached_assets/Ai_music_for_dream_planet_video__1785842118219.mp3"

# ── Scene 3 trim guard (v2 value) ───────────────────────────────────────────
# Scene 3 v3 standalone capture has ~0.6s of Playwright preamble.
# The brightness guard checks at t=0.5s post-trim (approx animation t=1.1s)
# where the Referral Home is clearly visible — guards against blank-intro regressions.
SCENE3_TRIM_START=0.6

# ── Scene 5 trim guard ───────────────────────────────────────────────────────
# Scene 5 standalone capture has ~0.7s of Playwright preamble.
# Brightness guard checks at t=0.5s post-trim where live UI is visible.
SCENE5_TRIM_START=0.7

# ── Required output spec ─────────────────────────────────────────────────────
TARGET_W=1080
TARGET_H=1920
TARGET_FPS=30

# ── Scene order ──────────────────────────────────────────────────────────────
SCENE_ORDER=(scene1 scene2 scene3 scene4 scene5)

# ══════════════════════════════════════════════════════════════════════════
# Scene builders — each produces "$WORK/<scene>_normalized.mp4"
# ══════════════════════════════════════════════════════════════════════════

prepare_generated_assets() {
  echo "── Preparing Scene 1/2 procedural assets ──"
  ffmpeg -y -i "$MASTER_FRAME" -vf "scale=1640:1980" -q:v 2 -update 1 \
    "$WORK/hero_9x16.jpg" -loglevel warning

  ffmpeg -y -f lavfi -i "color=c=black:s=${TARGET_W}x${TARGET_H}:r=1" \
    -vf "format=rgba,geq=r=255:g=248:b=232:a='clip(150*exp(-0.5*pow(((X-540)*cos(0.38397)-(Y-960)*sin(0.38397))/172.8\,2))\,0\,255)'" \
    -vframes 1 -update 1 "$WORK/streak_s1_1920.png" -loglevel warning

  ffmpeg -y -f lavfi -i "color=c=black:s=${TARGET_W}x${TARGET_H}:r=1" \
    -vf "format=rgba,geq=r=255:g=250:b=238:a='clip(78*exp(-0.5*pow(((X-594)*cos(0.31416)-(Y-768)*sin(0.31416))/81\,2))\,0\,255)'" \
    -vframes 1 -update 1 "$WORK/streak_s2_1920.png" -loglevel warning
  echo "  done"
}

build_scene1() {
  echo "── Building Scene 1 (0.0–3.0s, generated) ──"
  ffmpeg -y \
    -loop 1 -i "$WORK/hero_9x16.jpg" \
    -i "$WORK/streak_s1_1920.png" \
    -filter_complex "
      [0:v]scale=w='trunc(iw*(1+0.065*min(1,max(0,(t-0.5)/2.5)))/2)*2':h='trunc(ih*(1+0.065*min(1,max(0,(t-0.5)/2.5)))/2)*2':eval=frame[zoomed];
      [zoomed]crop=w=${TARGET_W}:h=${TARGET_H}:x='(iw-${TARGET_W})/2':y='(ih-${TARGET_H})/2'[cropped];
      [1:v]format=rgba[streak];
      [cropped][streak]overlay=x='-1080+(t-0.8)/1.5*2160':y=0:enable='between(t,0.8,2.3)'[lit];
      [lit]drawtext=fontfile='$FONT':text='More than followers.':fontsize=54:fontcolor=white:shadowcolor=black@0.55:shadowx=2:shadowy=3:x=90:y=h-th-160:alpha='if(lt(t,1.2),0,if(lt(t,1.6),(t-1.2)/0.4,if(lt(t,2.8),1,if(lt(t,3.0),(3.0-t)/0.2,0))))'[texted];
      [texted]fade=t=in:st=0.2:d=0.3:color=black,setsar=1[vout]
    " \
    -map "[vout]" \
    -t 3.0 -r "$TARGET_FPS" \
    -c:v libx264 -preset medium -crf 14 -pix_fmt yuv420p \
    "$WORK/scene1_normalized.mp4" \
    -loglevel warning
  echo "  done"
}

build_scene2() {
  echo "── Building Scene 2 (3.0–6.0s, generated) ──"
  ffmpeg -y \
    -loop 1 -i "$WORK/hero_9x16.jpg" \
    -i "$WORK/streak_s2_1920.png" \
    -i "$DP_ICON" \
    -filter_complex "
      [0:v]scale=w='trunc(iw*(1.065+0.035*min(1,max(0,t/3.0)))/2)*2':h='trunc(ih*(1.065+0.035*min(1,max(0,t/3.0)))/2)*2':eval=frame[zoomed];
      [zoomed]crop=w=${TARGET_W}:h=${TARGET_H}:x='(iw-${TARGET_W})/2':y='(ih-${TARGET_H})/2'[cropped];
      [cropped]eq=contrast='1+0.018*min(1,max(0,(t-0.6)/0.6))':eval=frame[graded];
      [1:v]format=rgba[streak];
      [graded][streak]overlay=x='-90+(t-1.5)/0.8*180':y='-30+(t-1.5)/0.8*60':enable='between(t,1.5,2.3)'[lit];
      [2:v]scale=-2:96,format=rgba[iconraw];
      [iconraw]fade=t=in:st=2.2:d=0.5:alpha=1[iconfaded];
      [lit][iconfaded]overlay=x=90:y=1542:enable='gte(t,2.2)'[iconned];
      [iconned]drawtext=fontfile='$FONT':text='Join me on':fontsize=40:fontcolor=white:shadowcolor=black@0.5:shadowx=1:shadowy=2:x=90:y=1660:alpha='if(lt(t,0.6),0,if(lt(t,1.0),(t-0.6)/0.4,if(lt(t,2.5),1,if(lt(t,2.8),(2.8-t)/0.3,0))))'[t1];
      [t1]drawtext=fontfile='$FONT':text='Dream ':fontsize=82:fontcolor=white:shadowcolor=black@0.55:shadowx=2:shadowy=3:x=90:y=1709:alpha='if(lt(t,1.0),0,if(lt(t,1.4),(t-1.0)/0.4,if(lt(t,2.5),1,if(lt(t,2.8),(2.8-t)/0.3,0))))'[t2];
      [t2]drawtext=fontfile='$FONT':text='Planet':fontsize=82:fontcolor=0xF64A01:shadowcolor=black@0.55:shadowx=2:shadowy=3:x=374:y=1709:alpha='if(lt(t,1.0),0,if(lt(t,1.4),(t-1.0)/0.4,if(lt(t,2.5),1,if(lt(t,2.8),(2.8-t)/0.3,0))))',setsar=1[vout]
    " \
    -map "[vout]" \
    -t 3.0 -r "$TARGET_FPS" \
    -c:v libx264 -preset medium -crf 14 -pix_fmt yuv420p \
    "$WORK/scene2_normalized.mp4" \
    -loglevel warning
  echo "  done"
}

build_scene3() {
  echo "── Building Scene 3 v3 (trim preamble @ ss=${SCENE3_TRIM_START}s, normalize) ──"
  local src_dur
  src_dur=$(ffprobe -v error -show_entries format=duration \
    -of default=noprint_wrappers=1:nokey=1 "$SCENE3_SRC")
  if (( $(echo "$SCENE3_TRIM_START >= $src_dur" | bc -l) )); then
    echo "ERROR: SCENE3_TRIM_START (${SCENE3_TRIM_START}s) >= scene3_final.mp4 duration (${src_dur}s)." >&2
    echo "       scene3_final.mp4 may not be the expected v3 source. Verify before adjusting." >&2
    exit 1
  fi

  ffmpeg -y -ss "$SCENE3_TRIM_START" -i "$SCENE3_SRC" \
    -vf "fps=${TARGET_FPS},scale=${TARGET_W}:${TARGET_H},setsar=1" \
    -c:v libx264 -preset medium -crf 14 -pix_fmt yuv420p -an \
    "$WORK/scene3_normalized.mp4" \
    -loglevel warning

  # Brightness check at t=0.5s post-trim (≈ animation t=1.1s).
  # At that point the Referral Home orange UI is clearly visible (brightness ~0.6).
  # A near-white reading means the blank-intro bug has regressed or the trim is wrong.
  ffmpeg -y -ss 0.5 -i "$WORK/scene3_normalized.mp4" -vframes 1 -update 1 \
    "$WORK/scene3_check_frame.png" -loglevel warning
  local brightness
  brightness=$(convert "$WORK/scene3_check_frame.png" \
    -colorspace Gray -format "%[fx:mean]" info: 2>/dev/null || echo "0")
  if (( $(echo "$brightness > 0.90" | bc -l) )); then
    echo "ERROR: Scene 3 at t=0.5s post-trim is still near-blank (brightness ${brightness} > 0.90)." >&2
    echo "       SCENE3_TRIM_START (${SCENE3_TRIM_START}s) may be too short for this source." >&2
    echo "       Inspect $WORK/scene3_check_frame.png." >&2
    exit 1
  fi
  echo "  done (brightness check at t=0.5s post-trim: ${brightness})"
}

build_scene4() {
  echo "── Building Scene 4 (normalize) ──"
  ffmpeg -y -i "$SCENE4_SRC" \
    -vf "fps=${TARGET_FPS},scale=${TARGET_W}:${TARGET_H},setsar=1" \
    -c:v libx264 -preset medium -crf 14 -pix_fmt yuv420p -an \
    "$WORK/scene4_normalized.mp4" \
    -loglevel warning
  echo "  done"
}

build_scene5() {
  echo "── Building Scene 5 (trim preamble @ ss=${SCENE5_TRIM_START}s, normalize) ──"
  local src_dur
  src_dur=$(ffprobe -v error -show_entries format=duration \
    -of default=noprint_wrappers=1:nokey=1 "$SCENE5_SRC")
  if (( $(echo "$SCENE5_TRIM_START >= $src_dur" | bc -l) )); then
    echo "ERROR: SCENE5_TRIM_START (${SCENE5_TRIM_START}s) >= scene5_final.mp4 duration (${src_dur}s)." >&2
    exit 1
  fi

  ffmpeg -y -ss "$SCENE5_TRIM_START" -i "$SCENE5_SRC" \
    -vf "fps=${TARGET_FPS},scale=${TARGET_W}:${TARGET_H},setsar=1" \
    -c:v libx264 -preset medium -crf 14 -pix_fmt yuv420p -an \
    "$WORK/scene5_normalized.mp4" \
    -loglevel warning

  # Brightness check at t=0.5s post-trim (≈ animation t=1.2s).
  # Live Scene 5 UI is visible by that point (brightness ~0.69).
  ffmpeg -y -ss 0.5 -i "$WORK/scene5_normalized.mp4" -vframes 1 -update 1 \
    "$WORK/scene5_check_frame.png" -loglevel warning
  local brightness
  brightness=$(convert "$WORK/scene5_check_frame.png" \
    -colorspace Gray -format "%[fx:mean]" info: 2>/dev/null || echo "0")
  if (( $(echo "$brightness > 0.95" | bc -l) )); then
    echo "ERROR: Scene 5 at t=0.5s post-trim is still near-blank (brightness ${brightness} > 0.95)." >&2
    echo "       SCENE5_TRIM_START (${SCENE5_TRIM_START}s) may be too short for this source." >&2
    echo "       Inspect $WORK/scene5_check_frame.png." >&2
    exit 1
  fi
  echo "  done (brightness check at t=0.5s post-trim: ${brightness})"
}

# ══════════════════════════════════════════════════════════════════════════
# Build
# ══════════════════════════════════════════════════════════════════════════

prepare_generated_assets
for scene in "${SCENE_ORDER[@]}"; do
  "build_${scene}"
done

echo ""
echo "── Concatenating scenes in order: ${SCENE_ORDER[*]} ──"
FFMPEG_INPUTS=()
FILTER=""
LABELS=""
i=0
for scene in "${SCENE_ORDER[@]}"; do
  FFMPEG_INPUTS+=(-i "$WORK/${scene}_normalized.mp4")
  FILTER+="[$i:v]setsar=1:1[v$i];"
  LABELS+="[v$i]"
  i=$((i + 1))
done
FILTER+="${LABELS}concat=n=${#SCENE_ORDER[@]}:v=1:a=0[vout]"

ffmpeg -y "${FFMPEG_INPUTS[@]}" \
  -filter_complex "$FILTER" \
  -map "[vout]" \
  -c:v libx264 -preset medium -crf 14 -pix_fmt yuv420p \
  "$WORK/master_no_audio.mp4" \
  -loglevel warning

MASTER_DUR=$(ffprobe -v error -show_entries format=duration \
  -of default=noprint_wrappers=1:nokey=1 "$WORK/master_no_audio.mp4")
echo "  done → master_no_audio.mp4 (duration: ${MASTER_DUR}s)"

echo ""
echo "── Applying campaign music (master level only) ──"
FADE_START=$(echo "$MASTER_DUR - 1.0" | bc)
ffmpeg -y \
  -i "$WORK/master_no_audio.mp4" \
  -i "$MUSIC" \
  -filter_complex "[1:a]atrim=0:${MASTER_DUR},afade=t=out:st=${FADE_START}:d=1.0[afinal]" \
  -map "0:v" -map "[afinal]" \
  -c:v copy -c:a aac -b:a 192k \
  "$WORK/master_with_audio.mp4" \
  -loglevel warning
echo "  done → master_with_audio.mp4"

# ══════════════════════════════════════════════════════════════════════════
# Validation
# ══════════════════════════════════════════════════════════════════════════
echo ""
echo "── Validating build ──"
FAIL=0

probe_video()  { ffprobe -v error -select_streams v:0 -show_entries stream="$1" \
  -of default=noprint_wrappers=1:nokey=1 "$2"; }
probe_format() { ffprobe -v error -show_entries format="$1" \
  -of default=noprint_wrappers=1:nokey=1 "$2"; }

FINAL_W=$(probe_video width "$WORK/master_with_audio.mp4")
FINAL_H=$(probe_video height "$WORK/master_with_audio.mp4")
FINAL_FPS=$(probe_video r_frame_rate "$WORK/master_with_audio.mp4")
FINAL_VDUR=$(probe_format duration "$WORK/master_with_audio.mp4")
HAS_AUDIO=$(ffprobe -v error -select_streams a -show_entries stream=codec_type \
  -of csv=p=0 "$WORK/master_with_audio.mp4" || true)
AUDIO_DUR=$(ffprobe -v error -select_streams a:0 -show_entries stream=duration \
  -of default=noprint_wrappers=1:nokey=1 "$WORK/master_with_audio.mp4")

check() {
  local desc="$1" ok="$2"
  if [[ "$ok" == "1" ]]; then echo "  [PASS] $desc"; else echo "  [FAIL] $desc"; FAIL=1; fi
}

check "resolution is ${TARGET_W}x${TARGET_H} (got ${FINAL_W}x${FINAL_H})" \
  "$([[ "$FINAL_W" == "$TARGET_W" && "$FINAL_H" == "$TARGET_H" ]] && echo 1 || echo 0)"
check "frame rate is ${TARGET_FPS}/1 (got ${FINAL_FPS})" \
  "$([[ "$FINAL_FPS" == "${TARGET_FPS}/1" ]] && echo 1 || echo 0)"
check "audio stream present" \
  "$([[ "$HAS_AUDIO" == "audio" ]] && echo 1 || echo 0)"
check "audio duration (${AUDIO_DUR}s) matches video duration (${FINAL_VDUR}s) within 0.2s" \
  "$(awk -v a="$AUDIO_DUR" -v b="$FINAL_VDUR" 'BEGIN{d=a-b;if(d<0)d=-d;print(d<0.2)?1:0}')"

# Scene ordering / completeness: sum of each scene's duration must match master
SUM=0
TIMELINE=""
CURSOR=0
for scene in "${SCENE_ORDER[@]}"; do
  d=$(probe_format duration "$WORK/${scene}_normalized.mp4")
  SUM=$(echo "$SUM + $d" | bc)
  END=$(echo "$CURSOR + $d" | bc)
  TIMELINE+="$(printf "    %-8s %6.2fs - %6.2fs  (%.2fs)" "$scene" "$CURSOR" "$END" "$d")"$'\n'
  CURSOR=$END
done
check "scene ordering/completeness: sum of scene durations (${SUM}s) matches master (${MASTER_DUR}s) within 0.1s" \
  "$(awk -v a="$SUM" -v b="$MASTER_DUR" 'BEGIN{d=a-b;if(d<0)d=-d;print(d<0.1)?1:0}')"

# Scene 3 regression guard: normalized scene3 must not start near-white (>0.90)
# Checking t=0.5s post-trim where Referral Home is clearly visible.
S3_NORM_BRIGHTNESS=$(convert "$WORK/scene3_check_frame.png" \
  -colorspace Gray -format "%[fx:mean]" info: 2>/dev/null || echo "1")
check "Scene 3 blank-intro regression guard (brightness at t=0.5s post-trim: ${S3_NORM_BRIGHTNESS} < 0.90)" \
  "$(awk -v b="$S3_NORM_BRIGHTNESS" 'BEGIN{print(b<0.90)?1:0}')"

# Scene 5 integrity: normalized scene5 must not start near-white (>0.95)
S5_NORM_BRIGHTNESS=$(convert "$WORK/scene5_check_frame.png" \
  -colorspace Gray -format "%[fx:mean]" info: 2>/dev/null || echo "1")
check "Scene 5 blank-intro guard (brightness at t=0.5s post-trim: ${S5_NORM_BRIGHTNESS} < 0.95)" \
  "$(awk -v b="$S5_NORM_BRIGHTNESS" 'BEGIN{print(b<0.95)?1:0}')"

# Scene 4 → Scene 5 continuity: check that scene4 and scene5 normalized clips
# both have valid non-trivial durations (both > 5.0s).
S4_DUR=$(probe_format duration "$WORK/scene4_normalized.mp4")
S5_DUR=$(probe_format duration "$WORK/scene5_normalized.mp4")
check "Scene 4 duration > 5.0s (got ${S4_DUR}s)" \
  "$(awk -v d="$S4_DUR" 'BEGIN{print(d>5.0)?1:0}')"
check "Scene 5 duration > 5.0s (got ${S5_DUR}s)" \
  "$(awk -v d="$S5_DUR" 'BEGIN{print(d>5.0)?1:0}')"

if [[ "$FAIL" != "0" ]]; then
  echo ""
  echo "Validation FAILED — deliverables were NOT copied to $OUT_DIR." >&2
  exit 1
fi

# ══════════════════════════════════════════════════════════════════════════
# Deliverables — v2 filenames; v1 files are not touched
# ══════════════════════════════════════════════════════════════════════════
cp "$WORK/master_no_audio.mp4"   "$OUT_DIR/DreamPlanet_Master_v2_no_audio.mp4"
cp "$WORK/master_with_audio.mp4" "$OUT_DIR/DreamPlanet_Master_v2_audio.mp4"
cp "$WORK/master_with_audio.mp4" "$OUT_DIR/DreamPlanet_Master_v2.mp4"

echo ""
echo "══════════════════════════════════════════════════════"
echo " BUILD REPORT — Master v2"
echo "══════════════════════════════════════════════════════"
echo "  Resolution:      ${FINAL_W}x${FINAL_H}"
echo "  Frame rate:      ${FINAL_FPS}"
echo "  Video duration:  ${FINAL_VDUR}s"
echo "  Audio duration:  ${AUDIO_DUR}s"
echo "  Scene order:     ${SCENE_ORDER[*]}"
echo "  Timeline:"
echo -n "$TIMELINE"
echo "  Deliverables written to: $OUT_DIR"
echo "    - DreamPlanet_Master_v2.mp4"
echo "    - DreamPlanet_Master_v2_audio.mp4"
echo "    - DreamPlanet_Master_v2_no_audio.mp4"
echo "══════════════════════════════════════════════════════"
