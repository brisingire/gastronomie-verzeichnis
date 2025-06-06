// src/app/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      {/* 
        Wir verwenden hier flex, um Impressum, Datenrichtlinien und das Logo 
        alle in einer Zeile anzuordnen. 
      */}
      <div className="mx-auto flex max-w-screen-xl items-center justify-center px-4 py-4 text-sm text-gray-600">
        {/* Link Impressum */}
        <Link href="/impressum" className="mx-2 hover:text-gray-900">
          Impressum
        </Link>

        <span className="mx-1 text-gray-400">|</span>

        {/* Link Datenrichtlinien */}
        <Link href="/datenrichtlinien" className="mx-2 hover:text-gray-900">
          Datenrichtlinien
        </Link>

        <span className="mx-1 text-gray-400">|</span>

        {/* 
          Das Logo „Hosted in Europe“ folgt jetzt direkt in der gleichen Flex-Zeile, 
          ohne absolute Position. Mit ml-2 bekommt es einen kleinen Abstand zu den Links. 
        */}
        
        <img
          src="/hosted-in-europe.jpg"
          alt="Hosted in Europe"
          className="h-5 w-auto object-contain"
          
        />
      </div>
    </footer>
  );
}
