---
name: Dream Planet promo video pipeline
description: How Scene 1 of the "Dream Planet" tattoo promo was built (source choice, still-prep recipe, ffmpeg animation technique, font, audio status) — read before touching Scene 1 or building later scenes in the same series.
---

## Project is now a folder-organized multi-scene campaign
Everything moved from scattered `scripts/`/`output/`/`assets/` into `Dream Planet Referral Campaign/` (Scene 1 (LOCKED), Scene 2-4, Music, Logos, Final Edit). Scene 1 is locked — do not modify its Final Master Frame or Final Animation. Folder convention, locked-scene rule, and the scene-transition rule (straight cut or subtle 2-4 frame dissolve only) are recorded in `replit.md` and in the campaign's own root README, not repeated here — read those for current conventions. All paths below are historical/technique notes; check the campaign folder for where files actually live now.

## Source & framing
- Two source photos of the same tattoo existed; the upright close-up PNG (not the sideways/zoomed-out JPEG on a woven pouf) is the correct hero source — matches the brief's tight close-up + correct orientation.
- Tattoo focal point on that source is at roughly (45%, 43%) of image width/height. Needed for centering any blur/vignette mask or re-crop.
- Rotation must be clockwise per the brief; in PIL, clockwise = **negative** angle in `.rotate()`. Used -10°, `expand=True`, `fillcolor` matched to the dark warm vignette tone so corners blend instead of needing crop math.
- Output aspect kept close to the source's native ~0.83 (not forced to 9:16/4:5) since no platform was specified — revisit if the user names a target platform.

## Still-prep recipe (Pillow/numpy)
Radial-mask compositing (not rembg/AI segmentation — too fragile for hand+tassel subjects): build a smoothstep radial mask centered on the tattoo focal point, blend sharp vs. heavily-blurred copies for depth-of-field, blend again toward a dark warm color at the edges for vignette+background cleanup, then apply a global warm color grade (channel shift + contrast up + saturation down ~9% + gentle gamma). Order matters: DOF blend → extra sharpen on subject only → edge darken/tint → global grade → rotate → crop → final resize/sharpen.

## Animation (ffmpeg)
- Avoid `zoompan` for a subtle Ken-Burns push-in (known jitter quirks). Instead: `scale` filter with `eval=frame` and a `t`-based width/height expression (e.g. `iw*(1+0.065*min(1,max(0,(t-0.5)/2.5)))`) to grow the image over time, followed by a fixed-size centered `crop` — smooth and deterministic for small zoom ranges.
- Complex per-filter time expressions (nested `if()`/`min()`/`max()`, needed for fade/alpha timelines) get unreadable and escaping-fragile inline. Write the whole graph to a text file and pass it via `-filter_complex_script file.txt` instead of an inline `-filter_complex "..."` string — sidesteps shell-quoting-on-top-of-filtergraph-quoting entirely.
- A moving light-sweep effect = a separate static PNG (soft diagonal gaussian-alpha band, same canvas size as the video) fed as a second input and slid across with `overlay=x='<t-based expr>':enable='between(t,...)'`.

## Font
No Inter/SF Pro/Geist installed (only DejaVu via `fc-list`). Google's GitHub font repo (`raw.githubusercontent.com/google/fonts/main/ofl/inter/...ttf`) serves Inter only as a variable font; ffmpeg `drawtext` renders a variable font's default instance (Regular), not named weights. Fix: `pip install fonttools`, then `fonttools varLib.instancer <variable.ttf> wght=600 -o Inter-SemiBold.ttf` to bake a static weight instance drawtext renders correctly. (`unpkg`/`fonts.google.com` direct-download endpoints returned HTML/blocked, not usable directly.)

## Audio status
The real "Dream Planet song" has since been provided and lives at `Music/dream_planet_song.mp3` (one continuous track — each scene uses the matching slice, e.g. Scene 1 = 0:00-0:03, Scene 2 = 0:03-0:06). Scene 2's render uses the correct slice. Scene 1's *locked* Final Animation still has the old AI ambient placeholder baked in and was deliberately left untouched (audio-only swap on a locked asset needs the user's explicit sign-off first) — check Scene 1's README for whether that's since been resolved before assuming its audio is current.

## Filter-graph gotcha: don't backslash-escape commas inside `-filter_complex_script` files
Commas inside a single-quoted filter option value (e.g. `alpha='if(lt(t,1.0),0,...)'`) do **not** need escaping when the whole filtergraph is written to a file and passed via `-filter_complex_script` — drawtext options are colon-separated, so commas inside one option's quoted expression are unambiguous. Adding `\,` there silently breaks the expression parser (fade-out stopped working, alpha stuck at 1) with no visible ffmpeg error. Match Scene 1's original (working) unescaped style exactly when copying/extending a filter graph like this.

## Continuing a locked scene's animation into the next scene (seam continuity)
When a scene must feel like an uninterrupted continuation of a locked prior scene (same shot, no cut): reuse the prior scene's *exact* master-frame still (don't re-grade), reuse the same crop-centering formula, and make the new scene's zoom curve start exactly at the value the locked scene's zoom curve ended on. Verified by concatenating both scenes' video-only renders and diffing the boundary frames — with matching zoom/crop/grade the seam is genuinely invisible.

## Brand color convention (Dream Planet)
Both the tattoo photo's own printed wordmark and the official app logo color "Planet" in the brand orange (`~#F64A01`, sampled from the official logo) and leave "Dream" white/neutral — not the reverse. Match this when adding any new "Dream Planet" text/caption rather than guessing which word to accent.
