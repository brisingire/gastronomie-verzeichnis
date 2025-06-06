// File: src/app/api/generate-test/route.ts

export const config = {
    runtime: "nodejs", // Damit Buffer, fetch(u. ArrayBuffer) usw. funktionieren
  };
  
  import { NextResponse } from "next/server";
  import { supabaseServer } from "@/lib/db";
  import { createTestReportPng } from "@/lib/test-report-generator";
  
  export async function GET(request: Request) {
    try {
      // 1) Den Parameter "slug" aus der Query ziehen:
      const { searchParams } = new URL(request.url);
      const slug = searchParams.get("slug");
      if (!slug) {
        return NextResponse.json(
          { error: "Fehlender Parameter: slug" },
          { status: 400 }
        );
      }
  
      // 2) Restaurant-Daten aus Supabase holen:
      const { data: restaurantData, error: fetchError } = await supabaseServer
        .from("restaurants")
        .select("name, adresse, ort, bewertung, beschreibung")
        .eq("slug", slug)
        .single();
  
      if (fetchError || !restaurantData) {
        return NextResponse.json(
          { error: "Restaurant nicht gefunden oder DB-Fehler." },
          { status: 404 }
        );
      }
  
      const restaurantName = restaurantData.name as string;
      const restaurantAdresse = restaurantData.adresse as string;
      const restaurantOrt = restaurantData.ort as string;
      const rating = (restaurantData.bewertung as number | null) ?? 0;
      const description = (restaurantData.beschreibung as string) || "";
  
      // 3) Testbericht-PNG on-the-fly generieren (Buffer)
      const pngBuffer = await createTestReportPng({
        restaurantName,
        address: restaurantAdresse,
        ort: restaurantOrt,
        rating,
        description,
        slug,
      });
  
      // 4) Das PNG in den Supabase-Storage hochladen
      //    Bucket-Name: "testergebnisse", Pfad: "<slug>.jpg"
      //    Wir laden als JPEG, auch wenn der Buffer PNG liefert – Supabase konvertiert das beim Upload.
      const fileName = `${slug}.jpg`;
      const { data: uploadData, error: uploadError } = await supabaseServer.storage
        .from("testergebnisse")
        .upload(fileName, pngBuffer, {
          contentType: "image/jpeg",
          upsert: true, // Falls schon einmal existiert, überschreiben
        });
  
      if (uploadError) {
        console.error("Fehler beim Upload ins Storage:", uploadError);
        return NextResponse.json(
          { error: "Fehler beim Hochladen des Testergebnisses." },
          { status: 500 }
        );
      }
  
      // 5) Öffentliche URL zusammensetzen (wenn dein Bucket Public ist):
      //    Formel: https://<YOUR_SUPABASE_PROJECT>.supabase.co/storage/v1/object/public/<bucket>/<path>
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const testergebnisUrl = `${supabaseUrl}/storage/v1/object/public/testergebnisse/${fileName}`;
  
      // 6) In der Tabelle "restaurants" das Feld "testergebnis_url" aktualisieren
      const { error: updateError } = await supabaseServer
        .from("restaurants")
        .update({ testergebnis_url: testergebnisUrl })
        .eq("slug", slug);
  
      if (updateError) {
        console.error("Fehler beim Setzen der testergebnis_url:", updateError);
        return NextResponse.json(
          { error: "Fehler beim Setzen der URL in der Datenbank." },
          { status: 500 }
        );
      }
  
      // 7) Am Ende die öffentliche URL zurückgeben
      return NextResponse.json({ success: true, url: testergebnisUrl });
    } catch (err: any) {
      console.error("API-Route /api/generate-test Fehler:", err);
      return NextResponse.json(
        { error: "Interner Serverfehler beim Generieren des Tests.", detail: err.message },
        { status: 500 }
      );
    }
  }
  