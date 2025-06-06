// File: src/app/testmethodik/page.tsx
export default function TestmethodikPage() {
  return (
    <main className="bg-gray-50 py-8">
      {/* Container wie bei anderen Seiten (max-w-screen-xl, gleiche Ränder) */}
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* Überschrift */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Testmethodik</h1>

        {/* ─────────────────────────────────────────────────────────────────────────── */}
        {/* 1. Ziel & Perspektive */}
        {/* ─────────────────────────────────────────────────────────────────────────── */}
        <section className="space-y-2">
          <h2 className="text-lg font-medium text-gray-800">1 Ziel &amp; Perspektive</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Diese Methodik beschreibt ein gastzentriertes Bewertungsverfahren für gastronomische Betriebe
            aller Kategorien. <span className="font-semibold text-gray-800">Ziel</span> ist es, auf Basis
            wissenschaftlich fundierter Kriterien ein differenziertes Qualitäts-, Service- und
            Nachhaltigkeitsprofil zu erstellen, das die tatsächliche Gästeerfahrung widerspiegelt und
            zugleich objektiv vergleichbar bleibt.
          </p>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────── */}
        {/* 2. Wissenschaftlicher Rahmen */}
        {/* ─────────────────────────────────────────────────────────────────────────── */}
        <section className="mt-6 space-y-2">
          <h2 className="text-lg font-medium text-gray-800">2 Wissenschaftlicher Rahmen</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Die Bewertungslogik orientiert sich an anerkannten Standards der Konsumenten- und
            Ernährungsforschung, der Service-Quality-Science sowie einschlägigen Normen des
            Qualitätsmanagements (<span className="font-semibold text-gray-800">DIN EN ISO 9001, DIN EN ISO 22000</span>).
            Zusätzlich werden Leitlinien zu Barrierefreiheit, Nachhaltigkeit (
            <span className="font-semibold text-gray-800">SDG 12</span>) und digitaler Teilhabe
            berücksichtigt.
          </p>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────── */}
        {/* 3. Datenquellen & Triangulation */}
        {/* ─────────────────────────────────────────────────────────────────────────── */}
        <section className="mt-6 space-y-2">
          <h2 className="text-lg font-medium text-gray-800">3 Datenquellen &amp; Triangulation</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Um valide Ergebnisse zu sichern, kommt ein mehrstufiges Triangulationskonzept zum Einsatz.
            Dabei werden ausschließlich Informationsquellen herangezogen, die Gästen unmittelbar oder
            mittelbar zugänglich sind.
          </p>

          {/* ──────────────────────────────────────────────────────── */}
          {/* A) Mobile: „Stacked Cards“ (nur <640px) */}
          {/* ──────────────────────────────────────────────────────── */}
          <div className="sm:hidden space-y-4">
            {[
              {
                datenstrom: "On-Site Observation",
                erhebungsform: "strukturierte Beobachtung im öffentlichen Gästebereich",
                inhalt: "Ambiente, Serviceinteraktion, Sauberkeit, Geruchsprofil, Akustik",
                zweck: "Erfassung realer Gästeeindrücke",
              },
              {
                datenstrom: "Open-Source Research",
                erhebungsform: "systematisierte Desk-Analyse",
                inhalt:
                  "Speisekarten, Preisstrukturen, Herkunftsangaben, digitale Auftritte, öffentlich verfügbare Hygiene-Infos",
                zweck: "Kontextualisierung &amp; Plausibilitätscheck",
              },
              {
                datenstrom: "Multimodale Analytik",
                erhebungsform: "KI-gestützte Auswertung von Bild-, Text- &amp; Menüdaten",
                inhalt: "Präsentationsästhetik, Portionierung, Nährwertschätzung, Menu-Engineering",
                zweck: "Ergänzung visueller &amp; ernährungsbezogener Dimensionen",
              },
              {
                datenstrom: "Stakeholder-Feedback",
                erhebungsform: "Panel- und Community-Befragungen",
                inhalt: "Gästebewertungen, Barrierefreiheits-Erfahrungen, Nachhaltigkeitswahrnehmung",
                zweck: "Erweiterung der Nutzer*innenperspektive",
              },
            ].map((row, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-md bg-white p-4 shadow-sm"
              >
                <div className="mb-2">
                  <span className="block text-xs font-medium text-gray-500">Datenstrom</span>
                  <span className="block mt-0.5 text-sm text-gray-800">{row.datenstrom}</span>
                </div>
                <div className="mb-2">
                  <span className="block text-xs font-medium text-gray-500">Erhebungsform</span>
                  <span className="block mt-0.5 text-sm text-gray-800">{row.erhebungsform}</span>
                </div>
                <div className="mb-2">
                  <span className="block text-xs font-medium text-gray-500">Typischer Inhalt</span>
                  <span className="block mt-0.5 text-sm text-gray-800">{row.inhalt}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-500">Zweck</span>
                  <span className="block mt-0.5 text-sm text-gray-800">{row.zweck}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ──────────────────────────────────────────────────────── */}
          {/* B) Ab sm (>=640px): normale Tabelle */}
          {/* ──────────────────────────────────────────────────────── */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-gray-700">
              <thead>
                <tr className="bg-gray-100">
                  <th className="w-1/4 px-3 py-2 border border-gray-200 text-left font-medium text-xs sm:text-sm">
                    Datenstrom
                  </th>
                  <th className="w-1/4 px-3 py-2 border border-gray-200 text-left font-medium text-xs sm:text-sm">
                    Erhebungsform
                  </th>
                  <th className="w-1/4 px-3 py-2 border border-gray-200 text-left font-medium text-xs sm:text-sm">
                    Typischer Inhalt
                  </th>
                  <th className="w-1/4 px-3 py-2 border border-gray-200 text-left font-medium text-xs sm:text-sm">
                    Zweck
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2 border border-gray-200 align-top text-xs sm:text-sm">
                    On-Site Observation
                  </td>
                  <td className="px-3 py-2 border border-gray-200 align-top text-xs sm:text-sm">
                    strukturierte Beobachtung im öffentlichen Gästebereich
                  </td>
                  <td className="px-3 py-2 border border-gray-200 align-top text-xs sm:text-sm">
                    Ambiente, Serviceinteraktion, Sauberkeit, Geruchsprofil, Akustik
                  </td>
                  <td className="px-3 py-2 border border-gray-200 align-top text-xs sm:text-sm">
                    Erfassung realer Gästeeindrücke
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 align-top text-xs sm:text-sm">
                    Open-Source Research
                  </td>
                  <td className="px-3 py-2 border border-gray-200 align-top text-xs sm:text-sm">
                    systematisierte Desk-Analyse
                  </td>
                  <td className="px-3 py-2 border border-gray-200 align-top text-xs sm:text-sm">
                    Speisekarten, Preisstrukturen, Herkunftsangaben, digitale Auftritte, öffentlich
                    verfügbare Hygiene-Infos
                  </td>
                  <td className="px-3 py-2 border border-gray-200 align-top text-xs sm:text-sm">
                    Kontextualisierung &amp; Plausibilitätscheck
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 border border-gray-200 align-top text-xs sm:text-sm">
                    Multimodale Analytik
                  </td>
                  <td className="px-3 py-2 border border-gray-200 align-top text-xs sm:text-sm">
                    KI-gestützte Auswertung von Bild-, Text- &amp; Menüdaten
                  </td>
                  <td className="px-3 py-2 border border-gray-200 align-top text-xs sm:text-sm">
                    Präsentationsästhetik, Portionierung, Nährwertschätzung, Menu-Engineering
                  </td>
                  <td className="px-3 py-2 border border-gray-200 align-top text-xs sm:text-sm">
                    Ergänzung visueller &amp; ernährungsbezogener Dimensionen
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 align-top text-xs sm:text-sm">
                    Stakeholder-Feedback
                  </td>
                  <td className="px-3 py-2 border border-gray-200 align-top text-xs sm:text-sm">
                    Panel- und Community-Befragungen
                  </td>
                  <td className="px-3 py-2 border border-gray-200 align-top text-xs sm:text-sm">
                    Gästebewertungen, Barrierefreiheits-Erfahrungen, Nachhaltigkeitswahrnehmung
                  </td>
                  <td className="px-3 py-2 border border-gray-200 align-top text-xs sm:text-sm">
                    Erweiterung der Nutzer*innenperspektive
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-2 text-xs italic text-gray-600">
            Hinweis: Je nach Restauranttyp und Datenverfügbarkeit können einzelne
            Erhebungsschritte vor Ort stattfinden oder auf valide Distanzverfahren
            zurückgreifen.
          </p>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────── */}
        {/* 4. Bewertungsdimensionen (Auszug) */}
        {/* ─────────────────────────────────────────────────────────────────────────── */}
        <section className="mt-6 space-y-2">
          <h2 className="text-lg font-medium text-gray-800">4 Bewertungsdimensionen (Auszug)</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 leading-relaxed">
            <li>
              <span className="font-semibold text-gray-800">Produktqualität &amp; Sensorik</span> –
              Rohstoffindikatoren, Anrichtungsqualität, Konsistenz, Aromaprofil.
            </li>
            <li>
              <span className="font-semibold text-gray-800">Service &amp; Gastorientierung</span> –
              Reaktionszeit, Fachkompetenz, Angebotstransparenz, Sprachoptionen.
            </li>
            <li>
              <span className="font-semibold text-gray-800">Ambiente &amp; Aufenthaltsqualität</span> –
              Raumklima, Ergonomie, akustische und visuelle Gestaltung.
            </li>
            <li>
              <span className="font-semibold text-gray-800">Nachhaltigkeit &amp; Verantwortung</span> –
              Deklarierte Beschaffungswege, Abfallmanagement, soziale Verantwortung.
            </li>
            <li>
              <span className="font-semibold text-gray-800">Digitale Kompetenz &amp; Barrierefreiheit</span> –
              Online-Reservierung, kontaktlose Zahlung, Gebärden-/Leichte Sprache, responsive Menü-Darstellung.
            </li>
            <li>
              <span className="font-semibold text-gray-800">Preis-Leistungs-Relation</span> –
              Benchmarking innerhalb des Marktsegments unter Berücksichtigung saisonaler Schwankungen.
            </li>
          </ul>
          <p className="text-sm text-gray-700 leading-relaxed">
            Alle Dimensionen sind durch über 100 Einzelkriterien operationalisiert und mit empirisch
            hergeleiteten Gewichtungen versehen.
          </p>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────── */}
        {/* 5. Mess- & Auswertungssystematik */}
        {/* ─────────────────────────────────────────────────────────────────────────── */}
        <section className="mt-6 space-y-2">
          <h2 className="text-lg font-medium text-gray-800">5 Mess- &amp; Auswertungssystematik</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-gray-800">Skalen-Scoring:</span> Likert-basierte Ratings (1–5 / 0–100 Punkte)
            verknüpfen quantitative Messgrößen mit qualitativen Beobachtungen.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-gray-800">Algorithmische Normalisierung:</span> Z- und Robust-Z-Verfahren
            gleichen regionale Variablen aus.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-gray-800">Inter-Rater-Reliabilität:</span> Mehrere Fachpersonen bewerten
            identische Datenpunkte unabhängig; Abweichungen &gt; 10 % werden moderiert.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-gray-800">Plausibilitätsprüfung:</span> Ein Advisory Board validiert
            die Gesamtergebnisse; kritische Punkte werden stichprobenartig re-verifiziert – wahlweise durch verdeckte
            Folgebeobachtungen oder weiterführende Open-Source-Checks.
          </p>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────── */}
        {/* 6. Ergebnisdarstellung */}
        {/* ─────────────────────────────────────────────────────────────────────────── */}
        <section className="mt-6 space-y-2">
          <h2 className="text-lg font-medium text-gray-800">6 Ergebnisdarstellung</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-gray-800">Gesamtscore (0–100)</span> plus
            <span className="font-semibold text-gray-800"> Ampelklasse (A = exzellent, D = kritisch)</span>.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Detaillierter Bericht mit Stärken-/Schwächenprofil, Verbesserungsempfehlungen und Benchmark-Vergleich.
          </p>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────── */}
        {/* 7. Qualitätssicherung & Weiterentwicklung */}
        {/* ─────────────────────────────────────────────────────────────────────────── */}
        <section className="mt-6 space-y-2">
          <h2 className="text-lg font-medium text-gray-800">7 Qualitätssicherung &amp; Weiterentwicklung</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Quartals-Review des Prüfkatalogs nach Regulierungs- und Forschungslage.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Jährliche Benchmark-Studie zur Sicherung externer Validität.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Peer-Consulting mit Hochschulen, Think-Tanks und Brancheninstitutionen.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Audit-Trail &amp; Versionierung sämtlicher Kriterien-Updates.
          </p>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────── */}
        {/* 8. Ethik & Transparenz */}
        {/* ─────────────────────────────────────────────────────────────────────────── */}
        <section className="mt-6 mb-12 space-y-2">
          <h2 className="text-lg font-medium text-gray-800">8 Ethik &amp; Transparenz</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Die Bewertungsstelle agiert nach den Grundsätzen Unabhängigkeit, Nicht-Diskriminierung und
            Datenschutz-Compliance (DSGVO). Betriebe erhalten vor Veröffentlichung ein 14-tägiges
            Stellungnahme-Recht.
          </p>
        </section>
      </div>
    </main>
  );
}
