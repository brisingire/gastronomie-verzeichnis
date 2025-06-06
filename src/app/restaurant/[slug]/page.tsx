// File: src/app/restaurant/[slug]/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import StarRating from "@/app/components/StarRating";
import { CheckIcon } from "@heroicons/react/24/solid";

type Restaurant = {
  name: string;
  adresse: string;
  ort: string;
  bewertung: number;
  slug: string;
  verifiziert: boolean;
  verifizierungscode: string | null;
  testergebnis_url: string | null;
  beschreibung: string | null;
};

export default function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params) as { slug: string };
  const router = useRouter();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function fetchRestaurant() {
      setLoading(true);
      try {
        const res = await fetch(`/api/restaurant/${encodeURIComponent(slug)}`);
        const json: { restaurant: Restaurant } = await res.json();
        setRestaurant(json.restaurant || null);
      } catch (err) {
        console.error("Fehler beim Laden des Restaurants:", err);
        setRestaurant(null);
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurant();
  }, [slug]);

  async function handleVerifyClick() {
    if (!restaurant) return;
    setIsGenerating(true);

    try {
      const res = await fetch(`/api/generate-test?slug=${encodeURIComponent(slug)}`);
      const json = await res.json();

      if (!res.ok) {
        console.error("Fehler beim Generieren des Testergebnisses:", json.error);
        setIsGenerating(false);
        return;
      }

      const updated = await fetch(`/api/restaurant/${encodeURIComponent(slug)}`);
      const updatedJson: { restaurant: Restaurant } = await updated.json();
      setRestaurant(updatedJson.restaurant);

      router.push(`/restaurant/${encodeURIComponent(slug)}/verify`);
    } catch (err) {
      console.error("Fehler bei handleVerifyClick:", err);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-8">
      <button
        onClick={() => router.push("/")}
        className="mb-6 inline-flex items-center rounded border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        ← Zurück
      </button>

      {loading ? (
        <p className="text-gray-600">Lade Details…</p>
      ) : !restaurant ? (
        <p className="text-gray-600">Restaurant nicht gefunden.</p>
      ) : (
        <div className="mx-auto w-full max-w-xl space-y-8 rounded bg-white p-8 shadow-lg">
          {/* 1) Name + Adresse */}
          <header className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-gray-800">{restaurant.name}</h1>
            <p className="text-gray-600">
              {restaurant.adresse}, {restaurant.ort}
            </p>
          </header>

          {/* 2) Sterne‐Anzeige oder Hinweis */}
          {restaurant.verifiziert ? (
            <div className="flex w-full items-center justify-between sm:w-auto sm:gap-4">
              <div className="flex items-center">
                <StarRating rating={restaurant.bewertung} />
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-medium text-green-600">
                  Verifiziertes Testergebnis
                </span>
              </div>
              <div className="sm:hidden">
                <span className="text-xs font-medium text-green-600">
                  Verifiziertes Testergebnis
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between">
              {/* Linke Seite: fünf leere Sterne (rating={0} zeigt leere Sterne) */}
              <div className="flex justify-center sm:justify-start">
                <StarRating rating={0} />
              </div>
              {/* Rechte Seite: Hinweistext, mobil zentriert, ab sm rechtsbündig */}
              <p className="mt-2 sm:mt-0 text-gray-700 text-xs sm:text-sm text-center sm:text-right">
                Sternebewertung noch nicht freigegeben
              </p>
            </div>
          )}

          {/* 3) Wenn verifiziert: echtes Bild, sonst Blur‐Placeholder */}
          {restaurant.verifiziert ? (
            <div className="mt-4">
              {restaurant.testergebnis_url ? (
                <img
                  src={restaurant.testergebnis_url}
                  alt="Testergebnis"
                  className="w-full mx-auto max-w-md rounded border border-gray-200"
                />
              ) : (
                <p className="text-sm text-gray-500">Noch kein Bild hinterlegt.</p>
              )}
            </div>
          ) : (
            <div className="relative mx-auto mt-4 w-full max-w-lg">
              {/* Blur‐Placeholder */}
              <div className="aspect-[7/9] w-full rounded border border-gray-300 bg-gray-100 filter blur-2xl"></div>
              <div className="absolute inset-0 z-[5] flex flex-col justify-between py-4 rounded overflow-hidden">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 ${i % 2 === 0 ? "w-10/12" : "w-8/12"} bg-gray-400 mx-auto blur-md opacity-70`}
                  />
                ))}
              </div>
              <div className="absolute inset-0 z-[10] flex flex-col items-center justify-center px-6">
                <div className="rounded border border-red-300 bg-red-50 px-4 py-2">
                  <p className="text-center text-sm font-medium text-red-700">
                    Hinweis: Dieser Qualitäts- und Hygienetest wurde vom Inhaber noch nicht freigeschaltet
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4) Verifizieren‐Block (nur wenn nicht verifiziert) */}
          {!restaurant.verifiziert && (
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-1">
                Bewertung verifizieren
              </h3>

              {/* Vorteile-Liste */}
              <p className="ml-2 text-gray-700 text-sm">Sie sind Inhaber dieses Gastronomiebetriebes? <br></br>Verifzieren Sie jetzt das Testergebnis und profoitieren Sie von zahlreichen Vorteilen:</p>
              <ul className="mx-auto max-w-md space-y-3 text-left">
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="ml-2 text-gray-700 text-sm">
                    Einsicht in interne Testdetails und Bewertungsergebnis
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="ml-2 text-gray-700 text-sm">
                    Offizielles Zertifikat für Ihren Gastronomiebetrieb, auch für den kommerziellen Nutzen legitimiert
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="ml-2 text-gray-700 text-sm">
                    Über 300 Webseitenbetreiber und tausende Nutzer vertrauen auf unsere Expertise
                  </span>
                </li>
              </ul>

              <button
                onClick={handleVerifyClick}
                disabled={isGenerating}
                className={`mt-4 w-full max-w-xs mx-auto rounded border ${
                  isGenerating
                    ? "border-gray-300 bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
                } px-6 py-2`}
              >
                {isGenerating ? "Test wird geladen..." : "Testergebnis freischalten"}
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
