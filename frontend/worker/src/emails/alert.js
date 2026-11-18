import { escapeHtml } from "./escape.js";

// E-mail d'alerte envoyé quand Resend signale qu'un message du formulaire
// n'a pas été remis (rebond, plainte, retard, échec).

// Détails d'une alerte, extraits de l'événement Resend (les champs absents sont tolérés).
export function alertDetails(event, label) {
  const data = event.data ?? {};
  const bounce = data.bounce ?? {};
  const date = new Date(event.created_at ?? data.created_at ?? "");
  return {
    level: "WARN",
    event: String(event.type ?? "inconnu"),
    label,
    to: Array.isArray(data.to)
      ? data.to.join(", ")
      : String(data.to ?? "inconnu"),
    subject: String(data.subject ?? ""),
    kind: [bounce.type, bounce.subType].filter(Boolean).join(" / "),
    reason: String(
      bounce.message ?? data.failed?.reason ?? "non précisé",
    ).slice(0, 500),
    date: Number.isNaN(date.getTime())
      ? "inconnue"
      : date
          .toISOString()
          .replace("T", " ")
          .replace(/\.\d+Z$/, " UTC"),
    id: String(data.email_id ?? "inconnu"),
  };
}

export function renderAlertText(event, label) {
  const d = alertDetails(event, label);
  return [
    "Un message du formulaire de contact n'a pas été remis.",
    "",
    `[${d.level}] ${d.date}`,
    `Événement : ${label}`,
    `Destinataire : ${d.to}`,
    `Sujet : ${d.subject}`,
    ...(d.kind ? [`Type : ${d.kind}`] : []),
    `Motif : ${d.reason}`,
    `Identifiant Resend : ${d.id}`,
    "",
    "Le visiteur a vu « envoyé » sur le site. Retrouve son message dans Resend",
    "(Emails), puis réponds-lui par un autre moyen.",
  ].join("\n");
}

// Même mise en page que l'e-mail du formulaire, avec un bandeau d'avertissement
// orange et un bloc façon journal (logs). Styles en ligne, couleurs écrites en dur.
export function renderAlertHtml(event, label) {
  const d = alertDetails(event, label);
  // Espaces insécables : les clients mail réduisent les espaces normaux.
  const line = (key, value) =>
    `<div><span style="color:#9ca3af;">${key.padEnd(8, " ")}</span> ${escapeHtml(value)}</div>`;
  const logs = [
    `<div style="margin-bottom:6px;"><span style="color:#fb923c;font-weight:700;">[${d.level}]</span> <span style="color:#9ca3af;">${escapeHtml(d.date)}</span></div>`,
    line("event", d.event),
    line("to", d.to),
    line("subject", d.subject),
    ...(d.kind ? [line("type", d.kind)] : []),
    line("reason", d.reason),
    line("id", d.id),
  ].join("\n      ");
  const dashboard =
    d.id === "inconnu"
      ? "https://resend.com/emails"
      : `https://resend.com/emails/${encodeURIComponent(d.id)}`;
  return `<div style="background:#f3f4f6;padding:24px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
    <div style="background:#ea580c;padding:20px 24px;color:#ffffff;font-size:19px;font-weight:700;">&#9888; Message du portfolio non remis</div>
    <div style="padding:24px;">
      <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#c2410c;font-weight:700;">Warning &middot; ${escapeHtml(label)}</p>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;">Un message du formulaire de contact n'a pas été remis. Le visiteur a vu « envoyé » sur le site.</p>
      <div style="margin:0 0 24px;padding:16px;background:#111827;border-left:4px solid #f97316;border-radius:8px;color:#e5e7eb;font-family:Consolas,'SF Mono',Menlo,'Courier New',monospace;font-size:13px;line-height:1.7;word-break:break-word;">
      ${logs}
      </div>
      <a href="${escapeHtml(dashboard)}" style="display:inline-block;padding:10px 20px;background:#c2410c;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">Ouvrir dans Resend</a>
      <p style="margin:16px 0 0;font-size:13px;line-height:1.5;color:#6b7280;">Retrouve son message dans Resend, puis réponds au visiteur par un autre moyen.</p>
    </div>
    <div style="padding:14px 24px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">Alerte automatique de zolenikokolo.com</div>
  </div>
</div>`;
}
