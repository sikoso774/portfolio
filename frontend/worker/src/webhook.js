import {
  ALERT_SUBJECT_PREFIX,
  CONTACT_SUBJECT_PREFIX,
  MAX_WEBHOOK_BYTES,
  WEBHOOK_EVENTS,
} from "./config.js";
import { renderAlertHtml, renderAlertText } from "./emails/alert.js";
import { json } from "./http.js";
import { fromHeader, sendWithResend } from "./resend.js";
import { verifyWebhookSignature } from "./signature.js";

// POST /api/resend-webhook : reçoit les événements Resend et t'écrit quand un
// message du formulaire n'arrive pas (par exemple une adresse refusée par la messagerie).
export async function handleWebhook(request, env) {
  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405, { Allow: "POST" });
  }
  if (!env.RESEND_WEBHOOK_SECRET) {
    console.error("RESEND_WEBHOOK_SECRET n'est pas défini");
    return json({ error: "not_configured" }, 500);
  }
  if (Number(request.headers.get("Content-Length") ?? 0) > MAX_WEBHOOK_BYTES) {
    return json({ error: "payload_too_large" }, 413);
  }

  // La signature porte sur le corps brut : on le lit en texte avant de l'analyser.
  const rawBody = await request.text();
  if (
    !(await verifyWebhookSignature(request, rawBody, env.RESEND_WEBHOOK_SECRET))
  ) {
    return json({ error: "invalid_signature" }, 401);
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const label = WEBHOOK_EVENTS[event?.type];
  const subject = String(event?.data?.subject ?? "");
  if (!label || !subject.startsWith(CONTACT_SUBJECT_PREFIX)) {
    return json({ ok: true, ignored: true });
  }

  const response = await sendWithResend(env, {
    from: fromHeader(env),
    to: [env.TO_EMAIL],
    subject: `${ALERT_SUBJECT_PREFIX}Message du portfolio non remis`,
    text: renderAlertText(event, label),
    html: renderAlertHtml(event, label),
  });
  if (!response.ok) {
    // Une réponse non 2xx fait réessayer Resend plus tard.
    console.error("Resend a refusé l'alerte", response.status);
    return json({ error: "alert_failed" }, 502);
  }
  return json({ ok: true });
}
