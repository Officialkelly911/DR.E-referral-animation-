/**
 * capture-scene3.mjs
 *
 * Records the Scene 3 animation from the running Vite dev server at
 * 1080×1920 (9:16) using Playwright's built-in video recorder.
 *
 * Prerequisites:
 *   - Dev server running: pnpm --filter @workspace/dream-planet-scene3 run dev
 *   - playwright-core installed (pnpm add -D playwright-core -w)
 *   - Chromium headless-shell installed (npx playwright-core install chromium)
 *
 * Usage:
 *   node scripts/capture-scene3.mjs [--port 24448] [--out ./scene3-raw.webm]
 */

import { chromium } from 'playwright-core';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACT_DIR = path.resolve(__dirname, '..');

// ── Config ─────────────────────────────────────────────────────────────────
const PORT       = process.env.PORT_OVERRIDE || 24448;
const BASE_PATH  = '/dream-planet-scene3/';
const URL        = `http://localhost:${PORT}${BASE_PATH}`;
const WIDTH      = 1080;
const HEIGHT     = 1920;
// 14.14s animation + 0.8s buffer to ensure stopRecording fires
const RECORD_MS  = 14_940;
const VIDEO_DIR  = path.join(ARTIFACT_DIR, 'captured');
const FINAL_DIR  = path.resolve(
  __dirname,
  '../../../../Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Scene 3'
);
const FINAL_NAME = 'scene3_final.mp4';
const START_FRAME_NAME = 'scene3_start_frame.png';
const END_FRAME_NAME   = 'scene3_end_frame.png';

// ── Setup ───────────────────────────────────────────────────────────────────
fs.mkdirSync(VIDEO_DIR,  { recursive: true });
fs.mkdirSync(FINAL_DIR,  { recursive: true });
fs.mkdirSync(path.join(FINAL_DIR, 'Final Animation'),  { recursive: true });
fs.mkdirSync(path.join(FINAL_DIR, 'Project Files'),    { recursive: true });

console.log(`\n🎬  Dream Planet — Scene 3 Capture`);
console.log(`   Target: ${URL}`);
console.log(`   Viewport: ${WIDTH}×${HEIGHT} (9:16)`);
console.log(`   Duration: ${RECORD_MS / 1000}s buffer\n`);

// ── Launch ──────────────────────────────────────────────────────────────────
const browser = await chromium.launch({
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-web-security',
    '--force-device-scale-factor=1',
  ],
});

const context = await browser.newContext({
  viewport:          { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
  recordVideo: {
    dir:  VIDEO_DIR,
    size: { width: WIDTH, height: HEIGHT },
  },
});

const page = await context.newPage();

// Suppress console noise from Vite HMR / React DevTools
page.on('console', msg => {
  if (msg.type() === 'error') console.error('  page error:', msg.text());
});

// ── Navigate & capture start frame ─────────────────────────────────────────
console.log('  → Navigating…');
await page.goto(URL, { waitUntil: 'networkidle' });

// Short settle before start frame (Phase 1 white overlay is intentional)
await page.waitForTimeout(100);
const startFramePath = path.join(VIDEO_DIR, START_FRAME_NAME);
await page.screenshot({ path: startFramePath });
console.log(`  ✓ Start frame saved: ${START_FRAME_NAME}`);

// ── Wait for animation to complete ─────────────────────────────────────────
console.log(`  → Recording ${RECORD_MS / 1000}s…`);
await page.waitForTimeout(RECORD_MS);

// Capture end frame (last frame of animation)
const endFramePath = path.join(VIDEO_DIR, END_FRAME_NAME);
await page.screenshot({ path: endFramePath });
console.log(`  ✓ End frame saved: ${END_FRAME_NAME}`);

// ── Close context — this flushes the WebM ──────────────────────────────────
const video = await page.video();
await context.close();
await browser.close();

const webmPath = await video.path();
console.log(`  ✓ WebM captured: ${path.basename(webmPath)}`);

// ── Convert WebM → MP4 via ffmpeg ──────────────────────────────────────────
const finalMp4     = path.join(FINAL_DIR, 'Final Animation', FINAL_NAME);
const finalStart   = path.join(FINAL_DIR, 'Final Animation', START_FRAME_NAME);
const finalEnd     = path.join(FINAL_DIR, 'Final Animation', END_FRAME_NAME);

console.log('\n  → Converting WebM → MP4 (this may take a moment)…');
// Trim to exact Scene 3 duration — prevents any Scene 4 content bleeding in
// if the VideoTemplate loops before the capture context closes.
const S3_TRIM_S = 14.14;
execSync(
  `ffmpeg -i "${webmPath}" ` +
  `-vf "crop=${WIDTH}:${HEIGHT}:0:0" ` +
  `-c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p ` +
  `-movflags +faststart ` +
  `-t ${S3_TRIM_S} ` +
  `-y "${finalMp4}"`,
  { stdio: 'inherit' }
);
console.log(`  ✓ MP4 master: ${finalMp4}`);

// Copy start/end frames to Final Animation folder
fs.copyFileSync(startFramePath, finalStart);
fs.copyFileSync(endFramePath,   finalEnd);
console.log(`  ✓ Start frame: ${finalStart}`);
console.log(`  ✓ End frame:   ${finalEnd}`);

// ── Stitch Scene 1+2 (with fade) + Scene 3 ─────────────────────────────────
const s1s2 = path.resolve(
  __dirname,
  '../../../../Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/' +
  'Scene 2/Final Animation/scene2_final_with_fadeout.mp4'
);
const combined = path.resolve(
  __dirname,
  '../../../../Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/' +
  'Final Edit/scene1_scene2_scene3_combined.mp4'
);

if (fs.existsSync(s1s2)) {
  console.log('\n  → Stitching Scenes 1+2+3…');
  const listFile = path.join(VIDEO_DIR, 'concat_list.txt');
  const s1s2orig = path.resolve(
    __dirname,
    '../../../../Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/' +
    'Final Edit/scene1_scene2_combined.mp4'
  );

  // Scenes 1+2 are 1080×1302; Scene 3 is 1080×1920.
  // Scale/pad Scene 3 to match the existing 1080×1302 crop for interim review.
  const s3preview = path.join(VIDEO_DIR, 'scene3_1302_preview.mp4');
  execSync(
    `ffmpeg -i "${finalMp4}" ` +
    `-vf "scale=1080:1302:force_original_aspect_ratio=decrease,` +
    `pad=1080:1302:(ow-iw)/2:(oh-ih)/2:black" ` +
    `-c:v libx264 -crf 18 -preset fast -pix_fmt yuv420p ` +
    `-an -y "${s3preview}"`,
    { stdio: 'inherit' }
  );

  fs.writeFileSync(listFile,
    `file '${s1s2}'\nfile '${s3preview}'\n`
  );
  execSync(
    `ffmpeg -f concat -safe 0 -i "${listFile}" ` +
    `-c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p ` +
    `-an -y "${combined}"`,
    { stdio: 'inherit' }
  );
  console.log(`  ✓ Combined S1+S2+S3: ${path.basename(combined)}`);
} else {
  console.log('  ℹ  scene2_final_with_fadeout.mp4 not found — skipping stitch.');
}

console.log('\n✅  Scene 3 capture complete.\n');
