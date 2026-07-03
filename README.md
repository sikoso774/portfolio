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
src/
├── layouts/
│   └── Layout.astro        # Base layout: <head>, SEO meta, fonts
├── components/
│   ├── Header.astro
│   ├── Hero.astro
│   ├── About.astro
│   ├── Skills.astro
│   ├── Experience.astro
│   ├── Projects.astro
│   ├── Languages.astro
│   └── Footer.astro
├── pages/
│   └── index.astro         # Assembles all components
├── styles/
│   └── global.css          # All styles (CSS variables in :root)
└── scripts/
    └── main.js             # Scroll, mobile menu, animations

public/
├── assets/
│   ├── img/                # Profile photo
│   ├── docs/               # CV PDF
│   └── svg/                # Tech icons (Matplotlib, Waydroid…)
├── favicon.svg
├── sitemap.xml
├── robots.txt
└── CNAME                   # Custom domain
```

---

## Getting Started

```bash
npm install
npm run dev       # Dev server at localhost:4321
npm run build     # Static build → dist/
npm run preview   # Preview the build locally
```

---

## Customization

### Theme colors

All colors are CSS variables in `src/styles/global.css`:

```css
:root {
  --clr-accent: #10b981; /* main green */
  --clr-accent-dark: #059669; /* hover/gradient green */
  --clr-bg-start: #064e3b; /* left side of background gradient */
}
```

### Content

Each section is an independent component in `src/components/`. Edit the relevant `.astro` file to update content.

### SEO / meta

Default title and description are defined as props in `src/layouts/Layout.astro`. Override them per page by passing props to `<Layout>`.

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
