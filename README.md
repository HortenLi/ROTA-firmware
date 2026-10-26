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
