import {
  CONTACT_SUBJECT_PREFIX,
  EMAIL_RE,
  LIMITS,
  MAX_BODY_BYTES,
} from "./config.js";
import { renderHtml, renderText } from "./emails/contact.js";
import { json } from "./http.js";
import { fromHeader, sendWithResend } from "./resend.js";

// Origin n'arrête pas un script hors navigateur, mais bloque l'usage de
// l'endpoint depuis le site d'un tiers. localhost : seulement en dev.
function originAllowed(request, env) {
  const origin = request.headers.get("Origin");
  if (origin === "https://zolenikokolo.com") return true;
  return (
    env.ALLOW_LOCALHOST === "true" &&
    /^http:\/\/localhost:\d+$/.test(origin ?? "")
  );
}

// Retourne { data } si tout est valide, sinon { fields } avec les champs en erreur.
export function validate(body) {
  const data = {};
  const fields = [];
  for (const key of Object.keys(LIMITS)) {
    const value = typeof body?.[key] === "string" ? body[key].trim() : "";
    // Pas de saut de ligne dans les champs d'une ligne (injection d'en-têtes)
    const singleLine = key !== "message";
    if (
      !value ||
      value.length > LIMITS[key] ||
      (singleLine && /[\r\n]/.test(value))
    ) {
      fields.push(key);
    }
    data[key] = value;
  }
  if (!fields.includes("email") && !EMAIL_RE.test(data.email)) {
    fields.push("email");
  }
  return fields.length ? { fields } : { data };
}

// POST /api/contact : valide le message du visiteur et te l'envoie par e-mail.
export async function handleContact(request, env) {
  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405, { Allow: "POST" });
  }
  if (!originAllowed(request, env)) return json({ error: "forbidden" }, 403);
  if (
    !(request.headers.get("Content-Type") ?? "").includes("application/json")
  ) {
    return json({ error: "unsupported_media_type" }, 415);
  }
  if (Number(request.headers.get("Content-Length") ?? 0) > MAX_BODY_BYTES) {
    return json({ error: "payload_too_large" }, 413);
  }

  if (env.RATE_LIMITER) {
    const key = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const { success } = await env.RATE_LIMITER.limit({ key });
    if (!success) return json({ error: "rate_limited" }, 429);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  // Champ piège : un humain ne le voit pas. On répond « ok » sans rien envoyer
  // pour ne pas apprendre au robot qu'il a été repéré.
  if (typeof body?.website === "string" && body.website !== "") {
    return json({ ok: true });
  }

  const { data, fields } = validate(body);
  if (!data) return json({ error: "invalid", fields }, 400);

  const response = await sendWithResend(env, {
    from: fromHeader(env),
    to: [env.TO_EMAIL],
    reply_to: data.email,
    subject: `${CONTACT_SUBJECT_PREFIX}${data.subject}`,
    text: renderText(data),
    html: renderHtml(data),
  });

  if (!response.ok) {
    // On ne journalise ni le message ni l'adresse du visiteur.
    console.error("Resend a refusé l'envoi", response.status);
    return json({ error: "send_failed" }, 502);
  }
  return json({ ok: true });
}
