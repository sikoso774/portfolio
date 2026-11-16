---
title: "Headers de sécurité GitHub Pages : la solution Cloudflare"
description: "GitHub Pages ne permet pas de configurer de headers HTTP personnalisés : securityheaders.com a donc donné un D à ce site. Comment je l'ai corrigé avec les Transform Rules de Cloudflare pour atteindre un A."
pubDate: 2026-06-12
tags: ["Sécurité", "Headers HTTP", "GitHub Pages", "Cloudflare", "DNS"]
---

## Le problème

Scan de `zolenikokolo.com` sur [securityheaders.com](https://securityheaders.com) → **note D** 😓

5 headers HTTP de sécurité manquants :

| Header                    | Rôle                                                                 |
| ------------------------- | -------------------------------------------------------------------- |
| `Content-Security-Policy` | Liste blanche des sources de contenu autorisées → bloque le XSS      |
| `X-Frame-Options`         | Interdit d'afficher le site dans une iframe → anti-clickjacking      |
| `X-Content-Type-Options`  | Empêche le navigateur de "deviner" le type MIME d'un fichier         |
| `Referrer-Policy`         | Contrôle ce que le navigateur révèle aux sites visités via les liens |
| `Permissions-Policy`      | Désactive les APIs sensibles (caméra, micro, géoloc)                 |

Seul `Strict-Transport-Security` (HSTS) était présent — envoyé par GitHub.

> **La cause racine :** ces headers sont envoyés par le **serveur**, pas par le code HTML. Or **GitHub Pages ne permet pas de configurer des headers HTTP personnalisés**. Rien dans le repo n'était en cause — c'est une limitation de l'hébergeur. Quasiment tous les sites GitHub Pages ont la note D.

### Faut-il paniquer ?

Non. Ce sont des couches de **durcissement** (defense in depth). Pour un site statique sans login, sans BDD et sans entrée utilisateur, le risque réel est faible. Mais c'est une bonne occasion d'apprendre. (Côté Express/Node, le même problème se règle avec Helmet.)

## Les solutions possibles

1. **`<meta http-equiv="Content-Security-Policy">`** dans le `<head>` — gratuit mais partiel : seule la CSP fonctionne en meta, et les scanners ne lisent que les headers HTTP → la note reste D
2. **Migrer vers Netlify / Cloudflare Pages** — supportent un fichier `_headers` natif
3. ✅ **Mettre [Cloudflare](/fr/blog/what-is-cloudflare/) (gratuit) devant GitHub Pages** — solution retenue : on garde l'hébergement, Cloudflare injecte les headers au passage

## La mise en œuvre (≈ 45 min)

1. **Compte Cloudflare** (plan Free) → "Add a domain" → Cloudflare scanne et importe la zone DNS existante d'Infomaniak
2. **Vérifier les enregistrements importés** :
   - 4 records **A** → IPs GitHub Pages (`185.199.108-111.153`) + CNAME `www` → en **Proxied** (nuage orange 🟠 = le trafic passe par Cloudflare)
   - ⚠️ CNAME `autoconfig` / `autodiscover` (email Infomaniak) → en **DNS only** (nuage gris), sinon l'autoconfiguration des clients mail casse
   - MX / TXT (SPF, DMARC, domainkey) conservés → l'email continue de fonctionner
3. **Changer les nameservers chez Infomaniak** (registrar) : `ns1/ns2.infomaniak.com` → `abdullah.ns.cloudflare.com` / `khloe.ns.cloudflare.com`. Le bandeau d'avertissement d'Infomaniak est normal : sa zone DNS n'est plus utilisée, c'est le but.
4. **SSL/TLS → mode Full (strict)** ⚠️ piège classique : en "Flexible", boucle de redirection infinie avec GitHub Pages qui force déjà HTTPS
5. **Rules → Response Header Transform Rule** : une règle "All incoming requests" qui ajoute les 5 headers en "Set static" :

```text
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Résultat

**D → A** 🎉 (12 juin 2026)

> **Pourquoi pas A+ ?** La CSP contient `'unsafe-inline'` dans `script-src`, nécessaire pour le script d'obfuscation email inline (`is:inline`) du Footer et pour `main.js` (qu'Astro inline dans le HTML car trop petit). Le A+ est possible en remplaçant `'unsafe-inline'` par des hashes SHA-256 des scripts inline.
>
> **Décision : on reste à A.** Une CSP à hashes est fragile : l'empreinte correspond au contenu _exact_ du script, donc chaque modification du JS déployée casserait les hashes et bloquerait les scripts en prod (menu mobile, animations). Pour un portfolio, une note A robuste vaut mieux qu'un A+ qui demande une mise à jour manuelle de la règle Cloudflare à chaque déploiement. Sécurité = aussi un arbitrage avec la maintenabilité.

## À retenir

- La CSP `'self'` est très stricte : **si j'ajoute une ressource externe** (CDN, analytics, iframe YouTube…), elle sera bloquée → mettre à jour la règle dans Cloudflare
- Vérifier les erreurs CSP dans la console navigateur (F12) après chaque changement
- Cloudflare met les pages en cache → "Purge cache" si un déploiement ne s'affiche pas

---

_Adapté de mes notes personnelles d'infrastructure, rédigées juste après la correction des headers de sécurité de ce site._
