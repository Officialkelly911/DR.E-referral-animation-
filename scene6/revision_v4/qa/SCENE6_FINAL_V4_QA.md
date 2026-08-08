# Scene 6 Final v4 Candidate — Creative QA Report

**Status:** PASS — isolated creative candidate only  
**Approval status:** Not final approved; do not replace Master v3  
**Source brief:** `attached_assets/Pasted-FINAL-MASTER-V3-CREATIVE-POLISH-TARGETED-ONLY-We-have-r_1786213001036.txt`

## Scope

This candidate applies only the requested targeted polish:

- Notifications remain readable until the handoff.
- A restrained cinematic dim/fade is applied to Notifications.
- Orange ambient CTA light emerges under the transition.
- Notifications hand off into the existing premium CTA over approximately 0.5s.
- CTA spacing and hierarchy remain polished without changing its approved identity.
- Motion uses opacity/transform transitions and does not add a new screen or copy.

Scenes 1–5, the approved Scene 6 v3 candidate, and Master v3 were not
overwritten or integrated.

## Technical result

| Property | Result |
|---|---|
| Candidate | `scene6_final_v4.mp4` |
| No-audio candidate | `scene6_final_v4_no_audio.mp4` |
| Duration | 15.500s |
| Resolution | 1080 × 1920 |
| Frame rate | 30 fps constant |
| Frames | 465 |
| Audio | None |
| Codec | H.264 / yuv420p |
| SHA-256 | `d1e280891c252052614bf47b022f6c9770932774baa53d42c8cc366077712053` |

The no-audio candidate is an identical byte-for-byte copy with the same
SHA-256 hash.

## Timing

| Beat | Timing |
|---|---:|
| Notifications readable hold | 0.00–9.94s scene-relative |
| Dim/fade + orange ambient glow begins | 9.94s |
| CTA content begins | 10.44s |
| Notifications → CTA handoff | 0.50s |
| CTA full composition hold begins | 12.92s |
| Final fade begins | 14.64s |
| Candidate ends | 15.50s |

The scene duration is unchanged from the 15.5s target, so the integrated
campaign remains within the requested approximately 56–57s duration envelope
if this candidate is later approved.

## Visual checkpoint inspection

All screenshots were captured at scene-relative times anchored to the
component's `data-s6-started` marker, not to page-load time. This avoids
mislabeling checkpoints when the browser has a variable startup delay.

| Checkpoint | Time | Result |
|---|---:|---|
| `A_notifications_final.png` | 9.82s | PASS — full Notifications screen is readable; no CTA present |
| `B_transition_early.png` | 10.08s | PASS — Notifications remains visible under a subtle dim; orange glow emerges |
| `B_transition_late.png` | 10.36s | PASS — premium CTA resolves smoothly; no abrupt cut or black frame |
| `C_cta_midpoint.png` | 11.45s | PASS — logo, headline, referral card, and CTA hierarchy are readable |
| `D_cta_final.png` | 13.40s | PASS — full CTA composition holds cleanly; referral code is primary |
| `E_fade_out.png` | 15.05s | PASS — final fade remains intact with no clipping or artifacts |

## Acceptance checks

- [x] Notifications screen remains present.
- [x] Old Community Forum screen does not appear immediately before CTA.
- [x] Notifications → CTA transition is smooth and intentional.
- [x] CTA logo is readable.
- [x] Referral code `IK54OTRD` is readable.
- [x] `Join Dream Planet` button is readable.
- [x] No clipping or unexpected black frames before the authored fade.
- [x] No layout jump or abrupt position change observed.
- [x] Final fade remains intact.
- [x] Resolution is 1080 × 1920.
- [x] Output is constant 30 fps.
- [x] No audio drift is possible; candidate intentionally has no audio.
- [x] Master v3 files remain unchanged by hash.

## Output locations

### Campaign candidate

- `extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Scene 6/Final Animation/scene6_final_v4.mp4`
- `extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Scene 6/Final Animation/scene6_final_v4_no_audio.mp4`

### Isolated workspace copies

- `scene6/revision_v4/scene6_final_v4.mp4`
- `scene6/revision_v4/scene6_final_v4_no_audio.mp4`
- `scene6/renders/scene6_final_v4.mp4`
- `scene6/renders/scene6_final_v4_no_audio.mp4`

### QA evidence

- `scene6/revision_v4/qa/A_notifications_final.png`
- `scene6/revision_v4/qa/B_transition_early.png`
- `scene6/revision_v4/qa/B_transition_late.png`
- `scene6/revision_v4/qa/C_cta_midpoint.png`
- `scene6/revision_v4/qa/D_cta_final.png`
- `scene6/revision_v4/qa/E_fade_out.png`
- `scene6/revision_v4/qa/scene6_v4_capture_metadata.json`

## Remaining concerns

- The browser capture logs one non-blocking 404 for a favicon/resource outside
  the Scene 6 composition. It does not appear in the rendered frames and did
  not affect the candidate output.
- The candidate has not been integrated into Master v3 by design.
- Creative approval is required before any replacement of the currently
  integrated Scene 6 v3 candidate.