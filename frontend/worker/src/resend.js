import { FROM_NAME, RESEND_URL } from "./config.js";

// Envoie un e-mail via l'API Resend (la clé reste dans le secret RESEND_API_KEY).
export function sendWithResend(env, payload) {
  return fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// « Portfolio <adresse> » : FROM_EMAIL peut contenir l'adresse seule ou déjà un
// « Nom <adresse> » (ancienne configuration) : dans les deux cas on garde l'adresse.
export function fromHeader(env) {
  const raw = String(env.FROM_EMAIL ?? "").trim();
  const address = raw.match(/<([^>]+)>/)?.[1] ?? raw;
  return `${FROM_NAME} <${address}>`;
}
