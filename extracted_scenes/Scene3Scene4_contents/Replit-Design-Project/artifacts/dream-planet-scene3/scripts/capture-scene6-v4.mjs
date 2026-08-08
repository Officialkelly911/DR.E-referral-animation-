/**
 * Capture the isolated Scene 6 v4 creative candidate.
 *
 * Usage (from this artifact root):
 *   PORT_OVERRIDE=24448 node scripts/capture-scene6-v4.mjs
 *
 * This intentionally writes only v4-suffixed outputs. It never overwrites
 * the approved v3 candidate, the canonical Scene 6 render, or Master v3.
 */

import { chromium } from 'playwright-core';
import { execFileSync, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACT_DIR = path.resolve(__dirname, '..');
const PORT = process.env.PORT_OVERRIDE || 24448;
const URL = `http://localhost:${PORT}/dream-planet-scene3/scene6-cinematic-v4.html`;
const WIDTH = 1080;
const HEIGHT = 1920;
const CONTENT_DURATION_MS = 15_500;
const TAIL_BUFFER_MS = 1_000;

const SCENE6_DIR = path.resolve(__dirname, '../../../../../../scene6');
const REVISION_DIR = path.join(SCENE6_DIR, 'revision_v4');
const QA_DIR = path.join(REVISION_DIR, 'qa');
const RENDERS_DIR = path.join(SCENE6_DIR, 'renders');
const CAMPAIGN_DIR = path.resolve(
  __dirname,
  '../../../../Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/',
);
const FINAL_DIR = path.join(CAMPAIGN_DIR, 'Scene 6', 'Final Animation');
const CAPTURES_DIR = path.join(ARTIFACT_DIR, 'captured', 'scene6-v4');

function findChromium() {
  for (const candidate of [
    '/run/current-system/sw/bin/chromium',
    '/nix/var/nix/profiles/default/bin/chromium',
  ]) {
    if (fs.existsSync(candidate)) return candidate;
  }
  try {
    return execFileSync('which', ['chromium'], { encoding: 'utf8' }).trim();
  } catch {
    throw new Error('System Chromium not found.');
  }
}

function mkdirs() {
  for (const dir of [REVISION_DIR, QA_DIR, RENDERS_DIR, FINAL_DIR, CAPTURES_DIR]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function probe(file) {
  const raw = execFileSync('ffprobe', [
    '-v', 'quiet',
    '-print_format', 'json',
    '-show_streams',
    '-show_format',
    file,
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

console.log(`\nScene 6 v4 capture`);
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
  ['A_notifications_final', 9_820],
  ['B_transition_early', 10_080],
  ['B_transition_late', 10_360],
  ['C_cta_midpoint', 11_450],
  ['D_cta_final', 13_400],
  ['E_fade_out', 15_050],
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
  console.log(`Checkpoint ${label}: target=${sceneMs}ms phase=${phase.phase} phaseAt=${phase.phaseAt}`);
}

await page.waitForTimeout(
  Math.max(0, timelineStartedAt + CONTENT_DURATION_MS + TAIL_BUFFER_MS - Date.now()),
);
const video = await page.video();
await context.close();
await browser.close();

const webmPath = await video.path();
const mp4Path = path.join(FINAL_DIR, 'scene6_final_v4.mp4');
const noAudioPath = path.join(FINAL_DIR, 'scene6_final_v4_no_audio.mp4');
const revisionMp4Path = path.join(REVISION_DIR, 'scene6_final_v4.mp4');
const revisionNoAudioPath = path.join(REVISION_DIR, 'scene6_final_v4_no_audio.mp4');
const renderMp4Path = path.join(RENDERS_DIR, 'scene6_final_v4.mp4');
const renderNoAudioPath = path.join(RENDERS_DIR, 'scene6_final_v4_no_audio.mp4');

execSync(
  `ffmpeg -hide_banner -loglevel error -i "${webmPath}" ` +
  `-ss ${(startupOffsetMs / 1000).toFixed(3)} -t ${(CONTENT_DURATION_MS / 1000).toFixed(3)} ` +
  `-vf "crop=${WIDTH}:${HEIGHT}:0:0" -r 30 -fps_mode cfr ` +
  `-c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -movflags +faststart -an -y "${mp4Path}"`,
  { stdio: 'inherit' },
);

for (const destination of [
  noAudioPath,
  revisionMp4Path,
  revisionNoAudioPath,
  renderMp4Path,
  renderNoAudioPath,
]) {
  fs.copyFileSync(destination.endsWith('no_audio.mp4') ? mp4Path : mp4Path, destination);
}

const metadata = probe(mp4Path);
const sha256 = execFileSync('sha256sum', [mp4Path], { encoding: 'utf8' }).split(/\s+/)[0];
const report = {
  candidate: 'scene6_final_v4.mp4',
  noAudioCandidate: 'scene6_final_v4_no_audio.mp4',
  resolution: `${metadata.width}x${metadata.height}`,
  fps: metadata.fps,
  frameCount: metadata.frames,
  durationSeconds: Number(metadata.duration.toFixed(3)),
  audio: metadata.hasAudio ? 'present' : 'none',
  sha256,
  startupOffsetMs,
  transition: {
    notificationsReadableUntilSeconds: 9.94,
    dimAndGlowStartSeconds: 9.94,
    ctaContentStartSeconds: 10.44,
    durationSeconds: 0.5,
  },
  cta: {
    contentStartSeconds: 10.44,
    fullHoldStartSeconds: 12.92,
    fadeStartSeconds: 14.64,
  },
  checkpoints: checkpointPaths.map(file => path.relative(SCENE6_DIR, file)),
};
fs.writeFileSync(path.join(QA_DIR, 'scene6_v4_capture_metadata.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`\nMP4: ${mp4Path}`);
console.log(JSON.stringify(report, null, 2));