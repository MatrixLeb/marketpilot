// One-off: add the English→Arabic language switch to every English page header.
// Usage: node tools/add-lang-switch.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");

const pages = [
  ["index.html", "ar/index.html"],
  ["downloads.html", "ar/downloads.html"],
  ["404.html", "ar/index.html"],
  ["docs/index.html", "../ar/index.html"],
  ["docs/guide.html", "../ar/docs/guide.html"],
  ["docs/channels.html", "../ar/docs/channels.html"],
  ["docs/automation.html", "../ar/docs/automation.html"],
  ["docs/safety.html", "../ar/docs/safety.html"],
  ["docs/faq.html", "../ar/docs/faq.html"]
];

const marker = '<div class="header-actions">';

for (const [file, href] of pages) {
  const path = join(root, file);
  let html = readFileSync(path, "utf8");
  if (html.includes('class="lang-switch"')) {
    console.log(`skip ${file}: already has a language switch`);
    continue;
  }
  const count = html.split(marker).length - 1;
  if (count !== 1) {
    console.log(`skip ${file}: found ${count} header-actions markers`);
    continue;
  }
  const link = `${marker}\n        <a class="lang-switch" href="${href}" hreflang="ar" lang="ar" aria-label="Switch to Arabic">العربية</a>`;
  html = html.replace(marker, link);
  writeFileSync(path, html);
  console.log(`updated ${file} -> ${href}`);
}
