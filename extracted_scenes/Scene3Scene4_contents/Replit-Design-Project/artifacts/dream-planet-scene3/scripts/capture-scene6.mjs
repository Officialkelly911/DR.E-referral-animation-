/**
 * capture-scene6.mjs
 *
 * Captures the Scene 6 cinematic animation using the system Chromium binary.
 *
 * Usage (from artifact root):
 *   PORT_OVERRIDE=24448 node scripts/capture-scene6.mjs
 *
 * Prerequisites:
 *   - Dev server running on port 24448
 *   - System Chromium available (found via `which chromium`)
 *   - ffmpeg available
 *
 * Outputs (canonical — all in scene6/renders/ AND Scene 6/Final Animation/):
 *   scene6_final.mp4          — no audio (audio added at master concat stage)
 *   scene6_final_no_audio.mp4 — identical copy, convention mirror
 *   scene6_start_frame.png
 *   scene6_end_frame.png
 *
 * Phase 10 — Scene 6: "Join the Dream Planet Movement" (Revision Pass)
 * Duration: 15.5s (S6.TOTAL in Scene6Timeline.ts)
 */

import { chromium } from 'playwright-core';
import { execSync, execFileSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname    = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACT_DIR = path.resolve(__dirname, '..');

// ── Config ──────────────────────────────────────────────────────────────────
const PORT      = process.env.PORT_OVERRIDE || 24448;
const BASE_PATH = '/dream-planet-scene3/scene6-cinematic.html';
const URL       = `http://localhost:${PORT}${BASE_PATH}`;
const WIDTH     = 1080;
const HEIGHT    = 1920;

// Keep in sync with S6.TOTAL in Scene6Timeline.ts
const S6_DURATION_MS = 15_500;
const TAIL_BUFFER_MS = 1_000;  // encoder flush buffer recorded after content ends

const CAPTURES_DIR = path.join(ARTIFACT_DIR, 'captured');

// Scene 6 workspace directories
const SCENE6_DIR = path.resolve(__dirname, '../../../../../../scene6');  // workspace root scene6/
const SCENE6_RENDERS_DIR = path.join(SCENE6_DIR, 'renders');
const SCENE6_QA_DIR      = path.join(SCENE6_DIR, 'qa');

// Mirror the campaign directory convention
const CAMPAIGN_DIR = path.resolve(
  __dirname,
  '../../../../Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/'
);
const S6_FINAL_DIR = path.join(CAMPAIGN_DIR, 'Scene 6', 'Final Animation');

// ── Find system Chromium ─────────────────────────────────────────────────────
function findSystemChromium() {
  const candidates = [
    '/run/current-system/sw/bin/chromium',
    '/nix/var/nix/profiles/default/bin/chromium',
  ];
  try {
    const found = execFileSync('which', ['chromium'], { encoding: 'utf8' }).trim();
    if (found) return found;
  } catch {}
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  try {
    const result = execFileSync('sh', ['-c', 'ls -1 /nix/store/ | grep chromium | head -3'], {
      encoding: 'utf8', timeout: 5000,
    });
    const dirs = result.trim().split('\n').filter(Boolean);
    for (const dir of dirs) {
      const bin = `/nix/store/${dir}/bin/chromium`;
      if (fs.existsSync(bin)) return bin;
    }
  } catch {}
  throw new Error('System Chromium not found. Install with: nix-env -i chromium');
}

const CHROMIUM_PATH = findSystemChromium();
console.log(`\n🌐  Chromium: ${CHROMIUM_PATH}`);

// ── Setup dirs ───────────────────────────────────────────────────────────────
[CAPTURES_DIR, SCENE6_RENDERS_DIR, SCENE6_QA_DIR, S6_FINAL_DIR].forEach(d =>
  fs.mkdirSync(d, { recursive: true })
);

console.log(`\n🎬  Dream Planet — Scene 6 Capture`);
console.log(`   Scene:    "Join the Dream Planet Movement"`);
console.log(`   Target:   ${URL}`);
console.log(`   Viewport: ${WIDTH}×${HEIGHT} (9:16 portrait)`);
console.log(`   Content:  ${S6_DURATION_MS / 1000}s (startup offset measured dynamically)\n`);

// ── Launch browser ───────────────────────────────────────────────────────────
const browser = await chromium.launch({
  executablePath: CHROMIUM_PATH,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-web-security',
    '--force-device-scale-factor=1',
    '--disable-gpu',
    '--disable-software-rasterizer',
  ],
  headless: true,
});

// ── Capture context ──────────────────────────────────────────────────────────
const ctx = await browser.newContext({
  viewport:          { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
  recordVideo: {
    dir:  CAPTURES_DIR,
    size: { width: WIDTH, height: HEIGHT },
  },
});

const page = await ctx.newPage();
page.on('console', msg => {
  if (msg.type() === 'error')   console.error('  [page error]',   msg.text());
  if (msg.type() === 'warning') console.warn ('  [page warn]',    msg.text());
});
page.on('pageerror', err => console.error('  [page exception]', err.message));

// ── Navigate & record ────────────────────────────────────────────────────────
// IMPORTANT: Playwright's recordVideo starts recording the moment the page
// is created — BEFORE navigation, network load, and React mount complete.
// That gap ("startup offset") varies run to run. If it's ignored, a fixed
// total-recording-length silently truncates whatever lands at the very end
// of the timeline (here: the final fade-to-black). So we measure the offset
// directly via a DOM marker the component sets when its own timeline starts
// (see `data-s6-started` in Scene6CinematicAnimation.tsx), and schedule
// every subsequent wait relative to that measured moment instead of a guess.
const recordingStartedAt = Date.now();

console.log('  → Navigating to Scene 6 cinematic…');
await page.goto(URL, { waitUntil: 'networkidle' });

console.log('  → Waiting for animation timeline to start…');
await page.waitForFunction(() => document.documentElement.hasAttribute('data-s6-started'));
const animationStartedAt = Date.now();
const startupOffsetMs = animationStartedAt - recordingStartedAt;
console.log(`  ✓ Timeline started (measured startup offset: ${startupOffsetMs}ms)`);

// Start frame — captured immediately after first paint (Phase 1: Home Feed hold)
await page.waitForTimeout(50);
const startFramePath = path.join(CAPTURES_DIR, 'scene6_start_frame.png');
await page.screenshot({ path: startFramePath });
console.log('  ✓ Start frame captured (Phase 1 — Home Feed hold)');

// Wait until the full premium CTA composition is visible (CTA button lands
// at ~12.69s) but BEFORE the fade-to-black which begins at 14.64s.
// Snapshot at t≈13.4s — also usable as the thumbnail-quality end frame.
const END_FRAME_MS = 13_400;
const alreadyWaitedMs = 50;
console.log(`  → Waiting ${(END_FRAME_MS - alreadyWaitedMs) / 1000}s for full composition…`);
await page.waitForTimeout(END_FRAME_MS - alreadyWaitedMs);
const endFramePath = path.join(CAPTURES_DIR, 'scene6_end_frame.png');
await page.screenshot({ path: endFramePath });
console.log('  ✓ End frame captured (t=13.4s — full composition, pre-fade)');

// Record remaining duration (includes the full fade-to-black) plus an
// encoder flush buffer so the trim below never runs past what was recorded.
const remainingMs = (S6_DURATION_MS - END_FRAME_MS) + TAIL_BUFFER_MS;
console.log(`  → Recording remaining ${remainingMs / 1000}s to completion…`);
await page.waitForTimeout(remainingMs);

const video = await page.video();
await ctx.close();
await browser.close();

// The recording starts before the React timeline does. Trim away that
// navigation/boot lead-in, then keep exactly the authored scene duration so
// the exported clip starts on the first Scene 6 frame and preserves its
// complete fade-to-black.
const START_TRIM_S = startupOffsetMs / 1000;
const CONTENT_DURATION_S = S6_DURATION_MS / 1000;

// ── Retrieve WebM ─────────────────────────────────────────────────────────────
const webmPath = await video.path();
console.log(`\n  ✓ WebM: ${path.basename(webmPath)}`);

// ── Convert to MP4 ────────────────────────────────────────────────────────────
const s6Mp4 = path.join(S6_FINAL_DIR, 'scene6_final.mp4');

console.log('\n  → Converting WebM → MP4…');
execSync(
  `ffmpeg -i "${webmPath}" ` +
  `-vf "crop=${WIDTH}:${HEIGHT}:0:0" ` +
  `-c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p ` +
    `-movflags +faststart ` +
    `-ss ${START_TRIM_S.toFixed(3)} ` +
    `-t ${CONTENT_DURATION_S} ` +
  `-an ` +
  `-y "${s6Mp4}"`,
  { stdio: 'inherit' }
);
console.log(`  ✓ Scene 6 MP4: ${s6Mp4}`);

// ── No-audio copy (convention mirror) ────────────────────────────────────────
const s6Mp4NoAudio = path.join(S6_FINAL_DIR, 'scene6_final_no_audio.mp4');
fs.copyFileSync(s6Mp4, s6Mp4NoAudio);
console.log(`  ✓ No-audio copy: ${path.basename(s6Mp4NoAudio)}`);

// ── Copy to scene6/renders/ workspace ────────────────────────────────────────
fs.copyFileSync(s6Mp4, path.join(SCENE6_RENDERS_DIR, 'scene6_final.mp4'));
fs.copyFileSync(s6Mp4NoAudio, path.join(SCENE6_RENDERS_DIR, 'scene6_final_no_audio.mp4'));
console.log(`  ✓ Copies in scene6/renders/`);

// ── Copy frames ───────────────────────────────────────────────────────────────
const destinations = [S6_FINAL_DIR, SCENE6_RENDERS_DIR, SCENE6_QA_DIR];
for (const dest of destinations) {
  fs.copyFileSync(startFramePath, path.join(dest, 'scene6_start_frame.png'));
  fs.copyFileSync(endFramePath,   path.join(dest, 'scene6_end_frame.png'));
}
console.log('  ✓ Frames copied to Final Animation/, scene6/renders/, scene6/qa/');

// ── Duration probe ────────────────────────────────────────────────────────────
let actualDuration = 'unknown';
try {
  const probe = execFileSync('ffprobe', [
    '-v', 'quiet', '-print_format', 'json', '-show_format', s6Mp4,
  ], { encoding: 'utf8' });
  const info = JSON.parse(probe);
  actualDuration = parseFloat(info.format.duration).toFixed(3) + 's';
} catch {}
console.log(`  ✓ Actual duration: ${actualDuration}`);

// ── Print summary ─────────────────────────────────────────────────────────────
console.log('\n✅  Scene 6 capture complete.');
console.log(`\n   MP4:         ${s6Mp4}`);
console.log(`   Duration:    ${actualDuration} (target: ${S6_DURATION_MS / 1000}s)`);
console.log(`   Start frame: scene6_start_frame.png`);
console.log(`   End frame:   scene6_end_frame.png`);
console.log('\n   Next step: creative review and approval before Master v3 integration.\n');
