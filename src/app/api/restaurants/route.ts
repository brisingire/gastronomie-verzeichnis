// src/app/api/restaurants/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/db";

// Typdefinition (dient hier nur der IDE/TypeScript-Unterstützung)
type RestaurantDB = {
  name: string;
  adresse: string;
  ort: string;
  bewertung: number | null;
  slug: string;
  verifiziert: boolean;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.toLowerCase().trim() || "";
  const term = searchParams.get("term")?.toLowerCase().trim() || "";

  // Wenn weder city noch term gesetzt ist, sofort leeres Ergebnis zurückgeben
  if (!city && !term) {
    return NextResponse.json({ restaurants: [] });
  }

  // Baue die Supabase-Abfrage, inklusive Sortierung:
  // 1. Zuerst nach `verifiziert` DESC (true zuerst)
  // 2. Dann nach `bewertung` DESC (höhere Bewertung zuerst, falls verifiziert gleich)
  let sb = supabaseServer
    .from("restaurants")
    .select(`
      name,
      adresse,
      ort,
      bewertung,
      slug,
      verifiziert
    `)
    .order("verifiziert", { ascending: false })
    .order("bewertung", { ascending: false });

  if (city) {
    sb = sb.ilike("ort", `%${city}%`);
  } else if (term) {
    sb = sb.or(`ort.ilike.%${term}%,name.ilike.%${term}%`);
  }

  const { data, error } = await sb;
  if (error) {
    console.error("Supabase-Fehler (restaurants):", error);
    return NextResponse.json({ restaurants: [] });
  }

  const restaurants = (data as RestaurantDB[]) || [];
  return NextResponse.json({ restaurants });
}
