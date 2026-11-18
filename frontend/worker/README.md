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

## Structure du code

Le Worker est découpé en petits modules (`src/`). Wrangler les regroupe tout seul au déploiement.

| Fichier             | Rôle                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------- |
| `index.js`          | Routeur : `/api/contact` → `contact.js`, `/api/resend-webhook` → `webhook.js`, sinon `404`. |
| `config.js`         | Constantes : limites des champs, préfixes de sujet, événements surveillés, tolérance Svix.  |
| `contact.js`        | Formulaire : contrôle d'origine, limite de débit, champ piège, validation, envoi.           |
| `webhook.js`        | Webhook Resend : vérifie la signature, filtre l'événement, envoie l'alerte.                 |
| `signature.js`      | Vérification de la signature Svix (HMAC-SHA256, tolérance de 5 minutes).                    |
| `resend.js`         | Appel à l'API Resend et en-tête expéditeur `Portfolio <adresse>`.                           |
| `http.js`           | Réponses JSON.                                                                              |
| `emails/contact.js` | Gabarit (texte + HTML vert) du message reçu depuis le formulaire.                           |
| `emails/alert.js`   | Gabarit (texte + HTML orange, bloc de logs) de l'alerte de rebond.                          |
| `emails/escape.js`  | Échappement HTML de tout ce qui vient du visiteur ou de Resend.                             |

Pour changer l'apparence d'un e-mail, modifie seulement le fichier du dossier `emails/` correspondant.
`index.js` réexporte les fonctions testées : les tests (`tests/contact.test.js`, `tests/webhook.test.js`)
les importent depuis ce point d'entrée.

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
npx wrangler secret put FROM_EMAIL       # l'adresse seule : notifications@zolenikokolo.com
npx wrangler secret put TO_EMAIL         # l'adresse qui reçoit les messages
npx wrangler deploy
```

`FROM_EMAIL` doit être une adresse **sur le domaine vérifié**, écrite **seule** : le nom affiché « Portfolio »
est ajouté par le Worker (`FROM_NAME` dans `src/index.js`), ce qui donne `Portfolio <notifications@zolenikokolo.com>`. Les trois valeurs sont des secrets (pas dans le
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

## Alertes de rebond (webhook Resend)

Quand un visiteur écrit avec une adresse que ta messagerie refuse (liste noire, boîte pleine…), le site
affiche « envoyé » mais tu ne reçois rien. Le webhook règle ça : Resend prévient le Worker, qui t'envoie
un e-mail d'alerte (`[Alerte] Message du portfolio non remis`) avec le motif.

```
Resend ── POST signé (Svix) ──► zolenikokolo.com/api/resend-webhook ──► Worker ──► e-mail d'alerte
```

- **Événements traités** : `email.bounced`, `email.complained`, `email.delivery_delayed` et `email.failed`.
  Les autres sont ignorés (réponse `200`).
- **Seuls les messages du formulaire** (sujet `[Portfolio] …`) déclenchent une alerte. Les alertes ont un autre
  préfixe, `[Alerte] …` : un rebond d'alerte ne peut pas en provoquer une autre.
- **Signature vérifiée** : HMAC-SHA256 de `svix-id.svix-timestamp.corps` avec le secret `whsec_…`, requête de
  moins de 5 minutes. Sans signature valide : `401`, rien n'est envoyé.
- Si l'envoi de l'alerte échoue, le Worker répond `502` : Resend réessaie plus tard.

### Mise en place

1. **Resend → Webhooks → Add Webhook** :
   - URL : `https://zolenikokolo.com/api/resend-webhook`
   - Événements : `email.bounced`, `email.complained`, `email.delivery_delayed` (et `email.failed` si proposé).
   - Copie le **Signing secret** (`whsec_…`).
2. Depuis ce dossier :

   ```bash
   npx wrangler secret put RESEND_WEBHOOK_SECRET   # colle le whsec_…
   npx wrangler deploy                             # publie aussi la nouvelle route
   ```

3. **Tester** : envoie un message depuis `/contact/` avec `test@example.com` comme adresse du visiteur
   (liste noire : Infomaniak le refuse). Tu dois recevoir l'alerte une minute plus tard. Dans Resend,
   la page du webhook liste chaque tentative et la réponse du Worker.

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

| Symptôme                                                                                     | Cause probable                                                                                                                                |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `403 forbidden`                                                                              | L'en-tête `Origin` n'est pas `https://zolenikokolo.com` (ou `ALLOW_LOCALHOST` absent en dev).                                                 |
| `502 send_failed`                                                                            | Resend refuse : clé invalide, domaine non vérifié ou `FROM_EMAIL` hors du domaine. Voir `npx wrangler tail`.                                  |
| `429 rate_limited`                                                                           | Plus de 3 envois en une minute depuis la même IP.                                                                                             |
| `200` mais rien reçu, « Bounced » dans Resend (Emails) avec `554 5.7.1 … is rbl blacklisted` | L'adresse du visiteur (`Reply-To`) est sur une liste noire, par exemple `test@example.com`. Teste avec une vraie adresse.                     |
| Webhook : `401 invalid_signature`                                                            | `RESEND_WEBHOOK_SECRET` ne correspond pas au « Signing secret » de ce webhook dans Resend, ou l'heure du serveur dérive de plus de 5 minutes. |
| Webhook : `403` renvoyé par Cloudflare, jamais par le Worker                                 | Bot Fight Mode ou une règle WAF bloque Resend : ajoute une exception pour `/api/resend-webhook`.                                              |
| Webhook : `500 not_configured`                                                               | Le secret `RESEND_WEBHOOK_SECRET` n'a pas été créé (`npx wrangler secret put`).                                                               |
| Le formulaire affiche une erreur                                                             | Le Worker n'est pas déployé, ou la route n'est pas active sur le domaine.                                                                     |
