// File: src/app/restaurant/[slug]/testresult/page.tsx

import { supabaseServer } from "@/lib/db";
import TestResultPageClient from "./TestResultPageClient";

type TestResultPageProps = {
  params: { slug: string };
};

export default async function TestResultPageSSR({ params }: TestResultPageProps) {
  const { slug } = params;

  // 1) Supabase‐Abfrage, um alle benötigten Felder zu holen:
  const { data, error } = await supabaseServer
    .from("restaurants")
    .select(`
      name,
      bewertung,
      ort,
      adresse,
      testergebnis_url,
      verifiziert
    `)
    .eq("slug", slug)
    .single();

  // 2) Wenn ein Fehler auftritt oder noch keine Daten da sind, geben wir
  //    einfach null zurück – also **kein** Kurz‐Fallback mehr.
  if (error || !data) {
    return null;
  }

  // 3) Wenn Daten da sind, leiten wir auf den Client‐Teil weiter:
  const initialData = {
    name: data.name,
    bewertung: data.bewertung as number | null,
    ort: data.ort,
    adresse: data.adresse,
    testergebnis_url: data.testergebnis_url as string | null,
    verifiziert: data.verifiziert as boolean,
  };

  return <TestResultPageClient initialData={initialData} slug={slug} />;
}
