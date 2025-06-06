// File: src/app/datenrichtlinien/page.tsx

import Link from "next/link";

export const metadata = {
  title: "Datenschutzerklärung – Gastronomie-Verzeichnis",
  description: "Datenschutzerklärung des Gastronomie-Verzeichnisses",
};

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-12 text-gray-800 font-sans">
      <div className="mx-auto max-w-screen-lg space-y-8">
        {/* Titel */}
        <h1 className="text-3xl font-semibold border-b border-gray-300 pb-2">
          Datenschutzerklärung
        </h1>

        {/* Einleitung */}
        <section className="space-y-2">
          <p className="text-base leading-snug">
            Das Gastronomie-Verzeichnis („wir“, „uns“) respektiert den Schutz Ihrer
            personenbezogenen Daten. Diese Datenschutzerklärung erläutert, welche Daten
            wir erheben, wie wir sie verwenden und welche Rechte Ihnen zustehen.
          </p>
          <p className="text-base leading-snug">
            <strong>Verantwortliche Stelle:</strong><br />
            Gastronomie-Verzeichnis UG (haftungsbeschränkt)<br />
            Inhaber: Jonas Amthor<br />
            Damyan Gruev 8A<br />
            1303 Sofia, Bulgarien<br />
            E-Mail:{" "}
            <a href="mailto:kontakt@gastronomie-verzeichnis.de" className="text-blue-600 hover:underline">
              kontakt@gastronomie-verzeichnis.de
            </a><br />
            VAT-Nr.: 181058425
          </p>
        </section>

        {/* 1. Erhebung und Speicherung personenbezogener Daten */}
        <section className="space-y-2">
          <h2 className="text-2xl font-medium">1. Erhebung und Speicherung</h2>
          <p className="text-base leading-snug">
            Wir speichern personenbezogene Daten, wenn Sie freiwillig Angaben in Formulare
            eingeben oder unsere Dienste nutzen. Dazu gehören:
          </p>
          <ul className="ml-6 list-disc space-y-1 text-base leading-snug">
            <li>E-Mail-Adresse (Versand von Testergebnis, Zertifikat, Rechnung)</li>
            <li>Verifizierungscode (Freischaltung Ihres Testergebnisses)</li>
            <li>Restaurant-Slug (Zuordnung in der Datenbank)</li>
          </ul>
          <p className="text-base leading-snug mt-2">
            Automatisch erfassen wir technische Daten, darunter:
          </p>
          <ul className="ml-6 list-disc space-y-1 text-base leading-snug">
            <li>Anonymisierte IP-Adresse</li>
            <li>Zeitpunkt des Zugriffs</li>
            <li>Browser-Typ und Betriebssystem</li>
            <li>Referrer-URL (vorher besuchte Seite)</li>
          </ul>
        </section>

        {/* 2. Verwendungszweck und Rechtsgrundlage */}
        <section className="space-y-2">
          <h2 className="text-2xl font-medium">2. Verwendungszweck und Rechtsgrundlage</h2>
          <ul className="ml-6 list-disc space-y-1 text-base leading-snug">
            <li>
              <strong>Versand von Testergebnis, Zertifikat, Rechnung:</strong><br />
              E-Mail-Adresse und Verifizierungscode werden genutzt, um nach Prüfung
              Ihr Testergebnis (JPEG), Zertifikat (PNG) und Rechnung (PDF) per E-Mail
              zu versenden.<br />
              <em>Rechtsgrundlage:</em> Art. 6 Abs. 1 lit. b DSGVO.
            </li>
            <li>
              <strong>Verwaltung von Verifizierungs- und Zahlungsstatus:</strong><br />
              Speicherung Ihrer Daten zum Verifizierungsprozess und Zahlungsabwicklung.<br />
              <em>Rechtsgrundlage:</em> Art. 6 Abs. 1 lit. c DSGVO.
            </li>
            <li>
              <strong>Bereitstellung der Website:</strong><br />
              Erfassung von Logdaten (z. B. IP-Adresse in anonymisierter Form), um
              den Website-Betrieb sicherzustellen.<br />
              <em>Rechtsgrundlage:</em> Art. 6 Abs. 1 lit. f DSGVO.
            </li>
          </ul>
        </section>

        {/* 3. Weitergabe an Dienstleister */}
        <section className="space-y-2">
          <h2 className="text-2xl font-medium">3. Weitergabe an Dienstleister</h2>
          <p className="text-base leading-snug">
            Eine Weitergabe Ihrer Daten an Dritte erfolgt nur, wenn:
          </p>
          <ul className="ml-6 list-disc space-y-1 text-base leading-snug">
            <li>
              <strong>SendGrid:</strong> Zum Versand von E-Mails mit Anhängen
              (Testergebnis, Zertifikat, Rechnung).<br />
              <em>Rechtsgrundlage:</em> Art. 6 Abs. 1 lit. b DSGVO.
            </li>
            <li>
              <strong>Supabase:</strong> Speicherung von E-Mail, Verifizierungscode
              und Status. Datenbanken sind in der EU gehostet.<br />
              <em>Rechtsgrundlage:</em> Art. 6 Abs. 1 lit. b und c DSGVO.
            </li>
          </ul>
        </section>

        {/* 4. Cookies und Tracking */}
        <section className="space-y-2">
          <h2 className="text-2xl font-medium">4. Cookies und Tracking</h2>
          <p className="text-base leading-snug">
            Wir verwenden nur technisch notwendige Cookies, um die Funktionalität
            der Website zu gewährleisten. Es werden keine Analyse- oder Tracking-Cookies genutzt.
            Sie können Cookies in den Browser-Einstellungen deaktivieren – dies kann
            die Nutzbarkeit unserer Dienste einschränken.
          </p>
        </section>

        {/* 5. Ihre Betroffenenrechte */}
        <section className="space-y-2">
          <h2 className="text-2xl font-medium">5. Ihre Betroffenenrechte</h2>
          <p className="text-base leading-snug">
            Ihnen stehen folgende Rechte zu:
          </p>
          <ul className="ml-6 list-disc space-y-1 text-base leading-snug">
            <li>
              <strong>Auskunft (Art. 15 DSGVO):</strong> Recht auf Bestätigung und
              Auskunft über verarbeitete Daten.
            </li>
            <li>
              <strong>Berichtigung (Art. 16 DSGVO):</strong> Korrektur unrichtiger
              Daten.
            </li>
            <li>
              <strong>Löschung (Art. 17 DSGVO):</strong> Recht auf Löschung, sofern
              keine gesetzlichen Aufbewahrungspflichten bestehen.
            </li>
            <li>
              <strong>Einschränkung (Art. 18 DSGVO):</strong> Recht auf Einschränkung
              der Verarbeitung unter bestimmten Voraussetzungen.
            </li>
            <li>
              <strong>Datenübertragbarkeit (Art. 20 DSGVO):</strong> Recht, Daten
              in maschinenlesbarem Format zu erhalten.
            </li>
            <li>
              <strong>Widerspruch (Art. 21 DSGVO):</strong> Widerspruch gegen Verarbeitung
              auf Basis berechtigter Interessen.
            </li>
            <li>
              <strong>Widerruf der Einwilligung (Art. 7 DSGVO):</strong> Widerruf Ihrer
              erteilten Einwilligungen jederzeit ohne Angabe von Gründen.
            </li>
            <li>
              <strong>Beschwerde (Art. 77 DSGVO):</strong> Recht auf Beschwerde
              bei einer Aufsichtsbehörde.
            </li>
          </ul>
        </section>

        {/* 6. Datensicherheit */}
        <section className="space-y-2">
          <h2 className="text-2xl font-medium">6. Datensicherheit</h2>
          <p className="text-base leading-snug">
            Wir treffen technische und organisatorische Maßnahmen, um Ihre Daten
            vor Verlust, Zerstörung und unbefugtem Zugriff zu schützen. Unsere
            Systeme werden regelmäßig aktualisiert und gesichert.
          </p>
        </section>

        {/* 7. Speicherdauer */}
        <section className="space-y-2">
          <h2 className="text-2xl font-medium">7. Speicherdauer</h2>
          <p className="text-base leading-snug">
            Personenbezogene Daten werden nur so lange aufbewahrt, wie es für die
            genannten Zwecke oder gesetzliche Aufbewahrungsfristen erforderlich ist.
            Anschließend werden die Daten gelöscht oder anonymisiert.
          </p>
        </section>

        {/* 8. Änderungen dieser Erklärung */}
        <section className="space-y-2">
          <h2 className="text-2xl font-medium">8. Änderungen dieser Erklärung</h2>
          <p className="text-base leading-snug">
            Diese Datenschutzerklärung kann überarbeitet werden. Die jeweils aktuelle
            Version finden Sie stets auf dieser Seite.
          </p>
        </section>

        {/* 9. Kontakt */}
        <section className="space-y-2">
          <h2 className="text-2xl font-medium">9. Kontakt</h2>
          <p className="text-base leading-snug">
            Bei Fragen zum Datenschutz wenden Sie sich bitte an:
          </p>
          <p className="ml-6 text-base leading-snug">
            Jonas Amthor<br />
            Damyan Gruev 8A, 1303 Sofia, Bulgarien<br />
            E-Mail:{" "}
            <a href="mailto:kontakt@gastronomie-verzeichnis.de" className="text-blue-600 hover:underline">
              kontakt@gastronomie-verzeichnis.de
            </a>
          </p>
        </section>

        {/* Footer-Hinweis */}
        <div className="mt-12 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} Gastronomie-Verzeichnis – Jonas Amthor.  
          Alle Rechte vorbehalten.
        </div>
      </div>
    </main>
  );
}
