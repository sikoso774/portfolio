// Worker Cloudflare : reçoit le formulaire de contact et envoie l'e-mail via Resend.
//
// - Route : zolenikokolo.com/api/contact (même origine que le site : la CSP
//   `default-src 'self'` n'a pas à changer).
// - Secrets (jamais dans le dépôt) : RESEND_API_KEY, FROM_EMAIL (l'adresse seule,
//   ex. notifications@zolenikokolo.com), TO_EMAIL. Le nom affiché de l'expéditeur
//   (« Portfolio ») est défini ici, dans FROM_NAME.
// - Anti-spam : champ piège (`website`), contrôle de l'origine, validation
//   stricte, limite de débit par IP (binding RATE_LIMITER).

const RESEND_URL = "https://api.resend.com/emails";
const MAX_BODY_BYTES = 20_000;
const LIMITS = { name: 100, email: 254, subject: 150, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FROM_NAME = "Portfolio";

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

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

// « Portfolio <adresse> » : FROM_EMAIL peut contenir l'adresse seule ou déjà un
// « Nom <adresse> » (ancienne configuration) : dans les deux cas on garde l'adresse.
export function fromHeader(env) {
  const raw = String(env.FROM_EMAIL ?? "").trim();
  const address = raw.match(/<([^>]+)>/)?.[1] ?? raw;
  return `${FROM_NAME} <${address}>`;
}

// Le texte du visiteur est inséré dans du HTML : on neutralise tout balisage.
export function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderText({ name, email, message }) {
  return `Nom : ${name}\nE-mail : ${email}\n\n${message}`;
}

// Mise en page volontairement simple : styles en ligne (les clients mail ignorent
// les feuilles de style et les variables CSS), couleurs du site écrites en dur.
export function renderHtml({ name, email, subject, message }) {
  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    message: escapeHtml(message).replaceAll("\n", "<br>"),
  };
  const replyHref = escapeHtml(
    `mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`,
  );
  const label =
    "margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;";
  return `<div style="background:#f3f4f6;padding:24px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
    <div style="background:#064e3b;padding:20px 24px;color:#ffffff;font-size:16px;font-weight:600;">Nouveau message depuis ton portfolio</div>
    <div style="padding:24px;">
      <p style="${label}">De</p>
      <p style="margin:0 0 20px;font-size:15px;"><strong>${safe.name}</strong> &middot; <a href="mailto:${safe.email}" style="color:#047857;">${safe.email}</a></p>
      <p style="${label}">Message</p>
      <div style="margin:0 0 24px;padding:12px 16px;border-left:3px solid #10b981;background:#f9fafb;font-size:15px;line-height:1.6;">${safe.message}</div>
      <a href="${replyHref}" style="display:inline-block;padding:10px 20px;background:#047857;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">Répondre à ${safe.name}</a>
    </div>
    <div style="padding:14px 24px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">Envoyé depuis le formulaire de zolenikokolo.com</div>
  </div>
</div>`;
}

export async function handle(request, env) {
  const url = new URL(request.url);
  // Le slash final est accepté : en dev, Astro (trailingSlash: "always") exige
  // `/api/contact/` avant de transmettre la requête au Worker.
  if (url.pathname.replace(/\/+$/, "") !== "/api/contact") {
    return json({ error: "not_found" }, 404);
  }
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

  const response = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromHeader(env),
      to: [env.TO_EMAIL],
      reply_to: data.email,
      subject: `[Portfolio] ${data.subject}`,
      text: renderText(data),
      html: renderHtml(data),
    }),
  });

  if (!response.ok) {
    // On ne journalise ni le message ni l'adresse du visiteur.
    console.error("Resend a refusé l'envoi", response.status);
    return json({ error: "send_failed" }, 502);
  }
  return json({ ok: true });
}

export default {
  fetch: handle,
};
