/**
 * capture-scene3-only.mjs
 *
 * Captures Scene 3 ONLY (no Scene 4, no master stitch).
 * Use this for Scene 3 timing revisions so Scene 4 is not affected.
 *
 * Usage (from artifact root):
 *   PORT_OVERRIDE=24448 node scripts/capture-scene3-only.mjs
 *
 * Prerequisites:
 *   - Dev server running on port 24448 (pnpm --filter @workspace/dream-planet-scene3 run dev)
 *   - System Chromium available (found via `which chromium`)
 *   - ffmpeg available
 *   - Playwright ffmpeg installed: npx playwright install ffmpeg
 *
 * Outputs (Scene 3 v2 — 11.84s pacing revision):
 *   captured/scene3_start_frame.png
 *   captured/scene3_end_frame.png
 *   Scene 3/Final Animation/scene3_final.mp4         (canonical source)
 *   Scene 3/Final Animation/scene3_final_no_audio.mp4 (identical copy for master concat)
 *   Scene 3/Final Animation/scene3_start_frame.png
 *   Scene 3/Final Animation/scene3_end_frame.png
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
const BASE_PATH = '/dream-planet-scene3/';
const URL       = `http://localhost:${PORT}${BASE_PATH}`;
const WIDTH     = 1080;
const HEIGHT    = 1920;

// S3 total = 11.84s (Scene3Timeline.ts S3.TOTAL, v2 pacing revision).
// Keep this literal in sync with S3.TOTAL in ../src/components/scene3/Scene3Timeline.ts
const S3_DURATION_MS = 11_840;
const RECORD_MS      = S3_DURATION_MS + 800;   // +0.8s buffer for encoder flush
const TRIM_S         = S3_DURATION_MS / 1000 - 0.2; // trim encoder flush tail

const CAPTURED_DIR  = path.join(ARTIFACT_DIR, 'captured');
const SCENE_DIR     = path.resolve(
  __dirname,
  '../../../../Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/'
);
const S3_FINAL_DIR  = path.join(SCENE_DIR, 'Scene 3', 'Final Animation');

// ── Setup ────────────────────────────────────────────────────────────────────
[CAPTURED_DIR, S3_FINAL_DIR].forEach(d => fs.mkdirSync(d, { recursive: true }));

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
console.log(`\n🌐  Using Chromium: ${CHROMIUM_PATH}`);
console.log(`\n🎬  Dream Planet — Scene 3 Capture (v2 pacing revision)`);
console.log(`   Duration: ${S3_DURATION_MS / 1000}s  |  Recording: ${RECORD_MS / 1000}s  |  Trim: ${TRIM_S}s`);
console.log(`   Target: ${URL}`);
console.log(`   Viewport: ${WIDTH}×${HEIGHT} (9:16)\n`);

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

// ── Capture Scene 3 ──────────────────────────────────────────────────────────
console.log(`  → Capturing Scene 3 (${S3_DURATION_MS / 1000}s)…`);

const ctx = await browser.newContext({
  viewport:          { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
  recordVideo: {
    dir:  CAPTURED_DIR,
    size: { width: WIDTH, height: HEIGHT },
  },
});

const page = await ctx.newPage();
page.on('console', msg => {
  if (msg.type() === 'error') console.error('  page error:', msg.text());
});

console.log('  → Navigating…');
await page.goto(URL, { waitUntil: 'networkidle' });

// Start frame — capture just after load (entry overlay still visible)
await page.waitForTimeout(100);
const startPath = path.join(CAPTURED_DIR, 'scene3_start_frame.png');
await page.screenshot({ path: startPath });
console.log('  ✓ Start frame saved');

// Wait for full animation
await page.waitForTimeout(RECORD_MS);

// End frame — should show Leaderboard in settled final hold
const endPath = path.join(CAPTURED_DIR, 'scene3_end_frame.png');
await page.screenshot({ path: endPath });
console.log('  ✓ End frame saved');

const vid = await page.video();
await ctx.close();
await browser.close();

// ── Convert WebM → MP4 ───────────────────────────────────────────────────────
const webmPath = await vid.path();
console.log(`\n  ✓ WebM: ${path.basename(webmPath)}`);

const mp4Out = path.join(S3_FINAL_DIR, 'scene3_final.mp4');
const noAudioOut = path.join(S3_FINAL_DIR, 'scene3_final_no_audio.mp4');

console.log('\n  → Converting WebM → MP4…');
execSync(
  `ffmpeg -i "${webmPath}" ` +
  `-vf "crop=${WIDTH}:${HEIGHT}:0:0" ` +
  `-c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p ` +
  `-movflags +faststart ` +
  `-t ${TRIM_S} ` +
  `-an ` +
  `-y "${mp4Out}"`,
  { stdio: 'inherit' }
);
console.log(`  ✓ MP4: ${mp4Out}`);

// No-audio copy (identical — reserved for master concat pipeline)
fs.copyFileSync(mp4Out, noAudioOut);
console.log(`  ✓ No-audio copy: ${noAudioOut}`);

// Copy frames to Final Animation dir
fs.copyFileSync(startPath, path.join(S3_FINAL_DIR, 'scene3_start_frame.png'));
fs.copyFileSync(endPath,   path.join(S3_FINAL_DIR, 'scene3_end_frame.png'));
console.log('  ✓ Frames copied to Final Animation/');

// ── Verify ───────────────────────────────────────────────────────────────────
console.log('\n  → Verifying output…');
execSync(`ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 "${mp4Out}"`, { stdio: 'inherit' });

console.log('\n✅  Scene 3 capture complete (v2 — 11.84s pacing revision).');
console.log(`   scene3_final.mp4      → ${mp4Out}`);
console.log(`   scene3_final_no_audio → ${noAudioOut}`);
