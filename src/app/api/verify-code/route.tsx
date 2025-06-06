// /src/app/api/verify-code/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { slug, code } = (await request.json()) as {
      slug: string;
      code: string;
    };

    if (!slug || !code) {
      return NextResponse.json(
        { valid: false, error: "Fehlende Parameter." },
        { status: 400 }
      );
    }

    // DB‐Abfrage: Hole den hinterlegten Verifizierungscode für dieses Restaurant
    const { data, error } = await supabaseServer
      .from("restaurants")
      .select("verifizierungscode")
      .eq("slug", slug)
      .single();

    if (error) {
      return NextResponse.json(
        { valid: false, error: "DB‐Fehler beim Prüfen des Codes." },
        { status: 500 }
      );
    }
    if (!data) {
      return NextResponse.json(
        { valid: false, error: "Kein Restaurant gefunden." },
        { status: 404 }
      );
    }

    // Vergleiche den übergebenen Code mit dem Datenbank‐Wert
    const isValid = data.verifizierungscode === code.trim();
    return NextResponse.json({ valid: isValid });
  } catch (err) {
    return NextResponse.json(
      { valid: false, error: "Unerwarteter Fehler." },
      { status: 500 }
    );
  }
}
