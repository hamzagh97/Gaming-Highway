import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge about the custom tokens from the Tailwind theme so
// conflicting classes (e.g. `rounded-lg` vs `rounded-card`) are resolved.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ["card"],
      shadow: ["card", "pop"],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
