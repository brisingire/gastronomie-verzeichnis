// File: src/app/kontakt/page.tsx
"use client";

export default function KontaktPage() {
  return (
    <main className="bg-gray-50 py-8">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* Seitenüberschrift */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Kontakt</h1>

        {/* Einleitung */}
        <p className="text-sm text-gray-700 leading-relaxed mb-8">
          Sie haben Fragen zu unserem Bewertungsverfahren oder möchten weitere Informationen?
          Wir helfen Ihnen gerne weiter. Nachfolgend finden Sie unsere Kontaktmöglichkeiten
          sowie unsere Erreichbarkeitszeiten. 
        </p>

        {/* Kontaktinformationen */}
        <section className="space-y-6">
          {/* 1) Ansprechpartner */}
          <div>
            <h2 className="text-lg font-medium text-gray-800">Ansprechpartner</h2>
            <p className="mt-2 text-sm text-gray-700 leading-relaxed">
              <span className="font-semibold text-gray-800">Projektleitung Qualitätssicherung:</span><br />
              Jonas Amthor
            </p>
          </div>

          {/* 2) E-Mail-Adresse */}
          <div>
            <h2 className="text-lg font-medium text-gray-800">E-Mail</h2>
            <p className="mt-2 text-sm text-gray-700 leading-relaxed">
              Für allgemeine Anfragen senden Sie uns bitte eine E-Mail an:{' '}
              <a
                href="mailto:kontakt@gastronomie-verzeichnis.de"
                className="text-blue-700 underline"
              >
                kontakt@gastronomie-verzeichnis.de
              </a>
              . Wir bemühen uns, Ihre Nachricht innerhalb von zwei Werktagen zu beantworten.
            </p>
          </div>

          

          {/* 4) Erreichbarkeitszeiten */}
          <div>
            <h2 className="text-lg font-medium text-gray-800">Erreichbarkeitszeiten</h2>
            <ul className="mt-2 list-disc list-inside text-sm text-gray-700 leading-relaxed">
              <li>Montag – Donnerstag: 09:00 – 17:00 Uhr</li>
              <li>Freitag: 09:00 – 15:00 Uhr</li>
              <li>Samstag &amp; Sonntag: geschlossen</li>
            </ul>
          </div>

          {/* 5) Postanschrift */}
          <div>
            <h2 className="text-lg font-medium text-gray-800">Postanschrift</h2>
            <address className="mt-2 not-italic text-sm text-gray-700 leading-relaxed">
              Gastronomie-Verzeichnis<br />
              Jonas Amthor<br />
              Talhof 1<br />
              89522 Heidenheim<br />
              Deutschland
            </address>
          </div>

          {/* 6) Datenschutz &amp; Hinweis */}
          <div>
            <h2 className="text-lg font-medium text-gray-800">Datenschutz &amp; Hinweis</h2>
            <p className="mt-2 text-xs italic text-gray-600 leading-relaxed">
              Alle von Ihnen bereitgestellten Kontaktdaten werden ausschließlich zur Beantwortung
              Ihrer Anfrage verwendet und selbstverständlich vertraulich behandelt. Weitere
              Informationen zum Datenschutz finden Sie unter Datenschutzrichtlinien.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
