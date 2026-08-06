/**
 * /review — Dream Planet Master Review Page
 *
 * Routes:
 *   GET /review          → HTML review player page
 *   GET /review/meta     → JSON metadata (version, resolution, fps, scenes, …)
 *   GET /review/video    → MP4 stream with HTTP Range support (required for seeking)
 */

import { Router, type IRouter, type Request, type Response } from "express";
import { createReadStream, statSync, existsSync } from "node:fs";
import { VIDEO_PATH, MASTER_META, SCENES, SCENE5_VIDEO_PATH } from "../config/master";

const router: IRouter = Router();

// ── GET /review/meta ─────────────────────────────────────────────────────────
router.get("/review/meta", (_req: Request, res: Response) => {
  res.json({
    ...MASTER_META,
    videoUrl: "/review/video",
    scenes: SCENES,
    videoExists: existsSync(VIDEO_PATH),
  });
});

// ── GET /review/video ─────────────────────────────────────────────────────────
// Streams the approved master MP4 with full HTTP Range support so the HTML5
// <video> element can seek without downloading the whole file.
router.get("/review/video", (req: Request, res: Response) => {
  if (!existsSync(VIDEO_PATH)) {
    res.status(404).json({
      error: "Master video not found",
      path: VIDEO_PATH,
      hint: "Run build_master.sh to regenerate the approved master files.",
    });
    return;
  }

  const stat = statSync(VIDEO_PATH);
  const fileSize = stat.size;
  const rangeHeader = req.headers.range;

  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Cache-Control", "no-store"); // always serve fresh in review context

  if (rangeHeader) {
    // Parse "bytes=start-end"
    const parts = rangeHeader.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0]!, 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    res.status(206);
    res.setHeader("Content-Range", `bytes ${start}-${end}/${fileSize}`);
    res.setHeader("Content-Length", chunkSize);

    createReadStream(VIDEO_PATH, { start, end }).pipe(res);
  } else {
    res.setHeader("Content-Length", fileSize);
    createReadStream(VIDEO_PATH).pipe(res);
  }
});

// ── GET /review/scene5/video ──────────────────────────────────────────────────
// Streams scene5_final.mp4 with full HTTP Range support (seeking works).
router.get("/review/scene5/video", (req: Request, res: Response) => {
  if (!existsSync(SCENE5_VIDEO_PATH)) {
    res.status(404).json({
      error: "Scene 5 video not found",
      path: SCENE5_VIDEO_PATH,
    });
    return;
  }

  const stat = statSync(SCENE5_VIDEO_PATH);
  const fileSize = stat.size;
  const rangeHeader = req.headers.range;

  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Cache-Control", "no-store");

  if (rangeHeader) {
    const parts = rangeHeader.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0]!, 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    res.status(206);
    res.setHeader("Content-Range", `bytes ${start}-${end}/${fileSize}`);
    res.setHeader("Content-Length", chunkSize);
    createReadStream(SCENE5_VIDEO_PATH, { start, end }).pipe(res);
  } else {
    res.setHeader("Content-Length", fileSize);
    createReadStream(SCENE5_VIDEO_PATH).pipe(res);
  }
});

// ── GET /review/scene5 ────────────────────────────────────────────────────────
router.get("/review/scene5", (_req: Request, res: Response) => {
  const exists = existsSync(SCENE5_VIDEO_PATH);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.send(buildScene5Page(exists));
});

// ── GET /review ───────────────────────────────────────────────────────────────
router.get("/review", (_req: Request, res: Response) => {
  const videoExists = existsSync(VIDEO_PATH);
  const html = buildReviewPage(videoExists);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.send(html);
});

// ─────────────────────────────────────────────────────────────────────────────
// HTML template
// ─────────────────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Assign a distinct brand-palette colour to each scene slot.
// Extend this array when Scene 6 is added.
const SCENE_COLOURS = [
  "#F64A01", // Scene 1 — Dream Planet orange
  "#E8370A", // Scene 2 — deeper orange
  "#C9A84C", // Scene 3 — warm gold
  "#8AB4A0", // Scene 4 — muted teal
  "#A78BDB", // Scene 5 — soft violet
  "#6BA3BE", // Scene 6 (reserved)
];

function buildReviewPage(videoExists: boolean): string {
  const meta = MASTER_META;
  const totalDur = meta.duration;

  // Build scene timeline segments as inline style widths + JS data
  const sceneSegments = SCENES.map((s, i) => {
    const widthPct = ((s.endTime - s.startTime) / totalDur) * 100;
    const colour = SCENE_COLOURS[i] ?? "#666";
    return `<div
      class="timeline-seg"
      data-start="${s.startTime}"
      data-end="${s.endTime}"
      data-label="${s.label}"
      style="width:${widthPct.toFixed(3)}%;background:${colour}"
      title="${s.label}: ${s.description}"
    ></div>`;
  }).join("\n      ");

  // Scene info cards
  const sceneCards = SCENES.map((s, i) => {
    const colour = SCENE_COLOURS[i] ?? "#666";
    const dur = (s.endTime - s.startTime).toFixed(2);
    return `<div class="scene-card" data-start="${s.startTime}" data-end="${s.endTime}">
        <div class="scene-dot" style="background:${colour}"></div>
        <div class="scene-info">
          <span class="scene-label" style="color:${colour}">${s.label} <span class="scene-short-label">${s.shortLabel}</span></span>
          <span class="scene-time">${formatDuration(s.startTime)} – ${formatDuration(s.endTime)} &nbsp;·&nbsp; ${dur}s</span>
          <span class="scene-desc">${s.description}</span>
          <span class="scene-source">${s.source === "procedural" ? "⚙ procedurally rendered" : "▶ flat video source"}</span>
        </div>
      </div>`;
  }).join("\n      ");

  const videoBlock = videoExists
    ? `<video id="player" controls playsinline preload="metadata">
        <source src="/review/video" type="video/mp4">
        <p class="no-video">Your browser does not support HTML5 video.</p>
      </video>`
    : `<div class="no-video-placeholder">
        <span class="no-video-icon">⚠</span>
        <p>Master video not found.</p>
        <p class="no-video-hint">Run <code>build_master.sh</code> to regenerate the approved master files,<br>then restart the API server.</p>
      </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dream Planet — Master Review ${meta.version}</title>
  <style>
    /* ── Reset & base ───────────────────────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --orange:   #F64A01;
      --bg:       #080808;
      --surface:  #111111;
      --surface2: #1a1a1a;
      --border:   #2a2a2a;
      --text:     #e8e8e8;
      --muted:    #777;
      --font:     -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
      --mono:     "SF Mono", "Fira Code", "Consolas", monospace;
    }
    html, body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font);
      font-size: 14px;
      min-height: 100vh;
    }

    /* ── Layout ─────────────────────────────────────────────────────────── */
    .page {
      display: grid;
      grid-template-columns: auto 1fr;
      grid-template-rows: auto 1fr auto;
      grid-template-areas:
        "header  header"
        "player  sidebar"
        "footer  footer";
      min-height: 100vh;
      gap: 0;
    }
    @media (max-width: 900px) {
      .page {
        grid-template-columns: 1fr;
        grid-template-areas: "header" "player" "sidebar" "footer";
      }
    }

    /* ── Header ─────────────────────────────────────────────────────────── */
    .header {
      grid-area: header;
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 24px;
      border-bottom: 1px solid var(--border);
      background: var(--surface);
    }
    .header-logo {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--orange);
    }
    .header-divider { width: 1px; height: 20px; background: var(--border); }
    .header-title { font-size: 13px; color: var(--muted); }
    .header-version {
      margin-left: auto;
      font-family: var(--mono);
      font-size: 11px;
      background: var(--surface2);
      border: 1px solid var(--border);
      color: var(--orange);
      padding: 3px 10px;
      border-radius: 4px;
      letter-spacing: 1px;
    }

    /* ── Player column ───────────────────────────────────────────────────── */
    .player-col {
      grid-area: player;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px 24px 24px;
      gap: 16px;
      background: var(--bg);
    }
    .player-wrap {
      position: relative;
      width: min(360px, 100%);
      background: #000;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 0 0 1px var(--border), 0 24px 64px rgba(0,0,0,.7);
    }
    #player {
      display: block;
      width: 100%;
      aspect-ratio: 9 / 16;
      background: #000;
    }
    .no-video-placeholder {
      width: 100%;
      aspect-ratio: 9 / 16;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      background: var(--surface2);
      color: var(--muted);
      text-align: center;
      padding: 24px;
    }
    .no-video-icon { font-size: 36px; }
    .no-video-hint {
      font-size: 12px;
      line-height: 1.6;
      color: #555;
      margin-top: 4px;
    }
    .no-video-hint code {
      font-family: var(--mono);
      color: var(--orange);
      background: rgba(246,74,1,.1);
      padding: 1px 6px;
      border-radius: 3px;
    }

    /* Current scene indicator */
    .current-scene-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--muted);
      height: 24px;
      transition: color .2s;
    }
    .current-scene-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: var(--orange);
      flex-shrink: 0;
      transition: background .2s;
    }
    .current-scene-name { color: var(--text); font-weight: 500; }

    /* Timeline bar */
    .timeline-wrap {
      width: min(360px, 100%);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .timeline-label {
      font-size: 10px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--muted);
    }
    .timeline-bar {
      display: flex;
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
      gap: 2px;
      cursor: pointer;
    }
    .timeline-seg {
      height: 100%;
      border-radius: 2px;
      transition: opacity .15s;
      flex-shrink: 0;
    }
    .timeline-seg:hover { opacity: .75; }
    .timeline-seg.active { outline: 2px solid white; outline-offset: 2px; }
    .timeline-ticks {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      font-family: var(--mono);
      color: #444;
    }

    /* ── Sidebar ─────────────────────────────────────────────────────────── */
    .sidebar {
      grid-area: sidebar;
      padding: 32px 24px;
      border-left: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      gap: 32px;
      overflow-y: auto;
      background: var(--surface);
    }
    @media (max-width: 900px) {
      .sidebar { border-left: none; border-top: 1px solid var(--border); }
    }

    /* Metadata grid */
    .section-title {
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 14px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .meta-cell {
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px 14px;
    }
    .meta-key {
      font-size: 10px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 4px;
    }
    .meta-val {
      font-family: var(--mono);
      font-size: 16px;
      font-weight: 600;
      color: var(--text);
    }
    .meta-val.orange { color: var(--orange); }
    .meta-val.green  { color: #4caf79; }
    .meta-val.red    { color: #e05252; }
    .meta-unit { font-size: 11px; color: var(--muted); margin-left: 2px; }

    /* Scene cards */
    .scene-list { display: flex; flex-direction: column; gap: 10px; }
    .scene-card {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px 14px;
      cursor: pointer;
      transition: border-color .15s, background .15s;
    }
    .scene-card:hover { border-color: #444; background: #1e1e1e; }
    .scene-card.active-card { border-color: var(--orange) !important; background: rgba(246,74,1,.06); }
    .scene-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 3px; }
    .scene-info { display: flex; flex-direction: column; gap: 3px; }
    .scene-label { font-size: 13px; font-weight: 600; }
    .scene-short-label { font-weight: 400; color: var(--muted); font-size: 12px; margin-left: 4px; }
    .scene-time { font-family: var(--mono); font-size: 11px; color: var(--muted); }
    .scene-desc { font-size: 12px; color: #aaa; line-height: 1.5; margin-top: 2px; }
    .scene-source { font-size: 10px; color: #555; margin-top: 2px; }

    /* ── Footer ─────────────────────────────────────────────────────────── */
    .footer {
      grid-area: footer;
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 12px 24px;
      border-top: 1px solid var(--border);
      background: var(--surface);
      font-size: 11px;
      color: #444;
      flex-wrap: wrap;
    }
    .footer a { color: #555; text-decoration: none; }
    .footer a:hover { color: var(--orange); }
    .footer-sep { color: #2a2a2a; }
    .footer-right { margin-left: auto; }
  </style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <header class="header">
    <span class="header-logo">Dream Planet</span>
    <div class="header-divider"></div>
    <span class="header-title">Campaign Master — Review</span>
    <span class="header-version">Master ${meta.version}</span>
  </header>

  <!-- Player column -->
  <main class="player-col">
    <div class="player-wrap">
      ${videoBlock}
    </div>

    <div class="current-scene-badge" id="sceneBadge">
      <div class="current-scene-dot" id="sceneDot"></div>
      <span id="sceneName">—</span>
    </div>

    <div class="timeline-wrap">
      <div class="timeline-label">Scene timeline</div>
      <div class="timeline-bar" id="timelineBar">
        ${sceneSegments}
      </div>
      <div class="timeline-ticks">
        <span>0:00</span>
        ${SCENES.slice(1).map(s => `<span>${formatDuration(s.startTime)}</span>`).join("")}
        <span>${formatDuration(totalDur)}</span>
      </div>
    </div>
  </main>

  <!-- Sidebar -->
  <aside class="sidebar">

    <!-- Metadata -->
    <section>
      <div class="section-title">Video metadata</div>
      <div class="meta-grid">
        <div class="meta-cell">
          <div class="meta-key">Duration</div>
          <div class="meta-val orange" id="metaDuration">${formatDuration(meta.duration)}<span class="meta-unit">&nbsp;(${meta.duration.toFixed(2)}s)</span></div>
        </div>
        <div class="meta-cell">
          <div class="meta-key">Resolution</div>
          <div class="meta-val">${meta.width}<span class="meta-unit">×</span>${meta.height}<span class="meta-unit">${meta.aspectRatio}</span></div>
        </div>
        <div class="meta-cell">
          <div class="meta-key">Frame rate</div>
          <div class="meta-val">${meta.fps}<span class="meta-unit">fps</span></div>
        </div>
        <div class="meta-cell">
          <div class="meta-key">Audio</div>
          <div class="meta-val ${meta.hasAudio ? "green" : "red"}">${meta.hasAudio ? "Present" : "None"}</div>
        </div>
        <div class="meta-cell">
          <div class="meta-key">Scenes</div>
          <div class="meta-val orange">${SCENES.length}<span class="meta-unit">&nbsp;scenes</span></div>
        </div>
        <div class="meta-cell">
          <div class="meta-key">Version</div>
          <div class="meta-val orange">${meta.version}</div>
        </div>
        <div class="meta-cell" style="grid-column:span 2">
          <div class="meta-key">Approved</div>
          <div class="meta-val" style="font-size:13px">${meta.approvedDate}</div>
        </div>
        <div class="meta-cell" style="grid-column:span 2">
          <div class="meta-key">File</div>
          <div class="meta-val" style="font-size:11px;word-break:break-all;font-family:var(--mono)">${meta.filename}</div>
        </div>
        <div class="meta-cell" style="grid-column:span 2">
          <div class="meta-key">Elapsed / Remaining</div>
          <div class="meta-val" style="font-size:13px" id="metaElapsed">0:00 / ${formatDuration(meta.duration)}</div>
        </div>
      </div>
    </section>

    <!-- Scenes -->
    <section>
      <div class="section-title">Scenes — ${SCENES.length} total</div>
      <div class="scene-list" id="sceneList">
        ${sceneCards}
      </div>
    </section>

  </aside>

  <!-- Footer -->
  <footer class="footer">
    <span>Dream Planet Referral Campaign</span>
    <span class="footer-sep">·</span>
    <a href="/api/healthz">API health</a>
    <span class="footer-sep">·</span>
    <a href="/review/meta">Raw metadata JSON</a>
    <span class="footer-sep">·</span>
    <span>Master ${meta.version} · ${meta.width}×${meta.height} · ${meta.fps}fps · ${SCENES.length} scenes</span>
    <span class="footer-right">Review page — not a production deliverable</span>
  </footer>

</div>

<script>
(function () {
  const player   = document.getElementById('player');
  const segs     = document.querySelectorAll('.timeline-seg');
  const badge    = document.getElementById('sceneBadge');
  const dot      = document.getElementById('sceneDot');
  const namEl    = document.getElementById('sceneName');
  const elapsed  = document.getElementById('metaElapsed');
  const cards    = document.querySelectorAll('.scene-card');
  const totalDur = ${totalDur};

  // Scene data embedded from server config
  const scenes = ${JSON.stringify(SCENES)};
  const sceneColours = ${JSON.stringify(SCENE_COLOURS)};

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m + ':' + String(sec).padStart(2, '0');
  }

  function currentSceneIndex(t) {
    for (let i = scenes.length - 1; i >= 0; i--) {
      if (t >= scenes[i].startTime) return i;
    }
    return 0;
  }

  function updateUI(t) {
    const idx = currentSceneIndex(t);
    const scene = scenes[idx];
    const colour = sceneColours[idx] || '#F64A01';

    // Badge
    dot.style.background = colour;
    namEl.textContent = scene.label + ' · ' + (scene.shortLabel || scene.description.split('—')[0].trim());

    // Timeline segments
    segs.forEach((seg, i) => seg.classList.toggle('active', i === idx));

    // Scene cards
    cards.forEach((card, i) => card.classList.toggle('active-card', i === idx));

    // Elapsed
    const rem = Math.max(0, totalDur - t);
    if (elapsed) elapsed.textContent = formatTime(t) + ' / −' + formatTime(rem);
  }

  if (player) {
    player.addEventListener('timeupdate', () => updateUI(player.currentTime));
    player.addEventListener('loadedmetadata', () => updateUI(0));

    // Click on a scene card seeks to that scene's start
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const start = parseFloat(card.dataset.start || '0');
        player.currentTime = start;
        player.play();
      });
    });

    // Click on a timeline segment seeks to that scene's start
    segs.forEach((seg) => {
      seg.addEventListener('click', () => {
        const start = parseFloat(seg.dataset.start || '0');
        player.currentTime = start;
        player.play();
      });
    });

    updateUI(0);
  }
})();
</script>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 5 HTML template — minimal portrait player, reliable native controls
// ─────────────────────────────────────────────────────────────────────────────

const SCENE5_PHASES = [
  { id: "P1", time: "0.00 – 1.20 s", label: "Scene 4 handoff — white dissolve → home → Side Nav opens, holds to read" },
  { id: "P2", time: "1.20 – 2.50 s", label: "View Portfolio tap → Portfolio slides in" },
  { id: "P3", time: "2.50 – 5.20 s", label: "Portfolio reveal — profile/stats hold, media grid scroll (floating + visible)" },
  { id: "P4", time: "5.20 – 6.50 s", label: "View Forum tap → Forum enters (floating + disappears)" },
  { id: "P5", time: "6.50 – 8.00 s", label: "Forum reveal + camera push-in — header, 47 members, post 1" },
  { id: "P6", time: "8.00 – 12.60 s", label: "Multi-post discovery — p1 (Like) → p2 → p3 (Comment) → p4, 3 controlled scrolls" },
  { id: "P7", time: "12.60 – 13.80 s", label: "Final push-in, hold on clean forum feed (p4)" },
];

function buildScene5Page(videoExists: boolean): string {
  const phaseRows = SCENE5_PHASES.map((p) =>
    `<tr><td class="ph-id">${p.id}</td><td class="ph-time">${p.time}</td><td>${p.label}</td></tr>`
  ).join("\n");

  const noVideoWarning = videoExists ? "" : `
    <div class="warn">
      ⚠ Video file not found at expected path. Run the Scene 5 capture pipeline first.
    </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Dream Planet — Scene 5 Preview</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0a0a0a;
      color: #ddd;
      font-family: system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px 20px 56px;
      gap: 28px;
    }
    header { width: 100%; max-width: 480px; }
    .eyebrow { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #444; margin-bottom: 6px; }
    h1 { font-size: 15px; font-weight: 600; color: #f64a01; margin-bottom: 8px; }
    .chips { display: flex; gap: 12px; flex-wrap: wrap; font-size: 11px; color: #555; }
    .chips strong { color: #aaa; }
    /* Phone shell */
    .shell {
      position: relative;
      width: 270px;
      background: #111;
      border-radius: 38px;
      border: 2px solid #252525;
      box-shadow: 0 0 0 1px #181818, 0 32px 72px rgba(0,0,0,.75), inset 0 1px 0 rgba(255,255,255,.05);
      padding: 14px 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .notch { width: 72px; height: 5px; background: #1c1c1c; border-radius: 3px; margin-bottom: 10px; }
    .screen { width: 250px; height: 444px; border-radius: 12px; overflow: hidden; background: #000; }
    video { width: 100%; height: 100%; object-fit: cover; display: block; }
    .home-bar { width: 70px; height: 4px; background: #252525; border-radius: 2px; margin-top: 10px; }
    /* Warn */
    .warn {
      width: 100%; max-width: 480px;
      background: #1e1200; border: 1px solid #5a3000;
      border-radius: 8px; padding: 12px 16px;
      font-size: 12px; color: #e8a020;
    }
    /* Phase table */
    .phases { width: 100%; max-width: 480px; background: #111; border: 1px solid #1e1e1e; border-radius: 10px; overflow: hidden; }
    .phases-title {
      font-size: 10px; font-weight: 600; letter-spacing: 1.5px;
      text-transform: uppercase; color: #444;
      padding: 12px 16px 8px; border-bottom: 1px solid #1a1a1a;
    }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 9px 14px; font-size: 11px; border-bottom: 1px solid #181818; vertical-align: top; }
    tr:last-child td { border-bottom: none; }
    .ph-id { font-weight: 700; color: #f64a01; white-space: nowrap; width: 36px; }
    .ph-time { color: #555; white-space: nowrap; padding-right: 8px; width: 120px; }
    .back { font-size: 11px; color: #444; }
    .back a { color: #f64a01; text-decoration: none; }
    .back a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <header>
    <p class="eyebrow">Dream Planet Referral Campaign</p>
    <h1>SCENE 5 — COMMUNITY &amp; PARTICIPATION</h1>
    <div class="chips">
      <span><strong>13.8 s</strong> source duration</span>
      <span><strong>12.9 s</strong> in master (0.9 s trim)</span>
      <span><strong>1080 × 1920</strong> 9:16</span>
      <span><strong>25 fps</strong> → 30 fps in master</span>
      <span><strong>H.264</strong> CRF 16</span>
      <span><strong>No audio</strong> (master adds score)</span>
    </div>
  </header>

  ${noVideoWarning}

  <div class="shell">
    <div class="notch"></div>
    <div class="screen">
      <video
        src="/review/scene5/video"
        controls
        autoplay
        muted
        playsinline
        preload="auto"
      ></video>
    </div>
    <div class="home-bar"></div>
  </div>

  <div class="phases">
    <div class="phases-title">Phase breakdown</div>
    <table>
      ${phaseRows}
    </table>
  </div>

  <p class="back">← <a href="/review">Back to master review</a></p>
</body>
</html>`;
}

export default router;
