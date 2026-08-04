---
name: Dream Planet audio replacement approach
description: How to replace Scene 1 placeholder audio and produce a seamless Scene 1+2 combined video with no audible cut at the 3-second boundary.
---

## Official track
`Dream Planet Referral Campaign/Music/dream_planet_song.mp3` — 97.5s, 44100Hz stereo, 192kbps.
Scene 1 uses 0:00–3:00, Scene 2 uses 3:00–6:00. The file in `attached_assets/Ai_music_for_dream_planet_video__*.mp3` is identical (same duration/bitrate) — prefer the `Music/` copy.

## Why a single audio slice (not two separate replacements)
Using one continuous `atrim=start=0:end=6` slice from the official track as the audio source for the combined video makes it *physically impossible* to have an audible cut at the Scene 1→2 boundary — the decoder never resets. If you replace audio per-scene and then concat, even a perfectly time-aligned splice can introduce a tiny discontinuity from AAC frame boundaries.

**How to apply:** Always produce the combined multi-scene video in one ffmpeg pass with the full audio slice, not by replacing per-scene and concatenating.

## ffmpeg command pattern for Scene 1+2 combined
```
ffmpeg -y \
  -i scene1_final.mp4 \
  -i scene2_final.mp4 \
  -i dream_planet_song.mp3 \
  -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0[vout];[2:a]atrim=start=0:end=6,asetpts=PTS-STARTPTS[aout]" \
  -map "[vout]" -map "[aout]" \
  -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -ar 44100 \
  output.mp4
```

## Standalone Scene 1 audio swap (lossless video copy)
```
ffmpeg -y -i scene1_final.mp4 -i dream_planet_song.mp3 \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -ar 44100 -t 3 \
  scene1_official_audio.mp4
```

## Output locations
- Combined: `Dream Planet Referral Campaign/Final Edit/scene1_scene2_combined.mp4`
- Standalone Scene 1 (official audio): `Scene 1 (LOCKED)/Final Animation/scene1_official_audio.mp4`
- Original locked Scene 1: `Scene 1 (LOCKED)/Final Animation/scene1_final.mp4` — never overwritten

## Locked-scene rule
Scene 1's original `scene1_final.mp4` must not be overwritten. Create a sibling file (`scene1_official_audio.mp4`) so the locked original is always recoverable.
