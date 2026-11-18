// Worker Cloudflare du portfolio : formulaire de contact + alertes de rebond, via Resend.
//
// Routes (même origine que le site : la CSP `default-src 'self'` n'a pas à changer) :
//   zolenikokolo.com/api/contact         formulaire de contact      -> contact.js
//   zolenikokolo.com/api/resend-webhook  événements Resend (rebonds) -> webhook.js
//
// Secrets (jamais dans le dépôt) : RESEND_API_KEY, FROM_EMAIL (l'adresse seule,
// ex. notifications@zolenikokolo.com), TO_EMAIL, RESEND_WEBHOOK_SECRET (whsec_…).
//
// Organisation du code (voir aussi README.md) :
//   index.js        routeur (ce fichier)
//   config.js       constantes : limites, préfixes de sujet, événements surveillés
//   http.js         réponses JSON
//   resend.js       appel à l'API Resend, en-tête « Portfolio <adresse> »
//   contact.js      validation et traitement du formulaire
//   webhook.js      traitement des webhooks Resend
//   signature.js    vérification de la signature Svix des webhooks
//   emails/         gabarits des e-mails (contact, alerte) et échappement HTML

import { handleContact } from "./contact.js";
import { json } from "./http.js";
import { handleWebhook } from "./webhook.js";

export async function handle(request, env) {
  const url = new URL(request.url);
  // Le slash final est accepté : en dev, Astro (trailingSlash: "always") exige
  // `/api/contact/` avant de transmettre la requête au Worker.
  const path = url.pathname.replace(/\/+$/, "");

  if (path === "/api/contact") return handleContact(request, env);
  if (path === "/api/resend-webhook") return handleWebhook(request, env);
  return json({ error: "not_found" }, 404);
}

// Fonctions publiques réexportées : les tests les importent depuis ce point d'entrée.
export { validate } from "./contact.js";
export {
  alertDetails,
  renderAlertHtml,
  renderAlertText,
} from "./emails/alert.js";
export { renderHtml, renderText } from "./emails/contact.js";
export { escapeHtml } from "./emails/escape.js";
export { fromHeader } from "./resend.js";
export { verifyWebhookSignature } from "./signature.js";
export { handleContact, handleWebhook };

export default {
  fetch: handle,
};
