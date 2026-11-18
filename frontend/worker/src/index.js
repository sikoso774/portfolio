// Worker Cloudflare : reçoit le formulaire de contact et envoie l'e-mail via Resend.
//
// - Route : zolenikokolo.com/api/contact (même origine que le site : la CSP
//   `default-src 'self'` n'a pas à changer).
// - Secrets (jamais dans le dépôt) : RESEND_API_KEY, FROM_EMAIL, TO_EMAIL.
// - Anti-spam : champ piège (`website`), contrôle de l'origine, validation
//   stricte, limite de débit par IP (binding RATE_LIMITER).

const RESEND_URL = "https://api.resend.com/emails";
const MAX_BODY_BYTES = 20_000;
const LIMITS = { name: 100, email: 254, subject: 150, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      from: env.FROM_EMAIL,
      to: [env.TO_EMAIL],
      reply_to: data.email,
      subject: `[Portfolio] ${data.subject}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
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
