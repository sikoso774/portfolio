import { WEBHOOK_TOLERANCE_SECONDS } from "./config.js";

function base64ToBytes(value) {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

// Vérifie la signature Svix d'un webhook Resend : HMAC-SHA256 de
// `${svix-id}.${svix-timestamp}.${corps brut}` avec la clé du secret `whsec_…`.
export async function verifyWebhookSignature(request, rawBody, secret) {
  const id = request.headers.get("svix-id");
  const timestamp = request.headers.get("svix-timestamp");
  const header = request.headers.get("svix-signature");
  if (!id || !timestamp || !header) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > WEBHOOK_TOLERANCE_SECONDS) return false;

  let key;
  try {
    key = await crypto.subtle.importKey(
      "raw",
      base64ToBytes(secret.replace(/^whsec_/, "")),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
  } catch {
    return false;
  }

  const signedContent = new TextEncoder().encode(
    `${id}.${timestamp}.${rawBody}`,
  );
  // L'en-tête peut contenir plusieurs signatures (« v1,xxx v1,yyy ») pendant une
  // rotation de secret ; `verify` compare en temps constant.
  for (const part of header.split(" ")) {
    const [version, signature] = part.split(",");
    if (version !== "v1" || !signature) continue;
    try {
      if (
        await crypto.subtle.verify(
          "HMAC",
          key,
          base64ToBytes(signature),
          signedContent,
        )
      ) {
        return true;
      }
    } catch {
      // signature mal formée : on passe à la suivante
    }
  }
  return false;
}
