---
name: Referral Module UI Lock
description: Documents the locked visual state of the Dream Planet Referral Module before Scene 3 & 4 animation work begins.
---

# Referral Module UI — Locked

**Status:** Locked. Do not redesign, restructure, or add new UI elements to any screen.

**Locked screenshots saved at:**
- `screenshots/locked_home.jpg`
- `screenshots/locked_levels.jpg`
- `screenshots/locked_leaderboard.jpg`

## What is locked

### Referral Home (`/`)
- Orange sunburst gradient hero, 4 memoji avatars in overlapping diamond cluster
- Referral code `IK54OTRD` + Share button pill — fully visible, no clipping
- `bronze` (lowercase) level label, `0 / 10` stat with gray `/10`
- `View Levels` orange link, "No qualified referrals yet." empty state
- Qualified / Pending tabs with black underline indicator

### View Levels (`/levels`)
- Warm cream background (`#FFF5EE`), 4-pointed diamond sparkle decorations
- Peek-carousel with both nav arrows always visible (left disabled on first slide)
- Bronze / Silver / Gold badge images, active badge centered and large, inactive peek from edges
- Dark `#1A1A1A` requirements card with checkmark rows
- Locked state (lock icon + "Locked") for Silver and Gold

### Leaderboard (`/leaderboard`)
- Natural-width time filter pills (This Week / This Month / All Time)
- Top-3 podium with real profile photos and orange rank badges
- Rows 4–8 with real profile photos; rank 5 (eg) uses initials — no photo was supplied
- dr._e (rank 9, current user) sticky row with orange gradient and real profile photo
- All photos: `object-cover object-top`, circular, consistent size

## Key implementation constraints for animators
- Every major section has a stable `id`: `#hero`, `#referral-card`, `#cta-button`, `#view-levels`, `#leaderboard`, `#badge-carousel`
- Individual cards and rows are separate components — not flattened
- No existing animations added yet; Framer Motion / GSAP hooks can be attached without restructuring
- Carousel is controlled via `activeIndex` state — programmatically settable
- Scroll containers are standard `overflow-y-auto` divs — scroll position is controllable

**Why:** User explicitly locked the module on 2026-08-04 after visual fidelity audit and profile photo integration. All future work (Scene 3 push-ins, Scene 4 transitions) must treat this as the source-of-truth visual baseline.
