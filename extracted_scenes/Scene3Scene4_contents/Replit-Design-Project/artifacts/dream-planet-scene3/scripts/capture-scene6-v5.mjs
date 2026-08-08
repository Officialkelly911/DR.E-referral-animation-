/**
 * Capture the isolated Scene 6 v5 sequence candidate.
 *
 * V5 removes the Home/sidebar establishing shots and opens directly in the
 * extended Community Forum feed, followed by the existing Notifications and
 * Premium CTA components. It writes only v5-suffixed candidate outputs.
 *
 * Usage:
 *   PORT_OVERRIDE=24448 node scripts/capture-scene6-v5.mjs
 */

import { chromium } from 'playwright-core';
import { execFileSync, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACT_DIR = path.resolve(__dirname, '..');
const PORT = process.env.PORT_OVERRIDE || 24448;
const URL = `http://localhost:${PORT}/dream-planet-scene3/scene6-cinematic-v5.html`;
const WIDTH = 1080;
const HEIGHT = 1920;
const CONTENT_DURATION_MS = 15_500;
const TAIL_BUFFER_MS = 1_000;

const SCENE6_DIR = path.resolve(__dirname, '../../../../../../scene6');
const REVISION_DIR = path.join(SCENE6_DIR, 'revision_v5');
const QA_DIR = path.join(REVISION_DIR, 'qa');
const RENDERS_DIR = path.join(SCENE6_DIR, 'renders');
const CAMPAIGN_DIR = path.resolve(
  __dirname,
  '../../../../Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/',
);
const FINAL_DIR = path.join(CAMPAIGN_DIR, 'Scene 6', 'Final Animation');
const CAPTURES_DIR = path.join(ARTIFACT_DIR, 'captured', 'scene6-v5');

function findChromium() {
  for (const candidate of [
    '/run/current-system/sw/bin/chromium',
    '/nix/var/nix/profiles/default/bin/chromium',
  ]) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return execFileSync('which', ['chromium'], { encoding: 'utf8' }).trim();
}

function mkdirs() {
  for (const dir of [REVISION_DIR, QA_DIR, RENDERS_DIR, FINAL_DIR, CAPTURES_DIR]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function probe(file) {
  const raw = execFileSync('ffprobe', [
    '-v', 'quiet', '-print_format', 'json', '-show_streams', '-show_format', file,
  ], { encoding: 'utf8' });
  const json = JSON.parse(raw);
  const stream = json.streams.find(s => s.codec_type === 'video');
  return {
    duration: Number(json.format.duration),
    width: Number(stream.width),
    height: Number(stream.height),
    fps: stream.avg_frame_rate,
    frames: Number(stream.nb_frames || 0),
    hasAudio: json.streams.some(s => s.codec_type === 'audio'),
  };
}

const chromiumPath = findChromium();
mkdirs();

console.log(`\nScene 6 v5 capture`);
console.log(`URL: ${URL}`);
console.log(`Viewport: ${WIDTH}x${HEIGHT}`);
console.log(`Candidate duration: ${CONTENT_DURATION_MS / 1000}s`);

const browser = await chromium.launch({
  executablePath: chromiumPath,
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-web-security',
    '--force-device-scale-factor=1',
    '--disable-gpu',
    '--disable-software-rasterizer',
  ],
});

const context = await browser.newContext({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
  recordVideo: { dir: CAPTURES_DIR, size: { width: WIDTH, height: HEIGHT } },
});
const page = await context.newPage();
page.on('console', msg => {
  if (msg.type() === 'error') console.error(`[page error] ${msg.text()}`);
});
page.on('pageerror', error => console.error(`[page exception] ${error.message}`));

const recordingStartedAt = Date.now();
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForFunction(() => document.documentElement.hasAttribute('data-s6-started'));
const startupOffsetMs = Date.now() - recordingStartedAt;
const timelineStartedAt = await page.evaluate(() =>
  Number(document.documentElement.getAttribute('data-s6-started')),
);
console.log(`Timeline startup offset: ${startupOffsetMs}ms`);

const checkpoints = [
  ['A_forum_open', 600],
  ['B_forum_mid_scroll', 3_950],
  ['C_forum_final', 6_900],
  ['D_notifications', 8_900],
  ['E_notification_to_cta', 10_450],
  ['F_cta_final', 13_400],
  ['G_fade_out', 15_050],
];
const checkpointPaths = [];
for (const [label, sceneMs] of checkpoints) {
  await page.waitForTimeout(Math.max(0, timelineStartedAt + sceneMs - Date.now()));
  const file = path.join(QA_DIR, `${label}.png`);
  const phase = await page.evaluate(() => ({
    phase: document.documentElement.getAttribute('data-s6-phase'),
    phaseAt: document.documentElement.getAttribute('data-s6-phase-at'),
  }));
  await page.screenshot({ path: file });
  checkpointPaths.push(file);
  console.log(`Checkpoint ${label}: target=${sceneMs}ms phase=${phase.phase}`);
}

await page.waitForTimeout(
  Math.max(0, timelineStartedAt + CONTENT_DURATION_MS + TAIL_BUFFER_MS - Date.now()),
);
const video = await page.video();
await context.close();
await browser.close();

const webmPath = await video.path();
const mp4Path = path.join(REVISION_DIR, 'scene6_final_v5.mp4');
const noAudioPath = path.join(REVISION_DIR, 'scene6_final_v5_no_audio.mp4');
const renderMp4Path = path.join(RENDERS_DIR, 'scene6_final_v5.mp4');
const renderNoAudioPath = path.join(RENDERS_DIR, 'scene6_final_v5_no_audio.mp4');

execSync(
  `ffmpeg -hide_banner -loglevel error -i "${webmPath}" ` +
  `-ss ${(startupOffsetMs / 1000).toFixed(3)} -t ${(CONTENT_DURATION_MS / 1000).toFixed(3)} ` +
  `-vf "crop=${WIDTH}:${HEIGHT}:0:0" -r 30 -fps_mode cfr ` +
  `-c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -movflags +faststart -an -y "${mp4Path}"`,
  { stdio: 'inherit' },
);

for (const destination of [noAudioPath, renderMp4Path, renderNoAudioPath]) {
  fs.copyFileSync(mp4Path, destination);
}

const metadata = probe(mp4Path);
const sha256 = execFileSync('sha256sum', [mp4Path], { encoding: 'utf8' }).split(/\s+/)[0];
const report = {
  candidate: 'scene6_final_v5.mp4',
  resolution: `${metadata.width}x${metadata.height}`,
  fps: metadata.fps,
  frameCount: metadata.frames,
  durationSeconds: Number(metadata.duration.toFixed(3)),
  audio: metadata.hasAudio ? 'present' : 'none',
  sha256,
  startupOffsetMs,
  sequence: {
    forumStartsAtSeconds: 0,
    forumHoldSeconds: 0.8,
    forumEndsAtSeconds: 7.1,
    notificationStartsAtSeconds: 7.1,
    ctaContentStartsAtSeconds: 11.1,
    fadeStartsAtSeconds: 14.64,
  },
  checkpoints: checkpointPaths.map(file => path.relative(SCENE6_DIR, file)),
};
fs.writeFileSync(
  path.join(QA_DIR, 'scene6_v5_capture_metadata.json'),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(`\nMP4: ${mp4Path}`);
console.log(JSON.stringify(report, null, 2));