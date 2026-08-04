# Dream Planet Referral Campaign

Multi-scene promo video campaign built around a real photo of a temporary "Dream Planet" tattoo.

## Structure
- `Scene 1 (LOCKED)/` — approved, do not re-edit. Contains `Final Master Frame/` (graded still), `Final Animation/` (rendered clip), `Project Files/` (scripts + source material used to build it).
- `Scene 2/` — built, pending approval (not yet locked). Continues Scene 1's push-in and reveals the brand name + logo. See its own README.
- `Scene 3/`, `Scene 4/` — not started yet. Each will get the same layout as Scene 1/2 once built.
- `Music/` — shared campaign audio.
- `Logos/` — shared brand marks.
- `Final Edit/` — the stitched full-campaign video, assembled once all scenes are locked.

## Cross-scene consistency rules
- **Scene 1 is locked.** Its Final Master Frame and Final Animation are approved and must not be modified. Apply new work to Scene 2+ only, matching Scene 1's established grade/mood rather than changing it retroactively.
- **Transitions into the next scene:** a straight cut, or a very subtle 2-4 frame dissolve. No flashy transitions — the elegance comes from continuity, not effects.
- **Shared technical baseline** — match these in later scenes unless a scene's own brief says otherwise:
  - Output frame: 1080×1302, 30fps.
  - Caption font: Inter SemiBold — `Scene 1 (LOCKED)/Project Files/fonts/Inter-SemiBold.ttf`.
  - Warm cinematic grade: contrast +12%, saturation -9%, gentle warm channel shift, soft highlight rolloff. Exact recipe in `Scene 1 (LOCKED)/Project Files/prep_hero.py`.
  - Push-in (Ken Burns) done via ffmpeg `scale` (eval=frame) + `crop`, not `zoompan` — see `Scene 1 (LOCKED)/Project Files/filter_graph.txt`.

## Open items
- Scene 3-4 briefs/source materials have not been received yet.
- Scene 2 is built but not yet locked — awaiting your approval before it's treated as final.
