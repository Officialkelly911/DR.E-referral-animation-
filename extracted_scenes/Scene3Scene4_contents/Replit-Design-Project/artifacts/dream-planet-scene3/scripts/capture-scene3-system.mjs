/**
 * capture-scene3-system.mjs
 *
 * Captures Scene 3 + Scene 4 animations using the system Chromium binary
 * (which has all required shared libraries bundled in the Nix store).
 *
 * Usage:
 *   node scripts/capture-scene3-system.mjs [--port 24448]
 *
 * Prerequisites:
 *   - Dev server running on port 24448
 *   - System Chromium installed via: nix-env -i chromium
 */

import { chromium } from 'playwright-core';
import { execSync, execFileSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACT_DIR = path.resolve(__dirname, '..');

// ── Config ──────────────────────────────────────────────────────────────────
const PORT          = process.env.PORT_OVERRIDE || 24448;
const BASE_PATH     = '/dream-planet-scene3/';
const URL           = `http://localhost:${PORT}${BASE_PATH}`;
const WIDTH         = 1080;
const HEIGHT        = 1920;

// Scene 3 = 9.5s + 0.5s buffer; Scene 4 = 9.0s + 0.5s buffer
const S3_RECORD_MS  = 10_000;
const S4_RECORD_MS  = 9_500;
const TOTAL_MS      = S3_RECORD_MS + S4_RECORD_MS;

const CAPTURED_DIR  = path.join(ARTIFACT_DIR, 'captured');
const SCENE_DIR     = path.resolve(
  __dirname,
  '../../../../Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/'
);
const S3_FINAL_DIR  = path.join(SCENE_DIR, 'Scene 3', 'Final Animation');
const S4_FINAL_DIR  = path.join(SCENE_DIR, 'Scene 4', 'Final Animation');
const FINAL_EDIT    = path.join(SCENE_DIR, 'Final Edit');

// ── Find system Chromium ────────────────────────────────────────────────────
function findSystemChromium() {
  const candidates = [
    '/run/current-system/sw/bin/chromium',
    '/nix/var/nix/profiles/default/bin/chromium',
  ];

  // Try which command
  try {
    const found = execFileSync('which', ['chromium'], { encoding: 'utf8' }).trim();
    if (found) return found;
  } catch {}

  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }

  // Last resort: search nix profile symlinks
  try {
    const result = execFileSync('sh', ['-c', 'ls -1 /nix/store/ | grep chromium | head -3'], {
      encoding: 'utf8',
      timeout: 5000,
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

// ── Setup dirs ──────────────────────────────────────────────────────────────
[CAPTURED_DIR, S3_FINAL_DIR, S4_FINAL_DIR, FINAL_EDIT].forEach(d => fs.mkdirSync(d, { recursive: true }));

console.log(`\n🎬  Dream Planet — Scene 3 + 4 Capture`);
console.log(`   Target: ${URL}`);
console.log(`   Viewport: ${WIDTH}×${HEIGHT} (9:16)`);
console.log(`   Duration: ${TOTAL_MS / 1000}s total (S3: ${S3_RECORD_MS/1000}s + S4: ${S4_RECORD_MS/1000}s)\n`);

// ── Launch browser ──────────────────────────────────────────────────────────
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

// ── Capture Scene 3 ─────────────────────────────────────────────────────────
console.log('  → Capturing Scene 3 (9.5s)…');

const ctxS3 = await browser.newContext({
  viewport:          { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
  recordVideo: {
    dir:  CAPTURED_DIR,
    size: { width: WIDTH, height: HEIGHT },
  },
});

const pageS3 = await ctxS3.newPage();
pageS3.on('console', msg => {
  if (msg.type() === 'error') console.error('  page error (S3):', msg.text());
});

console.log('  → Navigating to Scene 3…');
await pageS3.goto(URL, { waitUntil: 'networkidle' });

// Start frame
await pageS3.waitForTimeout(100);
const s3StartPath = path.join(CAPTURED_DIR, 'scene3_start_frame.png');
await pageS3.screenshot({ path: s3StartPath });
console.log('  ✓ Scene 3 start frame saved');

// Wait for Scene 3 animation
await pageS3.waitForTimeout(S3_RECORD_MS);

// End frame (should now be on Scene 4 — leaderboard opening)
const s3EndPath = path.join(CAPTURED_DIR, 'scene3_end_frame.png');
await pageS3.screenshot({ path: s3EndPath });
console.log('  ✓ Scene 3 end frame saved');

const vidS3 = await pageS3.video();
await ctxS3.close();

// ── Capture Scene 4 ─────────────────────────────────────────────────────────
console.log('  → Capturing Scene 4 (9.0s)…');

const ctxS4 = await browser.newContext({
  viewport:          { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
  recordVideo: {
    dir:  CAPTURED_DIR,
    size: { width: WIDTH, height: HEIGHT },
  },
});

const pageS4 = await ctxS4.newPage();
pageS4.on('console', msg => {
  if (msg.type() === 'error') console.error('  page error (S4):', msg.text());
});

// Navigate to the app and fast-forward past Scene 3 using JS
await pageS4.goto(URL, { waitUntil: 'networkidle' });
await pageS4.waitForTimeout(S3_RECORD_MS);

const s4StartPath = path.join(CAPTURED_DIR, 'scene4_start_frame.png');
await pageS4.screenshot({ path: s4StartPath });
console.log('  ✓ Scene 4 start frame saved');

await pageS4.waitForTimeout(S4_RECORD_MS);

const s4EndPath = path.join(CAPTURED_DIR, 'scene4_end_frame.png');
await pageS4.screenshot({ path: s4EndPath });
console.log('  ✓ Scene 4 end frame saved');

const vidS4 = await pageS4.video();
await ctxS4.close();
await browser.close();

// ── Retrieve WebM paths ──────────────────────────────────────────────────────
const webmS3 = await vidS3.path();
const webmS4 = await vidS4.path();
console.log(`\n  ✓ Scene 3 WebM: ${path.basename(webmS3)}`);
console.log(`  ✓ Scene 4 WebM: ${path.basename(webmS4)}`);

// ── Convert Scene 3 WebM → MP4 ──────────────────────────────────────────────
const s3Mp4  = path.join(S3_FINAL_DIR, 'scene3_final.mp4');
const s3Trim = S3_RECORD_MS / 1000 - 0.5;

console.log('\n  → Converting Scene 3 WebM → MP4…');
execSync(
  `ffmpeg -i "${webmS3}" ` +
  `-vf "crop=${WIDTH}:${HEIGHT}:0:0" ` +
  `-c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p ` +
  `-movflags +faststart ` +
  `-t ${s3Trim} ` +
  `-y "${s3Mp4}"`,
  { stdio: 'inherit' }
);
console.log(`  ✓ Scene 3 MP4: ${s3Mp4}`);

// ── Extract Scene 4 segment from its recording ──────────────────────────────
// The S4 context records the whole navigation including S3 wait time,
// so we trim the first S3_RECORD_MS seconds off to get just Scene 4.
const s4Mp4   = path.join(S4_FINAL_DIR, 'scene4_final.mp4');
const s4Start = S3_RECORD_MS / 1000;
const s4Trim  = S4_RECORD_MS / 1000 - 0.5;

console.log('\n  → Converting Scene 4 WebM → MP4…');
execSync(
  `ffmpeg -ss ${s4Start} -i "${webmS4}" ` +
  `-vf "crop=${WIDTH}:${HEIGHT}:0:0" ` +
  `-c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p ` +
  `-movflags +faststart ` +
  `-t ${s4Trim} ` +
  `-y "${s4Mp4}"`,
  { stdio: 'inherit' }
);
console.log(`  ✓ Scene 4 MP4: ${s4Mp4}`);

// Copy frames
fs.copyFileSync(s3StartPath, path.join(S3_FINAL_DIR, 'scene3_start_frame.png'));
fs.copyFileSync(s3EndPath,   path.join(S3_FINAL_DIR, 'scene3_end_frame.png'));
fs.copyFileSync(s4StartPath, path.join(S4_FINAL_DIR, 'scene4_start_frame.png'));
fs.copyFileSync(s4EndPath,   path.join(S4_FINAL_DIR, 'scene4_end_frame.png'));

// ── Stitch Scenes 1+2+3+4 ───────────────────────────────────────────────────
const s1s2Orig = path.join(SCENE_DIR, 'Final Edit', 'scene1_scene2_combined.mp4');
const s1s2Fade = path.join(SCENE_DIR, 'Scene 2', 'Final Animation', 'scene2_final_with_fadeout.mp4');

const masterOut = path.join(FINAL_EDIT, 'DreamPlanet_Master_v1.mp4');

// Use scene2_with_fadeout if available, else use combined
const s1s2Source = fs.existsSync(s1s2Fade) ? s1s2Fade : (fs.existsSync(s1s2Orig) ? s1s2Orig : null);

if (s1s2Source) {
  console.log('\n  → Stitching Scenes 1+2+3+4 into master…');

  // Normalise S3 and S4 to a common preview size for stitching
  // (S1+S2 were 1080×1302 in some exports; use S3/S4 native 1080×1920 as master)
  const listFile = path.join(CAPTURED_DIR, 'master_concat.txt');
  fs.writeFileSync(listFile, [s1s2Source, s3Mp4, s4Mp4].map(f => `file '${f}'`).join('\n') + '\n');

  execSync(
    `ffmpeg -f concat -safe 0 -i "${listFile}" ` +
    `-c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p ` +
    `-an -y "${masterOut}"`,
    { stdio: 'inherit' }
  );
  console.log(`  ✓ Master: ${masterOut}`);
} else {
  // No S1+S2 source — just stitch S3+S4
  console.log('\n  → No Scene 1+2 source found — stitching S3+S4 only…');
  const listFile = path.join(CAPTURED_DIR, 'master_concat.txt');
  fs.writeFileSync(listFile, [s3Mp4, s4Mp4].map(f => `file '${f}'`).join('\n') + '\n');

  execSync(
    `ffmpeg -f concat -safe 0 -i "${listFile}" ` +
    `-c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p ` +
    `-an -y "${masterOut}"`,
    { stdio: 'inherit' }
  );
  console.log(`  ✓ Scene 3+4 preview: ${masterOut}`);
}

console.log('\n✅  Capture complete.\n');
console.log(`   Scene 3 MP4:  ${s3Mp4}`);
console.log(`   Scene 4 MP4:  ${s4Mp4}`);
console.log(`   Master:       ${masterOut}`);
