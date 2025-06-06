// File: src/app/faq/page.tsx
"use client";

import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

const faqEntries: FAQItem[] = [
  {
    id: "1",
    question: "Warum habe ich Post von Ihnen erhalten?",
    answer:
      "Wir führen ein unabhängiges, gastzentriertes Bewertungsverfahren durch. Ihr Betrieb wurde anhand öffentlich zugänglicher Informationen in den Prüfpool aufgenommen. Mit dem Brief erhalten Sie Ihren Verifizierungscode, um das Testergebnis online einzusehen.",
  },
  {
    id: "2",
    question: "Muss ich irgendetwas unterschreiben, um teilzunehmen?",
    answer:
      "Nein. Die Prüfung basiert ausschließlich auf öffentlich zugänglichen Daten sowie Gast-Perspektiven. Ihre Mitwirkung ist freiwillig und beginnt erst, wenn Sie das Ergebnis aktiv freischalten.",
  },
  {
    id: "3",
    question: "Ist das Ergebnis öffentlich sichtbar?",
    answer:
      "Nein. Das Resultat bleibt solange ausschließlich für Sie einsehbar, bis Sie es selbst veröffentlichen und verifizieren.",
  },
  {
    id: "4",
    question: "Wo finde ich meinen Code?",
    answer:
      "Der Code befindet sich im Anschreiben. Er besteht aus sechs alphanumerischen Zeichen (z. B. AB12-CD34).",
  },
  {
    id: "5",
    question: "Was passiert, wenn ich den Code verliere?",
    answer:
      "Bitte kontaktieren Sie uns per E-Mail unter kontakt@gastronomie-verzeichnis.de.",
  },
  {
    id: "6",
    question: "Kann der Code mehrfach genutzt werden?",
    answer:
      "Der Code erlaubt genau eine Freischaltung. Nach erfolgreicher Bezahlung wird er automatisch deaktiviert.",
  },
  {
    id: "7",
    question: "Wie hoch sind die Gebühren?",
    answer:
      "Die einmalige Gebühr beträgt 29 €. Darin enthalten sind:\n\n" +
      "• Testbericht (PDF)\n" +
      "• Zertifikat (JPG + PDF)",
  },
  {
    id: "8",
    question: "Welche Zahlungsart steht zur Verfügung?",
    answer:
      "Derzeit Rechnung/Überweisung. Sie erhalten sofort nach Klick auf „Jetzt bezahlen“:\n\n" +
      "• Sofortigen Bildschirmzugriff auf das Ergebnis\n" +
      "• Eine E-Mail mit Zertifikat & Rechnung (Zahlungsziel: 14 Tage)",
  },
  {
    id: "9",
    question: "Was passiert, wenn ich nicht überweise?",
    answer:
      "Ihr Zugang bleibt aktiv. Sollte die Zahlung nicht innerhalb der Frist eingehen, erinnern wir Sie zweimal. Erfolgt danach kein Ausgleich, sehen wir uns gezwungen, die Forderung an ein Inkassobüro abzugeben.",
  },
  {
    id: "10",
    question: "Wie lange ist der Test bzw. das Zertifikat gültig?",
    answer:
      "Der Test und das Zertifikat sind mindestens 12 Monate gültig. Sollten wir uns entscheiden, erneut einen Test durchzuführen, erlischt die Gültigkeit mit dem neuen Ergebnis.",
  },
  {
    id: "11",
    question: "Darf ich das Zertifikat in Werbung oder Social Media nutzen?",
    answer:
      "Ja, solange Sie das Bildmaterial unverändert verwenden und das Ausstellungsjahr sichtbar bleibt.",
  },
  {
    id: "12",
    question: "Kann ich Korrekturen oder eine Nachprüfung beantragen?",
    answer:
      "Selbstverständlich. Reichen Sie innerhalb von 14 Tagen eine schriftliche Stellungnahme samt Nachweisen ein. Wir prüfen und aktualisieren das Ergebnis gegebenenfalls kostenlos.",
  },
  {
    id: "13",
    question: "Welche Daten speichern Sie?",
    answer:
      "Wir speichern ausschließlich:\n\n" +
      "• Betriebsname & Adresse\n" +
      "• Kontakt-E-Mail, die Sie beim Freischalten angeben\n" +
      "• Zahlungsstatus\n\n" +
      "Alle Daten werden gemäß DSGVO auf Servern in der EU gehostet und nach 24 Monaten anonymisiert.",
  },
  {
    id: "14",
    question: "Wer hat Zugriff auf mein Ergebnis?",
    answer:
      "Nur verifizierte interne Fachpersonen. Ohne Ihre ausdrückliche Freigabe werden keine Daten an Dritte weitergegeben.",
  },
  {
    id: "15",
    question: "Meine E-Mail kam nicht an – was tun?",
    answer:
      "Bitte prüfen Sie Spam- und Werbeordner. Falls Sie nichts finden, melden Sie sich mit Betriebsname und Code unter kontakt@gastronomie-verzeichnis.de.",
  },
  {
    id: "16",
    question: "Welche Browser werden unterstützt?",
    answer:
      "Aktuelle Versionen von Chrome, Firefox, Edge und Safari. Für mobile Endgeräte empfehlen wir eine Bildschirmbreite von mindestens 360 px.",
  },
  {
    id: "17",
    question: "Technischer Support",
    answer:
      "Senden Sie uns einfach eine E-Mail an kontakt@gastronomie-verzeichnis.de.",
  },
  {
    id: "18",
    question: "Code-Service / Ersatzcodes",
    answer:
      "Senden Sie uns einfach eine E-Mail an kontakt@gastronomie-verzeichnis.de.",
  },
  {
    id: "19",
    question: "Allgemeine Anfragen",
    answer:
      "Senden Sie uns einfach eine E-Mail an kontakt@gastronomie-verzeichnis.de.",
  },
];

export default function FAQPage() {
  const [openIds, setOpenIds] = useState<string[]>([]);

  function toggleItem(id: string) {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  return (
    <main className="bg-gray-50 py-8">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* Seitenüberschrift */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Häufig gestellte Fragen (FAQ)
        </h1>
        <p className="text-xs text-gray-600 mb-8">
          Stand 2025 – wird fortlaufend erweitert
        </p>

        {/* FAQ-Liste */}
        <div className="space-y-4">
          {faqEntries.map(({ id, question, answer }) => {
            const isOpen = openIds.includes(id);
            return (
              <div
                key={id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <button
                  onClick={() => toggleItem(id)}
                  className="w-full flex items-center justify-between px-4 py-3 focus:outline-none cursor-pointer"
                >
                  <span className="text-gray-800 text-sm font-medium">
                    {id} | {question}
                  </span>
                  {isOpen ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
