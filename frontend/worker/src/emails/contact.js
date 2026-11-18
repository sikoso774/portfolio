import { escapeHtml } from "./escape.js";

// E-mail reçu quand un visiteur utilise le formulaire.

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
