import { createServer } from "node:http";
import { createReadStream, statSync, readFileSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = fileURLToPath(new URL(".", import.meta.url));
const PORT = 5000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".mp4":  "video/mp4",
  ".jpg":  "image/jpeg",
  ".png":  "image/png",
};

createServer((req, res) => {
  const url = req.url === "/" ? "/index.html" : req.url;
  const filePath = join(DIR, url.split("?")[0]);

  let stat;
  try { stat = statSync(filePath); } catch {
    res.writeHead(404); res.end("Not found"); return;
  }

  const ext = extname(filePath).toLowerCase();
  const contentType = MIME[ext] ?? "application/octet-stream";
  const fileSize = stat.size;
  const rangeHeader = req.headers.range;

  res.setHeader("Content-Type", contentType);
  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (ext === ".mp4" && rangeHeader) {
    const [startStr, endStr] = rangeHeader.replace(/bytes=/, "").split("-");
    const start = parseInt(startStr, 10);
    const end   = endStr ? parseInt(endStr, 10) : fileSize - 1;
    res.writeHead(206, {
      "Content-Range":  `bytes ${start}-${end}/${fileSize}`,
      "Content-Length": end - start + 1,
    });
    createReadStream(filePath, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { "Content-Length": fileSize });
    createReadStream(filePath).pipe(res);
  }
}).listen(PORT, "0.0.0.0", () => {
  console.log(`Scene 5 player: http://0.0.0.0:${PORT}`);
});
