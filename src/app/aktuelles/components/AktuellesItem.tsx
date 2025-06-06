// src/app/aktuelles/components/AktuellesItem.tsx
import React from "react";

export type AktuellesEntry = {
  id: string;              // eindeutige ID, z.B. UUID oder Slug
  imageUrl: string;        // Link zum Vorschaubild
  category: string;        // z.B. "Aktuelles", "Ukraine-Unterstützung", o.Ä.
  title: string;           // Überschrift des Eintrags
  description: string;     // kurzer Texthintergrund / Teaser
  date: string;            // Datum im Format "DD.MM.YYYY"
  link?: string;           // Optional: Link auf Detailseite, falls gewünscht
};

/**
 * „AktuellesItem“ rendert genau einen Eintrag im gleichen Layout wie im Screenshot:
 * - Links das Bild in fixem Seitenverhältnis (7:3) oder 1/3 der Breite
 * - Rechts die Kategorie als gelber Badge, Titel, Beschreibung und Datum
 */
export default function AktuellesItem({
  imageUrl,
  category,
  title,
  description,
  date,
  link,
}: AktuellesEntry) {
  return (
    <article className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* ─── Bild‐Container ─────────────────────────────────────────────────── */}
      <div className="md:w-1/3 h-48 md:h-auto">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* ─── Text‐Container ────────────────────────────────────────────────── */}
      <div className="md:w-2/3 p-6 flex flex-col justify-between">
        {/* Kategorie‐Badge + Titel + Teaser */}
        <div>
          {/* Badge (Kategorie) */}
          <span className="inline-block bg-yellow-500 text-white text-xs font-semibold px-2 py-1  uppercase">
            {category}
          </span>

          {/* Titel (klickbar, falls ein „link“ hinterlegt ist) */}
          {link ? (
            <a
              href={link}
              className="mt-2 block text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
            >
              {title}
            </a>
          ) : (
            <h2 className="mt-2 text-2xl font-bold text-gray-800">
              {title}
            </h2>
          )}

          {/* Beschreibung/Teaser */}
          <p className="mt-3 text-gray-600 leading-relaxed">{description}</p>
        </div>

        {/* Datum (unten rechts) */}
        <div className="mt-4 text-sm text-gray-500">{date}</div>
      </div>
    </article>
  );
}
