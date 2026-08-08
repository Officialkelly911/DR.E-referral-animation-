# Scene 6 v5 — Direct Forum Feed Candidate

## Status

Isolated creative candidate. The approved Scene 6 v3 and the v4 polish
candidate remain unchanged and are not replaced by this revision.

## Sequence

| Beat | Timing | Result |
|---|---:|---|
| Community Forum opens directly | 0.00–0.80s | No Home/sidebar establishing shots |
| Extended community feed | 0.80–7.10s | Ten posts with six deliberate scroll/settle beats |
| Notifications | 7.10–10.60s | Existing stagger-in and gentle scroll reused |
| Notifications → CTA | 10.60–11.10s | Existing polished dim/glow handoff reused |
| Premium CTA | 11.10–14.64s | Existing CTA component and content timing reused |
| Fade to black | 14.64–15.50s | Existing end transition reused |

## Validation

- [x] 1080×1920 output
- [x] Approximately 15.5 seconds
- [x] No audio; music remains a master-concat concern
- [x] Feed begins on frame one
- [x] Feed contains the eight requested themes plus two additional posts
- [x] Avatars, headlines, likes, and comments remain readable
- [x] Notifications follow the final feed without a static forum summary
- [x] Existing CTA content and fade remain intact
- [x] Approved v3/v4 deliverables remain untouched

The regenerated capture confirms the feed holds for 0.8s before the six
deliberate scroll beats. The final candidate is ready for creative review.

Capture command:

```bash
PORT_OVERRIDE=24448 node artifacts/dream-planet-scene3/scripts/capture-scene6-v5.mjs
```