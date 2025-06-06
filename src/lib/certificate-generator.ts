// src/lib/certificate-generator.ts

import { createCanvas, loadImage, CanvasRenderingContext2D, registerFont } from "canvas";
import path from "path";

// ---------------------------
// Schriftart registrieren
// ---------------------------
// Hier registrieren wir eine benutzerdefinierte TTF‐Datei aus dem Verzeichnis "src/fonts".
// Passe den Pfad und den Familiennamen an deine Font‐Datei an.
registerFont(
  path.join(process.cwd(), "public", "fonts", "Roboto_Condensed-Regular.ttf"),
  { family: "Roboto Condensed", weight: "normal" }
);
registerFont(
  path.join(process.cwd(), "public", "fonts", "Roboto_Condensed-Bold.ttf"),
  { family: "Roboto Condensed", weight: "bold" }
);

// ---------------------------
// Konfiguration / Konstanten
// ---------------------------
const CERT_WIDTH = 1200;
const CERT_HEIGHT = 1800;

const BASE_TITLE_SIZE = 80;
const BASE_HEADER_SMALL_SIZE = 32;
const BASE_HEADER_SIZE = 40;
const BASE_TEXT_SIZE = 30;
const BASE_SMALL_SIZE = 24;

const DARK_GRAY = "#323232";
const GOLD = "#D4AF37";
const LIGHT_GRAY = "#E6E6E6";
const BLACK = "#000000";
const RED = "#DE2110";
const GOLD_FLAG = "#FFCE00";

const MARGIN = 20; // 20px Abstand zu den Rändern
const LOGO_FILENAME = "logo.png";            // lege dein Logo unter /public/logo.png ab
const SIGNATURE_FILENAME = "unterschrift.png"; // lege deine Signatur unter /public/unterschrift.png ab

// ---------------------------
// Helper: liefert einen Canvas‐Font‐String für "Roboto Condensed"
// ---------------------------
function getFont(fontSize: number, bold = false): string {
  const family = "Roboto Condensed";
  const weight = bold ? "bold" : "normal";
  return `${weight} ${fontSize}px "${family}"`;
}

// ---------------------------
// Helper: Fünfzackigen Stern zeichnen (Teilfüllung wie in Python‐Version)
// ---------------------------
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  fillColor: string,
  fillRatio = 1.0
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

  // 1) Ungefüllter (hellgrauer) Stern
  ctx.save();
  ctx.beginPath();
  points.forEach(([x, y], i) => {
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = LIGHT_GRAY;
  ctx.fill();
  ctx.restore();

  // 2) Teilweise oder Vollfüllung mit Gold
  if (fillRatio > 0) {
    ctx.save();
    // Clip‐Region definieren: linkes Rechteck entsprechend fillRatio
    ctx.beginPath();
    ctx.rect(minX, minY, starWidth * fillRatio, starHeight);
    ctx.clip();

    ctx.beginPath();
    points.forEach(([x, y], i) => {
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.restore();
  }

  // 3) Umriss des Sterns (dunkelgrau)
  ctx.beginPath();
  points.forEach(([x, y], i) => {
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = DARK_GRAY;
  ctx.stroke();
}

// ---------------------------
// Hauptfunktion: Zertifikat generieren
// ---------------------------
// Übergabe: restaurantName (string), address (string), rating (number), slug (string)
// Liefert: Buffer mit PNG‐Daten
// ---------------------------
export async function createCertificatePng({
  restaurantName,
  address,
  rating,
  slug,
}: {
  restaurantName: string;
  address: string;
  rating: number;
  slug: string;
}): Promise<Buffer> {
  // 1) Canvas erstellen
  const canvas = createCanvas(CERT_WIDTH, CERT_HEIGHT);
  const ctx = canvas.getContext("2d");

  // 2) Hintergrund weiß füllen
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, CERT_WIDTH, CERT_HEIGHT);

  // ---------------------------
  // 3) Kopfbereich: Flagge + "Gastronomie-Verzeichnis"
  // ---------------------------
  const headerText = "Gastronomie-Verzeichnis";
  ctx.font = getFont(BASE_HEADER_SMALL_SIZE);
  ctx.fillStyle = DARK_GRAY;
  const headerMetrics = ctx.measureText(headerText);
  // Höhe ermitteln (Ascent + Descent)
  const headerHeight =
    headerMetrics.actualBoundingBoxAscent +
    headerMetrics.actualBoundingBoxDescent;

  // Flagge links (schwarz / rot / gold)
  // Ursprünglich flagY = 50 + 5; jetzt um 3px höher → 50 + 2
  const flagX = 50;
  const flagY = 50 + 2; // leicht angehoben
  const flagW = 10;
  const segmentH = headerHeight / 3;
  ctx.fillStyle = BLACK;
  ctx.fillRect(flagX, flagY, flagW, segmentH);
  ctx.fillStyle = RED;
  ctx.fillRect(flagX, flagY + segmentH, flagW, segmentH);
  ctx.fillStyle = GOLD_FLAG;
  ctx.fillRect(flagX, flagY + 2 * segmentH, flagW, segmentH);

  // Text rechts neben Flagge
  ctx.fillStyle = DARK_GRAY;
  ctx.font = getFont(BASE_HEADER_SMALL_SIZE);
  ctx.fillText(
    headerText,
    flagX + flagW + 5,
    50 + headerHeight // so wie im Python‐Code
  );

  // ---------------------------
  // 4) Logo oben rechts (maximal 200×200 px)
  // ---------------------------
  try {
    const logoPath = path.join(process.cwd(), "public", LOGO_FILENAME);
    const logoImg = await loadImage(logoPath);
    let lw = logoImg.width;
    let lh = logoImg.height;
    const scale = Math.min(200 / lw, 200 / lh);
    lw = lw * scale;
    lh = lh * scale;
    ctx.drawImage(logoImg, CERT_WIDTH - lw - 50, 50, lw, lh);
  } catch {
    // Falls das Logo nicht existiert, ignorieren wir
  }

  // ---------------------------
  // 5) Titel "ZERTIFIKAT" zentriert
  // ---------------------------
  ctx.fillStyle = DARK_GRAY;
  ctx.font = getFont(BASE_TITLE_SIZE, true);
  const titleText = "ZERTIFIKAT";
  const titleMetrics = ctx.measureText(titleText);
  const titleW = titleMetrics.width;
  ctx.fillText(titleText, (CERT_WIDTH - titleW) / 2, 300);

  // ---------------------------
  // 6) Einleitungstext (drei Zeilen) zentriert
  // ---------------------------
  ctx.font = getFont(BASE_TEXT_SIZE);
  const introLines = [
    "Hiermit wird bestätigt, dass der nachfolgend genannte",
    "Gastronomiebetrieb auf Qualität und Hygiene geprüft wurde.",
    "Hierbei wurde folgendes Ergebnis erzielt:",
  ];
  let yOffset = 460;
  for (const line of introLines) {
    const m = ctx.measureText(line);
    ctx.fillText(line, (CERT_WIDTH - m.width) / 2, yOffset);
    yOffset += BASE_TEXT_SIZE + 10;
  }

  // ---------------------------
  // 7) Restaurant-Name (dynamische Schriftgröße, um 20px Rand einzuhalten)
  // ---------------------------
  let fontSizeName = BASE_HEADER_SIZE;
  ctx.font = getFont(fontSizeName);
  let nmMetrics = ctx.measureText(restaurantName);
  while (nmMetrics.width > CERT_WIDTH - 2 * MARGIN) {
    fontSizeName -= 2;
    ctx.font = getFont(fontSizeName);
    nmMetrics = ctx.measureText(restaurantName);
  }
  const nameW = nmMetrics.width;
  const nameH =
    nmMetrics.actualBoundingBoxAscent + nmMetrics.actualBoundingBoxDescent;
  const nameY = yOffset + 300 - 20;
  ctx.fillText(restaurantName, (CERT_WIDTH - nameW) / 2, nameY);

  // ---------------------------
  // 8) Adresse (dynamische Schriftgröße, um Rand einzuhalten)
  // ---------------------------
  let fontSizeAddr = BASE_TEXT_SIZE;
  ctx.font = getFont(fontSizeAddr);
  let addrMetrics = ctx.measureText(address);
  while (addrMetrics.width > CERT_WIDTH - 2 * MARGIN) {
    fontSizeAddr -= 2;
    ctx.font = getFont(fontSizeAddr);
    addrMetrics = ctx.measureText(address);
  }
  const addrW = addrMetrics.width;
  const addrH =
    addrMetrics.actualBoundingBoxAscent + addrMetrics.actualBoundingBoxDescent;
  const addrY = nameY + nameH + 20;
  ctx.fillText(address, (CERT_WIDTH - addrW) / 2, addrY);

  // ---------------------------
  // 9) Sterne-Bewertung (5 Sterne, evtl. teilweise gefüllt)
  //     – Abstand Stern→Text jetzt 30px +20px = 50px
  //     – Sterne + Text zusätzlich 70px nach oben verschoben
  //     Ursprünglich: addrY + addrH + 350
  //     Nach letzten Anpassungen: addrY + addrH + 250 (weil 350–100)
  // ---------------------------
  const starRadius = 40;
  const totalStarWidth = starRadius * 2 * 5 + 20 * 4;
  // Neuer Wert: addrY + addrH + 250 (d.h. 350 – 100 px nach oben)
  const starY = addrY + addrH + 250;
  const startX = (CERT_WIDTH - totalStarWidth) / 2 + starRadius;

  const fullStars = Math.floor(rating);
  const partialRatio = rating - fullStars;

  // Volle Sterne
  for (let i = 0; i < fullStars; i++) {
    const cx = startX + i * (2 * starRadius + 20);
    drawStar(ctx, cx, starY, starRadius, GOLD, 1.0);
  }
  // Teilweise gefüllter Stern
  if (partialRatio > 0 && fullStars < 5) {
    const cx = startX + fullStars * (2 * starRadius + 20);
    drawStar(ctx, cx, starY, starRadius, GOLD, partialRatio);
  }
  // Ungefüllte Sterne
  for (let i = fullStars + (partialRatio > 0 ? 1 : 0); i < 5; i++) {
    const cx = startX + i * (2 * starRadius + 20);
    drawStar(ctx, cx, starY, starRadius, GOLD, 0.0);
  }

  // Bewertungstext unter den Sternen: statt +30px nun +50px Abstand
  ctx.font = getFont(BASE_HEADER_SIZE);
  const ratingText = `${rating.toFixed(1)} von 5 Sternen`;
  const rtMetrics = ctx.measureText(ratingText);
  ctx.fillText(
    ratingText,
    (CERT_WIDTH - rtMetrics.width) / 2,
    starY + starRadius + 50
  );

  // ---------------------------
  // 10) Signatur-Bild full-width am unteren Rand (ersetzt Linie/Datum)
  // ---------------------------
  try {
    const sigPath = path.join(process.cwd(), "public", SIGNATURE_FILENAME);
    const sigImg = await loadImage(sigPath);
    // Sig auf gesamte Breite skalieren
    const scale = CERT_WIDTH / sigImg.width;
    const newW = CERT_WIDTH;
    const newH = sigImg.height * scale;
    const sigY = CERT_HEIGHT - newH;
    ctx.drawImage(sigImg, 0, sigY, newW, newH);
  } catch {
    // Falls das Signatur-Bild fehlt, ignorieren wir
  }

  // ---------------------------
  // 11) Ausstellungsdatum rechts unten
  // ---------------------------
  const todayStr = new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const dateText = `Ausstellungsdatum: ${todayStr}`;
  ctx.font = getFont(BASE_SMALL_SIZE);
  const dtMetrics = ctx.measureText(dateText);
  ctx.fillText(dateText, CERT_WIDTH - dtMetrics.width - 100, CERT_HEIGHT - 50);

  // ---------------------------
  // 12) PNG-Buffer zurückliefern
  // ---------------------------
  return canvas.toBuffer("image/png");
}
