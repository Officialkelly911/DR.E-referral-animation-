#!/usr/bin/env bash
# Dream Planet Referral Campaign — Master Build v3
#
# Appends the approved Scene 6 to the locked Master v2 without rebuilding
# Scenes 1–5. Master v2 remains untouched.
#
# Usage:
#   ./build_master_v3.sh
#   ./build_master_v3.sh /path/to/output-dir
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../../../.." && pwd)"
OUT_DIR="${1:-$SCRIPT_DIR}"
WORK="$REPO_ROOT/tmp_dp_master_v3_build"

mkdir -p "$OUT_DIR"
rm -rf "$WORK"
mkdir -p "$WORK"

BASE_NO_AUDIO="$SCRIPT_DIR/DreamPlanet_Master_v2_no_audio.mp4"
SCENE6_SRC="$REPO_ROOT/extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Scene 6/Final Animation/scene6_final_v3_no_audio.mp4"
MUSIC="$REPO_ROOT/extracted_scenes/Scene3Scene4_contents/Replit-Design-Project/attached_assets/Ai_music_for_dream_planet_video__1785842118219.mp3"

TARGET_W=1080
TARGET_H=1920
TARGET_FPS=30

for required in "$BASE_NO_AUDIO" "$SCENE6_SRC" "$MUSIC"; do
  [[ -s "$required" ]] || { echo "ERROR: missing required input: $required" >&2; exit 1; }
done

echo "Repo root:   $REPO_ROOT"
echo "Base:        $(basename "$BASE_NO_AUDIO") (locked Scenes 1–5)"
echo "Scene 6:     $(basename "$SCENE6_SRC")"
echo "Output dir:  $OUT_DIR"
echo ""

echo "── Normalizing approved Scene 6 to ${TARGET_FPS}fps ──"
ffmpeg -y -i "$SCENE6_SRC" \
  -vf "fps=${TARGET_FPS},scale=${TARGET_W}:${TARGET_H},setsar=1" \
  -c:v libx264 -preset medium -crf 14 -pix_fmt yuv420p -an \
  "$WORK/scene6_normalized.mp4" -loglevel warning

SCENE6_DUR="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$WORK/scene6_normalized.mp4")"
BASE_DUR="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$BASE_NO_AUDIO")"

echo "── Appending Scene 6 to the locked Master v2 video ──"
{
  printf "file '%s'\n" "$BASE_NO_AUDIO"
  printf "file '%s'\n" "$WORK/scene6_normalized.mp4"
} > "$WORK/concat.txt"
ffmpeg -y -f concat -safe 0 -i "$WORK/concat.txt" -c copy \
  "$WORK/master_no_audio.mp4" -loglevel warning

MASTER_DUR="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$WORK/master_no_audio.mp4")"
EXPECTED_DUR="$(awk -v a="$BASE_DUR" -v b="$SCENE6_DUR" 'BEGIN{printf "%.3f",a+b}')"

echo "  Base duration:     ${BASE_DUR}s"
echo "  Scene 6 duration:  ${SCENE6_DUR}s"
echo "  Master duration:   ${MASTER_DUR}s (expected ~${EXPECTED_DUR}s)"

echo "── Applying campaign music at master level ──"
FADE_START="$(awk -v d="$MASTER_DUR" 'BEGIN{printf "%.3f",d-1.0}')"
ffmpeg -y \
  -i "$WORK/master_no_audio.mp4" \
  -i "$MUSIC" \
  -filter_complex "[1:a]atrim=0:${MASTER_DUR},afade=t=out:st=${FADE_START}:d=1.0[afinal]" \
  -map 0:v -map "[afinal]" \
  -c:v copy -c:a aac -b:a 192k \
  "$WORK/master_audio.mp4" -loglevel warning

FINAL_W="$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$WORK/master_audio.mp4")"
FINAL_H="$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$WORK/master_audio.mp4")"
FINAL_FPS="$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$WORK/master_audio.mp4")"
AUDIO_DUR="$(ffprobe -v error -select_streams a:0 -show_entries stream=duration -of csv=p=0 "$WORK/master_audio.mp4")"

[[ "$FINAL_W" == "$TARGET_W" && "$FINAL_H" == "$TARGET_H" ]] || {
  echo "ERROR: unexpected output resolution ${FINAL_W}x${FINAL_H}" >&2; exit 1;
}
[[ "$FINAL_FPS" == "${TARGET_FPS}/1" ]] || {
  echo "ERROR: unexpected output FPS ${FINAL_FPS}" >&2; exit 1;
}
awk -v a="$MASTER_DUR" -v b="$AUDIO_DUR" 'BEGIN{d=a-b;if(d<0)d=-d; exit(d<=0.5?0:1)}' || {
  echo "ERROR: audio/video duration mismatch: ${AUDIO_DUR}s vs ${MASTER_DUR}s" >&2; exit 1;
}

cp "$WORK/master_audio.mp4" "$OUT_DIR/DreamPlanet_Master_v3.mp4"
cp "$WORK/master_audio.mp4" "$OUT_DIR/DreamPlanet_Master_v3_audio.mp4"
cp "$WORK/master_no_audio.mp4" "$OUT_DIR/DreamPlanet_Master_v3_no_audio.mp4"

echo ""
echo "══════════════════════════════════════════════════════"
echo " BUILD REPORT — Master v3"
echo "══════════════════════════════════════════════════════"
echo "  Resolution: ${FINAL_W}x${FINAL_H}"
echo "  Frame rate: ${FINAL_FPS}"
echo "  Duration:   ${MASTER_DUR}s"
echo "  Audio:      ${AUDIO_DUR}s"
echo "  Timeline:   Scenes 1–5 locked (${BASE_DUR}s) + Scene 6 (${SCENE6_DUR}s)"
echo "  Written to: $OUT_DIR"
echo "══════════════════════════════════════════════════════"