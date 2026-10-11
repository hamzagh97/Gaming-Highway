import { BrowseFallback, BrowseView } from "@/components/browse/BrowseView";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Browse games",
  description:
    "Filter PC, PS5 and Xbox game keys and accounts by device, platform, category and price.",
};

export default function BrowsePage() {
  // useSearchParams (inside BrowseView) needs a Suspense boundary.
  return (
    <Suspense fallback={<BrowseFallback />}>
      <BrowseView />
    </Suspense>
  );
}
