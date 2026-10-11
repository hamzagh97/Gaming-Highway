import type { VariantGroup } from "@/types";

/** Standard vs Deluxe edition; the Deluxe edition costs `deluxeExtra` more. */
export const editions = (deluxeExtra: number): VariantGroup => ({
  id: "edition",
  label: "Edition",
  options: [
    { value: "standard", label: "Standard" },
    { value: "deluxe", label: "Deluxe", priceDelta: deluxeExtra },
  ],
});
