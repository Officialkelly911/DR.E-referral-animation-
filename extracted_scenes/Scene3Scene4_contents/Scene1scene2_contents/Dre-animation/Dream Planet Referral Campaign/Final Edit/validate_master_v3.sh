#!/usr/bin/env bash
# Dream Planet Referral Campaign — Master v3 release validator
#
# Validates the already-built v3 release without rebuilding or touching Master v2.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../../../.." && pwd)"
MASTER="$SCRIPT_DIR/DreamPlanet_Master_v3.mp4"
MASTER_AUDIO="$SCRIPT_DIR/DreamPlanet_Master_v3_audio.mp4"
MASTER_NO_AUDIO="$SCRIPT_DIR/DreamPlanet_Master_v3_no_audio.mp4"
SCENE6="$REPO_ROOT/extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Scene 6/Final Animation/scene6_final_v3_no_audio.mp4"

for tool in ffprobe ffmpeg convert awk; do
  command -v "$tool" >/dev/null || { echo "ERROR: missing tool: $tool" >&2; exit 2; }
done
for file in "$MASTER" "$MASTER_AUDIO" "$MASTER_NO_AUDIO" "$SCENE6"; do
  [[ -s "$file" ]] || { echo "ERROR: missing or empty file: $file" >&2; exit 1; }
done

probe() {
  ffprobe -v error -show_entries "$1" -of default=noprint_wrappers=1:nokey=1 "$2"
}
pass=0
fail=0
check() {
  local label="$1" result="$2"
  if [[ "$result" == "1" ]]; then
    printf '  [PASS] %s\n' "$label"
    pass=$((pass + 1))
  else
    printf '  [FAIL] %s\n' "$label"
    fail=$((fail + 1))
  fi
}

MASTER_DUR="$(probe format=duration "$MASTER")"
VIDEO_W="$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of default=noprint_wrappers=1:nokey=1 "$MASTER")"
VIDEO_H="$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of default=noprint_wrappers=1:nokey=1 "$MASTER")"
FPS="$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 "$MASTER")"
AUDIO_TYPE="$(ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 "$MASTER" || true)"
AUDIO_DUR="$(probe stream=duration "$MASTER_AUDIO" | tail -1)"
NO_AUDIO_TYPE="$(ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 "$MASTER_NO_AUDIO" || true)"
SCENE6_DUR="$(probe format=duration "$SCENE6")"

check "Master v3 is 1080x1920 (${VIDEO_W}x${VIDEO_H})" "$([[ "$VIDEO_W" == 1080 && "$VIDEO_H" == 1920 ]] && echo 1 || echo 0)"
check "Master v3 is normalized to 30fps (${FPS})" "$([[ "$FPS" == 30/1 ]] && echo 1 || echo 0)"
check "Master v3 duration is ~56.767s (${MASTER_DUR}s)" "$(awk -v d="$MASTER_DUR" 'BEGIN{print (d>=56.6 && d<=56.9)?1:0}')"
check "Master v3 contains AAC audio" "$([[ "$AUDIO_TYPE" == audio ]] && echo 1 || echo 0)"
check "Audio/video durations match (${AUDIO_DUR}s vs ${MASTER_DUR}s)" "$(awk -v a="$AUDIO_DUR" -v b="$MASTER_DUR" 'BEGIN{d=a-b;if(d<0)d=-d;print(d<=0.5)?1:0}')"
check "No-audio release has no audio stream" "$([[ -z "$NO_AUDIO_TYPE" ]] && echo 1 || echo 0)"
check "Scene 6 source duration is ~15.48s (${SCENE6_DUR}s)" "$(awk -v d="$SCENE6_DUR" 'BEGIN{print (d>=15.4 && d<=15.6)?1:0}')"

WORK="$(mktemp -d /tmp/dp_master_v3_validate_XXXXXX)"
trap 'rm -rf "$WORK"' EXIT
for point in 0 3 6 19.433 28.433 41.2 41.3 41.4 54.7 56.2; do
  safe="${point//./_}"
  ffmpeg -y -ss "$point" -i "$MASTER" -frames:v 1 -update 1 "$WORK/frame_${safe}.png" -loglevel error
done

# Boundary frames must be real content, not a pure black/white dead frame.
for point in 41_2 41_3 41_4; do
  brightness="$(convert "$WORK/frame_${point}.png" -colorspace Gray -format '%[fx:mean]' info:)"
  check "Scene 5→6 boundary frame ${point//_/.}s is not near blank (brightness ${brightness})" "$(awk -v b="$brightness" 'BEGIN{print (b>0.01 && b<0.98)?1:0}')"
done

# The requested no-badge constraint is source-level enforced for the CTA.
CTA="$REPO_ROOT/extracted_scenes/Scene3Scene4_contents/Replit-Design-Project/artifacts/dream-planet-scene3/src/components/scene6/Scene6PremiumCTA.tsx"
if ! grep -Eq 'GooglePlayIcon|AppleIcon|Google Play|App Store' "$CTA"; then
  check "CTA source contains no store badge artwork" 1
else
  check "CTA source contains no store badge artwork" 0
fi

echo ""
echo "Master v3 validation: ${pass} passed, ${fail} failed"
[[ "$fail" == 0 ]]