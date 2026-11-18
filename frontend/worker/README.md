# Worker du formulaire de contact

Le site est statique (GitHub Pages) : il ne peut pas appeler Resend lui-même sans exposer la clé API.
Ce Worker Cloudflare reçoit le formulaire (`POST /api/contact`), le valide et envoie l'e-mail via
[Resend](https://resend.com). Il est servi sur la **même origine** que le site (`zolenikokolo.com/api/contact`) :
la CSP `default-src 'self'` actuelle n'a donc pas à changer.

```
Navigateur ── fetch /api/contact ──► Cloudflare (route du domaine) ──► Worker ──► API Resend ──► ta boîte mail
```

## Ce que fait le Worker

- Refuse tout sauf `POST` + JSON, depuis `https://zolenikokolo.com` (le dev local est autorisé par `ALLOW_LOCALHOST`).
- Valide les champs (longueurs, e-mail, pas de saut de ligne dans le sujet : pas d'injection d'en-têtes).
- Champ piège `website` : s'il est rempli, le message est ignoré sans prévenir le robot.
- Limite de débit : 3 envois par minute et par IP (`[[ratelimits]]` dans `wrangler.toml`).
- Ne journalise jamais le contenu des messages ni les adresses des visiteurs.

## Mise en place (une seule fois)

### 1. Resend

1. Crée un compte sur resend.com.
2. **Domains → Add domain** : `zolenikokolo.com`. Resend affiche des enregistrements DNS (SPF, DKIM) :
   ajoute-les dans **Cloudflare → DNS** en **DNS only** (nuage gris). Ils utilisent un sous-domaine (`send.`),
   donc ils n'entrent pas en conflit avec la messagerie déjà configurée sur le domaine.
3. Attends que le domaine passe à **Verified**.
4. **API Keys → Create API Key** (permission _Sending access_, limitée à ce domaine). Copie la clé : elle ne
   s'affiche qu'une fois.

### 2. Cloudflare

Depuis ce dossier (`frontend/worker/`) :

```bash
npx wrangler login
npx wrangler secret put RESEND_API_KEY   # colle la clé Resend
npx wrangler secret put FROM_EMAIL       # ex. Portfolio <contact@zolenikokolo.com>
npx wrangler secret put TO_EMAIL         # l'adresse qui reçoit les messages
npx wrangler deploy
```

`FROM_EMAIL` doit être une adresse **sur le domaine vérifié**. Les trois valeurs sont des secrets (pas dans le
dépôt, qui est public).

### 3. Vérifier

```bash
curl -i -X POST https://zolenikokolo.com/api/contact \
  -H "Content-Type: application/json" -H "Origin: https://zolenikokolo.com" \
  -d '{"name":"Test","email":"ton.adresse@gmail.com","subject":"Test","message":"Hello"}'
```

Attendu : `200 {"ok":true}` et un e-mail reçu. Mets une **vraie adresse** dans `email` : une adresse
d'exemple comme `test@example.com` est sur des listes noires (RBL) et la messagerie du destinataire
refuse le message (voir le dépannage). Puis teste le vrai formulaire sur `/contact/` (EN et FR).

## Développement local

```bash
cp .dev.vars.example .dev.vars   # puis remplis les valeurs (ALLOW_LOCALHOST=true)
npx wrangler dev                 # Worker sur http://localhost:8787
```

Dans un autre terminal, `npm run dev` à la racine de `frontend/` : Astro transmet `/api/*` au Worker
(proxy dans `astro.config.mjs`). Pour tester sans envoyer de vrai e-mail, laisse `FROM_EMAIL` sur
`onboarding@resend.dev` et `TO_EMAIL` sur l'adresse de ton compte Resend.

En dev, le formulaire appelle `/api/contact/` (avec slash) : Astro est configuré avec `trailingSlash: "always"`
et répond 404 à `/api/contact` avant que le proxy n'agisse. Le Worker accepte les deux chemins ; en
production, c'est `/api/contact` (la route Cloudflare).

## Dépannage

| Symptôme                                                                                     | Cause probable                                                                                                            |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `403 forbidden`                                                                              | L'en-tête `Origin` n'est pas `https://zolenikokolo.com` (ou `ALLOW_LOCALHOST` absent en dev).                             |
| `502 send_failed`                                                                            | Resend refuse : clé invalide, domaine non vérifié ou `FROM_EMAIL` hors du domaine. Voir `npx wrangler tail`.              |
| `429 rate_limited`                                                                           | Plus de 3 envois en une minute depuis la même IP.                                                                         |
| `200` mais rien reçu, « Bounced » dans Resend (Emails) avec `554 5.7.1 … is rbl blacklisted` | L'adresse du visiteur (`Reply-To`) est sur une liste noire, par exemple `test@example.com`. Teste avec une vraie adresse. |
| Le formulaire affiche une erreur                                                             | Le Worker n'est pas déployé, ou la route n'est pas active sur le domaine.                                                 |
