// src/app/components/StarRating.tsx
"use client";

type StarRatingProps = {
  rating: number; // z. B. 4.7
};

// Wir nutzen hier SVG‐Pfad für einen Stern. 
// Der äußere Container hat “text-gray-300”
// und die überlagerte Div hat “text-yellow-400” (gefüllte Sterne).
export default function StarRating({ rating }: StarRatingProps) {
  // Clamp rating zwischen 0 und 5
  const safeRating = Math.max(0, Math.min(rating, 5));
  // Prozentwerte, wie viel der 5 Sterne gefüllt sein sollen
  const fillPercentage = (safeRating / 5) * 100;

  // SVG‐Pfad für einen Stern (gleiche Wiederverwendung fünfmal)
  const starSvg = (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="currentColor"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  );

  return (
    <div className="relative inline-block leading-none">
      {/* 1) Untere Ebene: 5 graue Sterne */}
      <div className="flex text-gray-300">
        {[...Array(5)].map((_, i) => (
          <span key={i}>{starSvg}</span>
        ))}
      </div>
      {/* 2) Absolute Overlay‐Ebene: 5 gelbe Sterne, deren Breite auf fillPercentage beschränkt ist */}
      <div
        className="absolute top-0 left-0 overflow-hidden text-yellow-400"
        style={{ width: `${fillPercentage}%` }}
      >
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <span key={i}>{starSvg}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
