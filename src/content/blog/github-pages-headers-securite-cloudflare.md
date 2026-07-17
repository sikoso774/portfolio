---
title: "GitHub Pages & Security Headers: Problem and Cloudflare Fix"
description: "This site scored a D on securityheaders.com because GitHub Pages can't set custom HTTP headers. Here's the root cause and how putting Cloudflare in front fixed it — D to A."
pubDate: 2026-06-12
tags: ["Security", "HTTP Headers", "GitHub Pages", "Cloudflare", "DNS"]
---

## The Problem

Scanning `zolenikokolo.com` on [securityheaders.com](https://securityheaders.com) → a **D grade** 😓

5 missing HTTP security headers:

| Header                     | Role                                                              |
| --------------------------- | ------------------------------------------------------------------ |
| `Content-Security-Policy`   | Whitelists allowed content sources → blocks XSS                   |
| `X-Frame-Options`           | Forbids embedding the site in an iframe → anti-clickjacking       |
| `X-Content-Type-Options`    | Stops the browser from "guessing" a file's MIME type              |
| `Referrer-Policy`           | Controls what the browser reveals to sites reached through links  |
| `Permissions-Policy`        | Disables sensitive APIs (camera, mic, geolocation)                |

Only `Strict-Transport-Security` (HSTS) was present — sent by GitHub itself.

> **The root cause:** these headers are sent by the **server**, not by the HTML code. And **GitHub Pages doesn't let you configure custom HTTP headers**. Nothing in the repo was at fault — it's a hosting limitation. Pretty much every GitHub Pages site gets a D.

### Should I panic?

No. These are **hardening** layers (defense in depth). For a static site with no login, no database, and no user input, the real risk is low. But it's a good excuse to learn. (On the Express/Node side, the same problem is solved with Helmet.)

## Possible Solutions

1. **`<meta http-equiv="Content-Security-Policy">`** in the `<head>` — free but partial: only CSP works as a meta tag, and scanners only read HTTP headers → still a D
2. **Migrate to Netlify / Cloudflare Pages** — they support a native `_headers` file
3. ✅ **Put [Cloudflare](/blog/cloudflare-cest-quoi) (free) in front of GitHub Pages** — the option I went with: keep the current host, let Cloudflare inject the headers on the way through

## The Setup (~45 min)

1. **Cloudflare account** (Free plan) → "Add a domain" → Cloudflare scans and imports the existing DNS zone from Infomaniak
2. **Check the imported records**:
   - 4 **A** records → GitHub Pages IPs (`185.199.108-111.153`) + `www` CNAME → set to **Proxied** (orange cloud 🟠 = traffic goes through Cloudflare)
   - ⚠️ `autoconfig` / `autodiscover` CNAME (Infomaniak email) → set to **DNS only** (grey cloud), otherwise mail client autoconfiguration breaks
   - MX / TXT records (SPF, DMARC, domainkey) kept as-is → email keeps working
3. **Change the nameservers at Infomaniak** (the registrar): `ns1/ns2.infomaniak.com` → `abdullah.ns.cloudflare.com` / `khloe.ns.cloudflare.com`. Infomaniak's warning banner is expected — its DNS zone is no longer used, that's the whole point.
4. **SSL/TLS → Full (strict) mode** ⚠️ classic trap: "Flexible" mode causes an infinite redirect loop with GitHub Pages, which already forces HTTPS
5. **Rules → Response Header Transform Rule**: an "All incoming requests" rule that adds the 5 headers as "Set static":

```text
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Result

**D → A** 🎉 (June 12, 2026)

> **Why not an A+?** The CSP contains `'unsafe-inline'` in `script-src`, needed for the Footer's inline email-obfuscation script (`is:inline`) and for `main.js` (which Astro inlines into the HTML since it's small enough). An A+ is possible by replacing `'unsafe-inline'` with SHA-256 hashes of the inline scripts.
>
> **Decision: staying at A.** A hash-based CSP is fragile: the fingerprint matches the script's *exact* content, so any deployed JS change would break the hashes and block the scripts in production (mobile menu, animations). For a personal site, a solid A beats an A+ that needs the Cloudflare rule manually updated on every deploy. Security is also a trade-off with maintainability.

## Takeaways

- The `'self'` CSP is very strict: **adding any external resource** (a CDN, analytics, a YouTube iframe…) will get blocked → update the Cloudflare rule accordingly
- Check the browser console (F12) for CSP errors after every change
- Cloudflare caches pages → "Purge cache" if a deploy doesn't show up

---

_Adapted from my personal infrastructure notes, written right after fixing this site's security headers._
