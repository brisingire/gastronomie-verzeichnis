// File: src/app/restaurant/[slug]/verify/page.tsx

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/db";

export default async function VerifyPage(props: any) {
  // `props.params` und `props.searchParams` werden von Next.js übergeben
  const { slug } = props.params as { slug: string };
  const { error } = (props.searchParams as { error?: string }) || {};

  // Restaurant-Name serverseitig holen (statt nur den slug anzuzeigen)
  const { data: restaurantData, error: fetchError } = await supabaseServer
    .from("restaurants")
    .select("name")
    .eq("slug", slug)
    .single();

  if (fetchError || !restaurantData) {
    // Bei Fehler/kein Eintrag → zurück zur Detailseite mit -not_found
    return redirect(`/restaurant/${encodeURIComponent(slug)}/?error=not_found`);
  }

  const restaurantName = restaurantData.name as string;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md space-y-6 rounded bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800">
          Verifizierung des Testergebnisses
        </h1>

        {/* Statt slug zeigen wir hier den Restaurant-Namen */}
        <p className="text-sm text-gray-700 leading-relaxed">
          Geben Sie bitte den sechsstelligen Verifizierungscode für{" "}
          <strong className="text-gray-800">{restaurantName}</strong> ein.
        </p>

        {/* Wenn ?error=invalid in der URL steht, Fehlermeldung anzeigen */}
        {error === "invalid" && (
          <div className="rounded border border-red-300 bg-red-50 p-3">
            <p className="text-center text-sm font-medium text-red-700">
              Ungültiger Code. Bitte versuche es erneut.
            </p>
          </div>
        )}

        {/* Formular zum Abschicken des Codes */}
        <form action={verifyAction} className="mt-4 flex flex-col space-y-4">
          <input type="hidden" name="slug" value={slug} />

          <input
            name="code"
            type="text"
            maxLength={6}
            placeholder="6‐stelliger Code"
            className="w-full rounded border border-gray-300  px-3 py-2 text-center text-gray-700 text-base outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            Code prüfen
          </button>
        </form>
      </div>
    </main>
  );
}

// ----------------------------------------------------------------------------
// Diese Server-Action wird aufgerufen, sobald das obige Formular via method="post"
// abgeschickt wird. Sie prüft den Code und leitet entweder weiter zur
// Testresult-Seite oder zurück mit ?error=invalid.
// ----------------------------------------------------------------------------
async function verifyAction(formData: FormData) {
  "use server";

  const slug = formData.get("slug") as string;
  const code = (formData.get("code") as string)?.trim();

  // 1) Lese den in Supabase gespeicherten Verifizierungscode zum jeweiligen Slug
  const { data, error } = await supabaseServer
    .from("restaurants")
    .select("verifizierungscode")
    .eq("slug", slug)
    .single();

  // Falls kein Datensatz gefunden wurde oder ein Fehler, zurück mit ?error=invalid
  if (error || !data) {
    return redirect(
      `/restaurant/${encodeURIComponent(slug)}/verify?error=invalid`
    );
  }

  // 2) Wenn der Code übereinstimmt, weiter zur Testresult-Seite; sonst zurück mit Fehler
  if (data.verifizierungscode === code) {
    return redirect(`/restaurant/${encodeURIComponent(slug)}/testresult`);
  } else {
    return redirect(
      `/restaurant/${encodeURIComponent(slug)}/verify?error=invalid`
    );
  }
}
