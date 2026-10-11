import { IMAGE_HOSTS } from "@/config/image-hosts";

/**
 * True when `next/image` can load `src`: a local path ("/images/x.jpg") or an https URL
 * whose host is listed in `IMAGE_HOSTS`. Anything else would make `next/image` throw, so
 * the UI shows the placeholder instead and warns in the console during development.
 */
export function isAllowedImageSrc(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//")) return true;

  try {
    const url = new URL(src);
    const allowed = url.protocol === "https:" && IMAGE_HOSTS.includes(url.hostname);
    if (!allowed && process.env.NODE_ENV !== "production") {
      console.warn(`[images] "${src}" was not loaded. Add "${url.hostname}" to src/config/image-hosts.ts (https only).`);
    }
    return allowed;
  } catch {
    return false;
  }
}
