"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { parseBrowseQuery, toBrowseHref, type BrowseQuery } from "@/lib/browse";

/**
 * The Browse page keeps its state in the URL, so filtered pages can be shared, bookmarked
 * and reached from links elsewhere (navbar, search). Reading goes through the validating
 * parser; changing a filter just navigates to the new URL.
 */
export function useBrowseQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const query = useMemo(() => parseBrowseQuery((name) => params.get(name)), [params]);

  const update = useCallback(
    (patch: Partial<BrowseQuery>) => {
      // Only this page understands these parameters.
      if (pathname !== "/browse") return;
      router.replace(toBrowseHref({ ...query, ...patch }), { scroll: false });
    },
    [pathname, router, query],
  );

  const clearAll = useCallback(() => {
    router.replace(toBrowseHref({ sort: query.sort, view: query.view }), { scroll: false });
  }, [router, query.sort, query.view]);

  return { query, update, clearAll };
}
