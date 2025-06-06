// src/app/search/SearchResultsClient.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import StarRating from "@/app/components/StarRating";

type Restaurant = {
  name: string;
  adresse: string;
  ort: string;
  bewertung: number | null;
  verifiziert: boolean;
  slug: string;
};

export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const cityParam = searchParams.get("city")?.toLowerCase().trim() || "";
  const termParam = searchParams.get("term")?.toLowerCase().trim() || "";

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurants() {
      setLoading(true);
      try {
        let url = "/api/restaurants?";
        if (cityParam) {
          url += `city=${encodeURIComponent(cityParam)}`;
        } else if (termParam) {
          url += `term=${encodeURIComponent(termParam)}`;
        }

        const res = await fetch(url);
        const json = await res.json();
        setRestaurants(json.restaurants || []);
      } catch (err) {
        console.error("Fehler beim Laden der Restaurants:", err);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    }

    if (cityParam || termParam) {
      fetchRestaurants();
    } else {
      setRestaurants([]);
      setLoading(false);
    }
  }, [cityParam, termParam]);

  const heading = cityParam
    ? `Restaurants in ${cityParam.charAt(0).toUpperCase() + cityParam.slice(1)}`
    : termParam
    ? `Ergebnisse für „${termParam.charAt(0).toUpperCase() + termParam.slice(1)}“`
    : "";

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <Link href="/">
        <button className="mb-6 inline-flex items-center rounded border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100">
          ← Zurück
        </button>
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-gray-800">{heading}</h1>

      {loading ? (
        <p className="text-gray-600">Lädt…</p>
      ) : restaurants.length === 0 ? (
        <p className="text-gray-600">Keine Restaurants gefunden.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((r) => (
            <div
              key={r.slug}
              className="rounded bg-white p-4 shadow hover:shadow-md cursor-pointer transition"
              onClick={() =>
                router.push(`/restaurant/${encodeURIComponent(r.slug)}`)
              }
            >
              <h2 className="mb-1 text-lg font-semibold text-gray-800">{r.name}</h2>
              <p className="text-gray-700">{r.adresse}</p>
              <p className="text-gray-700">{r.ort}</p>

              {r.verifiziert ? (
                <div className="mt-2">
                  <StarRating rating={r.bewertung ?? 0} />
                </div>
              ) : (
                <p className="mt-2 text-red-600 font-medium text-sm">
                  Nicht verifiziert
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
