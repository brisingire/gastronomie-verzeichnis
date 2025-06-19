"use client";

import { useState, FormEvent } from "react";

interface RestaurantData {
  name: string;
  bewertung: number | null;
  ort: string;
  adresse: string;
  testergebnis_url: string | null;
  verifiziert: boolean;
}

type TestResultPageClientProps = {
  initialData: RestaurantData;
  slug: string;
};

export default function TestResultPageClient({
  initialData,
  slug,
}: TestResultPageClientProps) {
  const [verifiziert, setVerifiziert] = useState<boolean>(
    initialData.verifiziert
  );
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const rawRating = initialData.bewertung;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    try {
      const apiRes = await fetch("/api/sendpurchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          email,
          verifizierungscode: code,
        }),
      });
      const apiJson = await apiRes.json();
      if (!apiRes.ok) throw new Error(apiJson.error || "Unbekannter Fehler");

      if (apiJson.success) {
        setVerifiziert(true);

        try {
          const FORMSPREE_URL = "https://formspree.io/f/mrbkgepv";
          const formRes = await fetch(FORMSPREE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              restaurant: slug,
              verifizierungscode: code,
            }),
          });
          if (!formRes.ok) {
            console.warn("Formspree-Upload fehlgeschlagen:", await formRes.text());
          }
        } catch (_) {
          console.warn("Fehler beim Formspree-Aufruf");
        }

        setSubmitSuccess(
          "Vielen Dank! Ihr Testergebnis ist jetzt freigeschaltet. Eine Bestätigungsmail wurde versandt."
        );
      }
    } catch (err: any) {
      console.error("Fehler beim Abschicken:", err);
      setSubmitError(err.message || "Fehler beim Versenden.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-2xl space-y-8 bg-white border border-gray-200 rounded-md shadow-sm p-6 sm:p-10">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-gray-900">
            Testergebnis:{" "}
            <span className="font-serif text-blue-800">{initialData.name}</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Standort: {initialData.ort} – {initialData.adresse}
          </p>
        </header>

        {/* Verkaufsargumente */}
        {!verifiziert && (
          <section className="bg-blue-50 border-l-4 border-blue-600 rounded-sm px-5 py-4 space-y-4">
            <p className="text-gray-800 text-sm sm:text-base">
              <span className="font-medium text-blue-800">Für einmalig 29,00 € </span>
              erhalten Sie das vollständige Testergebnis und das offizielle Zertifikat per E-Mail.
            </p>
            <p className="text-gray-800 text-sm sm:text-base">
              Das Zertifikat bestätigt Ihre Bewertung und kann für geschäftliche
              beziehungsweise kommerzielle Zwecke genutzt werden.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <figure className="text-center cursor-pointer" onClick={() => setModalImage("/beispieltest.jpg")}>
                <img
                  src="/beispieltest.jpg"
                  alt="Beispiel Testergebnis"
                  className="mx-auto h-32 object-contain border border-gray-300 rounded-md"
                />
                <figcaption className="mt-2 text-xs text-gray-500">
                  Beispiel: Vollständiges Testergebnis
                </figcaption>
              </figure>
              <figure className="text-center cursor-pointer" onClick={() => setModalImage("/musterzertifikat.jpg")}>
                <img
                  src="/musterzertifikat.jpg"
                  alt="Beispiel Zertifikat"
                  className="mx-auto h-32 object-contain border border-gray-300 rounded-md"
                />
                <figcaption className="mt-2 text-xs text-gray-500">
                  Beispiel: Zertifikat
                </figcaption>
              </figure>
            </div>
          </section>
        )}

        {/* Freigeschaltet Hinweis */}
        {verifiziert && (
          <section className="bg-green-50 border-l-4 border-green-600 rounded-sm px-5 py-4 space-y-2">
            <h2 className="text-lg font-semibold text-green-800">Freigeschaltet</h2>
            <p className="text-gray-700 text-sm sm:text-base">
              Ihr Testergebnis, Zertifikat und Ihre Rechnung wurden soeben an{" "}
              <span className="font-medium">{email}</span> gesendet.
            </p>
            <p className="text-gray-600 text-xs">
              Bitte prüfen Sie Ihren Posteingang. Der Versand kann in Einzelfällen
              bis zu einer Minute dauern.
            </p>
          </section>
        )}

        {/* Bewertung */}
        {verifiziert && (
          <p className="text-gray-700 text-sm sm:text-base">
            <span className="font-medium">Bewertung:</span>{" "}
            {rawRating !== null ? (
              <span className="font-semibold">{rawRating.toFixed(1)} / 5</span>
            ) : (
              <span className="text-gray-500">–</span>
            )}
          </p>
        )}

        {/* Bild-Container */}
        <div className="relative mt-4 overflow-auto rounded-md border border-gray-300 bg-gray-100 max-h-[80vh]">
          {initialData.testergebnis_url ? (
            <>
              <img
                src={initialData.testergebnis_url}
                alt="Testergebnis"
                className="w-full h-auto object-contain cursor-pointer"
                onClick={() => verifiziert && setModalImage(initialData.testergebnis_url)}
              />
              {!verifiziert && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div
                    className="absolute left-0 right-0 bg-white/50 backdrop-blur-md"
                    style={{ top: "9%", bottom: "16%" }}
                  />
                  <div className="relative w-11/12 max-w-sm bg-white border border-gray-300 rounded-md px-4 py-5 space-y-4 z-10">
                    <h2 className="text-lg font-semibold text-gray-800 text-center">
                      Testergebnis freischalten
                    </h2>
                    <p className="text-gray-600 text-xs text-center">
                      Klicken Sie auf „Jetzt kaufen“, um das vollständige Testergebnis,
                      das Zertifikat und die Rechnung sofort per E-Mail zu erhalten.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-xs font-medium text-gray-700"
                        >
                          E-Mail-Adresse
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="beispiel@domain.de"
                          className="mt-1 block w-full rounded-sm border border-gray-300 px-2 py-1 focus:border-gray-700 focus:outline-none text-xs"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="verifizierungscode"
                          className="block text-xs font-medium text-gray-700"
                        >
                          Verifizierungscode
                        </label>
                        <input
                          type="text"
                          id="verifizierungscode"
                          required
                          maxLength={6}
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder="1234"
                          className="mt-1 block w-full rounded-sm border border-gray-300 px-2 py-1 focus:border-gray-700 focus:outline-none text-center text-xs"
                        />
                      </div>
                      {submitError && (
                        <p className="text-xs text-red-600">{submitError}</p>
                      )}
                      {submitSuccess && (
                        <p className="text-xs text-green-600">{submitSuccess}</p>
                      )}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`mt-1 w-full ${
                          isSubmitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-700 hover:bg-blue-800"
                        } text-white py-2 rounded-sm text-sm transition`}
                      >
                        {isSubmitting ? "Bitte warten…" : "Jetzt kaufen"}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-40 items-center justify-center">
              <p className="text-gray-500 text-xs">Noch kein Testergebnis hinterlegt.</p>
            </div>
          )}
        </div>

        {/* Modal für vergrößerte Bilder */}
        {modalImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) setModalImage(null);
            }}
          >
            <div className="relative max-w-[90vw] max-h-[90vh] overflow-auto bg-white rounded-md p-4">
              <img
                src={modalImage}
                alt="Vergrößertes Bild"
                className="max-w-full max-h-[90vh] object-contain"
              />
              <button
                onClick={() => setModalImage(null)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg hover:bg-red-600 transition"
              >
                X
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}