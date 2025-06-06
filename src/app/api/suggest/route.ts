// src/app/api/suggest/route.ts

import { NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/db";

type Suggestion = {
  label: string;
  type: "restaurant" | "city";
  value: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("query")?.toLowerCase().trim() || "";

  if (!term) {
    return NextResponse.json({ suggestions: [] });
  }

  // 1) Restaurant‐Vorschläge mit Substring‐Matching (%term%)
  const { data: restData, error: restError } = await supabaseServer
    .from("restaurants")
    .select("name, ort, slug")
    .ilike("name", `%${term}%`)  // Substring statt Prefix
    .limit(5);

  if (restError) {
    console.error("Supabase-Error (suggest restaurants):", restError);
  }

  const restSuggestions: Suggestion[] = (restData || []).map((r) => ({
    label: `${r.name} (${r.ort})`,
    type: "restaurant",
    value: r.slug,
  }));

  // 2) City‐Vorschläge (hier weiter auf Prefix‐Matching oder auch Substring)
  const { data: cityData, error: cityError } = await supabaseServer
    .from("restaurants")
    .select("ort")
    .ilike("ort", `${term}%`)  // kann auf `%${term}%` geändert werden, falls gewünscht
    .order("ort", { ascending: true })
    .limit(10);

  if (cityError) {
    console.error("Supabase-Error (suggest cities):", cityError);
  }

  const allOrts = (cityData || []).map((c) => c.ort.trim());
  const uniqueOrts = Array.from(new Set(allOrts));

  const citySuggestions: Suggestion[] = uniqueOrts.map((ort) => ({
    label: ort,
    type: "city",
    value: ort,
  }));

  const suggestions = [...restSuggestions, ...citySuggestions];
  return NextResponse.json({ suggestions });
}
