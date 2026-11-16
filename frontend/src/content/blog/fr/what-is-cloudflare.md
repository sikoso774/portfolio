---
title: "Cloudflare : c'est quoi et comment ça marche"
description: "Un reverse proxy et un CDN expliqués simplement — comment Cloudflare se place devant GitHub Pages, comment les nameservers le branchent, et comment vérifier qu'il est bien actif."
pubDate: 2026-06-12
tags: ["Cloudflare", "DNS", "CDN", "Sécurité", "Infrastructure"]
---

## C'est quoi ?

Cloudflare est un **reverse proxy + CDN** mondial : un intermédiaire qui se place **entre les visiteurs et le serveur d'origine** (l'hébergeur). Au lieu d'atteindre directement le serveur, chaque requête passe d'abord par les serveurs de Cloudflare, qui peuvent la filtrer, la mettre en cache, et **modifier la réponse au passage**.

```text
SANS Cloudflare :
Visiteur ──────────────────────────▶ GitHub Pages

AVEC Cloudflare :
Visiteur ──▶ Cloudflare (proxy) ──▶ GitHub Pages
                  │
                  ├─ cache CDN (300+ datacenters)
                  ├─ protection DDoS / bots
                  ├─ certificat SSL
                  └─ injection de headers ◀── ce qui nous intéressait !
```

Le plan **Free** suffit largement pour un site perso.

## Comment ça s'active : les nameservers

Le mécanisme clé, c'est le **DNS**. Quand un navigateur cherche `zolenikokolo.com`, il interroge les **nameservers** du domaine pour obtenir l'adresse IP.

1. À l'inscription, Cloudflare **copie la zone DNS** existante (records A, CNAME, MX, TXT…)
2. Chez le **registrar** (Infomaniak pour moi), on remplace les nameservers par ceux de Cloudflare (`xxx.ns.cloudflare.com`)
3. Désormais c'est Cloudflare qui répond aux requêtes DNS, et il a deux modes par enregistrement :

| Mode         | Nuage     | Comportement                                                                      |
| ------------ | --------- | --------------------------------------------------------------------------------- |
| **Proxied**  | 🟠 orange | Cloudflare répond avec **ses propres IPs** → tout le trafic HTTP passe par lui    |
| **DNS only** | ⚪ gris   | Cloudflare répond avec la vraie IP → trafic direct, Cloudflare ne fait que du DNS |

> **Astuce — le piège du proxy :** tout ce qui n'est pas du trafic web "classique" (email, autoconfig…) doit rester en **DNS only**. Le proxy ne gère que HTTP/HTTPS et casserait le reste.

## Pourquoi ça a résolu notre problème

Le problème (voir [le retour d'expérience complet](/fr/blog/github-pages-security-headers/)) : GitHub Pages ne permet pas d'ajouter des headers HTTP de sécurité.

Comme **chaque réponse traverse maintenant Cloudflare**, on peut la modifier en vol avec une **Response Header Transform Rule** : Cloudflare reçoit la page de GitHub, **ajoute les 5 headers manquants**, puis la transmet au visiteur. GitHub n'en sait rien, le repo ne change pas d'une ligne — c'est l'infrastructure qui s'en charge.

C'est exactement le principe d'un **middleware**, mais au niveau réseau au lieu du niveau applicatif (comme Helmet le fait dans Express).

## Ce qu'on gagne en bonus

- **CDN** : les pages sont mises en cache dans 300+ datacenters → servies au plus près du visiteur
- **Protection DDoS et bots** incluse, même en Free
- **SSL/TLS géré** : mode **Full (strict)** = chiffrement de bout en bout (visiteur ↔ Cloudflare ↔ origine). Éviter "Flexible" qui déchiffre entre Cloudflare et l'origine → boucles de redirection avec les hébergeurs qui forcent HTTPS
- **Analytics** de trafic sans cookie ni script
- Workers, redirections, cache rules… beaucoup d'outils pour apprendre l'infra web

## Comment vérifier que Cloudflare est bien actif

Deux questions à se poser : **l'aiguillage** (vers où pointe le nom ?) et **le livreur** (qui répond réellement ?).

### Côté DNS (PowerShell)

```powershell
Resolve-DnsName zolenikokolo.com -Type NS   # qui gère la zone ? → xxx.ns.cloudflare.com
Resolve-DnsName zolenikokolo.com -Type A    # quelle IP ? → IPs Cloudflare (188.114.x.x, 172.67.x.x…)
```

Si les A records montrent les IPs de l'hébergeur d'origine (GitHub : `185.199.x.x`), le proxy n'est pas actif (nuage gris ou zone pas encore activée). Les IPs varient selon le datacenter qui répond : c'est l'**anycast**.

### Côté HTTP (PowerShell)

```powershell
# Qui signe la réponse ?
(Invoke-WebRequest -Uri "https://zolenikokolo.com/" -Method Head).Headers["Server"]   # → cloudflare

# Tous les en-têtes (dont les headers de sécurité injectés)
(Invoke-WebRequest -Uri "https://zolenikokolo.com/" -Method Head).Headers
```

`-Method Head` = ne demander que les en-têtes, pas le contenu de la page.

### Côté navigateur (sans terminal)

F12 → onglet **Réseau** → recharger → cliquer sur la première requête → **En-têtes de réponse**. On y voit les **deux couches** à la fois : les en-têtes de l'origine qui transitent (`X-Served-By`, `Via: 1.1 varnish`, `X-Github-Request-Id` = GitHub/Fastly) et ceux ajoutés par Cloudflare (`Server: cloudflare`, headers de sécurité, `CF-RAY`).

## Les limites / points d'attention

- Cloudflare voit **tout le trafic déchiffré** → on lui fait confiance (man-in-the-middle volontaire)
- Le **cache** peut servir une vieille version après un déploiement → "Purge cache"
- Dépendance à un tiers : si Cloudflare tombe (rare mais arrivé), le site tombe avec

---

_Adapté de mes notes personnelles d'infrastructure, rédigées en mettant Cloudflare devant ce site._
