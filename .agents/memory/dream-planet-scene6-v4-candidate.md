---
name: Dream Planet Scene 6 v4 candidate
description: Isolated targeted-polish candidate for the Notifications-to-CTA handoff; not approved or integrated.
---

Scene 6 v4 is an isolated creative candidate, not a replacement for the
approved Scene 6 v3 or Master v3. It preserves the existing CTA and changes
only the Notifications dim/orange-glow handoff plus targeted CTA spacing.
The candidate is 15.5s at 1080×1920, constant 30fps, and no audio.

**Why:** the creative brief explicitly requires output isolation and approval
before replacing the currently integrated Scene 6. Treating v4 as a separate
candidate protects the approved master while allowing visual review.

**How to apply:** use `scene6/revision_v4/qa/SCENE6_FINAL_V4_QA.md` and its
checkpoint frames for review. If approved later, integrate only through the
existing Scene 6/master checklist; do not overwrite v3 directly during review.

The capture script anchors QA screenshots to the component's timeline-start
DOM marker rather than page-load time. This is required because Playwright
startup/network timing can otherwise shift screenshots into later phases while
their labels still claim the authored scene time.