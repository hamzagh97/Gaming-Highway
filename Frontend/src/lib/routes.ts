type ParamValue = string | number | readonly string[] | null | undefined;

/** Everything the Browse page understands in its URL. Lists are comma separated. */
export interface BrowseHrefParams {
  /** Free-text search. */
  q?: ParamValue;
  /** ps5, xbox or pc. */
  device?: ParamValue;
  /** steam, psn, xbox-live... */
  store?: ParamValue;
  genre?: ParamValue;
  /** key or account. */
  type?: ParamValue;
  min?: ParamValue;
  max?: ParamValue;
  sort?: ParamValue;
  view?: ParamValue;
}

function toText(value: ParamValue): string {
  if (value === null || value === undefined) return "";
  return typeof value === "object" ? value.join(",") : String(value);
}

/** Builds a link to the Browse page. Empty values are left out. */
function browse(params: BrowseHrefParams = {}): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const text = toText(value);
    if (text) search.set(key, text);
  }
  const query = search.toString();
  return query ? `/browse?${query}` : "/browse";
}

export const ROUTES = {
  home: "/",
  checkout: "/checkout",
  product: (slug: string) => `/product/${slug}`,
  browse,
} as const;
