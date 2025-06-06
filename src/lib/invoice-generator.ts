// src/lib/invoice-generator.ts

import { PassThrough } from "stream";
// Standalone-Import, damit keine AFM-Dateien nachgeladen werden
const PDFDocument = require("pdfkit/js/pdfkit.standalone");
import path from "path";

interface InvoiceData {
  slug: string;
  restaurantName: string;
  restaurantAdresse: string;
}

export async function createInvoicePdf({
  slug,
  restaurantName,
  restaurantAdresse,
}: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // ───────────────────────────────────────────────────────────────────────────
    // 1) Neues PDFKit-Dokument erzeugen
    // ───────────────────────────────────────────────────────────────────────────
    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
      autoFirstPage: false,
    });
    doc.addPage();

    // 2) Buffer-Streaming vorbereiten
    const passthrough = new PassThrough();
    const chunks: Buffer[] = [];
    doc.pipe(passthrough);
    passthrough.on("data", (chunk: Buffer) => chunks.push(chunk));
    passthrough.on("end", () => resolve(Buffer.concat(chunks)));
    passthrough.on("error", (err) => reject(err));

    // ───────────────────────────────────────────────────────────────────────────
    // 3) Daten / Variablen für die Rechnung
    // ───────────────────────────────────────────────────────────────────────────
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const rechnungsnummer = `GV-${year}${month}${day}-${randomNum}`; // z.B. GV-20250605-1234
    const datum = `${day}.${month}.${year}`;                        // z.B. "05.06.2025"
    const menge = 1;
    const einzelpreis = 29.0;                                        // 29,00 €
    const gesamt = menge * einzelpreis;                              // 29,00 €
    const zwischensummeText = `${gesamt.toFixed(2).replace(".", ",")} €`; // "29,00 €"
    const uStText = "0,00 €";                                         // "0,00 €"
    const gesamtText = `${gesamt.toFixed(2).replace(".", ",")} €`;    // "29,00 €"

    // ───────────────────────────────────────────────────────────────────────────
    // 4) Layout-Variablen
    // ───────────────────────────────────────────────────────────────────────────
    const pageWidth = doc.page.width;   // ≈ 595
    const pageHeight = doc.page.height; // ≈ 842
    const margin = 40;
    const primaryColor = "#003366";   // Dunkelblau
    const secondaryColor = "#A9A9A9"; // Grau

    // ───────────────────────────────────────────────────────────────────────────
    // 5) Kopf: Logo + Anbieter + Rechnungsinfos + Empfänger
    // ───────────────────────────────────────────────────────────────────────────
    const headerY = margin;
    const leftColumnX = margin;
    const rightColumnX = pageWidth - margin - 150;

    // 5.1 Logo links oben (falls vorhanden)
    try {
      const logoPath = path.join(process.cwd(), "public", "logo.png");
      doc.image(logoPath, leftColumnX, headerY - 5, { width: 100 });
    } catch {
      // Logo fehlt → ignorieren
    }

    // 5.2 Anbieterdaten rechts oben
    doc.font("Times-Roman")
      .fontSize(10)
      .fillColor(primaryColor)
      .text("Gastronomie-Verzeichnis", rightColumnX, headerY)
      .text("Jonas Amthor", rightColumnX, headerY + 14)
      .text("Talhof 1", rightColumnX, headerY + 28)
      .text("89522 Heidenheim", rightColumnX, headerY + 42)
      .text("E-Mail: kontakt@gastronomie-verzeichnis.de", rightColumnX, headerY + 56);

    // 5.3 Rechnungsmetadata links oben
    let cursorY = headerY;
    doc.font("Times-Roman")
      .fontSize(10)
      .fillColor("black")
      .text(`Rechnungsnummer: ${rechnungsnummer}`, leftColumnX, cursorY)
      .text(`Rechnungsdatum: ${datum}`, leftColumnX, cursorY + 14)
      .text("Zahlungsziel: 14 Tage ohne Abzug", leftColumnX, cursorY + 28);

    // 5.4 Titel "Rechnung" zentriert unter den Details
    cursorY += 80;
    doc.font("Times-Bold")
      .fontSize(20)
      .fillColor(primaryColor)
      .text("Rechnung", margin, cursorY, { align: "center", width: pageWidth - 2 * margin });

    // 5.5 Empfängerdaten links unter dem Titel
    cursorY += 80;
    doc.font("Times-Bold")
      .fontSize(10)
      .fillColor("black")
      .text("Rechnungsempfänger:", leftColumnX, cursorY);

    // Adresse aufsplitten, falls „Straße, PLZ Ort“ vorliegt
    const adresseParts = restaurantAdresse.split(",");
    const strasseHausnummer = adresseParts[0]?.trim() || restaurantAdresse;
    const plzOrt = adresseParts[1]?.trim() || "";
    doc.font("Times-Roman")
      .fontSize(10)
      .text(restaurantName, leftColumnX, cursorY + 14)
      .text(strasseHausnummer, leftColumnX, cursorY + 28)
      .text(plzOrt, leftColumnX, cursorY + 42);

    // ───────────────────────────────────────────────────────────────────────────
    // 6) Tabellenbereich
    // ───────────────────────────────────────────────────────────────────────────
    const tableTopY = cursorY + 100;
    const colPosX = margin;
    const colDescX = margin + 50;
    const colQtyX = margin + 300;
    const colPriceX = margin + 370;
    const colTotalX = margin + 450;
    const rowHeight = 20;

    // 6.1 Tabellenkopf (grau)
    doc.rect(colPosX, tableTopY, pageWidth - 2 * margin, rowHeight)
      .fillColor(secondaryColor)
      .fill();
    doc.fillColor("black");

    doc.font("Times-Bold").fontSize(10);
    doc.text("Pos.", colPosX + 2, tableTopY + 5);
    doc.text("Beschreibung", colDescX + 2, tableTopY + 5);
    doc.text("Menge", colQtyX + 2, tableTopY + 5);
    doc.text("Einzelpreis", colPriceX + 2, tableTopY + 5);
    doc.text("Gesamt", colTotalX + 2, tableTopY + 5);

    // Linien um Tabellenkopf
    doc.lineWidth(0.5).strokeColor("#999999");
    doc.moveTo(colPosX, tableTopY).lineTo(colTotalX + 70, tableTopY).stroke();
    doc.moveTo(colPosX, tableTopY + rowHeight).lineTo(colTotalX + 70, tableTopY + rowHeight).stroke();
    ;[colDescX, colQtyX, colPriceX, colTotalX, colTotalX + 70].forEach((x) => {
      doc.moveTo(x, tableTopY).lineTo(x, tableTopY + rowHeight).stroke();
    });

    // 6.2 Datenzeile
    const dataRowY = tableTopY + rowHeight;
    doc.font("Times-Roman").fontSize(10);
    doc.text("1", colPosX + 2, dataRowY + 5);
    doc.text("Freischaltung Testergebnis & Zertifikat", colDescX + 2, dataRowY + 5);
    doc.text(String(menge), colQtyX + 2, dataRowY + 5);
    doc.text(`${einzelpreis.toFixed(2).replace(".", ",")} €`, colPriceX + 2, dataRowY + 5);
    doc.text(`${gesamt.toFixed(2).replace(".", ",")} €`, colTotalX + 2, dataRowY + 5);

    // Linien um Datenzeile
    doc.lineWidth(0.5).strokeColor("#999999");
    doc.moveTo(colPosX, dataRowY).lineTo(colTotalX + 70, dataRowY).stroke();
    doc.moveTo(colPosX, dataRowY + rowHeight).lineTo(colTotalX + 70, dataRowY + rowHeight).stroke();
    ;[colDescX, colQtyX, colPriceX, colTotalX, colTotalX + 70].forEach((x) => {
      doc.moveTo(x, dataRowY).lineTo(x, dataRowY + rowHeight).stroke();
    });

    // ───────────────────────────────────────────────────────────────────────────
    // 7) Summen unterhalb der Tabelle
    // ───────────────────────────────────────────────────────────────────────────
    const summaryStartY = dataRowY + rowHeight + 60;
    const summaryX = pageWidth - margin - 100;
    doc.font("Times-Roman").fontSize(10);
    doc.text("Zwischensumme:", summaryX - 100, summaryStartY);
    doc.text(zwischensummeText, summaryX, summaryStartY, { align: "right" });
    doc.text("Umsatzsteuer (0 %):", summaryX - 100, summaryStartY + 14);
    doc.text(uStText, summaryX, summaryStartY + 14, { align: "right" });
    doc.font("Times-Bold").fontSize(10)
      .text("Gesamt:", summaryX - 100, summaryStartY + 28)
      .text(gesamtText, summaryX, summaryStartY + 28, { align: "right" });

    // ───────────────────────────────────────────────────────────────────────────
    // 8) Hinweistext (Reverse-Charge)
    // ───────────────────────────────────────────────────────────────────────────
    const reverseY = summaryStartY + 100;
    doc.font("Times-Roman").fontSize(10).fillColor("black");
    doc.text(
      "Hinweis nach Reverse-Charge-Verfahren: Die Steuerschuldnerschaft geht auf den Leistungsempfänger über (Paragraph 13b UStG / Artikel 196 MwSt-Richtlinie).",
      margin,
      reverseY,
      { width: pageWidth - 2 * margin, align: "left" }
    );

    // ───────────────────────────────────────────────────────────────────────────
    // 9) Zahlungsinformationen
    // ───────────────────────────────────────────────────────────────────────────
    const payInfoY = reverseY + 60;
    doc.font("Times-Bold").fontSize(10)
      .text("Zahlungsinformationen", margin, payInfoY);
    doc.font("Times-Roman").fontSize(10)
      .text("Bank: Postbank Heidenheim", margin, payInfoY + 14)
      .text("IBAN: DE600100700789267701", margin, payInfoY + 28)
      .text("BIC: PBNKDEFF", margin, payInfoY + 42);

    // ───────────────────────────────────────────────────────────────────────────
    // 10) Footer (Dankestext + Kontakt)
    // ───────────────────────────────────────────────────────────────────────────
    const footerY = pageHeight - margin - 40;
    doc.font("Times-Roman").fontSize(10)
      .text(
        "Vielen Dank für Ihren Auftrag! Bitte überweisen Sie den Gesamtbetrag innerhalb von 14 Tagen auf das oben genannte Konto.",
        margin,
        footerY - 20,
        { align: "center", width: pageWidth - 2 * margin }
      )
      .fontSize(8)
      .text(
        "Gastronomie-Verzeichnis | Jonas Amthor | Talhof 1, 89522 Heidenheim | E-Mail: kontakt@gastronomie-verzeichnis.de",
        margin,
        footerY,
        { align: "center", width: pageWidth - 2 * margin }
      );

    // 11) PDF beenden
    doc.end();
  });
}
