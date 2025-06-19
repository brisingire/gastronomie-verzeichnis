import { createCanvas, loadImage, registerFont, CanvasRenderingContext2D } from "canvas";
import path from "path";

// Register Roboto Condensed fonts
registerFont(
  path.join(process.cwd(), "public", "fonts", "Roboto_Condensed-Regular.ttf"),
  { family: "Roboto Condensed", weight: "normal" }
);
registerFont(
  path.join(process.cwd(), "public", "fonts", "Roboto_Condensed-Bold.ttf"),
  { family: "Roboto Condensed", weight: "bold" }
);

// Helper function to set font
function getFont(fontSize: number, bold = false): string {
  const family = "Roboto Condensed";
  const weight = bold ? "bold" : "normal";
  return `${weight} ${fontSize}px "${family}"`;
}

// Helper function to wrap text
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

// Function to draw a star (unchanged)
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  fillColor: string,
  fillRatio: number
) {
  const points: [number, number][] = [];
  for (let i = 0; i < 10; i++) {
    const angle = Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? radius : radius * 0.5;
    const x = cx + r * Math.cos(angle);
    const y = cy - r * Math.sin(angle);
    points.push([x, y]);
  }
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const starWidth = maxX - minX;
  const starHeight = maxY - minY;

  ctx.save();
  ctx.beginPath();
  points.forEach(([x, y], i) => {
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = "#E6E6E6";
  ctx.fill();
  ctx.restore();

  if (fillRatio > 0) {
    ctx.save();
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

  ctx.beginPath();
  points.forEach(([x, y], i) => {
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#323232";
  ctx.stroke();
}

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
  const width = 1240;
  const height = 1754;
  const margin = 70;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);

  // Header
  const headerText = "Gastronomie Verzeichnis";
  ctx.font = getFont(18, true);
  ctx.fillStyle = "#000000";
  ctx.fillText(headerText, margin, margin + 18);

  // Title line
  const titleLine = `TESTBERICHT – ${restaurantName} – ${address}, ${ort} – Deutschland`;
  ctx.font = getFont(18, false);
  const titleLines = wrapText(ctx, titleLine, width - 2 * margin);
  let y = margin + 40;
  for (const line of titleLines) {
    ctx.fillText(line, margin, y);
    y += 24;
  }
  y += 18;

  // Subtitle
  ctx.font = getFont(20, true);
  ctx.fillText("Gastronomie- und Hygienetest", margin, y);
  y += 28;

  // Introduction
  ctx.font = getFont(20, false);
  ctx.fillText("Einleitung", margin, y);
  y += 28;

  const introTemplates = [
    `Der vorliegende Testbericht fokussiert sich auf den Betrieb „${restaurantName}“. Unter Berücksichtigung eines vielseitigen Angebots wurde eine detaillierte Prüfung durchgeführt.`,
    `Im Rahmen dieser Untersuchung wurde der Gastronomiebetrieb „${restaurantName}“ einer eingehenden Analyse unterzogen. Besonderes Augenmerk galt der Angebotsvielfalt und den Serviceparametern.`,
    `Für die nachfolgende Bewertung stand der Betrieb „${restaurantName}“ im Zentrum der Untersuchung. Dabei wurde die Angebotsstruktur sowie die Servicequalität sorgfältig erfasst.`,
    `Die vorliegende Beurteilung bezieht sich auf den Betrieb „${restaurantName}“. Es wurde eine umfassende Evaluation durchgeführt, bei der die kulinarische Ausrichtung und der Service einbezogen wurden.`,
    `Gegenstand dieses Berichts ist der Gastronomiebetrieb „${restaurantName}“. Die Erhebung erfolgte anhand eines standardisierten Prüfverfahrens mit Fokus auf Angebotsprofil und Serviceeffizienz.`,
    `Dieser Bericht widmet sich der Bewertung des Betriebs „${restaurantName}“. Die Prüfung umfasste sowohl das kulinarische Angebot als auch die Serviceleistungen.`,
    `Im Fokus dieses Testberichts steht der Betrieb „${restaurantName}“. Eine gründliche Analyse des Angebots und der Serviceprozesse wurde vorgenommen.`,
    `Die Untersuchung konzentrierte sich auf den Gastronomiebetrieb „${restaurantName}“. Dabei wurde die Qualität des Angebots sowie der Kundenservice detailliert bewertet.`,
    `Ziel dieses Berichts ist es, den Betrieb „${restaurantName}“ zu bewerten. Die Erhebung erfolgte unter Berücksichtigung der Speisenvielfalt und des Servicestandards.`,
    `Der Gastronomiebetrieb „${restaurantName}“ wurde für diesen Testbericht einer umfassenden Prüfung unterzogen, die sowohl das Angebot als auch den Service beleuchtete.`,
  ];
  const idxIntro = Math.floor(Math.random() * introTemplates.length);
  let introText = introTemplates[idxIntro];

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

  // Methodology
  ctx.font = getFont(20, false);
  ctx.fillText("Methodik", margin, y);
  y += 28;

  const methodTemplates = [
    "Die Untersuchung erfolgte auf Basis eines kombinierten Verfahrens, bestehend aus visueller Inspektion, unobtrusiven Beobachtungen sowie deskriptiver Datenüberprüfung. Standardisierte Bewertungsraster wurden eingesetzt, um eine objektive Vergleichbarkeit zu gewährleisten.",
    "Die Bewertung wurde durch eine Kombination aus direkten Beobachtungen, diskreten Inspektionen und Datenanalysen erstellt. Einheitliche Kriterien sicherten eine faire Einschätzung.",
    "Zur Durchführung der Analyse kamen visuelle Kontrollen, unauffällige Beobachtungen und die Auswertung von Daten zum Einsatz. Standardisierte Bewertungsmethoden garantierten Objektivität.",
    "Die Erhebung basierte auf einem Mix aus visuellen Inspektionen, versteckten Beobachtungen und der Überprüfung von Daten. Einheitliche Bewertungsraster sorgten für Vergleichbarkeit.",
    "Die Bewertung erfolgte mittels eines systematischen Ansatzes, der Sichtprüfungen, unauffällige Beobachtungen und Datenanalysen umfasste. Standardkriterien gewährleisteten eine objektive Beurteilung.",
    "Die Untersuchung stützte sich auf visuelle Beurteilungen, diskrete Beobachtungen und die Analyse verfügbarer Daten. Einheitliche Bewertungsvorgaben sicherten eine faire Bewertung.",
    "Für die Analyse wurden Sichtkontrollen, unauffällige Beobachtungen und Datenprüfungen kombiniert. Standardisierte Methoden stellten eine objektive Vergleichbarkeit sicher.",
  ];
  const idxMethod = Math.floor(Math.random() * methodTemplates.length);
  const methodText = methodTemplates[idxMethod];

  ctx.font = getFont(18, false);
  const methodLines = wrapText(ctx, methodText, width - 2 * margin - 20);
  for (const line of methodLines) {
    ctx.fillText(line, margin + 20, y);
    y += 24;
  }
  y += 16;

  // Results
  ctx.font = getFont(20, false);
  ctx.fillText("Ergebnisse", margin, y);
  y += 28;

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

  // Discussion
  ctx.font = getFont(20, false);
  ctx.fillText("Diskussion", margin, y);
  y += 28;

  const discussionTemplates = [
    "Die Beobachtungen im Betrieb zeigten eine konstante Servicebereitschaft und eine flüssige Koordination im Team, die zu kurzen Wartezeiten führte.",
    "Während der Untersuchung fiel die angenehme Geräuschkulisse auf, die ein entspanntes Ambiente ermöglichte. Die Abläufe blieben auch bei hoher Auslastung reibungslos.",
    "Es zeigte sich eine effiziente Umsetzung der Bestellungen, wodurch auch in Stoßzeiten eine zufriedenstellende Geschwindigkeit erreicht wurde.",
    "Hygienestandards wurden insgesamt überzeugend eingehalten. Die Atmosphäre wirkte stimmig und unterstützte eine positive Gesamtwirkung.",
    "Bemerkenswert war die klare Struktur der Tischzuweisung, die zu einer gleichmäßigen Verteilung der Gäste führte und Überfüllung verhinderte.",
    "Die Professionalität des Personals sorgte für einen reibungslosen Ablauf und eine angenehme Gästebetreuung.",
    "Die Sauberkeit im Betrieb war vorbildlich, und die Atmosphäre trug zu einem positiven Erlebnis bei.",
    "Das Team zeigte eine hohe Flexibilität, die auch bei unerwartetem Andrang einen guten Service sicherstellte.",
    "Die Organisation der Arbeitsabläufe war beeindruckend und führte zu einer hohen Kundenzufriedenheit.",
    "Die Gäste wurden durchweg höflich und effizient bedient, was den Gesamteindruck positiv prägte.",
  ];
  const idxDisc = Math.floor(Math.random() * discussionTemplates.length);
  const discussionText = discussionTemplates[idxDisc];

  ctx.font = getFont(18, false);
  const discLines = wrapText(ctx, discussionText, width - 2 * margin - 20);
  for (const line of discLines) {
    ctx.fillText(line, margin + 20, y);
    y += 24;
  }
  y += 16;

  // Conclusion
  ctx.font = getFont(20, false);
  ctx.fillText("Fazit", margin, y);
  y += 28;

  const conclusionTemplates = [
    `Abschließend erhält der Betrieb das Prädikat „empfehlenswert“, bestätigt durch die Bewertung von ${rating.toFixed(1)} Punkten (von maximal 5 möglichen Punkten). Eine erneute Evaluierung im Folgejahr wird angeraten.`,
    `Der Betrieb überzeugt durch solide Performance in allen bewerteten Dimensionen. Die erzielten ${rating.toFixed(1)} Punkte (von maximal 5 möglichen Punkten) unterstreichen dies. Eine kontinuierliche Qualitätsüberwachung bleibt ratsam.`,
    `Insgesamt lässt sich feststellen, dass „${restaurantName}“ mit einer Bewertung von ${rating.toFixed(1)} Punkten (von maximal 5 möglichen Punkten) eine überdurchschnittliche Servicequalität bietet. Ein Follow-up-Audit wird empfohlen.`,
    `Der Testbericht bestätigt die gegebene Bewertung von ${rating.toFixed(1)} Punkten (von maximal 5 möglichen Punkten). Empfohlen wird eine periodische Nachkontrolle zur Aufrechterhaltung der Standards.`,
    `Mit ${rating.toFixed(1)} von maximal 5 Punkten erhält der Betrieb eine deutliche Bestätigung seiner Leistungsfähigkeit. Eine jährliche Re-Auditierung würde zusätzliche Optimierungspotenziale aufdecken.`,
    `Die Bewertung von ${rating.toFixed(1)} Punkten (von maximal 5 möglichen Punkten) spiegelt eine insgesamt hohe Qualität wider. Eine regelmäßige Überprüfung wird empfohlen.`,
    `Der Betrieb erzielt ${rating.toFixed(1)} Punkte (von maximal 5 möglichen Punkten) und zeigt eine solide Leistung. Eine jährliche Kontrolle wird zur Sicherung der Standards angeraten.`,
    `Mit einer Bewertung von ${rating.toFixed(1)} Punkten (von maximal 5 möglichen Punkten) bestätigt der Betrieb seine Zuverlässigkeit. Eine wiederholte Prüfung wird empfohlen.`,
    `Die erzielten ${rating.toFixed(1)} Punkte (von maximal 5 möglichen Punkten) belegen eine gute Gesamtleistung. Eine periodische Evaluierung bleibt sinnvoll.`,
    `Der Betrieb erreicht ${rating.toFixed(1)} Punkte (von maximal 5 möglichen Punkten), was seine Qualität unterstreicht. Eine regelmäßige Nachprüfung wird vorgeschlagen.`,
  ];
  const idxConc = Math.floor(Math.random() * conclusionTemplates.length);
  const conclusionText = conclusionTemplates[idxConc];

  ctx.font = getFont(18, false);
  const concLines = wrapText(ctx, conclusionText, width - 2 * margin - 20);
  for (const line of concLines) {
    ctx.fillText(line, margin + 20, y);
    y += 24;
  }
  y += 30;

  // Prüfer's Note
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

  // Signature
  const signaturePath = path.join(process.cwd(), "public", "unterschrift.png");
  try {
    const sigImg = await loadImage(signaturePath);
    const scale = 800 / sigImg.width;
    const sigW = 800;
    const sigH = sigImg.height * scale;
    const sigX = margin;
    const sigY = height - sigH - 40;
    ctx.drawImage(sigImg, sigX, sigY, sigW, sigH);
  } catch {
    // Fallback if signature image not found
  }

  return canvas.toBuffer("image/jpeg", { quality: 0.9 });
}