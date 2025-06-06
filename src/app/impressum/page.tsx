    // File: src/app/impressum/page.tsx
    import Link from "next/link";

    export default function ImpressumPage() {
    return (
        <main className="min-h-screen bg-white px-4 py-8 text-gray-800">
        <div className="mx-auto max-w-screen-lg space-y-6">
            {/* Überschrift */}
            <h1 className="text-3xl font-semibold">Impressum</h1>

            {/* Anbieter-Angaben */}
            <section>
            <h2 className="text-xl font-medium mt-4">Anbieter</h2>
            <p className="mt-2">
                Jonas Amthor<br />
                Talhof 1<br />
                89522 Heidenheim<br />
                Deutschland
            </p>
            </section>

            {/* Sitz der Firma */}

            {/* Kontakt */}
            <section>
            <h2 className="text-xl font-medium mt-6">Kontakt</h2>
            <p className="mt-2">
                E-Mail:{" "}
                <a
                href="mailto:kontakt@gastronomie-verzeichnis.de"
                className="text-blue-600 hover:underline"
                >
                kontakt@gastronomie-verzeichnis.de
                </a>
            </p>
            </section>

            {/* Verantwortlich gemäß § 55 RStV */}
            <section>
            <h2 className="text-xl font-medium mt-6">Verantwortlich gemäß § 55 RStV</h2>
            <p className="mt-2">
                Jonas Amthor<br />
                Talhof 1<br />
                89522 Heidenheim<br />
                Deutschland
            </p>
            </section>
            <section>
            <h2 className="text-xl font-medium mt-6">Firmensitz / Anschrift</h2>
            <p className="mt-2">
                Jonas Amthor (Geschäftsinhaber)<br />
                Damyan Gruev 8A<br />
                1303 Sofia<br />
                Bulgarien
            </p>
            </section>

            {/* Umsatzsteuer-ID */}
            <section>
            <h2 className="text-xl font-medium mt-6">Umsatzsteuer-Identifikationsnummer</h2>
            <p className="mt-2">USt-ID: DE 181058425</p>
            </section>


            {/* Haftungsausschluss (Disclaimer) */}
            <section>
            <h2 className="text-xl font-medium mt-6">Haftung für Inhalte</h2>
            <p className="mt-2">
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf
                diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10
                TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte
                oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu
                forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p className="mt-2">
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen
                nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche
                Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten
                Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
                Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
            </section>

            <section>
            <h2 className="text-xl font-medium mt-6">Haftung für Links</h2>
            <p className="mt-2">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte
                wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch
                keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der
                jeweilige Anbieter oder Betreiber der Seiten verantwortlich.  
            </p>
            <p className="mt-2">
                Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend
                entfernen.
            </p>
            </section>

            <section>
            <h2 className="text-xl font-medium mt-6">Urheberrecht</h2>
            <p className="mt-2">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
                unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung,
                Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts
                bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
            <p className="mt-2">
                Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen
                Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
                wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter
                als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung
                aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
                Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>
            </section>

        
        </div>
        </main>
    );
    }
