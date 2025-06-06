// File: src/lib/test-report-generator.ts

import { createCanvas, loadImage, registerFont, CanvasRenderingContext2D } from "canvas";
import path from "path";

/**
 * Zunächst: Roboto Condensed-Schriften registrieren.
 * Die TTF-Dateien liegen unter public/fonts/Roboto_Condensed-*.ttf
 */
registerFont(
  path.join(process.cwd(), "public", "fonts", "Roboto_Condensed-Regular.ttf"),
  { family: "Roboto Condensed", weight: "normal" }
);
registerFont(
  path.join(process.cwd(), "public", "fonts", "Roboto_Condensed-Bold.ttf"),
  { family: "Roboto Condensed", weight: "bold" }
);

/**
 * Helper-Funktion, um eine Schrift im Canvas zu setzen.
 * Wir verwenden nun "Roboto Condensed" anstelle von "Serif".
 * 
 * @param fontSize z. B. 18, 20, etc.
 * @param bold      true ⇒ weight: "bold", false ⇒ weight: "normal"
 */
function getFont(fontSize: number, bold = false): string {
  const family = "Roboto Condensed";
  const weight = bold ? "bold" : "normal";
  return `${weight} ${fontSize}px "${family}"`;
}

/**
 * Wrappet einen längeren Text so, dass er in einer gegebenen Pixel‐Breite bleibt.
 * Gibt ein Array von Zeilen zurück.
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Zeichnet einen fünfzackigen Stern an Position (cx, cy) mit Radius `radius`.
 * fillRatio:
 *   - 1.0 ⇒ vollständig gold‐gefüllt,
 *   - 0.0 ⇒ nur Umriss (hellgrau),
 *   - alles dazwischen ⇒ links anteilig gefüllt.
 */
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  fillColor: string,
  fillRatio: number
) {
  // 10 Punkte (5 Spitzen, 5 Zwischenpunkte)
  const points: [number, number][] = [];
  for (let i = 0; i < 10; i++) {
    const angle = Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? radius : radius * 0.5;
    const x = cx + r * Math.cos(angle);
    const y = cy - r * Math.sin(angle);
    points.push([x, y]);
  }

  // Bounding‐Box berechnen
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const starWidth = maxX - minX;
  const starHeight = maxY - minY;

  // 1) Hellgrauer, ungefüllter Stern
  ctx.save();
  ctx.beginPath();
  points.forEach(([x, y], i) => {
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = "#E6E6E6"; // LIGHT_GRAY
  ctx.fill();
  ctx.restore();

  // 2) Teil‐ oder Vollfüllung in Gold
  if (fillRatio > 0) {
    ctx.save();
    // Clip‐Region: linke fillRatio‐Anteil der Breite
    ctx.beginPath();
    ctx.rect(minX, minY, starWidth * fillRatio, starHeight);
    ctx.clip();

    ctx.beginPath();
    points.forEach(([x, y], i) => {
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = fillColor; // GOLD
    ctx.fill();
    ctx.restore();
  }

  // 3) Rand des Sterns (Dunkelgrau)
  ctx.beginPath();
  points.forEach(([x, y], i) => {
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#323232"; // DARK_GRAY
  ctx.stroke();
}

/**
 * Erstellt einen Testbericht (Gastronomie- und Hygienetest) im A4‐Format (als PNG).
 *
 * @param restaurantName   Voller Name des Betriebs
 * @param address          Adresse (Straße, PLZ Ort)
 * @param ort              Ort (Stadt) – optional, kann in address integriert sein
 * @param rating           Numerische Bewertung (0 bis 5)
 * @param description      Textbeschreibung (string), z. B. aus deinem CSV-Feld 'beschreibung'
 * @param slug             Dateiname (z. B. "el-greco-..."); dient nur zum Benennen oder Logging
 * @returns                Ein Promise<Buffer> mit den PNG‐Daten des Testberichts
 */
export async function createTestReportPng({
  restaurantName,
  address,
  ort,
  rating,
  description,
  slug,
}: {
  restaurantName: string;
  address: string;
  ort: string;
  rating: number;
  description: string;
  slug: string;
}): Promise<Buffer> {
  // 1) Canvas erstellen in A4‐Dimensionen bei 150 DPI ~ 1240×1754 px
  const width = 1240;
  const height = 1754;
  const margin = 70;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Hintergrund weiß füllen
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);

  // ---------------------------
  // 2) Kopfbereich: "Gastronomie Verzeichnis"
  // ---------------------------
  const headerText = "Gastronomie Verzeichnis";
// Mit getFont(fontSize, true) wird die Schriftart fett (weight="bold"):
    ctx.font = getFont(18, true);
    ctx.fillStyle = "#000000"; // schwarz
    ctx.fillText(headerText, margin, margin + 18);


  // ---------------------------
  // 3) Titelzeile: Name – Adresse, Ort – Deutschland
  //    → Wir umbrechen bei max. 60 Zeichen/Zeile (etwa 90 Zeichen in Pixeln).
  // ---------------------------
  const titleLine = `TESTBERICHT – ${restaurantName} – ${address}, ${ort} – Deutschland`;
  ctx.font = getFont(18, false);
  ctx.fillStyle = "#000000";
  const titleLines = wrapText(ctx, titleLine, width - 2 * margin);
  let y = margin + 40;
  for (const line of titleLines) {
    ctx.fillText(line, margin, y);
    y += 24; // Zeilenhöhe ≈ 18px + 6px Abstand
  }
  y += 18; // etwas extra Abstand

  // ---------------------------
  // 4) Unterüberschrift (fett): "Gastronomie- und Hygienetest"
  // ---------------------------
  ctx.font = getFont(20, true);
  ctx.fillText("Gastronomie- und Hygienetest", margin, y);
  y += 28;

  // ---------------------------
  // 5) Abschnitt Einleitung
  // ---------------------------
  ctx.font = getFont(20, false);
  ctx.fillStyle = "#000000";
  ctx.fillText("Einleitung", margin, y);
  y += 28;

  // Einleitungstext auswählen (z. B. zufällig; hier: erster String)
  const introTemplates = [
    `Der vorliegende Testbericht fokussiert sich auf den Betrieb „${restaurantName}“. Unter Berücksichtigung eines vielseitigen Angebots wurde eine detaillierte Prüfung durchgeführt.`,
    `Im Rahmen dieser Untersuchung wurde der Gastronomiebetrieb „${restaurantName}“ einer eingehenden Analyse unterzogen. Besonderes Augenmerk galt der Angebotsvielfalt und den Serviceparametern.`,
    `Für die nachfolgende Bewertung stand der Betrieb „${restaurantName}“ im Zentrum der Untersuchung. Dabei wurde die Angebotsstruktur sowie die Servicequalität sorgfältig erfasst.`,
    `Die vorliegende Beurteilung bezieht sich auf den Betrieb „${restaurantName}“. Es wurde eine umfassende Evaluation durchgeführt, bei der die kulinarische Ausrichtung und der Service einbezogen wurden.`,
    `Gegenstand dieses Berichts ist der Gastronomiebetrieb „${restaurantName}“. Die Erhebung erfolgte anhand eines standardisierten Prüfverfahrens mit Fokus auf Angebotsprofil und Serviceeffizienz.`,
  ];
  const idxIntro = Math.floor(Math.random() * introTemplates.length);
  let introText = introTemplates[idxIntro];
  // Wenn description bestimmte Schlüsselwörter enthält, fügen wir automatisch einen Satz an:
  const descLower = description.toLowerCase();
  let descIntro = "";
  if (descLower.includes("vegetarisch") || descLower.includes("fleischlos")) {
    descIntro = " Das Angebot hebt eine vielfältige Auswahl an vegetarischen Speisen hervor.";
  } else if (descLower.includes("panasiatisch") || descLower.includes("sushi")) {
    descIntro = " Panasiatische Spezialitäten und Sushi-Angebote prägen das kulinarische Profil.";
  } else if (descLower.includes("vietnamesisch") || descLower.includes("asiatisch")) {
    descIntro = " Authentische vietnamesische Gerichte ergänzen das Angebot.";
  } else if (descLower.includes("italienisch")) {
    descIntro = " Klassische italienische Gerichte runden die Speisekarte ab.";
  } else if (descLower.includes("burger")) {
    descIntro = " Verschiedene Burger-Varianten sorgen für eine abwechslungsreiche Speisenauswahl.";
  } else if (descLower.includes("syrisch")) {
    descIntro = " Syrische Spezialitäten bieten eine aromatische Vielfalt im Speisenangebot.";
  } else if (descLower.includes("griechisch")) {
    descIntro = " Traditionelle griechische Gerichte sind ein Schwerpunkt des kulinarischen Profils.";
  } else if (descLower.includes("türkisch")) {
    descIntro = " Typisch türkische Speisen prägen das Angebot und sorgen für authentische Geschmacksnoten.";
  }
  introText += descIntro;

  ctx.font = getFont(18, false);
  const introLines = wrapText(ctx, introText, width - 2 * margin - 20);
  for (const line of introLines) {
    ctx.fillText(line, margin + 20, y);
    y += 24;
  }
  y += 16;

  // ---------------------------
  // 6) Abschnitt Methodik
  // ---------------------------
  ctx.font = getFont(20, false);
  ctx.fillStyle = "#000000";
  ctx.fillText("Methodik", margin, y);
  y += 28;

  const methodText =
    "Die Untersuchung erfolgte auf Basis eines kombinierten Verfahrens, bestehend aus visueller Inspektion, " +
    "unobtrusiven Beobachtungen sowie deskriptiver Datenüberprüfung. " +
    "Standardisierte Bewertungsraster wurden eingesetzt, um eine objektive Vergleichbarkeit zu gewährleisten.";
  ctx.font = getFont(18, false);
  const methodLines = wrapText(ctx, methodText, width - 2 * margin - 20);
  for (const line of methodLines) {
    ctx.fillText(line, margin + 20, y);
    y += 24;
  }
  y += 16;

  // ---------------------------
  // 7) Abschnitt Ergebnisse (Kategorien + Buchstaben­noten)
  // ---------------------------
  ctx.font = getFont(20, false);
  ctx.fillText("Ergebnisse", margin, y);
  y += 28;

  // map rating zu Buchstabennoten
  function mapRatingToGrades(r: number): string[] {
    if (r >= 4.8) return ["A", "A", "A", "A-", "A", "A"];
    if (r >= 4.5) return ["A", "A-", "A-", "B+", "A-", "A"];
    if (r >= 4.2) return ["A-", "B+", "A-", "B", "A-", "A-"];
    return ["B+", "B", "B+", "B", "B+", "B+"];
  }
  const categories = [
    "Servicequalität",
    "Ambiente",
    "Produktqualität",
    "Preis-Leistungs-Relation",
    "Hygiene & Nachhaltigkeit",
    "Subjektiver Gesamteindruck",
  ];
  const grades = mapRatingToGrades(rating);

  ctx.font = getFont(18, false);
  for (let i = 0; i < categories.length; i++) {
    const line = `${categories[i]}: ${grades[i]}`;
    ctx.fillText(line, margin + 20, y);
    y += 24;
  }
  y += 16;

  // ---------------------------
  // 8) Abschnitt Diskussion
  // ---------------------------
  const discussionTemplates = [
    "Die Beobachtungen im Betrieb zeigten eine konstante Servicebereitschaft und eine flüssige Koordination im Team, die zu kurzen Wartezeiten führte.",
    "Während der Untersuchung fiel die angenehme Geräuschkulisse auf, die ein entspanntes Ambiente ermöglichte. Die Abläufe blieben auch bei hoher Auslastung reibungslos.",
    "Es zeigte sich eine effiziente Umsetzung der Bestellungen, wodurch auch in Stoßzeiten eine zufriedenstellende Geschwindigkeit erreicht wurde.",
    "Hygienestandards wurden insgesamt überzeugend eingehalten. Die Atmosphäre wirkte stimmig und unterstützte eine positive Gesamtwirkung.",
    "Bemerkenswert war die klare Struktur der Tischzuweisung, die zu einer gleichmäßigen Verteilung der Gäste führte und Überfüllung verhinderte.",
  ];
  const idxDisc = Math.floor(Math.random() * discussionTemplates.length);
  const discussionText = discussionTemplates[idxDisc];

  ctx.font = getFont(20, false);
  ctx.fillText("Diskussion", margin, y);
  y += 28;
  ctx.font = getFont(18, false);
  const discLines = wrapText(ctx, discussionText, width - 2 * margin - 20);
  for (const line of discLines) {
    ctx.fillText(line, margin + 20, y);
    y += 24;
  }
  y += 16;

  // ---------------------------
  // 9) Abschnitt Fazit
  // ---------------------------
  const conclusionTemplates = [
    `Abschließend erhält der Betrieb das Prädikat „empfehlenswert“, bestätigt durch die Bewertung von ${rating.toFixed(
      1
    )} Punkten (von maximal 5 möglichen Punkten). Eine erneute Evaluierung im Folgejahr wird angeraten.`,
    `Der Betrieb überzeugt durch solide Performance in allen bewerteten Dimensionen. Die erzielten ${rating.toFixed(
      1
    )} Punkte (von maximal 5 möglichen Punkten) unterstreichen dies. Eine kontinuierliche Qualitätsüberwachung bleibt ratsam.`,
    `Insgesamt lässt sich feststellen, dass „${restaurantName}“ mit einer Bewertung von ${rating.toFixed(
      1
    )} Punkten (von maximal 5 möglichen Punkten) eine überdurchschnittliche Servicequalität bietet. Ein Follow-up-Audit wird empfohlen.`,
    `Der Testbericht bestätigt die gegebene Bewertung von ${rating.toFixed(
      1
    )} Punkten (von maximal 5 möglichen Punkten). Empfohlen wird eine periodische Nachkontrolle zur Aufrechterhaltung der Standards.`,
    `Mit ${rating.toFixed(
      1
    )} von maximal 5 Punkten erhält der Betrieb eine deutliche Bestätigung seiner Leistungsfähigkeit. Eine jährliche Re-Auditierung würde zusätzliche Optimierungspotenziale aufdecken.`,
  ];
  const idxConc = Math.floor(Math.random() * conclusionTemplates.length);
  const conclusionText = conclusionTemplates[idxConc];

  ctx.font = getFont(20, false);
  ctx.fillText("Fazit", margin, y);
  y += 28;
  ctx.font = getFont(18, false);
  const concLines = wrapText(ctx, conclusionText, width - 2 * margin - 20);
  for (const line of concLines) {
    ctx.fillText(line, margin + 20, y);
    y += 24;
  }
  y += 30;

  // ---------------------------
  // 10) Anmerkung des Prüfers (Unterstrichenes Feld)
  // ---------------------------
  ctx.font = getFont(20, false);
  ctx.fillText("Anmerkung des Prüfers:", margin, y);
  y += 30;
  const lineWidthField = width - 2 * margin;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(margin, y);
    ctx.lineTo(margin + lineWidthField, y);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.stroke();
    y += 50;
  }
  y += 10;

  // ---------------------------
  // 11) Signatur unten links
  // ---------------------------
  const signaturePath = path.join(process.cwd(), "public", "unterschrift.png");
  try {
    const sigImg = await loadImage(signaturePath);
    // Auf ca. 800px Breite skalieren, wie im Python-Skript
    const scale = 800 / sigImg.width;
    const sigW = 800;
    const sigH = sigImg.height * scale;
    const sigX = margin;
    const sigY = height - sigH - 40;
    ctx.drawImage(sigImg, sigX, sigY, sigW, sigH);
  } catch {
    // Falls kein Signature-Bild gefunden wird, ignorieren
  }

  // 12) PNG‐Buffer zurückgeben
  return canvas.toBuffer("image/jpeg", { quality: 0.9 });
}
