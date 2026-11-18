// Constantes du Worker : limites, préfixes de sujet, événements surveillés.

export const RESEND_URL = "https://api.resend.com/emails";

// Nom affiché de l'expéditeur : « Portfolio <adresse> » (l'adresse vient du secret FROM_EMAIL).
export const FROM_NAME = "Portfolio";

// Formulaire de contact
export const MAX_BODY_BYTES = 20_000;
export const LIMITS = { name: 100, email: 254, subject: 150, message: 5000 };
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Les messages du formulaire ont ce préfixe : le webhook ne traite que ceux-là
// (et jamais ses propres alertes, qui ont un autre préfixe : pas de boucle).
export const CONTACT_SUBJECT_PREFIX = "[Portfolio] ";
export const ALERT_SUBJECT_PREFIX = "[Alerte] ";

// Webhook Resend
export const MAX_WEBHOOK_BYTES = 100_000;

// Événements Resend qui déclenchent une alerte.
export const WEBHOOK_EVENTS = {
  "email.bounced": "Rebond : le serveur du destinataire a refusé le message",
  "email.complained": "Plainte : le message a été signalé comme spam",
  "email.delivery_delayed": "Livraison retardée",
  "email.failed": "Échec d'envoi",
};

// Resend signe ses webhooks avec Svix : on refuse une requête vieille de plus de 5 minutes.
export const WEBHOOK_TOLERANCE_SECONDS = 300;
