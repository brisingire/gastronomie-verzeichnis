// src/app/components/Header.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HandRaisedIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const router = useRouter();
  const [signLanguageActive, setSignLanguageActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleSignLanguageToggle() {
    setSignLanguageActive((prev) => !prev);
    router.refresh();
  }

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center px-4 sm:px-6 lg:px-8">
        {/* Links: Deutschland‐Streifen + Logo */}
        <div className="flex items-center">
          <div className="flex h-8 w-1 flex-col">
            <span className="h-1/3 w-full bg-black"></span>
            <span className="h-1/3 w-full bg-red-600"></span>
            <span className="h-1/3 w-full bg-yellow-400"></span>
          </div>
          <Link
            href="/"
            className="ml-3 text-lg font-semibold text-gray-900 hover:text-gray-700"
          >
            Gastronomie‐Verzeichnis
          </Link>
        </div>

        {/* Hamburger für Mobile */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="ml-auto md:hidden flex items-center justify-center p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
          aria-label="Menü öffnen oder schließen"
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>

        {/* Desktop‐Nav (ab md anzeigen) */}
        <nav className="hidden ml-auto items-center space-x-8 text-sm font-medium md:flex">
          <Link
            href="/aktuelles"
            className="text-gray-700 hover:underline hover:decoration-gray-900"
          >
            Aktuelles
          </Link>
          <Link
            href="/testmethodik"
            className="text-gray-700 hover:underline hover:decoration-gray-900"
          >
            Testmethodik
          </Link>
          <Link
            href="/faq"
            className="text-gray-700 hover:underline hover:decoration-gray-900"
          >
            FAQs
          </Link>
          <Link
            href="/kontakt"
            className="text-gray-700 hover:underline hover:decoration-gray-900"
          >
            Kontakt
          </Link>
          <button
            type="button"
            onClick={handleSignLanguageToggle}
            className={
              `flex items-center space-x-1 ` +
              (signLanguageActive ? "text-blue-800" : "text-gray-700") +
              " cursor-pointer focus:outline-none"
            }
          >
            <HandRaisedIcon className="h-5 w-5" />
            <span>Gebärdensprache</span>
          </button>
        </nav>
      </div>

      {/* Mobile‐Dropdown (unterhalb Header, nur wenn geöffnet) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-screen-xl space-y-1 px-4 py-4 sm:px-6">
            <Link
              href="/aktuelles"
              className="block w-full rounded px-3 py-2 text-left text-gray-700 hover:bg-gray-100 hover:underline hover:decoration-gray-900"
            >
              Aktuelles
            </Link>
            <Link
              href="/testmethodik"
              className="block w-full rounded px-3 py-2 text-left text-gray-700 hover:bg-gray-100 hover:underline hover:decoration-gray-900"
            >
              Testmethodik
            </Link>
            <Link
              href="/faq"
              className="block w-full rounded px-3 py-2 text-left text-gray-700 hover:bg-gray-100 hover:underline hover:decoration-gray-900"
            >
              FAQs
            </Link>
            <Link
              href="/kontakt"
              className="block w-full rounded px-3 py-2 text-left text-gray-700 hover:bg-gray-100 hover:underline hover:decoration-gray-900"
            >
              Kontakt
            </Link>
            <button
              onClick={handleSignLanguageToggle}
              className={
                `flex w-full items-center space-x-2 rounded px-3 py-2 text-left ` +
                (signLanguageActive ? "text-blue-800" : "text-gray-700") +
                " hover:bg-gray-100 focus:outline-none"
              }
            >
              <HandRaisedIcon className="h-5 w-5" />
              <span>Gebärdensprache</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
