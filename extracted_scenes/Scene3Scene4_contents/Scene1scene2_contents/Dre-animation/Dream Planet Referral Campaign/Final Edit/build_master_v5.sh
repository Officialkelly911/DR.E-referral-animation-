#!/usr/bin/env bash
# Dream Planet Referral Campaign — Master Build v5
#
# Rebuilds Scenes 1–5 through the existing deterministic v2 pipeline, using
# the approved revised Scene 5 at its canonical source path, then appends the
# approved integrated Scene 6 Notifications/CTA render. Previous masters are
# never overwritten.
#
# Usage:
#   ./build_master_v5.sh
#   ./build_master_v5.sh /path/to/output-dir
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../../../.." && pwd)"
OUT_DIR="${1:-$SCRIPT_DIR}"
WORK="$REPO_ROOT/tmp_dp_master_v5_build"
BASE_DIR="$WORK/base"

mkdir -p "$OUT_DIR"
rm -rf "$WORK"
mkdir -p "$BASE_DIR"

SCENE5_SRC="$REPO_ROOT/extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Scene 5/Final Animation/scene5_final.mp4"
SCENE6_SRC="$REPO_ROOT/extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Scene 6/Final Animation/scene6_final_v3_no_audio.mp4"
MUSIC="$REPO_ROOT/extracted_scenes/Scene3Scene4_contents/Replit-Design-Project/attached_assets/Ai_music_for_dream_planet_video__1785842118219.mp3"

for required in "$SCENE5_SRC" "$SCENE6_SRC" "$MUSIC"; do
  [[ -s "$required" ]] || { echo "ERROR: missing required input: $required" >&2; exit 1; }
done

echo "── Rebuilding Scenes 1–5 with the existing deterministic pipeline ──"
MASTER_BASENAME_OVERRIDE=DreamPlanet_Master_v5 \
SCENE5_SRC_OVERRIDE="$SCENE5_SRC" \
bash "$SCRIPT_DIR/build_master_v2.sh" "$BASE_DIR"

BASE_NO_AUDIO="$BASE_DIR/DreamPlanet_Master_v5_no_audio.mp4"
BASE_AUDIO="$BASE_DIR/DreamPlanet_Master_v5_audio.mp4"

echo "── Normalizing approved Scene 6 to 30fps ──"
ffmpeg -y -i "$SCENE6_SRC" \
  -vf "fps=30,scale=1080:1920,setsar=1,format=yuv420p" \
  -c:v libx264 -preset medium -crf 14 -pix_fmt yuv420p -an \
  "$WORK/scene6_normalized.mp4" -loglevel warning

BASE_DUR="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$BASE_NO_AUDIO")"
SCENE6_DUR="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$WORK/scene6_normalized.mp4")"
BASE_FRAMES="$(ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames -of csv=p=0 "$BASE_NO_AUDIO")"
SCENE6_FRAMES="$(ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames -of csv=p=0 "$WORK/scene6_normalized.mp4")"

echo "── Appending Scene 6 without changing the rebuilt Scenes 1–5 ──"
{
  printf "file '%s'\n" "$BASE_NO_AUDIO"
  printf "file '%s'\n" "$WORK/scene6_normalized.mp4"
} > "$WORK/concat.txt"
ffmpeg -y -f concat -safe 0 -i "$WORK/concat.txt" \
  -c:v libx264 -preset medium -crf 14 -pix_fmt yuv420p -movflags +faststart \
  "$WORK/master_no_audio.mp4" -loglevel warning

MASTER_DUR="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$WORK/master_no_audio.mp4")"
MASTER_FRAMES="$(ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames -of csv=p=0 "$WORK/master_no_audio.mp4")"
EXPECTED_DUR="$(awk -v a="$BASE_DUR" -v b="$SCENE6_DUR" 'BEGIN{printf "%.6f",a+b}')"
EXPECTED_FRAMES=$((BASE_FRAMES + SCENE6_FRAMES))

echo "── Applying campaign music once at master level ──"
FADE_START="$(awk -v d="$MASTER_DUR" 'BEGIN{printf "%.6f",d-1.0}')"
ffmpeg -y \
  -i "$WORK/master_no_audio.mp4" \
  -i "$MUSIC" \
  -filter_complex "[1:a]atrim=0:${MASTER_DUR},afade=t=out:st=${FADE_START}:d=1.0[afinal]" \
  -map 0:v -map "[afinal]" \
  -c:v copy -c:a aac -b:a 192k -movflags +faststart \
  "$WORK/master_audio.mp4" -loglevel warning

FINAL_W="$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$WORK/master_audio.mp4")"
FINAL_H="$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$WORK/master_audio.mp4")"
FINAL_FPS="$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$WORK/master_audio.mp4")"
AUDIO_DUR="$(ffprobe -v error -select_streams a:0 -show_entries stream=duration -of csv=p=0 "$WORK/master_audio.mp4")"

[[ "$FINAL_W" == "1080" && "$FINAL_H" == "1920" ]] || {
  echo "ERROR: unexpected output resolution ${FINAL_W}x${FINAL_H}" >&2; exit 1;
}
[[ "$FINAL_FPS" == "30/1" ]] || {
  echo "ERROR: unexpected output FPS ${FINAL_FPS}" >&2; exit 1;
}
awk -v a="$MASTER_DUR" -v b="$EXPECTED_DUR" 'BEGIN{d=a-b;if(d<0)d=-d;exit(d<=0.1?0:1)}' || {
  echo "ERROR: unexpected master duration ${MASTER_DUR}s; expected ${EXPECTED_DUR}s" >&2; exit 1;
}
[[ "$MASTER_FRAMES" == "$EXPECTED_FRAMES" ]] || {
  echo "ERROR: frame count mismatch: base ${BASE_FRAMES} + Scene 6 ${SCENE6_FRAMES} = ${EXPECTED_FRAMES}, master ${MASTER_FRAMES}" >&2
  exit 1
}
awk -v a="$MASTER_DUR" -v b="$AUDIO_DUR" 'BEGIN{d=a-b;if(d<0)d=-d;exit(d<=0.2?0:1)}' || {
  echo "ERROR: audio/video duration mismatch: ${AUDIO_DUR}s vs ${MASTER_DUR}s" >&2; exit 1;
}

# Transition guards: both handoff frames must contain real content, not black
# or unintended white/dead frames. The final fade is intentionally black.
for point in 28.433 28.500 41.300 41.400; do
  safe="${point//./_}"
  frame="$WORK/boundary_${safe}.png"
  ffmpeg -y -ss "$point" -i "$WORK/master_no_audio.mp4" \
    -frames:v 1 -update 1 "$frame" -loglevel error
  brightness="$(convert "$frame" -colorspace Gray -format '%[fx:mean]' info:)"
  awk -v b="$brightness" 'BEGIN{exit(b>0.01 && b<0.98?0:1)}' || {
    echo "ERROR: boundary frame at ${point}s is near blank (brightness ${brightness})" >&2
    exit 1
  }
  cp "$frame" "$WORK/boundary_${safe}.png"
done

cp "$WORK/master_audio.mp4" "$OUT_DIR/DreamPlanet_Master_v5.mp4"
cp "$WORK/master_audio.mp4" "$OUT_DIR/DreamPlanet_Master_v5_audio.mp4"
cp "$WORK/master_no_audio.mp4" "$OUT_DIR/DreamPlanet_Master_v5_no_audio.mp4"

echo ""
echo "══════════════════════════════════════════════════════"
echo " BUILD REPORT — Master v5"
echo "══════════════════════════════════════════════════════"
echo "  Resolution: ${FINAL_W}x${FINAL_H}"
echo "  Frame rate: ${FINAL_FPS}"
echo "  Duration:   ${MASTER_DUR}s (expected ${EXPECTED_DUR}s)"
echo "  Audio:      ${AUDIO_DUR}s"
echo "  Frames:     ${MASTER_FRAMES} (expected ${EXPECTED_FRAMES})"
echo "  Timeline:   Scenes 1–5 rebuilt + approved Scene 6 CTA"
echo "  Written to: $OUT_DIR"
echo "══════════════════════════════════════════════════════"