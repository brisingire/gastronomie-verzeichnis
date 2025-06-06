// File: src/app/api/sendpurchase/route.ts

export const config = {
  runtime: "nodejs",
};

import { NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/db";
import { sendEmailWithAttachments } from "../../../lib/sendEmails";
import { createInvoicePdf } from "../../../lib/invoice-generator";
import { createCertificatePng } from "../../../lib/certificate-generator";
// Neu: Testbericht‐Generator importieren
import { createTestReportPng } from "../../../lib/test-report-generator";

export async function POST(request: Request) {
  try {
    // ─────────────────────────────────────────────────────────────────────────
    // 1) JSON‐Body parsen: { slug, email, verifizierungscode }
    // ─────────────────────────────────────────────────────────────────────────
    const body = (await request.json()) as {
      slug: string;
      email: string;
      verifizierungscode: string;
    };
    const { slug, email, verifizierungscode } = body;

    // ─────────────────────────────────────────────────────────────────────────
    // 2) Restaurant‐Daten aus Supabase holen:
    //    • verifizierungscode
    //    • name, adresse, ort, bewertung, beschreibung
    //    (früher: testergebnis_url, aber jetzt erzeugen wir selbst)
    // ─────────────────────────────────────────────────────────────────────────
    const { data: restaurantData, error: fetchError } = await supabaseServer
      .from("restaurants")
      .select("verifizierungscode, name, adresse, ort, bewertung, beschreibung")
      .eq("slug", slug)
      .single();

    if (fetchError || !restaurantData) {
      return NextResponse.json(
        { error: "Restaurant nicht gefunden oder DB‐Fehler." },
        { status: 404 }
      );
    }

    const storedCode = restaurantData.verifizierungscode as string;
    const restaurantName = restaurantData.name as string;
    const restaurantAdresse = restaurantData.adresse as string;
    const restaurantOrt = restaurantData.ort as string;
    const rating = (restaurantData.bewertung as number | null) ?? 0;
    const description = (restaurantData.beschreibung as string) || "";

    // ─────────────────────────────────────────────────────────────────────────
    // 3) Verifizierungscode prüfen
    // ─────────────────────────────────────────────────────────────────────────
    if (storedCode !== verifizierungscode) {
      return NextResponse.json(
        { error: "Ungültiger Verifizierungscode." },
        { status: 400 }
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 4) Testbericht‐PNG ON‐THE‐FLY generieren und Base64‐kodieren
    // ─────────────────────────────────────────────────────────────────────────
    const testReportBuffer = await createTestReportPng({
      restaurantName,
      address: restaurantAdresse,
      ort: restaurantOrt,
      rating,
      description,
      slug,
    });
    const base64TestReport = testReportBuffer.toString("base64");

    // ─────────────────────────────────────────────────────────────────────────
    // 5) Rechnung‐PDF generieren und Base64‐kodieren
    // ─────────────────────────────────────────────────────────────────────────
    const pdfBuffer = await createInvoicePdf({
      slug,
      restaurantName,
      restaurantAdresse,
    });
    const base64Pdf = pdfBuffer.toString("base64");

    // ─────────────────────────────────────────────────────────────────────────
    // 6) Zertifikat‐PNG generieren und Base64‐kodieren
    // ─────────────────────────────────────────────────────────────────────────
    const certBuffer = await createCertificatePng({
      restaurantName,
      address: restaurantAdresse,
      rating,
      slug,
    });
    const base64Cert = certBuffer.toString("base64");

    // ─────────────────────────────────────────────────────────────────────────
    // 7) E-Mail mit 4 Attachments verschicken:
    //    1) Testbericht (PNG)
    //    2) Zertifikat (PNG)
    //    3) Rechnung (PDF)
    //    4) (Optional: Zusatzdateien falls nötig)
    // ─────────────────────────────────────────────────────────────────────────
    await sendEmailWithAttachments({
      to: email,
      subject: `Ihr Testbericht, Zertifikat & Rechnung für "${restaurantName}"`,
      text: `
Hallo,

vielen Dank, dass Sie Ihr Testergebnis für "${restaurantName}" freischalten haben.
Im Anhang finden Sie:
- Ihren Testbericht (PNG),
- das dazugehörige Zertifikat (PNG),
- und die Rechnung (PDF).

Diese Dokumente sind exziplit für den kommerziellen Nutzen bestimmt und können auch zu Werbezwecken eingsetzt werden. 

Mit freundlichen Grüßen,
Ihr Gastronomie-Verzeichnis-Team
      `.trim(),
      html: `
<p>Hallo,</p>
<p>
  vielen Dank, dass Sie Ihr Testergebnis für <strong>${restaurantName}</strong> freischalten möchten.<br/>
  Im Anhang erhalten Sie:
  <ul>
    <li>Den Testbericht als <em>Bild (PNG)</em></li>
    <li>Das Zertifikat als <em>Bild (PNG)</em></li>
    <li>Die Rechnung als <em>PDF</em></li>
  </ul>
</p>
<p>Mit freundlichen Grüßen,<br/>Ihr Gastronomie-Verzeichnis-Team</p>
      `.trim(),
      attachments: [
        {
          content: base64TestReport,
          filename: `Testbericht_${slug}.png`,
          type: "image/png",
          disposition: "attachment",
        },
        {
          content: base64Cert,
          filename: `Zertifikat_${slug}.png`,
          type: "image/png",
          disposition: "attachment",
        },
        {
          content: base64Pdf,
          filename: `Rechnung_${slug}.pdf`,
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    });

    // ─────────────────────────────────────────────────────────────────────────
    // 8) In DB das Feld „verifiziert“ auf true setzen
    // ─────────────────────────────────────────────────────────────────────────
    const { error: updateError } = await supabaseServer
      .from("restaurants")
      .update({ verifiziert: true })
      .eq("slug", slug);

    if (updateError) {
      console.error("Fehler beim Update 'verifiziert':", updateError);
      // Mail ist schon rausgegangen → t dennoch success zurückgeben
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API-Route /api/sendpurchase Fehler:", err);
    return NextResponse.json(
      { error: "Interner Serverfehler beim Versand der E-Mail.", detail: err.message },
      { status: 500 }
    );
  }
}
