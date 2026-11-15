# MarketPilot website

Static marketing site and documentation for MarketPilot 1.0.0, in English and Arabic,
with the Windows installer and portable build attached.

**Live:** <https://matrixleb.github.io/marketpilot/>
**العربية:** <https://matrixleb.github.io/marketpilot/ar/>

The public repo at <https://github.com/MatrixLeb/marketpilot> contains the site only.
The 96–99 MB downloads are GitHub Release assets, not Git files.

## Preview

```powershell
cd E:\Business\MarketPilot\site
node tools/serve.mjs
```

Open <http://localhost:4173>. No install step and no dependencies.

## Verify

```powershell
node tools/build-ar.mjs
node tools/check-links.mjs
```

The first command rebuilds the Arabic mirror; the second checks local links, anchors,
duplicate ids, both search indexes and the presence of the download files.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Landing page: features, safety model, channels, downloads, FAQ |
| `downloads.html` | Install instructions, requirements, SHA-256 verification |
| `404.html` | Styled not-found page |
| `docs/` | Hub, setup guide, channels, automation, safety, FAQ |
| `ar/` | Generated Arabic mirror of every page (do not hand-edit) |
| `i18n/ar/` | Arabic header, footer and per-page `<main>` fragments |
| `assets/site.css` | Shared dark theme, based on the app's palette |
| `assets/site.js` | Mobile nav, docs search, copy buttons, doc filter |
| `assets/dashboard.png` | Real screenshot of the packaged app |
| `downloads/` | EXE, MSI, portable ZIP and `SHA256SUMS.txt` |
| `tools/serve.mjs` | Dependency-free preview server with Range support |
| `tools/check-links.mjs` | Offline link checker |
| `tools/build-ar.mjs` | Renders `ar/` from `i18n/ar/` |

## Editing notes

- The site is plain HTML. There is no templating, so shared header/footer markup is
  duplicated per page. Keep navigation in sync when adding a page.
- Arabic pages are the exception: edit `i18n/ar/pages/*.main.html`, the shared
  `i18n/ar/header.html` / `footer.html`, or the metadata in `tools/build-ar.mjs`, then run
  `node tools/build-ar.mjs`. Never hand-edit `site/ar/`.
- Documentation pages set `<body data-root="../">` so the search index can resolve
  links from either the root, `docs/` or `ar/`. Root pages use `data-root=""`.
- Search entries live in `searchIndexEn` in `assets/site.js`; Arabic copy lives in
  `searchIndexAr`, keyed by the same URLs. Add both when you add a section, and keep each
  `url` anchored to a real `id`.
- Code blocks get a copy button automatically; buttons with `data-copy="…"` copy their
  own value. Labels switch to Arabic on `lang="ar"` pages.
- The theme uses the app's colours: Ink `#0A100E`, Mint `#45E0B0`, Amber `#FFC24B`,
  text `#E9F2ED`, muted `#93A69D`. `html[dir="rtl"]` overrides mirror the layout, while
  code, paths and hashes stay LTR.
- Keep claims accurate to the build. The website documents 1.0.0, including its
  limitations: text-only Facebook/LinkedIn/X connectors, Instagram's public image URL
  requirement, WhatsApp templates, Manual TikTok bundles, per-install credentials and
  the unsigned installers.

## Publishing

See [DEPLOY.md](DEPLOY.md) for hosting options, large-file limits, MIME types, cache
rules, hash-update steps and the post-deploy checklist.

The short version: run `node tools/build-ar.mjs`, mirror the folder into `publish`
(excluding `i18n/` and the binaries), and host the three ~96–99 MB downloads on a
service that allows files that large (GitHub Releases, S3/R2, or a VPS).

## Download integrity

```text
c2cfd3f339929ffe336ece38bd49193ca524159e772c236ef67aaf9b47137c4c  MarketPilot-1.0.0.exe
704de36c21336839f6f85e6ef43d3b603dff68899840be2c454cc384474b998e  MarketPilot-1.0.0.msi
7d3e285f6017caac320d96ee79727566ed49be6cccbaa3d3dc178b6d992fb7c5  MarketPilot-1.0.0-portable.zip
```

Recompute these whenever the binaries are rebuilt.
