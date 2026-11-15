# Deploying the MarketPilot site

The site is plain HTML, CSS and JavaScript. There is no build step, no framework, no
package manager and no external font or analytics request. Upload the folder and it
works.

## Live deployment

| Item | Value |
| --- | --- |
| Site | <https://matrixleb.github.io/marketpilot/> |
| Repository | <https://github.com/MatrixLeb/marketpilot> |
| Pages source | `main` branch, repository root, legacy build |
| Download host | GitHub Release `v1.0.0` (2 GiB per asset) |

The published repository contains the site only. The MSI and ZIP stay out of Git and
are attached to the release; the download buttons on the site point straight at the
release asset URLs. To publish an update:

```powershell
cd E:\Business\MarketPilot\publish
git add -A
git commit -m "Update site"
git push
```

A push to `main` rebuilds the Pages site automatically. Update the release assets and
`SHA256SUMS.txt` separately with `gh release upload v1.0.0 <files> --clobber`.

## Folder map

```
site/
  index.html                 landing page
  downloads.html             install, requirements, checksums
  404.html                   not-found page
  docs/
    index.html               documentation hub + filter
    guide.html               setup guide A–Z
    channels.html            every credential field
    automation.html          cadences, CLI, Task Scheduler, data
    safety.html              defaults, guard rails, compliance
    faq.html                 troubleshooting, limits, questions
  assets/
    site.css                 shared theme (matches the app palette)
    site.js                  nav, search, copy buttons, doc filter
    favicon.svg
    dashboard.png            real app screenshot
  downloads/
    MarketPilot-1.0.0.msi
    MarketPilot-1.0.0-portable.zip
    SHA256SUMS.txt
  tools/
    serve.mjs                local preview with Range support
    check-links.mjs          offline link/anchor/search validation
  README.md                  editing notes
  DEPLOY.md                  this file
```

## Preview locally

```powershell
cd E:\Business\MarketPilot\site
node tools/serve.mjs
# http://localhost:4173
```

`serve.mjs` supports `HEAD` and single-range `Range` requests, which matters for the
~100 MB downloads. It serves `404.html` for missing paths.

Validate everything before uploading:

```powershell
node tools/check-links.mjs
```

It checks every local `href`/`src`, every `#anchor`, the 32-entry documentation
search index in `assets/site.js`, duplicate ids, and the presence of the download
files.

## Hosting options

Because the site is static, any of these work:

| Host | Notes |
| --- | --- |
| **GitHub Pages** | Upload the folder to a repository and enable Pages. Published sites have a 1 GB soft limit; GitHub blocks individual Git files over 100 MiB. |
| **Cloudflare Pages** | Drop the folder in the dashboard or connect a repo. **25 MiB per-file limit** — the two downloads are ~96–98 MB, so host them elsewhere (see below). |
| **Netlify / Vercel** | Static deploy works; check the plan's per-file limit before uploading the binaries. |
| **IIS / Apache / Nginx** | Copy the folder to the web root. Set MIME types and enable range requests. |
| **Object storage + CDN** | S3, R2 or Backblaze for the downloads; the HTML can live anywhere. |

### Downloads are larger than most static hosts allow

| File | Size |
| --- | --- |
| `MarketPilot-1.0.0.msi` | 102,445,552 bytes (97.7 MB) |
| `MarketPilot-1.0.0-portable.zip` | 101,026,920 bytes (96.3 MB) |

Recommended pattern:

1. Publish the HTML/CSS/JS on the static host.
2. Upload the MSI and ZIP to **GitHub Releases**, S3/R2, or another download host that
   supports large files and range requests.
3. Replace the two `href` values in `index.html` and `downloads.html` with the hosted
   URLs. Keep `SHA256SUMS.txt` on the site and keep the hash values in sync.

PowerShell replacement example:

```powershell
$site = "E:\Business\MarketPilot\site"
$base = "https://downloads.example.com/marketpilot"

(Get-Content "$site\index.html" -Raw) `
  -replace 'href="downloads/MarketPilot-1\.0\.0\.msi"', "href=`"$base/MarketPilot-1.0.0.msi`"" `
  -replace 'href="downloads/MarketPilot-1\.0\.0-portable\.zip"', "href=`"$base/MarketPilot-1.0.0-portable.zip`"" `
  | Set-Content "$site\index.html" -NoNewline

(Get-Content "$site\downloads.html" -Raw) `
  -replace 'href="downloads/MarketPilot-1\.0\.0\.msi"', "href=`"$base/MarketPilot-1.0.0.msi`"" `
  -replace 'href="downloads/MarketPilot-1\.0\.0-portable\.zip"', "href=`"$base/MarketPilot-1.0.0-portable.zip`"" `
  | Set-Content "$site\downloads.html" -NoNewline
```

Remove the `download` attribute if the file is served from another origin and you want
the browser to navigate instead of downloading; cross-origin `download` is often
ignored. Keep the direct link either way.

## MIME types and caching

If you control the server, add:

```nginx
types {
  application/x-msi  msi;
  application/zip    zip;
}

location ~* \.(msi|zip)$ {
  add_header Accept-Ranges bytes;
  expires 1h;
}
```

For IIS, add `.msi` → `application/x-msi` and `.zip` → `application/zip` in MIME Types.
For Apache, use `AddType application/x-msi .msi`.

HTML should be served with a short cache (`no-cache` or a few minutes) so docs updates
appear. Assets can be cached for an hour; this site does not use content hashes in file
names.

## Custom domain and HTTPS

Any static host can attach a domain. Use HTTPS: the download is unsigned, and an HTTPS
page at least confirms the file came from the site you intended to visit. After pointing
DNS, test:

```powershell
curl.exe -I https://your-domain.example/
curl.exe -I https://your-domain.example/downloads/MarketPilot-1.0.0.msi
curl.exe -I -H "Range: bytes=0-1023" https://your-domain.example/downloads/MarketPilot-1.0.0.msi
```

The last command should return `206 Partial Content` and `Content-Range`. If it returns
`200`, the host ignores ranges; downloads still work but cannot resume.

## Publishing a new app version

1. Build the MSI and portable folder from the app project.
2. Replace `site/downloads/MarketPilot-<version>.msi`.
3. Recreate the portable ZIP from `build\compose\binaries\main\app\MarketPilot`:

   ```powershell
   Add-Type -AssemblyName System.IO.Compression.FileSystem
   [System.IO.Compression.ZipFile]::CreateFromDirectory(
     'E:\Business\MarketPilot\build\compose\binaries\main\app\MarketPilot',
     'E:\Business\MarketPilot\site\downloads\MarketPilot-<version>-portable.zip',
     [System.IO.Compression.CompressionLevel]::Optimal,
     $true)
   ```

4. Recompute hashes and update **all** of these:

   ```powershell
   Get-FileHash .\downloads\MarketPilot-<version>.msi -Algorithm SHA256
   Get-FileHash .\downloads\MarketPilot-<version>-portable.zip -Algorithm SHA256
   ```

   - `downloads/SHA256SUMS.txt`
   - `index.html` — file names, sizes, both hash strings and their `data-copy` values
   - `downloads.html` — file names, byte counts, sizes, both hashes and `data-copy`
   - any version label (`v1.0.0`, “Version 1.0.0”) if the version changed

5. Update docs where behaviour changed, and the `searchIndex` in `assets/site.js` if
   sections moved.
6. Run `node tools/check-links.mjs` and preview the affected pages.
7. Re-verify the downloaded file:

   ```powershell
   (Get-FileHash .\MarketPilot-<version>.msi -Algorithm SHA256).Hash.ToLower()
   ```

## Security and privacy

- **Never upload app data.** Do not copy `%APPDATA%\MarketPilot\data`,
  `settings.properties`, `workspace.json`, `media` or `outbox` into the site.
- **Review the screenshot.** `assets/dashboard.png` is a real capture. If you replace it,
  make sure it contains no customer names, emails, tokens or unpublished offers.
- **No trackers.** The site makes no third-party requests. Keep it that way unless you add
  a privacy notice.
- **Unsigned binary.** The download docs already explain SmartScreen. Consider signing
  future installers; if you do, update the security wording on the downloads page.

## Post-deploy checklist

- [ ] `/`, `/downloads.html` and all six docs pages return 200.
- [ ] A bad URL returns the styled 404 page.
- [ ] Mobile nav opens and closes; docs chips scroll on a phone.
- [ ] Search (`/` or the header button) finds “Instagram”, “dry run” and “backup”.
- [ ] Both download links serve the full files and the hashes match.
- [ ] `SHA256SUMS.txt` matches the copies on the site.
- [ ] No local file paths such as `E:\Business` appear in published docs.
- [ ] HTTPS works and the domain serves the favicon.
