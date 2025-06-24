// File: src/app/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Suggestion = {
  label: string;
  type: "restaurant" | "city";
  value: string;
};

export default function HomePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ① Autocomplete‐Vorschläge (Substring‐Match über ?query=Term)
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      setIsLoadingSuggestions(false);
      return;
    }
    // sobald wir zwei Zeichen haben, öffnen wir das Dropdown und zeigen Loading
    setShowDropdown(true);
    setIsLoadingSuggestions(true);

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/suggest?query=${encodeURIComponent(term)}`);
        const json = await res.json();
        setSuggestions(json.suggestions || []);
      } catch (err) {
        console.error("Fehler beim Laden der Vorschläge:", err);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // ② ENTER abfangen: EINZIGER Parameter "term"
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = searchTerm.trim();
      if (!trimmed) return;
      setShowDropdown(false);
      router.push(`/search?term=${encodeURIComponent(trimmed)}`);
    }
  }

  // ③ Klick auf Vorschlag
  function handleSelectSuggestion(s: Suggestion) {
    setShowDropdown(false);
    if (s.type === "restaurant") {
      router.push(`/restaurant/${encodeURIComponent(s.value)}`);
    } else {
      router.push(`/search?city=${encodeURIComponent(s.value)}`);
    }
  }

  // ④ Klick außerhalb schließt Dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <main className="relative flex flex-col flex-grow items-center justify-center bg-gray-50 p-4">
      {/* ─────────────────────────────────────────────────────────────────────────── */}
      {/* Überschrift */}
      {/* ─────────────────────────────────────────────────────────────────────────── */}
      <h1 className="mb-8 text-2xl font-bold text-center text-gray-900 sm:text-4xl">
        Gastronomie‐Verzeichnis
      </h1>

      {/* ─────────────────────────────────────────────────────────────────────────── */}
      {/* Suchfeld-Container */}
      {/* ─────────────────────────────────────────────────────────────────────────── */}
      <div className="relative w-full max-w-xl">
        <input
          ref={inputRef}
          type="text"
          placeholder="Suche nach Stadt oder Betrieb.."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0 || isLoadingSuggestions) {
              setShowDropdown(true);
            }
          }}
          className="w-full rounded border border-gray-300 bg-white px-4 py-3 text-lg text-gray-700 placeholder-gray-600 outline-none focus:border-blue-500"
        
        />

        {showDropdown && (
          <ul className="absolute left-0 top-full z-10 mt-1 w-full rounded border border-gray-200 bg-white shadow-lg">
            {isLoadingSuggestions ? (
              <li className="px-4 py-3 text-gray-600">Daten werden geladen..</li>
            ) : suggestions.length > 0 ? (
              suggestions.map((s) => (
                <li
                  key={`${s.type}__${s.value}`}
                  onMouseDown={() => handleSelectSuggestion(s)}
                  className="flex justify-between cursor-pointer px-4 py-3 hover:bg-gray-100"
                >
                  <span className="font-medium text-gray-600">{s.label}</span>
                  <span
                    className={
                      s.type === "restaurant"
                        ? "ml-2 inline-block rounded bg-green-100 px-2 py-0.5 text-sm text-green-700"
                        : "ml-2 inline-block rounded bg-blue-100 px-2 py-0.5 text-sm text-blue-700"
                    }
                  >
                    {s.type === "restaurant" ? "Restaurant" : "Stadt"}
                  </span>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-gray-600">Keine Ergebnisse</li>
            )}
          </ul>
        )}
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Neue Trennlinie + Info-Text weiter nach unten */}
      {/* ------------------------------------------------------------ */}
      <div className="mt-12 w-full max-w-xl">
        <hr className="border-gray-300" />
      </div>

      <div className="mt-4 w-full max-w-xl">
        <p className="text-center text-sm text-gray-600">
          Mehr als <span className="font-semibold text-gray-800">300 Webseitenbetreiber</span> vertrauen auf unsere
          Informationen zu über{" "}
          <span className="font-semibold text-gray-800">10.000 getesteten Gastronomiebetrieben</span> in Deutschland,
          Österreich und der Schweiz.
        </p>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Awards */}
      {/* ------------------------------------------------------------ */}
      <div className="absolute inset-x-0 bottom-20 flex justify-center sm:hidden">
        <img
          src="/awards/award1.jpg"
          alt="Auszeichnung Award 1"
          className="h-20 w-auto object-contain"
        />
        <img
          src="/awards/award2.jpg"
          alt="Auszeichnung Award 2"
          className="h-20 w-auto object-contain"
        />
      </div>

      <div className="hidden sm:flex fixed bottom-20 right-6 flex space-x-4 z-50">
        <img
          src="/awards/award1.jpg"
          alt="Auszeichnung Award 1"
          className="h-20 w-auto object-contain"
        />
        <img
          src="/awards/award2.jpg"
          alt="Auszeichnung Award 2"
          className="h-20 w-auto object-contain"
        />
      </div>
    </main>
  );
}
