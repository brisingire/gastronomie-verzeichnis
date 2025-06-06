// src/app/api/restaurant/[slug]/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // Jetzt inklusive testergebnis_url (und reviewer_notes, falls du das brauchst)
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
    // Falls Fehler oder kein Datensatz gefunden, geben wir restaurant: null zurück
    return NextResponse.json({ restaurant: null });
  }

  // data enthält jetzt auch data.testergebnis_url
  return NextResponse.json({ restaurant: data });
}
