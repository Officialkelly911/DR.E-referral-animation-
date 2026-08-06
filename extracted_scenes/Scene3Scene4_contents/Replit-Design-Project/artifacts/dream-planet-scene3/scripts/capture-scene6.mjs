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
 * Phase 10 — Scene 6: "Join the Dream Planet Movement"
 * Duration: 8.0s (S6.TOTAL in Scene6Timeline.ts)
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
const S6_DURATION_MS = 8_000;
const RECORD_MS      = S6_DURATION_MS + 1_000;  // 1s encoder flush buffer
const TRIM_S         = S6_DURATION_MS / 1000 - 0.1;

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
console.log(`   Duration: ${RECORD_MS / 1000}s recording (${S6_DURATION_MS / 1000}s content)\n`);

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
console.log('  → Navigating to Scene 6 cinematic…');
await page.goto(URL, { waitUntil: 'networkidle' });

// Start frame — captured immediately after first paint (Phase 1: Forum hold)
await page.waitForTimeout(200);
const startFramePath = path.join(CAPTURES_DIR, 'scene6_start_frame.png');
await page.screenshot({ path: startFramePath });
console.log('  ✓ Start frame captured (Phase 1 — Forum hold)');

// Wait until full composition is visible (after badges at 5.70s) but
// BEFORE the fade-to-black which begins at 7.70s. Snapshot at t≈6.5s.
const END_FRAME_MS = 6_500;
console.log(`  → Waiting ${END_FRAME_MS / 1000}s for full composition…`);
await page.waitForTimeout(END_FRAME_MS);
const endFramePath = path.join(CAPTURES_DIR, 'scene6_end_frame.png');
await page.screenshot({ path: endFramePath });
console.log('  ✓ End frame captured (t=6.5s — full composition, pre-fade)');

// Record remaining duration (includes fade-to-black).
const remainingMs = RECORD_MS - END_FRAME_MS;
console.log(`  → Recording remaining ${remainingMs / 1000}s to completion…`);
await page.waitForTimeout(remainingMs);

const video = await page.video();
await ctx.close();
await browser.close();

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
  `-t ${TRIM_S} ` +
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
