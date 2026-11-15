#!/usr/bin/env node
/**
 * Offline link + anchor checker for the MarketPilot site.
 *
 *   node tools/check-links.mjs
 *
 * Checks every local href/src in every HTML file, verifies the target exists,
 * verifies #fragments resolve to an id (or name) in the target page, validates
 * the documentation search index in assets/site.js, and reports duplicate ids.
 * Exit code 1 on any problem.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const errors = [];
const checkedLinks = new Set();

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "downloads" || entry === "node_modules" || entry === ".git") continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (/\.html?$/i.test(entry)) out.push(full);
  }
  return out;
}

function rel(file) {
  return relative(root, file).split(sep).join("/");
}

function idsOf(file) {
  if (!existsSync(file) || !/\.html?$/i.test(file)) return new Set();
  const html = readFileSync(file, "utf8");
  const ids = new Set();
  for (const match of html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)) ids.add(match[1]);
  for (const match of html.matchAll(/\bname\s*=\s*["']([^"']+)["']/gi)) ids.add(match[1]);
  return ids;
}

function checkDuplicateIds(file) {
  const html = readFileSync(file, "utf8");
  const seen = new Map();
  for (const match of html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)) {
    const id = match[1];
    seen.set(id, (seen.get(id) || 0) + 1);
  }
  for (const [id, count] of seen) {
    if (count > 1) errors.push(`${rel(file)}: duplicate id "${id}" (${count} times)`);
  }
}

function checkTarget(pageFile, raw, attr) {
  if (!raw) return;
  const value = raw.trim();
  if (!value) return;
  if (/^(https?:|mailto:|tel:|data:|javascript:)/i.test(value)) return;
  if (value === "#") return;

  const [rawPath, rawHash] = value.split("#");
  let target;
  if (!rawPath) {
    target = pageFile;
  } else {
    let clean = rawPath.replace(/\?.*$/, "");
    try { clean = decodeURIComponent(clean); } catch { /* keep raw */ }
    target = clean.startsWith("/")
      ? resolve(join(root, clean.slice(1)))
      : resolve(dirname(pageFile), clean);
  }

  if (existsSync(target) && statSync(target).isDirectory()) target = join(target, "index.html");

  if (!target.startsWith(root + sep) && target !== root) {
    errors.push(`${rel(pageFile)}: ${attr} escapes the site root: ${value}`);
    return;
  }
  if (!existsSync(target)) {
    errors.push(`${rel(pageFile)}: ${attr} target missing: ${value}`);
    return;
  }

  checkedLinks.add(`${rel(pageFile)} -> ${rel(target)}${rawHash ? "#" + rawHash : ""}`);

  if (rawHash) {
    let hash = rawHash;
    try { hash = decodeURIComponent(hash); } catch { /* keep raw */ }
    if (!idsOf(target).has(hash)) {
      errors.push(`${rel(pageFile)}: missing anchor #${hash} in ${rel(target)}`);
    }
  }
}

const pages = walk(root).sort();
for (const page of pages) {
  checkDuplicateIds(page);
  const html = readFileSync(page, "utf8");
  for (const match of html.matchAll(/\b(href|src)\s*=\s*["']([^"']+)["']/gi)) {
    checkTarget(page, match[2], match[1]);
  }
}

/* Search index URLs in assets/site.js must point at real pages and anchors. */
const jsFile = join(root, "assets", "site.js");
if (existsSync(jsFile)) {
  const js = readFileSync(jsFile, "utf8");
  const urls = [...js.matchAll(/\burl:\s*["']([^"']+)["']/g)].map((m) => m[1]);
  if (!urls.length) errors.push("assets/site.js: no search index URLs found");
  for (const url of urls) {
    const [pathPart, hash] = url.split("#");
    const target = resolve(join(root, pathPart));
    if (!existsSync(target)) {
      errors.push(`assets/site.js: search target missing: ${url}`);
      continue;
    }
    if (hash && !idsOf(target).has(hash)) {
      errors.push(`assets/site.js: search anchor missing: ${url}`);
    }
  }
  console.log(`Search index: ${urls.length} entries checked.`);
}

/* Every download shown on the site should be present. */
for (const file of [
  "downloads/MarketPilot-1.0.0.msi",
  "downloads/MarketPilot-1.0.0-portable.zip",
  "downloads/SHA256SUMS.txt",
  "assets/dashboard.png",
  "assets/favicon.svg"
]) {
  if (!existsSync(join(root, file))) errors.push(`Required asset missing: ${file}`);
}

console.log(`Checked ${pages.length} HTML files and ${checkedLinks.size} local links.`);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):`);
  for (const error of errors) console.error(`  ✗ ${error}`);
  process.exit(1);
}
console.log("All local links, anchors and search entries resolve.");
