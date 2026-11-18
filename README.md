<div align="center">

```text
┌──────────────────────────────────────────┐
│ zoleni@portfolio:~$ ./build --lang=en,fr  │
└──────────────────────────────────────────┘
```

**Bilingual static portfolio. Astro, vanilla CSS, no framework runtime.**

[![Live](https://img.shields.io/badge/live-zolenikokolo.com-10b981?style=flat-square&labelColor=064e3b)](https://zolenikokolo.com)
[![CI](https://img.shields.io/github/actions/workflow/status/Sikoso774/Portofolio/ci.yml?branch=dev&style=flat-square&label=ci&labelColor=064e3b&color=10b981)](https://github.com/Sikoso774/Portofolio/actions/workflows/ci.yml)
[![Astro](https://img.shields.io/badge/astro-7-10b981?style=flat-square&labelColor=064e3b&logo=astro&logoColor=white)](https://astro.build)
[![License](https://img.shields.io/badge/license-all%20rights%20reserved-10b981?style=flat-square&labelColor=064e3b)](LICENSE)

</div>

```console
$ whoami
zoleni kokolo zassi

$ cat about.txt
Student in IT, Linux and infrastructure on the side.
This repo is the source of my personal site: EN at /, FR at /fr/,
a learning journal (blog) and a contact form backed by a Cloudflare Worker.

$ open https://zolenikokolo.com
```

---

```console
$ cat stack.txt
astro       static site generator, content collections, i18n routing
css         vanilla, scoped per component, themed through :root variables
javascript  vanilla (scroll, menu, reveal animations), no framework
cloudflare  proxy + security headers (CSP) + Worker for the form
resend      transactional e-mail behind the contact form
github      Pages hosting, Actions CI/CD, Dependabot
vitest      tests that really build the site (SEO, i18n, blog, nav)
```

## Run it

```console
$ git clone https://github.com/Sikoso774/Portofolio.git
$ cd Portofolio/frontend        # the Astro app lives here
$ npm install
$ npm run dev                   # http://localhost:4321/
```

```console
$ npm run build                 # production build -> dist/ (+ sitemap)
$ npm run preview               # serve the build locally
$ npm test                      # Vitest, ~10 s (it builds the site)
$ npm run format                # Prettier; format:check is what CI runs
```

Requires Node 24, the version used by the CI.

## Map

```console
$ tree -L 3 --dirsfirst
.
├── .github/workflows/     ci.yml (dev, PRs) · deploy.yml (main -> Pages)
└── frontend/
    ├── src/
    │   ├── pages/[...locale]/   every route, served at / (en) and /fr/
    │   ├── content/blog/{en,fr}/  Markdown articles, same slug in both
    │   ├── i18n/                en.ts · fr.ts · blog.ts
    │   ├── components/          Header, Hero, Footer, previews...
    │   ├── layouts/Layout.astro <head>: SEO, Open Graph, JSON-LD, hreflang
    │   ├── styles/global.css    :root variables + shared styles
    │   └── scripts/main.js      scroll, mobile menu, animations
    ├── worker/                  Cloudflare Worker: POST /api/contact
    ├── public/                  CNAME, robots.txt, favicons, assets/
    ├── scripts/                 generate-og.mjs (social card)
    └── tests/                   blog · i18n · nav · seo · contact · hygiene
```

## How it fits together

```console
$ cat architecture.txt
 dev ──push──► GitHub ──Actions──► Pages ──► Cloudflare ──► zolenikokolo.com
                 │                                │
                 └── CI: format · tests · build   ├── security headers (Transform Rule)
                                                  └── /api/contact ──► Worker ──► Resend ──► inbox
```

- **i18n**: English at the root, French under `/fr/`. Every string lives in `src/i18n/{en,fr}.ts`;
  TypeScript and `tests/i18n.test.js` fail on a missing key.
- **Contact form**: the site is static, so the API key can't live in the page. The Worker validates
  the message, rate-limits by IP, drops bots through a honeypot field, then sends it via Resend.
  Details in [`frontend/worker/README.md`](frontend/worker/README.md).
- **SEO**: canonical + hreflang, JSON-LD graph, RSS per language, sitemap generated at build time.
- **Security**: CSP and security headers served by Cloudflare, no third-party scripts, self-hosted font.

## Theme

```console
$ grep -- '--clr' frontend/src/styles/global.css | head -4
--clr-accent:       #10b981;   /* main green */
--clr-accent-dark:  #047857;   /* hover, gradients */
--clr-bg-start:     #064e3b;   /* background, left */
--clr-bg-end:       #000000;   /* background, right */
```

Never hardcode a colour: change the variable. A light theme (`prefers-color-scheme: light`)
redefines the same variables.

## Ship it

```console
$ git switch dev                # all work happens on dev
$ git push                      # CI runs: format:check -> tests -> build
$ gh pr create --base main      # merge when the CI is green
```

Merging into `main` triggers `deploy.yml`, which builds with the official Astro action and
publishes to GitHub Pages. Never commit to `main` directly.

| branch                   | role                                      |
| ------------------------ | ----------------------------------------- |
| `main`                   | production, every push deploys            |
| `dev`                    | active development                        |
| `master`                 | legacy, kept for history                  |
| `version_1`, `version_2` | archives of the previous versions of the site |

---

```console
$ cat LICENSE | head -1
Copyright (c) 2026 Zoléni Kokolo Zassi. All Rights Reserved.

$ exit
```
