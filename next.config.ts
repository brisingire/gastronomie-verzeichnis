// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ...weitere Konfigurationsoptionen, falls vorhanden

  // Damit ESLint-Fehler den Produktions-Build nicht blockieren:
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
