# Dream Planet Referral Campaign

## Overview
A multi-scene promotional video campaign for the "Dream Planet" referral program. Scene 1 ("The Hook") is a 3-second cinematic opener built from a real photo of a temporary tattoo on a user's hand/wrist, animated with a slow push-in, a soft diagonal light sweep, and a caption. Deliverables are rendered image/video files produced with a Pillow (image prep) + ffmpeg (animation/render) pipeline — this is not a running web app, so there is no dev server/workflow for this project.

## Project structure
All production output lives under `Dream Planet Referral Campaign/`: one folder per scene (`Scene 1 (LOCKED)`, `Scene 2`, `Scene 3`, `Scene 4`), plus shared `Music/`, `Logos/`, and `Final Edit/` folders. Each scene folder holds `Final Master Frame/`, `Final Animation/`, and `Project Files/` (scripts, source material, intermediates) once built. See `Dream Planet Referral Campaign/README.md` for the full folder convention and the shared technical baseline (resolution, font, color grade, animation technique) later scenes should match.

## User preferences
- Treat a scene as **locked** once approved — do not re-edit its Final Master Frame or Final Animation without explicit sign-off. Build later scenes to match the locked look rather than adjusting it retroactively.
- Transitions between scenes: a straight cut, or a very subtle 2-4 frame dissolve only. No flashy transitions — favor continuity over effects.
- Maintaining consistency across scenes matters more than continuing to polish an already-approved scene.
