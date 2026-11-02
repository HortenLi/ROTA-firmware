# ROTA-firmware

The home of **ROTA Film Roller Processor** — firmware releases, updates, and project documentation.

Official website: **https://hortenli.github.io/ROTA-firmware/**

The website is built with React + Vite and ships with full interface translations:

- **English** (default)
- **简体中文** (Simplified Chinese)
- **繁體中文** (Traditional Chinese, Hong Kong terminology)

Language preference is stored in `localStorage`; browser language is used as a fallback for first-time visitors only. The switcher never reloads the page and preserves the current section.

## Firmware releases

Firmware packages are published under [Releases](https://github.com/HortenLi/ROTA-firmware/releases). The website lists releases automatically via the GitHub API, including download assets and release notes (notes are shown in their original language).

## Android app releases (auto-update)

The ROTA Link app updates itself from this repository — no app store, and no
GitHub API (unauthenticated quota is 60 requests/hour per IP, which a phone
behind carrier NAT can burn through by doing nothing).

Everything lives in `public/releases/`, served from
`https://hortenli.github.io/ROTA-firmware/releases/`:

| file | role |
|---|---|
| `latest.json` | the manifest the app reads (`AppUpdater.kt`) |
| `ROTA-Link-v<version>.apk` | the current build — exactly one, replaced on each release |

Publishing a build:

```bash
node scripts/publish_release.mjs ../7B0/rotaLink/ROTA-Link-v0.16.32.apk 0.16.32 71 notes.json
git add public/releases && git commit -m "release(app): v0.16.32" && git push
```

`notes.json` is optional and carries the update-dialog copy in three languages
(`{"en": "...", "zh-CN": "...", "zh-TW": "..."}`). Older builds are not kept
here — they belong under [Releases](https://github.com/HortenLi/ROTA-firmware/releases)
as tagged assets (`app-v*` tags; `Firmware.tsx` filters them out of the firmware list).

Attaching the APK to the release is done on the runner, not locally — this machine's
uplink cannot push 36 MB without resetting (see `.github/workflows/release-apk.yml`):

```bash
gh api -X POST repos/HortenLi/ROTA-firmware/actions/workflows/release-apk.yml/dispatches \
  -f ref=main -f 'inputs[tag]=app-v0.16.32'
```

The app compares `versionCode` (never the version string) against its own
`BuildConfig.VERSION_CODE`, downloads over HTTPS, verifies the `sha256` from the
manifest, and hands the file to the system installer. It checks once at launch;
after that only Settings → CHECK FOR UPDATES triggers a request.

## Website development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # serve the production build locally
```

The site is deployed to GitHub Pages by `.github/workflows/deploy-pages.yml` on every push to `main` that touches site files.

### Typography

- Latin display: **Jost** (self-hosted, latin subset, ~25 KB per weight)
- Latin interface: **IBM Plex Sans** (self-hosted, latin subset)
- Chinese: system font stacks (Noto Sans SC/TC, PingFang SC/TC, Microsoft YaHei/JhengHei) — no CJK webfont is downloaded, keeping first load fast.

Product specifications shown on the site live in `src/i18n/locales/*.json` (all interface text) — update them there.
