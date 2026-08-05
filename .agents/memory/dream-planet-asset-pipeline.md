---
name: Dream Planet uploaded-asset pipeline
description: Where uploaded reference/media files actually end up after import, and where the app's @assets alias resolves — these are two different directories.
---

This project has **two** `attached_assets` directories that are easy to
confuse:

1. **Workspace root** (`/home/runner/workspace/attached_assets/`) — where
   raw user uploads land, including a curated `_scene5_inventory/` subfolder
   (Brand, Forum, PortfolioMedia, Recordings, References). This is scratch
   space for finding source material; the app does not import from here.
2. **Nested project** (`extracted_scenes/.../Replit-Design-Project/attached_assets/`)
   — this is what the `dream-planet-scene3` artifact's Vite `@assets` alias
   actually resolves to (see `vite.config.ts`). Only files copied here (with
   clean names, mirroring the existing `scene5-portfolio/`, `scene5-forum/`
   subfolder convention) are usable via `@assets/...` imports.

**Why:** on a fresh GitHub import, several large uploads were tracked via
git-lfs (or plain git blobs) and never materialized in the working tree
despite `git status` showing clean — `git lfs fetch`/`pull` from the true
repo root (`/home/runner/workspace`, since the nested dir's `.git` resolves
up to the workspace root) was needed before any of that content was visible
on disk at all.

**How to apply:** when picking a new asset for a Scene 5 (or later) UI
phase, look for source material under the workspace-root
`_scene5_inventory/`, but only ever import files that have been deliberately
copied into the nested project's `attached_assets/<scene-subfolder>/` —
don't copy entire raw upload zips or the whole inventory folder into the
nested location, that just bloats the artifact (a past mistake left a
~500MB duplicate there before it was cleaned up).

Also: after a fresh clone/import, `pnpm --filter <pkg> run dev` fails with
`vite: command not found` until `pnpm install` has been run at the monorepo
root at least once (node_modules isn't checked into git).
