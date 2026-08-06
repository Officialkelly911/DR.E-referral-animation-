/**
 * capture-scene5.mjs
 *
 * Captures the Scene 5 cinematic animation using the system Chromium binary.
 *
 * Usage (from artifact root):
 *   PORT_OVERRIDE=24448 node scripts/capture-scene5.mjs
 *
 * Prerequisites:
 *   - Dev server running on port 24448
 *   - System Chromium available (found via `which chromium`)
 *   - ffmpeg available
 *
 * Outputs:
 *   captured/scene5_raw.webm
 *   Scene 3/Final Animation/../../../Scene 5/Final Animation/scene5_final.mp4
 *   captured/scene5_start_frame.png
 *   captured/scene5_end_frame.png
 */

import { chromium } from 'playwright-core';
import { execSync, execFileSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname   = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACT_DIR = path.resolve(__dirname, '..');

// ── Config ──────────────────────────────────────────────────────────────────
const PORT         = process.env.PORT_OVERRIDE || 24448;
const BASE_PATH    = '/dream-planet-scene3/scene5-cinematic.html';
const URL          = `http://localhost:${PORT}${BASE_PATH}`;
const WIDTH        = 1080;
const HEIGHT       = 1920;

// S5 total = 10.0s + 0.8s buffer for encoder flush
const S5_DURATION_MS = 10_000;
const RECORD_MS      = S5_DURATION_MS + 800;
const TRIM_S         = S5_DURATION_MS / 1000 - 0.2; // trim buffer tail

const CAPTURED_DIR   = path.join(ARTIFACT_DIR, 'captured');

// Mirror the Scene 3/4 directory convention for outputs.
const SCENE_DIR = path.resolve(
  __dirname,
  '../../../../Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/'
);
const S5_FINAL_DIR = path.join(SCENE_DIR, 'Scene 5', 'Final Animation');

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
[CAPTURED_DIR, S5_FINAL_DIR].forEach(d => fs.mkdirSync(d, { recursive: true }));

console.log(`\n🎬  Dream Planet — Scene 5 Capture`);
console.log(`   Target:   ${URL}`);
console.log(`   Viewport: ${WIDTH}×${HEIGHT} (9:16)`);
console.log(`   Duration: ${RECORD_MS / 1000}s recording (${S5_DURATION_MS / 1000}s content)\n`);

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
    dir:  CAPTURED_DIR,
    size: { width: WIDTH, height: HEIGHT },
  },
});

const page = await ctx.newPage();
page.on('console', msg => {
  if (msg.type() === 'error') console.error('  [page error]', msg.text());
  if (msg.type() === 'warning') console.warn('  [page warn]', msg.text());
});
page.on('pageerror', err => console.error('  [page exception]', err.message));

// ── Navigate & record ────────────────────────────────────────────────────────
console.log('  → Navigating to Scene 5 cinematic…');
await page.goto(URL, { waitUntil: 'networkidle' });

// Capture start frame immediately after first paint.
await page.waitForTimeout(120);
const startFramePath = path.join(CAPTURED_DIR, 'scene5_start_frame.png');
await page.screenshot({ path: startFramePath });
console.log('  ✓ Start frame captured');

// Wait for the full animation.
console.log(`  → Recording ${RECORD_MS / 1000}s…`);
await page.waitForTimeout(RECORD_MS);

// Capture end frame.
const endFramePath = path.join(CAPTURED_DIR, 'scene5_end_frame.png');
await page.screenshot({ path: endFramePath });
console.log('  ✓ End frame captured');

const video = await page.video();
await ctx.close();
await browser.close();

// ── Retrieve WebM ─────────────────────────────────────────────────────────────
const webmPath = await video.path();
console.log(`\n  ✓ WebM: ${path.basename(webmPath)}`);

// ── Convert to MP4 ────────────────────────────────────────────────────────────
const s5Mp4 = path.join(S5_FINAL_DIR, 'scene5_final.mp4');

console.log('\n  → Converting WebM → MP4…');
execSync(
  `ffmpeg -i "${webmPath}" ` +
  `-vf "crop=${WIDTH}:${HEIGHT}:0:0" ` +
  `-c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p ` +
  `-movflags +faststart ` +
  `-t ${TRIM_S} ` +
  `-an ` +
  `-y "${s5Mp4}"`,
  { stdio: 'inherit' }
);
console.log(`  ✓ Scene 5 MP4: ${s5Mp4}`);

// ── Also save no-audio variant (same file, future master will add audio) ──────
const s5Mp4NoAudio = path.join(S5_FINAL_DIR, 'scene5_final_no_audio.mp4');
fs.copyFileSync(s5Mp4, s5Mp4NoAudio);
console.log(`  ✓ No-audio copy: ${path.basename(s5Mp4NoAudio)}`);

// ── Copy frames to Final Animation dir ────────────────────────────────────────
fs.copyFileSync(startFramePath, path.join(S5_FINAL_DIR, 'scene5_start_frame.png'));
fs.copyFileSync(endFramePath,   path.join(S5_FINAL_DIR, 'scene5_end_frame.png'));
console.log('  ✓ Frames copied to Final Animation/');

// ── Print summary ─────────────────────────────────────────────────────────────
console.log('\n✅  Scene 5 capture complete.\n');
console.log(`   MP4:         ${s5Mp4}`);
console.log(`   Start frame: ${path.join(S5_FINAL_DIR, 'scene5_start_frame.png')}`);
console.log(`   End frame:   ${path.join(S5_FINAL_DIR, 'scene5_end_frame.png')}`);
