// File: src/app/api/restaurant/[slug]/route.ts

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/db";

export async function GET(
  request: Request,
  context: any // hier umgehen wir das strikte Typ-Matching
) {
  // slug holen
  const { slug } = context.params as { slug: string };

  // Daten inklusive testergebnis_url und reviewer_notes abrufen
  const { data, error } = await supabaseServer
    .from("restaurants")
    .select(`
      name,
      adresse,
      ort,
      bewertung,
      slug,
      verifizierungscode,
      verifiziert,
      reviewer_notes,
      testergebnis_url
    `)
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ restaurant: null });
  }

  return NextResponse.json({ restaurant: data });
}
