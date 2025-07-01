// src/app/layout.tsx
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Script from "next/script";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        {/* Google Analytics Tag */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-5H7YH2QJVS"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-5H7YH2QJVS');
            `,
          }}
        />
      </head>
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
