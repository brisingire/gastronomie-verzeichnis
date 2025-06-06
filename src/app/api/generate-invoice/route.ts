// File: src/app/api/generate-invoice/route.ts

// ─────────────────────────────────────────────────────────────────────────────
//  Damit PDFKit mit Streams und dem lokalen Logo (im public-Ordner) arbeiten 
//  kann, muss diese Route in Node laufen (nicht Edge).
// ─────────────────────────────────────────────────────────────────────────────
export const config = {
    runtime: "nodejs",
};

import { NextResponse } from "next/server";
// Wir verwenden weiterhin die standalone-Version von PDFKit, damit keine AFM-Dateien nachgeladen werden:
const PDFDocument = require("pdfkit/js/pdfkit.standalone");
import { PassThrough } from "stream";
import path from "path";
import { supabaseServer } from "@/lib/db";

export async function GET(request: Request) {
    try {
        // ───────────────────────────────────────────────────────────────────────────
        // 1) slug aus URL-Query auslesen
        // ───────────────────────────────────────────────────────────────────────────
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get("slug");
        if (!slug) {
            return NextResponse.json({ error: "Fehlender Parameter: slug" }, { status: 400 });
        }

        // ───────────────────────────────────────────────────────────────────────────
        // 2) Restaurant-Daten aus Supabase holen (name + adresse)
        // ───────────────────────────────────────────────────────────────────────────
        const { data: restaurant, error: fetchError } = await supabaseServer
            .from("restaurants")
            .select("name, adresse")
            .eq("slug", slug)
            .single();

        if (fetchError || !restaurant) {
            return NextResponse.json({ error: "Restaurant nicht gefunden" }, { status: 404 });
        }

        const restaurantName = (restaurant.name as string) || "–";
        const restaurantAdresse = (restaurant.adresse as string) || "–";

        // ───────────────────────────────────────────────────────────────────────────
        // 3) Beispiel-Rechnungsdaten (anpassen, wenn du später dynamische Positionen
        //    o. Ä. haben möchtest)
        // ───────────────────────────────────────────────────────────────────────────
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-stellige Zufallszahl
        const rechnungsnummer = `GV-${year}${month}${day}-${randomNum}`; // z.B. GV-20250605-1234
        const datum = `${day}.${month}.${year}`; // z. B. "05.06.2025"
        const menge = 1;
        const einzelpreis = 29.0;                                 // 29,00 €
        const gesamt = menge * einzelpreis;                       // 29,00 €
        const zwischensummeText = `${gesamt.toFixed(2).replace(".", ",")} €`; // "29,00 €"
        const uStText = "0,00 €";                                  // 0 %
        const gesamtText = `${gesamt.toFixed(2).replace(".", ",")} €`;        // "29,00 €"

        // ───────────────────────────────────────────────────────────────────────────
        // 4) PDFKit im Speicher erzeugen (Buffer → später als Download zurückgeben)
        // ───────────────────────────────────────────────────────────────────────────
        const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
            const doc = new PDFDocument({
                size: "A4",
                margin: 40,
                autoFirstPage: false,
            });

            // Wir fügen manuell eine Seite hinzu, damit wir Breite/Höhe jederzeit abfragen können
            doc.addPage();

            const passthrough = new PassThrough();
            const chunks: Buffer[] = [];
            doc.pipe(passthrough);
            passthrough.on("data", (chunk: Buffer) => chunks.push(chunk));
            passthrough.on("end", () => resolve(Buffer.concat(chunks)));
            passthrough.on("error", (err) => reject(err));

            // ─────────────────────────────────────────────────────────────────────────
            // 4.1 Layout-Variablen definieren
            // ─────────────────────────────────────────────────────────────────────────
            const pageWidth = doc.page.width;   // A4-Breite in Punkten (etwa 595)
            const pageHeight = doc.page.height; // A4-Höhe (etwa 842)
            const margin = 40;                  // ausreichend Rand
            const headerY = 40;                 // Y-Koordinate für den Beginn des Headers

            // Farben definieren
            const primaryColor = "#003366"; // Dunkelblau
            const secondaryColor = "#A9A9A9"; // Grau

            // Linke Seite für Invoice-Details und Empfängerdaten
            const leftColumnX = margin;

            // Rechte Seite für Anbieterdaten
            const rightColumnX = pageWidth - margin - 150; // Platz für Meta-Daten

            // ─────────────────────────────────────────────────────────────────────────
            // 4.2 Kopfbereich: Logo (optional) + Anbieterdaten + Invoice-Details + Empfängerdaten
            // ─────────────────────────────────────────────────────────────────────────

            // 4.2.1: Logo links oben (optional)
            try {
                const logoPath = path.join(process.cwd(), "public", "logo.png");
                doc.image(logoPath, leftColumnX, headerY - 5, { width: 100 });
            } catch (_) {
                // Falls kein Logo vorhanden ist, bleibt der Platz leer
            }

            // 4.2.2: Anbieterdaten rechts oben
            doc.font("Times-Roman")
                .fontSize(10)
                .fillColor(primaryColor)
                .text("Gastronomie-Verzeichnis", rightColumnX, headerY)
                .text("Jonas Amthor", rightColumnX, headerY + 14)
                .text("Talhof 1", rightColumnX, headerY + 28)
                .text("89522 Heidenheim", rightColumnX, headerY + 42)
                .text("E-Mail: kontakt@gastronomie-verzeichnis.de", rightColumnX, headerY + 56);

            // 4.2.3: Rechnungsdetails links oben, bündig mit Anbieterdaten
            let cursorY = headerY;
            doc.font("Times-Roman")
                .fontSize(10)
                .fillColor("black")
                .text(`Rechnungsnummer: ${rechnungsnummer}`, leftColumnX, cursorY)
                .text(`Rechnungsdatum: ${datum}`, leftColumnX, cursorY + 14)
                .text("Zahlungsziel: 14 Tage ohne Abzug", leftColumnX, cursorY + 28);

            // 4.2.4: Titel "Rechnung" zentriert unter den Details
            cursorY += 80; // Erhöhter Abstand
            doc.font("Times-Bold")
                .fontSize(20)
                .fillColor(primaryColor)
                .text("Rechnung", margin, cursorY, { align: "center", width: pageWidth - 2 * margin });

            // 4.2.5: Empfängerdaten links unter dem Titel
            cursorY += 80; // Erhöhter Abstand
            doc.font("Times-Bold")
                .fontSize(10)
                .text("Rechnungsempfänger:", leftColumnX, cursorY);

            // Adresse aufteilen, falls möglich
            const adresseParts = restaurantAdresse.split(',');
            let strasseHausnummer = adresseParts[0]?.trim() || restaurantAdresse;
            let plzOrt = adresseParts[1]?.trim() || '';

            doc.font("Times-Roman")
                .fontSize(10)
                .text(restaurantName, leftColumnX, cursorY + 14)
                .text(strasseHausnummer, leftColumnX, cursorY + 28)
                .text(plzOrt, leftColumnX, cursorY + 42);

            // ─────────────────────────────────────────────────────────────────────────
            // 4.3 Tabellenbereich: Spaltenüberschriften + Datenzeile
            // ─────────────────────────────────────────────────────────────────────────
            const tableTopY = cursorY + 100; // Erhöhter Abstand
            const colPosX = margin;
            const colDescX = margin + 50;
            const colQtyX = margin + 300; // Verschieben für bessere Ausrichtung
            const colPriceX = margin + 370;
            const colTotalX = margin + 450;
            const rowHeight = 20;

            // 4.3.1: Tabellenkopf mit grauem Hintergrund
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

            // 4.3.2: Zellenrahmen für Tabellenkopf
            doc.lineWidth(0.5).strokeColor("#999999");
            doc.moveTo(colPosX, tableTopY).lineTo(colTotalX + 70, tableTopY).stroke();
            doc.moveTo(colPosX, tableTopY + rowHeight).lineTo(colTotalX + 70, tableTopY + rowHeight).stroke();
            [colDescX, colQtyX, colPriceX, colTotalX, colTotalX + 70].forEach((x) => {
                doc.moveTo(x, tableTopY).lineTo(x, tableTopY + rowHeight).stroke();
            });

            // 4.3.3: Eine Zeile mit den Rechnungspositionen
            const dataRowY = tableTopY + rowHeight;
            doc.font("Times-Roman").fontSize(10);
            doc.text("1", colPosX + 2, dataRowY + 5);
            doc.text("Freischaltung Testergebnis & Zertifikat", colDescX + 2, dataRowY + 5);
            doc.text(String(menge), colQtyX + 2, dataRowY + 5);
            doc.text(`${einzelpreis.toFixed(2).replace(".", ",")} €`, colPriceX + 2, dataRowY + 5);
            doc.text(`${gesamt.toFixed(2).replace(".", ",")} €`, colTotalX + 2, dataRowY + 5);

            // 4.3.4: Rahmen für Datenzeile
            doc.lineWidth(0.5).strokeColor("#999999");
            doc.moveTo(colPosX, dataRowY).lineTo(colTotalX + 70, dataRowY).stroke();
            doc.moveTo(colPosX, dataRowY + rowHeight).lineTo(colTotalX + 70, dataRowY + rowHeight).stroke();
            [colDescX, colQtyX, colPriceX, colTotalX, colTotalX + 70].forEach((x) => {
                doc.moveTo(x, dataRowY).lineTo(x, dataRowY + rowHeight).stroke();
            });

            // ─────────────────────────────────────────────────────────────────────────
            // 4.4 Zwischensumme / USt / Gesamt unterhalb der Tabelle (rechts ausgerichtet)
            // ─────────────────────────────────────────────────────────────────────────
            const summaryStartY = dataRowY + rowHeight + 60; // Erhöhter Abstand
            const summaryX = pageWidth - margin - 100; // Verschieben für besseren Abstand
            doc.font("Times-Roman").fontSize(10);
            doc.text("Zwischensumme:", summaryX - 100, summaryStartY);
            doc.text(zwischensummeText, summaryX, summaryStartY, { align: "right" });
            doc.text("Umsatzsteuer (0 %):", summaryX - 100, summaryStartY + 14);
            doc.text(uStText, summaryX, summaryStartY + 14, { align: "right" });
            doc.font("Times-Bold").fontSize(10)
                .text("Gesamt:", summaryX - 100, summaryStartY + 28)
                .text(gesamtText, summaryX, summaryStartY + 28, { align: "right" });

            // ─────────────────────────────────────────────────────────────────────────
            // 4.5 Hinweistext (Reverse-Charge) als ganzer Text über die Seite
            // ─────────────────────────────────────────────────────────────────────────
            const reverseY = summaryStartY + 100; // Erhöhter Abstand
            doc.font("Times-Roman").fontSize(10);
            doc.text(
                "Hinweis nach Reverse-Charge-Verfahren: Die Steuerschuldnerschaft geht auf den Leistungsempfänger über (Paragraph 13b UStG / Artikel 196 MwSt-Richtlinie).",
                margin,
                reverseY,
                { width: pageWidth - 2 * margin, align: "left" }
            );

            // 4.6 Zahlungsinformationen unterhalb des Hinweises mit mehr Abstand
            const payInfoY = reverseY + 60; // Erhöhter Abstand
            doc.font("Times-Bold").fontSize(10)
                .text("Zahlungsinformationen", margin, payInfoY);
            doc.font("Times-Roman").fontSize(10)
                .text("Bank: Postbank Heidenheim", margin, payInfoY + 14)
                .text("IBAN: DE__Platzhalter", margin, payInfoY + 28)
                .text("BIC: PBNKDEFFXXX (Platzhalter)", margin, payInfoY + 42);

            // ─────────────────────────────────────────────────────────────────────────
            // 4.7 Abschluss‐Text / Footer (zentriert am unteren Seitenrand)
            // ─────────────────────────────────────────────────────────────────────────
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

            doc.end();
        });

        // ───────────────────────────────────────────────────────────────────────────
        // 5) PDF-Buffer als Response zurückgeben (Download mit Dateiname)
        // ───────────────────────────────────────────────────────────────────────────
        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="rechnung_${slug}.pdf"`,
            },
        });
    } catch (err: any) {
        console.error("Fehler in /api/generate-invoice:", err);
        return NextResponse.json(
            { error: "Interner Fehler bei der PDF-Erzeugung.", detail: err.message },
            { status: 500 }
        );
    }
}