// src/app/layout.tsx
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="flex min-h-screen flex-col bg-gray-50">
        {/* 1) Einmalig der Header oben */}
        <Header />

        {/* 2) Alle Seiteninhalte (HomePage, DetailPage, Suche, ...) */}
        <main className="flex flex-grow flex-col">
          {children}
        </main>

        {/* 3) Footer am Seitenende */}
        <Footer />
      </body>
    </html>
  );
}
