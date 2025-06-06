// src/lib/sendEmails.ts
import SGMail from "@sendgrid/mail";


// ----------------------------------------------------------------------------
// 1) Lese den API‐Key aus der Env‐Variable und initialisiere SendGrid
// ----------------------------------------------------------------------------
if (!process.env.SENDGRID_API_KEY) {
  throw new Error(
    "SENDGRID_API_KEY ist nicht gesetzt. Bitte in .env.local definieren."
  );
}
SGMail.setApiKey(process.env.SENDGRID_API_KEY);

// ----------------------------------------------------------------------------
// 2) Funktion zum E-Mail‐Versand mit Attachments
// ----------------------------------------------------------------------------
export async function sendEmailWithAttachments(options: {
  to: string;               // Empfängeradresse
  subject: string;          // Betreff
  text?: string;            // Plain‐Text Version
  html?: string;            // HTML Version
  attachments?: {
    content: string;        // Base64‐kodierter Content
    filename: string;       // Dateiname z. B. "Testergebnis.jpg"
    type: string;           // MIME‐Type, z. B. "image/jpeg" oder "application/pdf"
    disposition?: "attachment" | "inline";
    content_id?: string;    // nur nötig, wenn inline‐Embedding erwünscht
  }[];
}) {
  if (!process.env.SENDGRID_FROM_EMAIL) {
    throw new Error(
      "SENDGRID_FROM_EMAIL ist nicht gesetzt. Bitte in .env.local definieren."
    );
  }

  const msg = {
    to: options.to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments,
  } as SGMail.MailDataRequired;

  return SGMail.send(msg);
}
