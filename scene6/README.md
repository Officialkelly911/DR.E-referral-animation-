# Dream Planet Referral Campaign — Scene 6

> **Status: Pre-development — workspace only. No implementation yet.**
>
> Master v2 (Scenes 1–5) is frozen. Scene 6 work happens exclusively in this
> directory and must not touch any Scene 1–5 assets, the master build pipeline,
> or the approved master deliverables.

---

## Objective

_To be defined._

---

## Storyboard

_Placeholder — attach or describe the Scene 6 storyboard here._

| Beat | Approx. Time | Visual Description | Interaction |
|------|-------------|-------------------|-------------|
| 1    | 0.0 – ?     | TBD               | TBD         |

---

## Timing

| Property        | Value     |
|----------------|-----------|
| Expected duration | TBD    |
| Scene 5 end time  | 41.300s |
| Scene 6 start time (in master) | 41.300s |
| Scene 6 end time (in master)   | TBD     |
| Total master duration (after Scene 6) | TBD |

---

## UI Screens

_List every UI screen or state that appears in Scene 6._

- [ ] Screen 1: _name / description_
- [ ] Screen 2: _name / description_

---

## Animation Sequence

_Describe the animation timeline in phases._

| Phase | Time Range | Description |
|-------|-----------|-------------|
| P1    | 0.0 – ?   | TBD         |

---

## Transition Requirements

| Transition       | Type   | Notes |
|-----------------|--------|-------|
| Scene 5 → Scene 6 | TBD  | Must match Scene 5 end frame |
| Scene 6 → End     | TBD  | Fade to black / freeze frame / TBD |

---

## Assets Required

_List every asset this scene needs — images, icons, fonts, videos, audio._

| Asset | Path | Status |
|-------|------|--------|
| TBD   | `scene6/assets/` | ⬜ Not started |

All Scene 6 assets go in `scene6/assets/`. Do not place them in any Scene 1–5 directory.

---

## QA Checklist

When Scene 6 capture is complete, verify:

- [ ] Source resolution: 1080 × 1920
- [ ] Source frame rate: 30fps (or confirm trim/normalization settings)
- [ ] No blank-intro baked in (or document trim point in `build_master_v2.sh`)
- [ ] First frame brightness check passes (< 0.95)
- [ ] Last frame matches expected end state
- [ ] Duration is within expected range
- [ ] No audio in source clip (music is added at master concat stage)
- [ ] QA artifacts saved to `scene6/qa/`

---

## Integration Steps (when Scene 6 is ready)

1. Export approved `scene6_final.mp4` → `scene6/renders/scene6_final.mp4`
2. Copy to canonical path: `Scene 6/Final Animation/scene6_final.mp4`
3. In `Final Edit/build_master_v2.sh`:
   - Uncomment `SCENE6_SRC` variable
   - Uncomment `build_scene6()` function
   - Append `scene6` to `SCENE_ORDER`
4. In `Final Edit/validate_master.sh` SCENE REGISTRY:
   - Uncomment `FLAT_SCENE_SRCS[scene6]`
   - Uncomment `SCENE_ORDER` scene6 entry
   - Uncomment `TRIM_GUARDS[scene6]` if applicable
5. Update `artifacts/api-server/src/config/master.ts`:
   - Append Scene 6 entry to `SCENES`
   - Update `MASTER_META.duration`
6. Run `./build_master_v2.sh` → verify all checks pass
7. Run `./validate_master.sh --verbose` → 9/9+ checks pass
8. Update `MASTER_BUILD.md` scene timeline table

---

## Notes

_Record any decisions, constraints, or open questions about Scene 6 here._
