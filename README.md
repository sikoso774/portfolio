<div align="center">
<img src="./frontend/public/assets/images/og-image.png" alt="Zoléni Kokolo Zassi — Portfolio" width="1200">
</div>
<br>

<h1 align="center">Zoléni Kokolo Zassi — Portfolio</h1>

<p align="center">
  A bilingual (EN / FR) static portfolio, a learning journal and a contact form,<br />
  built with Astro and served through Cloudflare.
</p>

<p align="center">
  <a href="https://zolenikokolo.com"><b>zolenikokolo.com</b></a> ·
  <a href="https://zolenikokolo.com/fr/">version française</a> ·
  <a href="https://zolenikokolo.com/blog/">blog</a>
</p>

<div align="center">
  <p>
    <a href="https://zolenikokolo.com"><img src="https://img.shields.io/badge/Live-zolenikokolo.com-10b981" alt="Live site"></a>
    <a href="https://github.com/sikoso774/portfolio/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/sikoso774/portfolio/ci.yml?branch=dev&label=CI" alt="CI"></a>
    <img src="https://img.shields.io/github/last-commit/sikoso774/portfolio/dev?color=78B4FF" alt="Last commit">
    <img src="https://img.shields.io/badge/Astro-7-7c3aed?logo=astro&logoColor=white" alt="Astro 7">
    <img src="https://img.shields.io/badge/Node-24-047857?logo=nodedotjs&logoColor=white" alt="Node 24">
    <img src="https://img.shields.io/badge/Tests-Vitest-6e9f18?logo=vitest&logoColor=white" alt="Vitest">
    <img src="https://img.shields.io/badge/i18n-EN%20%7C%20FR-0e131f" alt="Languages">
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-All%20rights%20reserved-A31F34" alt="License"></a>
  </p>
</div>

---

## At a glance

|                |                                                                |
| -------------- | -------------------------------------------------------------- |
| **What**       | Personal site: about, skills, experience, projects, blog, contact |
| **Languages**  | English at `/`, French at `/fr/`, one page file per route      |
| **Rendering**  | 100 % static (Astro), no framework runtime in the browser      |
| **Hosting**    | GitHub Pages behind Cloudflare, custom domain                  |
| **Form**       | Cloudflare Worker + Resend, same origin as the site            |
| **Quality**    | Prettier check, Vitest (real build), CI on every push to `dev` |

## How a request travels

```mermaid
flowchart LR
    V([Visitor]) --> CF[Cloudflare<br/>proxy + security headers]
    CF -->|pages, assets| GP[(GitHub Pages)]
    CF -->|POST /api/contact| W[Worker<br/>validate · rate-limit · honeypot]
    W --> R[Resend]
    R --> M([Inbox])
```

## How a change ships

```mermaid
flowchart LR
    D[dev branch] -->|push| CI{CI<br/>format · tests · build}
    CI -->|green| PR[Pull request → main]
    PR -->|merge| DP[deploy.yml]
    DP --> GP[(GitHub Pages)]
```

Work happens on `dev`. `main` is production: every push to it deploys, so it only ever
receives merged pull requests.

## Quick start

```bash
git clone https://github.com/sikoso774/portfolio.git
cd portfolio/frontend      # the Astro app lives here
npm install
npm run dev                # http://localhost:4321/
```

<details>
<summary><b>All commands</b></summary>

| Command                | What it does                                       |
| ---------------------- | -------------------------------------------------- |
| `npm run dev`          | Dev server on port 4321                            |
| `npm run build`        | Production build into `dist/`, plus the sitemap    |
| `npm run preview`      | Serve the build locally                            |
| `npm test`             | Vitest suite (builds the site, about 10 s)         |
| `npm run format`       | Prettier, write mode                               |
| `npm run format:check` | Prettier, check only (what CI runs)                |

</details>

<details>
<summary><b>Project structure</b></summary>

```text
.github/workflows/        ci.yml · deploy.yml
frontend/
├── src/
│   ├── pages/[...locale]/   every route, served in en and fr
│   ├── content/blog/{en,fr}/  Markdown articles, same slug in both
│   ├── i18n/                en.ts · fr.ts · blog.ts
│   ├── components/          Header, Hero, Footer, section previews
│   ├── layouts/Layout.astro head: SEO, Open Graph, JSON-LD, hreflang
│   ├── styles/global.css    :root variables and shared styles
│   └── scripts/main.js      scroll, mobile menu, animations
├── worker/                  Cloudflare Worker for the contact form
├── public/                  CNAME, robots.txt, favicons, assets/
├── scripts/                 generate-og.mjs (social card)
└── tests/                   blog · i18n · nav · seo · contact · hygiene
```

</details>

<details>
<summary><b>Design principles</b></summary>

- **No hardcoded colours.** Everything goes through `--clr-*` variables in `:root`;
  the light theme redefines the same variables.
- **No text in components.** Strings live in `src/i18n/{en,fr}.ts`; a missing key fails
  TypeScript and `tests/i18n.test.js`.
- **Trailing slash everywhere.** `trailingSlash: "always"`, canonicals and sitemap included.
- **No third-party scripts.** The font is self-hosted, the CSP is served by Cloudflare.

</details>

<details>
<summary><b>Contact form</b></summary>

The site is static, so the Resend API key cannot live in the page. The Worker receives
`POST /api/contact`, checks the origin, validates the fields, applies a per-IP rate limit,
silently drops submissions that fill the honeypot field, then sends the message through Resend.
It never logs message content. Full details in [`frontend/worker/README.md`](frontend/worker/README.md).

</details>

---

<p align="center">
  <sub>Copyright © 2026 Zoléni Kokolo Zassi. All rights reserved — see <a href="LICENSE">LICENSE</a>.</sub>
</p>
