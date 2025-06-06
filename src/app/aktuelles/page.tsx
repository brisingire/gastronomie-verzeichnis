// src/app/aktuelles/page.tsx
import AktuellesItem, { AktuellesEntry } from "./components/AktuellesItem";

/**
 * Beispiel‐Daten für „Aktuelles“. Später kannst du hier deine API (z.B. Supabase) abfragen
 * und dynamisch ein Array von AktuellesEntry‐Objekten erzeugen.
 */
const dummyEntries: AktuellesEntry[] = [
  {
    id: "1",
    imageUrl: "/heidelberg.jpg",
    category: "Testinitiative Süddeutschland",
    title: "63 erfolgreiche Tests in Heidelberg abgeschlossen",
    description:
      "Auch heute konnten wir wieder 63 Testergebnisse in unsere Datenbank aufnehmen. Damit ist der Raum Heidelberg/Mannheim vollständig erschlossen.",
    date: "02.06.2025",
  },
  {
    id: "2",
    imageUrl: "/google.jpg",
    category: "Kooperationen & Zusammenarbeit",
    title: "Präsenz auf Google erweitert",
    description:
      "Beschluss in eigener Sache: Da die Analytics-Werte unserer zweiwöchigen Testphase äußerst positiv waren, werden wir unser Google-Profil weiter ausbauen. Das schließt womöglich auch Google-Ads oder andere Produkte ein, die bisher nicht eingesetzt wurden.",
    date: "28.05.2025",
  },
  {
    id: "3",
    // Hier wird jetzt dein eigenes Bild aus "public/ulm.jpg" geladen:
    imageUrl: "/ulm.jpg",
    category: "Testinitiative Süddeutschland",
    title: "120 erfolgreiche Tests in Ulm und Umgebung abgeschlossen",
    description:
      "Wir danken den freiwilligen Helfern, die sich an diesem Testtag beteiligt haben. Alle 120 Ergebnisse wurden bereits in die Datenbank eingepflegt.",
    date: "15.05.2025",
  },
  // Falls du noch weitere Einträge benötigst, kannst du hier einfach
  // ein viertes Objekt anhängen. Beispiel:
  // {
  //   id: "4",
  //   imageUrl: "/ulm.jpg", // oder ein anderes Bild, das ebenfalls in public/ liegt
  //   category: "Neuer Eintrag",
  //   title: "Beispiel-Titel für weiteren Eintrag",
  //   description: "Hier steht eine kurze Beschreibung für den neuen Eintrag.",
  //   date: "03.06.2025",
  // },
];

export default function AktuellesPage() {
  return (
    <main className="bg-gray-50 py-8">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 space-y-8">
        {dummyEntries.map((entry) => (
          <AktuellesItem key={entry.id} {...entry} />
        ))}
      </div>
    </main>
  );
}
