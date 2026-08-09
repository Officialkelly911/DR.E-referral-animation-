# Scene 5 Archive — v1 Approved

**Archived:** 2026-08-06  
**Status:** Superseded and frozen. The canonical revised Scene 5 is retained in
the production source tree; this directory now preserves the historical
baseline metadata only.

---

## Retained contents

| File | Size | Description |
|------|------|-------------|
| `MASTER_V2_BASELINE.md` | — | Historical Master v2 production baseline |
| `ARCHIVE_MANIFEST.md` | — | This archive record |

The superseded v1 MP4s and capture stills were removed after the revised
Master v5 passed full technical and visual QA. The approved Scene 5 source
remains at the canonical production path documented below.

---

## Scene 5 Specs

| Property | Value |
|----------|-------|
| Title | Community & Participation |
| Source duration | ~13.8s |
| Duration in Master v2 | 12.867s (0.9s trim applied) |
| Trim start | 0.9s (Playwright preamble) |
| Resolution | 1080 × 1920 |
| Frame rate | 25fps source → 30fps in master |
| Audio | No audio in master input (score added at concat) |
| Codec | H.264, CRF 16 |
| Position in master | 28.433s – 41.300s |

---

## Animation Phases

| Phase | Time (source) | Description |
|-------|--------------|-------------|
| P1 | 0.00 – 1.20s | Scene 4 handoff — white dissolve → home → Side Nav opens |
| P2 | 1.20 – 2.50s | View Portfolio tap → Portfolio slides in |
| P3 | 2.50 – 5.20s | Portfolio reveal — profile/stats hold, media grid scroll |
| P4 | 5.20 – 6.50s | View Forum tap → Forum enters |
| P5 | 6.50 – 8.00s | Forum reveal + camera push-in |
| P6 | 8.00 – 12.60s | Multi-post discovery — like/comment interactions |
| P7 | 12.60 – 13.80s | Final push-in, hold on clean forum feed |

---

## Source Location

Original capture pipeline lives in:
```
extracted_scenes/Scene3Scene4_contents/Replit-Design-Project/
  artifacts/dream-planet-scene3/src/components/scene5/
```

Canonical source path in master build:
```
extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/
  Dre-animation/Dream Planet Referral Campaign/
    Scene 5/Final Animation/scene5_final.mp4
```

---

> The retained documents are read-only references. Do not overwrite them.
> Future Scene 5 revisions should be archived separately from the production
> source and final deliverables.
