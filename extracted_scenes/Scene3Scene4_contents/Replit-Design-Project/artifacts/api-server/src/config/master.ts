/**
 * Dream Planet Master Build — Review Configuration
 *
 * This file is the single source of truth for the review page.
 * Update these values when a new approved master is released or when
 * Scene 5 / Scene 6 are added.
 *
 * To update:
 *   1. Run validate_master.sh to confirm the new master passes all checks.
 *   2. Update MASTER_VERSION, VIDEO_FILENAME, and the metadata fields below.
 *   3. Append new entries to SCENES.
 *   4. Restart the api-server workflow.
 */

import { resolve } from "node:path";

// ── Master version label (shown in the review UI) ─────────────────────────────
export const MASTER_VERSION = "v2";

// ── Video filename (inside the Final Edit directory) ─────────────────────────
// Use the _audio variant so the review player has the campaign soundtrack.
export const VIDEO_FILENAME = "DreamPlanet_Master_v2_audio.mp4";

// ── Path to the Final Edit directory ─────────────────────────────────────────
// Resolved from __dirname (dist/), which the build banner injects from import.meta.url.
// Chain: dist/ → api-server/ → artifacts/ → Replit-Design-Project/ →
//        Scene3Scene4_contents/ → extracted_scenes/ → REPO_ROOT
//
// If the api-server is ever moved to a different depth in the repo tree,
// adjust the number of ".." entries here to match the new depth.
const REPO_ROOT = resolve(
  __dirname,
  "..",         // api-server/
  "..",         // artifacts/
  "..",         // Replit-Design-Project/
  "..",         // Scene3Scene4_contents/
  "..",         // extracted_scenes/
  "..",         // REPO_ROOT
);

export const FINAL_EDIT_DIR = resolve(
  REPO_ROOT,
  "extracted_scenes",
  "Scene3Scene4_contents",
  "Scene1scene2_contents",
  "Dre-animation",
  "Dream Planet Referral Campaign",
  "Final Edit",
);

export const VIDEO_PATH = resolve(FINAL_EDIT_DIR, VIDEO_FILENAME);

// ── Scene 5 standalone preview ────────────────────────────────────────────────
// Served at /review/scene5 — no audio (score added at master concat stage).
export const SCENE5_VIDEO_PATH = resolve(
  REPO_ROOT,
  "extracted_scenes",
  "Scene3Scene4_contents",
  "Scene1scene2_contents",
  "Dre-animation",
  "Dream Planet Referral Campaign",
  "Scene 5",
  "Final Animation",
  "scene5_final.mp4",
);

// ── Known video metadata ──────────────────────────────────────────────────────
// Sourced from ffprobe at the time the master was approved (Aug 5, 2026).
// Update when the master is regenerated with new scenes or a trim change.
export const MASTER_META = {
  version: MASTER_VERSION,
  filename: VIDEO_FILENAME,
  duration: 41.300,          // seconds
  durationFormatted: "0:41", // mm:ss
  width: 1080,
  height: 1920,
  aspectRatio: "9:16",
  fps: 30,
  hasAudio: true,
  approvedDate: "2026-08-06",
  buildScript: "build_master_v2.sh",
} as const;

// ── Scene list ────────────────────────────────────────────────────────────────
// When adding Scene 6: append to this array.
// startTime / endTime are seconds in the final master.
export interface SceneEntry {
  id: string;
  label: string;
  /** Short descriptive name shown as a subtitle in the review UI (e.g. "Tattoo Reveal"). */
  shortLabel: string;
  startTime: number;
  endTime: number;
  description: string;
  source: "procedural" | "video";
}

export const SCENES: SceneEntry[] = [
  {
    id: "scene1",
    label: "Scene 1",
    shortLabel: "Tattoo Reveal",
    startTime: 0,
    endTime: 3.0,
    description: "Luxury tattoo reveal — ken-burns zoom, light streak, \"More than followers\"",
    source: "procedural",
  },
  {
    id: "scene2",
    label: "Scene 2",
    shortLabel: "Creator Discovery",
    startTime: 3.0,
    endTime: 6.0,
    description: "Dream Planet identity reveal — DP icon + \"Dream Planet\" lockup",
    source: "procedural",
  },
  {
    id: "scene3",
    label: "Scene 3",
    shortLabel: "Referral Journey",
    startTime: 6.0,
    endTime: 19.433,
    description: "Referral experience — Referral Home UI with push-in, code emphasis, levels tease",
    source: "video",
  },
  {
    id: "scene4",
    label: "Scene 4",
    shortLabel: "Leaderboard",
    startTime: 19.433,
    endTime: 28.433,
    description: "Leaderboard & referral levels — full referral programme overview",
    source: "video",
  },
  {
    id: "scene5",
    label: "Scene 5",
    shortLabel: "Community & Participation",
    startTime: 28.433,
    endTime: 41.300,
    description: "Community & participation — Creator Portfolio → Community Forum → engagement interactions",
    source: "video",
  },
];
