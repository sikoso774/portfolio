---
title: "Cloudflare: What It Is and How It Works"
description: "A reverse proxy and CDN explained in plain terms — how Cloudflare sits in front of GitHub Pages, how nameservers wire it up, and how to check it's actually active."
pubDate: 2026-06-12
tags: ["Cloudflare", "DNS", "CDN", "Security", "Infrastructure"]
---

## What It Is

Cloudflare is a global **reverse proxy + CDN**: a middleman that sits **between visitors and the origin server** (the host). Instead of reaching the server directly, every request first passes through Cloudflare's servers, which can filter it, cache it, and **modify the response on the way through**.

```text
WITHOUT Cloudflare:
Visitor ──────────────────────────▶ GitHub Pages

WITH Cloudflare:
Visitor ──▶ Cloudflare (proxy) ──▶ GitHub Pages
                  │
                  ├─ CDN cache (300+ datacenters)
                  ├─ DDoS / bot protection
                  ├─ SSL certificate
                  └─ header injection ◀── the part we actually needed!
```

The **Free** plan is plenty for a personal site.

## How It Gets Activated: Nameservers

The key mechanism is **DNS**. When a browser looks up `zolenikokolo.com`, it queries the domain's **nameservers** to get an IP address.

1. On signup, Cloudflare **copies the existing DNS zone** (A, CNAME, MX, TXT records…)
2. At the **registrar** (Infomaniak in my case), the nameservers get replaced with Cloudflare's (`xxx.ns.cloudflare.com`)
3. From then on, Cloudflare answers the DNS queries, with two possible modes per record:

| Mode         | Cloud      | Behavior                                                                       |
| ------------ | ---------- | ------------------------------------------------------------------------------- |
| **Proxied**  | 🟠 orange | Cloudflare answers with **its own IPs** → all HTTP traffic goes through it     |
| **DNS only** | ⚪ grey    | Cloudflare answers with the real IP → direct traffic, Cloudflare only does DNS |

> **Tip — the proxy trap:** anything that isn't "classic" web traffic (email, autoconfig…) needs to stay on **DNS only**. The proxy only understands HTTP/HTTPS and would break everything else.

## Why It Solved Our Problem

The problem (see [the full write-up](/blog/github-pages-headers-securite-cloudflare)): GitHub Pages doesn't let you add custom HTTP security headers.

Since **every response now passes through Cloudflare**, it can be modified on the fly with a **Response Header Transform Rule**: Cloudflare receives the page from GitHub, **adds the 5 missing headers**, then forwards it to the visitor. GitHub knows nothing about it, the repo doesn't change a single line — the infrastructure handles it.

That's exactly the principle behind a **middleware**, just at the network level instead of the application level (the way Helmet does it in Express).

## What We Get as a Bonus

- **CDN**: pages are cached across 300+ datacenters → served from the closest point to the visitor
- **DDoS and bot protection** included, even on Free
- **Managed SSL/TLS**: **Full (strict)** mode = end-to-end encryption (visitor ↔ Cloudflare ↔ origin). Avoid "Flexible", which decrypts between Cloudflare and the origin → redirect loops with hosts that already force HTTPS
- **Traffic analytics** without cookies or scripts
- Workers, redirects, cache rules… plenty of tools to learn web infra with

## How to Check Cloudflare Is Actually Active

Two questions to ask: **the routing** (where does the name point?) and **the responder** (who actually answers?).

### On the DNS Side (PowerShell)

```powershell
Resolve-DnsName zolenikokolo.com -Type NS   # who manages the zone? → xxx.ns.cloudflare.com
Resolve-DnsName zolenikokolo.com -Type A    # which IP? → Cloudflare IPs (188.114.x.x, 172.67.x.x…)
```

If the A records show the origin host's IPs (GitHub: `185.199.x.x`), the proxy isn't active (grey cloud, or the zone isn't active yet). The IPs vary depending on which datacenter answers: that's **anycast**.

### On the HTTP Side (PowerShell)

```powershell
# Who's signing the response?
(Invoke-WebRequest -Uri "https://zolenikokolo.com/" -Method Head).Headers["Server"]   # → cloudflare

# All headers (including the injected security headers)
(Invoke-WebRequest -Uri "https://zolenikokolo.com/" -Method Head).Headers
```

`-Method Head` = only ask for the headers, not the page content.

### On the Browser Side (No Terminal)

F12 → **Network** tab → reload → click the first request → **Response Headers**. You can see **both layers** at once: the origin's headers passing through (`X-Served-By`, `Via: 1.1 varnish`, `X-Github-Request-Id` = GitHub/Fastly) and the ones Cloudflare added (`Server: cloudflare`, the security headers, `CF-RAY`).

## Limits / Things to Watch

- Cloudflare sees **all the decrypted traffic** → you're trusting it (a deliberate man-in-the-middle)
- The **cache** can serve a stale version after a deploy → "Purge cache"
- Third-party dependency: if Cloudflare goes down (rare, but it has happened), the site goes down with it

---

_Adapted from my personal infrastructure notes, written while setting up Cloudflare in front of this very site._
