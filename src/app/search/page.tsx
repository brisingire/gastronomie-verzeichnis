// src/app/search/page.tsx
import { Suspense } from 'react';
import SearchResultsClient from "./SearchResultsClient";

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResultsClient />
    </Suspense>
  );
}