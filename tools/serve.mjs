#!/usr/bin/env node
/**
 * Local preview server for the MarketPilot site.
 *
 *   node tools/serve.mjs            → http://localhost:4173
 *   node tools/serve.mjs 8080       → custom port
 *
 * No dependencies. Supports Range requests so the ~100 MB downloads can be
 * resumed, and serves index.html for directory URLs.
 */
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const port = Number(process.argv[2] || process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".msi": "application/x-msi",
  ".zip": "application/zip",
  ".mp4": "video/mp4"
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const clean = normalize(decoded).replace(/^([/\\])+/, "");
  const full = resolve(join(root, clean));
  if (full !== root && !full.startsWith(root + sep)) return null;
  return full;
}

function contentType(file) {
  return types[extname(file).toLowerCase()] || "application/octet-stream";
}

const server = createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" });
    res.end("Method not allowed");
    return;
  }

  let file = safePath(req.url || "/");
  if (!file) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (existsSync(file) && statSync(file).isDirectory()) {
    file = join(file, "index.html");
  }

  if (!existsSync(file) || !statSync(file).isFile()) {
    const notFound = join(root, "404.html");
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    if (existsSync(notFound)) createReadStream(notFound).pipe(res);
    else res.end("Not found");
    return;
  }

  const stat = statSync(file);
  const type = contentType(file);
  const isDownload = /\.(msi|zip)$/i.test(file);
  const headers = {
    "Content-Type": type,
    "Accept-Ranges": "bytes",
    "Cache-Control": isDownload ? "public, max-age=3600" : "no-cache",
    "X-Content-Type-Options": "nosniff"
  };

  const range = req.headers.range;
  if (range && /^bytes=\d*-\d*$/.test(range)) {
    const [startRaw, endRaw] = range.replace("bytes=", "").split("-");
    let start = startRaw ? Number(startRaw) : 0;
    let end = endRaw ? Number(endRaw) : stat.size - 1;
    if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= stat.size) {
      res.writeHead(416, { "Content-Range": `bytes */${stat.size}` });
      res.end();
      return;
    }
    end = Math.min(end, stat.size - 1);
    headers["Content-Range"] = `bytes ${start}-${end}/${stat.size}`;
    headers["Content-Length"] = String(end - start + 1);
    res.writeHead(206, headers);
    if (req.method === "HEAD") res.end();
    else createReadStream(file, { start, end }).pipe(res);
    return;
  }

  headers["Content-Length"] = String(stat.size);
  res.writeHead(200, headers);
  if (req.method === "HEAD") res.end();
  else createReadStream(file).pipe(res);
});

server.listen(port, () => {
  console.log(`MarketPilot site: http://localhost:${port}`);
  console.log(`Serving: ${root}`);
});
