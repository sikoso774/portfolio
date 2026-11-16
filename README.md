# Zoléni Kokolo Zassi — Portfolio

Personal portfolio website built with [Astro](https://astro.build), deployed on GitHub Pages with a custom domain.

🌐 **Live:** [zolenikokolo.com](https://zolenikokolo.com)

---

## Tech Stack

- **[Astro](https://astro.build)** — static site generator
- **Vanilla CSS** — custom design, no utility framework
- **Vanilla JavaScript** — scroll effects, animations, mobile menu
- **GitHub Pages** — hosting with custom domain (`CNAME`)

---

## Project Structure

```
.github/workflows/          # CI (ci.yml) and GitHub Pages deploy (deploy.yml)
frontend/                   # The Astro app: run every npm command from here
├── astro.config.mjs
├── package.json
├── src/
│   ├── layouts/Layout.astro    # Base layout: <head>, SEO meta, fonts
│   ├── components/             # Header, Hero, About, Projects, Footer…
│   ├── pages/                  # One file per route (EN at /, FR under /fr/)
│   ├── i18n/                   # en.ts / fr.ts dictionaries
│   ├── content/blog/{en,fr}/   # Markdown articles
│   ├── styles/global.css       # Shared styles (CSS variables in :root)
│   └── scripts/main.js         # Scroll, mobile menu, animations
├── public/                     # Copied as-is: CNAME, robots.txt, favicons, assets/
├── scripts/                    # generate-og.mjs
└── tests/                      # Vitest
```

---

## Getting Started

```bash
cd frontend
npm install
npm run dev       # Dev server at localhost:4321
npm run build     # Static build → dist/
npm run preview   # Preview the build locally
```

---

## Customization

### Theme colors

All colors are CSS variables in `frontend/src/styles/global.css`:

```css
:root {
  --clr-accent: #10b981; /* main green */
  --clr-accent-dark: #059669; /* hover/gradient green */
  --clr-bg-start: #064e3b; /* left side of background gradient */
}
```

### Content

Each section is an independent component in `frontend/src/components/`. Edit the relevant `.astro` file to update content.

### SEO / meta

Default title and description are defined as props in `frontend/src/layouts/Layout.astro`. Override them per page by passing props to `<Layout>`.

---

## Deployment

Pushing to `master` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`), which builds with the official [Astro GitHub Pages action](https://github.com/withastro/action) and deploys to Pages.

---

## Branches

| Branch   | Role                      |
| -------- | ------------------------- |
| `master` | Production (GitHub Pages) |
| `dev`    | Active development        |

---

© 2026 Zoléni Kokolo Zassi. All rights reserved.
