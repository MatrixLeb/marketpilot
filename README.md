# MarketPilot website

Static marketing site and documentation for MarketPilot 1.1.0, in English and Arabic,
with pricing and licence plans, plus the Windows installer and portable build attached.

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
node tools/build-pricing.mjs
node tools/build-ar.mjs
node tools/check-links.mjs
```

The first command regenerates the plan cards from `site.config.json`, the second rebuilds
the Arabic mirror, and the third checks local links, anchors, duplicate ids, both search
indexes and the presence of the download files.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Landing page: features, safety model, channels, downloads, FAQ |
| `pricing.html` | Three paid plans, trial explanation, licence FAQ, WhatsApp buy buttons |
| `site.config.json` | Prices and the WhatsApp order number (source for the plan cards) |
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
| `tools/build-pricing.mjs` | Injects the plan cards from `site.config.json` into four files |

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
- Prices exist twice: `site.config.json` for the website and the `Plan` enum in the app's
  `licensing/Licensing.kt`. Change both, then run `node tools/build-pricing.mjs`. Never
  put the signing key in this folder; only the public key ships in the app.
- Keep claims accurate to the build. The website documents 1.1.0, including its
  limitations: text-only Facebook/LinkedIn/X connectors, Instagram's public image URL
  requirement, WhatsApp templates, Manual TikTok bundles, per-install credentials and
  the unsigned installers.

## Publishing

See [DEPLOY.md](DEPLOY.md) for hosting options, large-file limits, MIME types, cache
rules, hash-update steps and the post-deploy checklist.

The short version: run `node tools/build-pricing.mjs` and `node tools/build-ar.mjs`, mirror
the folder into `publish` (excluding `i18n/` and the binaries), and host the three
~96–99 MB downloads on a service that allows files that large (GitHub Releases, S3/R2, or
a VPS).

## Download integrity

```text
4b9eaea625e30ab10448eff79b3bd4733f9b889f748d506454440c418ef84e82  MarketPilot-1.1.0.exe
1aa337eb811f9569a8195ca4f7e902be65baf2c42cfcf7e548d02f8139505577  MarketPilot-1.1.0.msi
6a3e0455933e6494de2990e4bb003feb67de6280e5db5588a4eb0399a2c489d8  MarketPilot-1.1.0-portable.zip
```

Recompute these whenever the binaries are rebuilt.
