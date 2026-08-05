---
name: Dream Planet Scene 5 — phased build boundary and workflow gotcha
description: Scene 5 is built in strict sequential phases with hard stops between them; plus a reimport gotcha where manual workflows collide with auto-detected artifact workflows.
---

## Scene 5 build order (per the task spec)

Side Navigation (done) → Creator Portfolio → Community Forum → engagement interactions
(like/comment/share) → Scene 5 animation timeline → master integration
(`SCENE5_INTEGRATION.md`). Each phase is explicitly scoped to stop before the next —
don't skip ahead even if reference material for later phases is already uploaded.

**Why:** The task spec enforces a hard stop condition per phase so each screen can be
reviewed/approved before the next is built, and so Scenes 1-4 (locked, approved) are never
at risk of accidental edits during Scene 5 work.

## Reimport / multi-artifact gotcha

**Why:** After a fresh GitHub import of this repo, no workflows exist yet even though the
project already has `[agent] stack = "PNPM_WORKSPACE"` in the nested `.replit`. Manually
configuring a workflow to run one pnpm-workspace package (e.g. `pnpm --filter
@workspace/dream-planet-scene3 run dev`) triggers the platform's own multi-artifact
detection shortly after, which auto-creates its **own** managed workflow with a different
name for the same package/port — causing a port-already-in-use collision between the two.

**How to apply:** On a fresh import of this project, don't hand-roll a workflow for any of
the four services (Scene 3, referral module, api-server, mockup-sandbox). Wait for/trigger
the automatic artifact detection first, then use `WorkflowsRestart` on the exact generated
names (format: `<path-to-artifact>: <label>`, e.g. `extracted_scenes/.../artifacts/dream-planet-scene3: web`).
If a manual workflow was already started, remove it and kill the leftover process on its
port (`lsof -i :<port>`, `kill -9 <pid>`) before restarting the managed one.
