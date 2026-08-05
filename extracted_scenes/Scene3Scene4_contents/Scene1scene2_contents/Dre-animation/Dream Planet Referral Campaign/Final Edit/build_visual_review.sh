#!/usr/bin/env bash
# Dream Planet – VisualReview master build
# Produces DreamPlanet_Master_v1_VisualReview_no_audio.mp4 and DreamPlanet_Master_v1_VisualReview.mp4
# Changes vs v1:
#   - S1 & S2 rendered natively at 1080×1920 (hero frame pre-scaled for 9:16 crop)
#   - S2 text coordinates adjusted for 1920px canvas height
#   - S2→S3: cross-dissolve (0.5s) directly into S3 content (S3's 3s white opening trimmed)
#   - S3 & S4 converted to 30fps for consistent concat

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../../../.." && pwd)"

# ── Source paths ────────────────────────────────────────────────────────────
S1_LOCKED="$REPO_ROOT/extracted_scenes/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Scene 1 (LOCKED)"
S2_DIR="$REPO_ROOT/extracted_scenes/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Scene 2"
SCENE3_SRC="$REPO_ROOT/extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Scene 3/Final Animation/scene3_final.mp4"
SCENE4_SRC="$REPO_ROOT/extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Scene 4/Final Animation/scene4_final.mp4"
MUSIC="$REPO_ROOT/extracted_scenes/Scene3Scene4_contents/Replit-Design-Project/attached_assets/Ai_music_for_dream_planet_video__1785842118219.mp3"

MASTER_FRAME="$S1_LOCKED/Final Master Frame/scene1_master_frame.jpg"
FONT="$S1_LOCKED/Project Files/fonts/Inter-SemiBold.ttf"
DP_ICON="$S2_DIR/Project Files/assets/dp_icon.png"

WORK="$REPO_ROOT/tmp_dp_build"
OUT_DIR="$SCRIPT_DIR"

mkdir -p "$WORK"
echo "Working dir: $WORK"
echo "Output dir:  $OUT_DIR"
echo ""

# ── Step 1: Pre-scale master frame for 9:16 ─────────────────────────────────
# Original 1200×1446 → scale to 1640×1980
# 1640/1200=1.367×; 1446*1.367=1976≈1980 (gives 30px+ margin above 1920 at scale=1.0)
# With zoom at 1.065–1.10, scaled frames will always exceed 1080×1920.
echo "── Step 1: Pre-scale master frame to 1640×1980 ──"
ffmpeg -y -i "$MASTER_FRAME" \
  -vf "scale=1640:1980" \
  -q:v 2 -update 1 \
  "$WORK/hero_9x16.jpg" \
  -loglevel warning
echo "  done → hero_9x16.jpg"

# ── Step 2: Generate light streak PNGs at 1080×1920 ─────────────────────────
# S1 streak: angle=22°, gaussian band, center=(540,960), half_width=172.8, peak_alpha=150
# alpha = clip(150 * exp(-0.5 * ((X-540)*cos(22°) - (Y-960)*sin(22°))² / 172.8²), 0, 255)
# 22° in radians ≈ 0.38397
echo "── Step 2: Generate light streaks at 1080×1920 ──"

ffmpeg -y \
  -f lavfi -i "color=c=black:s=1080x1920:r=1" \
  -vf "format=rgba,geq=r=255:g=248:b=232:a='clip(150*exp(-0.5*pow(((X-540)*cos(0.38397)-(Y-960)*sin(0.38397))/172.8\,2))\,0\,255)'" \
  -vframes 1 -update 1 \
  "$WORK/streak_s1_1920.png" \
  -loglevel warning
echo "  done → streak_s1_1920.png"

# S2 streak: angle=18°, center=(594,768)=(55%×1080, 40%×1920), half_width=81, peak_alpha=78
# 18° in radians ≈ 0.31416
ffmpeg -y \
  -f lavfi -i "color=c=black:s=1080x1920:r=1" \
  -vf "format=rgba,geq=r=255:g=250:b=238:a='clip(78*exp(-0.5*pow(((X-594)*cos(0.31416)-(Y-768)*sin(0.31416))/81\,2))\,0\,255)'" \
  -vframes 1 -update 1 \
  "$WORK/streak_s2_1920.png" \
  -loglevel warning
echo "  done → streak_s2_1920.png"

# ── Step 3: Render Scene 1 at 1080×1920, 30fps, 3.0s ────────────────────────
# Zoom: 1.0→1.065 over 2.5s starting at t=0.5
# Text: "More than followers." at y=h-th-160 (dynamic, auto-adjusts to 1920)
# Fade in from black: 0.2s→0.5s
echo "── Step 3: Render Scene 1 at 1080×1920 ──"
ffmpeg -y \
  -loop 1 -i "$WORK/hero_9x16.jpg" \
  -i "$WORK/streak_s1_1920.png" \
  -filter_complex "
    [0:v]scale=w='trunc(iw*(1+0.065*min(1,max(0,(t-0.5)/2.5)))/2)*2':h='trunc(ih*(1+0.065*min(1,max(0,(t-0.5)/2.5)))/2)*2':eval=frame[zoomed];
    [zoomed]crop=w=1080:h=1920:x='(iw-1080)/2':y='(ih-1920)/2'[cropped];
    [1:v]format=rgba[streak];
    [cropped][streak]overlay=x='-1080+(t-0.8)/1.5*2160':y=0:enable='between(t,0.8,2.3)'[lit];
    [lit]drawtext=fontfile='$FONT':text='More than followers.':fontsize=54:fontcolor=white:shadowcolor=black@0.55:shadowx=2:shadowy=3:x=90:y=h-th-160:alpha='if(lt(t,1.2),0,if(lt(t,1.6),(t-1.2)/0.4,if(lt(t,2.8),1,if(lt(t,3.0),(3.0-t)/0.2,0))))'[texted];
    [texted]fade=t=in:st=0.2:d=0.3:color=black[vout]
  " \
  -map "[vout]" \
  -t 3.0 -r 30 \
  -c:v libx264 -preset medium -crf 14 -pix_fmt yuv420p \
  "$WORK/s1_9x16.mp4" \
  -loglevel warning
echo "  done → s1_9x16.mp4"

# ── Step 4: Render Scene 2 at 1080×1920, 30fps, 3.0s ────────────────────────
# Zoom: 1.065→1.10 (continuous with S1 end)
# Text y positions adjusted for 1920 canvas (same bottom-margin distances as 1302 original):
#   icon_y:     1302-924=378 from bottom → 1920-378=1542
#   headline_y: 1302-1042=260 from bottom → 1920-260=1660
#   main_y:     1302-1091=211 from bottom → 1920-211=1709
#   planet_x:   374 unchanged (horizontal position)
echo "── Step 4: Render Scene 2 at 1080×1920 ──"
ffmpeg -y \
  -loop 1 -i "$WORK/hero_9x16.jpg" \
  -i "$WORK/streak_s2_1920.png" \
  -i "$DP_ICON" \
  -filter_complex "
    [0:v]scale=w='trunc(iw*(1.065+0.035*min(1,max(0,t/3.0)))/2)*2':h='trunc(ih*(1.065+0.035*min(1,max(0,t/3.0)))/2)*2':eval=frame[zoomed];
    [zoomed]crop=w=1080:h=1920:x='(iw-1080)/2':y='(ih-1920)/2'[cropped];
    [cropped]eq=contrast='1+0.018*min(1,max(0,(t-0.6)/0.6))':eval=frame[graded];
    [1:v]format=rgba[streak];
    [graded][streak]overlay=x='-90+(t-1.5)/0.8*180':y='-30+(t-1.5)/0.8*60':enable='between(t,1.5,2.3)'[lit];
    [2:v]scale=-2:96,format=rgba[iconraw];
    [iconraw]fade=t=in:st=2.2:d=0.5:alpha=1[iconfaded];
    [lit][iconfaded]overlay=x=90:y=1542:enable='gte(t,2.2)'[iconned];
    [iconned]drawtext=fontfile='$FONT':text='Join me on':fontsize=40:fontcolor=white:shadowcolor=black@0.5:shadowx=1:shadowy=2:x=90:y=1660:alpha='if(lt(t,0.6),0,if(lt(t,1.0),(t-0.6)/0.4,if(lt(t,2.5),1,if(lt(t,2.8),(2.8-t)/0.3,0))))'[t1];
    [t1]drawtext=fontfile='$FONT':text='Dream ':fontsize=82:fontcolor=white:shadowcolor=black@0.55:shadowx=2:shadowy=3:x=90:y=1709:alpha='if(lt(t,1.0),0,if(lt(t,1.4),(t-1.0)/0.4,if(lt(t,2.5),1,if(lt(t,2.8),(2.8-t)/0.3,0))))'[t2];
    [t2]drawtext=fontfile='$FONT':text='Planet':fontsize=82:fontcolor=0xF64A01:shadowcolor=black@0.55:shadowx=2:shadowy=3:x=374:y=1709:alpha='if(lt(t,1.0),0,if(lt(t,1.4),(t-1.0)/0.4,if(lt(t,2.5),1,if(lt(t,2.8),(2.8-t)/0.3,0))))'[vout]
  " \
  -map "[vout]" \
  -t 3.0 -r 30 \
  -c:v libx264 -preset medium -crf 14 -pix_fmt yuv420p \
  "$WORK/s2_9x16.mp4" \
  -loglevel warning
echo "  done → s2_9x16.mp4"

# ── Step 5: Trim Scene 3 and convert to 30fps ────────────────────────────────
# S3 source is 25fps, 9.52s. Content first appears at t=3.0s (frames 0-74 are blank white).
# We trim to start at t=3.0s → trimmed duration = 6.52s.
# The S2→S3 xfade dissolve (0.5s) bridges directly from S2's DP logo to S3's interface.
echo "── Step 5: Trim Scene 3 white opening + convert to 30fps ──"
ffmpeg -y \
  -ss 3.0 -i "$SCENE3_SRC" \
  -vf "fps=30" \
  -c:v libx264 -preset medium -crf 14 -pix_fmt yuv420p \
  -an \
  "$WORK/s3_trimmed_30fps.mp4" \
  -loglevel warning
S3_TRIMMED_DUR=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$WORK/s3_trimmed_30fps.mp4")
echo "  done → s3_trimmed_30fps.mp4  (duration: ${S3_TRIMMED_DUR}s)"

# ── Step 6: Convert Scene 4 to 30fps ─────────────────────────────────────────
echo "── Step 6: Convert Scene 4 to 30fps ──"
ffmpeg -y \
  -i "$SCENE4_SRC" \
  -vf "fps=30" \
  -c:v libx264 -preset medium -crf 14 -pix_fmt yuv420p \
  -an \
  "$WORK/s4_30fps.mp4" \
  -loglevel warning
S4_DUR=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$WORK/s4_30fps.mp4")
echo "  done → s4_30fps.mp4  (duration: ${S4_DUR}s)"

# ── Step 7: Assemble master (no audio) ──────────────────────────────────────
# Layout: S1(3s) │ S2(3s) xfade(0.5s dissolve)→ S3_trimmed(6.52s) │ S4(9s)
# xfade offset = S2_duration - xfade_duration = 3.0 - 0.5 = 2.5s
# Master duration ≈ 3.0 + (3.0 + 6.52 - 0.5) + 9.0 = 21.02s
echo "── Step 7: Assemble master (no audio) ──"
ffmpeg -y \
  -i "$WORK/s1_9x16.mp4" \
  -i "$WORK/s2_9x16.mp4" \
  -i "$WORK/s3_trimmed_30fps.mp4" \
  -i "$WORK/s4_30fps.mp4" \
  -filter_complex "
    [0:v]setsar=1:1[s1];
    [1:v]setsar=1:1[s2];
    [2:v]setsar=1:1[s3];
    [3:v]setsar=1:1[s4];
    [s2][s3]xfade=transition=dissolve:duration=0.5:offset=2.5[v23];
    [v23]setsar=1:1[v23s];
    [s1][v23s][s4]concat=n=3:v=1:a=0[vout]
  " \
  -map "[vout]" \
  -c:v libx264 -preset medium -crf 14 -pix_fmt yuv420p \
  "$WORK/master_no_audio.mp4" \
  -loglevel warning
MASTER_DUR=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$WORK/master_no_audio.mp4")
echo "  done → master_no_audio.mp4  (duration: ${MASTER_DUR}s)"

# ── Step 8: Add continuous AI music track ────────────────────────────────────
# Strip all scene audio; lay AI track from 0:00, fade out last 1.0s, trim to master duration.
echo "── Step 8: Add AI music track ──"
FADE_START=$(echo "$MASTER_DUR - 1.0" | bc)
ffmpeg -y \
  -i "$WORK/master_no_audio.mp4" \
  -i "$MUSIC" \
  -filter_complex "
    [1:a]atrim=0:${MASTER_DUR},afade=t=out:st=${FADE_START}:d=1.0[afinal]
  " \
  -map "0:v" \
  -map "[afinal]" \
  -c:v copy -c:a aac -b:a 192k \
  "$WORK/master_with_audio.mp4" \
  -loglevel warning
echo "  done → master_with_audio.mp4"

# ── Step 9: Copy to Final Edit ────────────────────────────────────────────────
echo "── Step 9: Copy deliverables to Final Edit ──"
cp "$WORK/master_no_audio.mp4"    "$OUT_DIR/DreamPlanet_Master_v1_VisualReview_no_audio.mp4"
cp "$WORK/master_with_audio.mp4"  "$OUT_DIR/DreamPlanet_Master_v1_VisualReview.mp4"

# ── Verification report ───────────────────────────────────────────────────────
echo ""
echo "══════════════════════════════════════════════════════"
echo " VERIFICATION"
echo "══════════════════════════════════════════════════════"
for f in \
  "$OUT_DIR/DreamPlanet_Master_v1_VisualReview_no_audio.mp4" \
  "$OUT_DIR/DreamPlanet_Master_v1_VisualReview.mp4"; do
  echo ""
  echo "  $(basename "$f")"
  ffprobe -v error \
    -show_entries stream=codec_type,width,height,r_frame_rate,duration \
    -show_entries format=duration \
    -of default=noprint_wrappers=1 "$f"
done

echo ""
echo "  Scene timeline:"
echo "    S1       0.00–3.00s  (3.00s, 1080×1920, 30fps, letterbox-free)"
echo "    S2       3.00–6.00s  (3.00s, 1080×1920, 30fps, letterbox-free)"
echo "    dissolve 5.50–6.00s  (0.50s cross-dissolve S2→S3)"
echo "    S3 +3.0s 5.50–12.02s (6.52s content, white opening trimmed)"
echo "    S4       12.02–21.02s(9.00s)"
echo "    Audio    0.00–${MASTER_DUR}s  (AI track, 1s fadeout at end)"
echo ""
echo "Done."
