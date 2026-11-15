# MarketPilot website

Static marketing site and documentation for MarketPilot 1.0.0, with the Windows
installer and portable build attached.

## Preview

```powershell
cd E:\Business\MarketPilot\site
node tools/serve.mjs
```

Open <http://localhost:4173>. No install step and no dependencies.

## Verify

```powershell
node tools/check-links.mjs
```

Checks local links, anchors, duplicate ids, the documentation search index and the
presence of the download files.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Landing page: features, safety model, channels, downloads, FAQ |
| `downloads.html` | Install instructions, requirements, SHA-256 verification |
| `404.html` | Styled not-found page |
| `docs/` | Hub, setup guide, channels, automation, safety, FAQ |
| `assets/site.css` | Shared dark theme, based on the app's palette |
| `assets/site.js` | Mobile nav, docs search, copy buttons, doc filter |
| `assets/dashboard.png` | Real screenshot of the packaged app |
| `downloads/` | MSI, portable ZIP and `SHA256SUMS.txt` |
| `tools/serve.mjs` | Dependency-free preview server with Range support |
| `tools/check-links.mjs` | Offline link checker |

## Editing notes

- The site is plain HTML. There is no templating, so shared header/footer markup is
  duplicated per page. Keep navigation in sync when adding a page.
- Documentation pages set `<body data-root="../">` so the search index can resolve
  links from either the root or `docs/`. Root pages use `data-root=""`.
- Search entries live in the `searchIndex` array in `assets/site.js`. Add an entry when
  you add a section, and keep the `url` anchored to a real `id`.
- Code blocks get a copy button automatically; buttons with `data-copy="…"` copy their
  own value.
- The theme uses the app's colours: Ink `#0A100E`, Mint `#45E0B0`, Amber `#FFC24B`,
  text `#E9F2ED`, muted `#93A69D`.
- Keep claims accurate to the build. The website documents 1.0.0, including its
  limitations: text-only Facebook/LinkedIn/X connectors, Instagram's public image URL
  requirement, WhatsApp templates, Manual TikTok bundles, per-install credentials and
  the unsigned MSI.

## Publishing

See [DEPLOY.md](DEPLOY.md) for hosting options, large-file limits, MIME types, cache
rules, hash-update steps and the post-deploy checklist.

The short version: upload the folder, but host the two ~96–98 MB downloads on a service
that allows files that large (GitHub Releases, S3/R2, or a VPS), then point the download
links at them.

## Download integrity

```text
704de36c21336839f6f85e6ef43d3b603dff68899840be2c454cc384474b998e  MarketPilot-1.0.0.msi
7d3e285f6017caac320d96ee79727566ed49be6cccbaa3d3dc178b6d992fb7c5  MarketPilot-1.0.0-portable.zip
```

Recompute these whenever the binaries are rebuilt.
