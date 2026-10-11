"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { fieldControlClasses } from "@/components/ui/TextField";
import { SITE } from "@/lib/constants";

interface PriceFilterProps {
  min: number | null;
  max: number | null;
  onApply: (min: number | null, max: number | null) => void;
}

const toText = (value: number | null) => (value === null ? "" : String(value));

/** From / To price boxes. The filter is applied when a box loses focus or Enter is pressed. */
export function PriceFilter({ min, max, onApply }: PriceFilterProps) {
  const [minText, setMinText] = useState(toText(min));
  const [maxText, setMaxText] = useState(toText(max));

  // Follow the URL when it changes elsewhere (Clear all, removing a chip, a link).
  useEffect(() => setMinText(toText(min)), [min]);
  useEffect(() => setMaxText(toText(max)), [max]);

  const apply = () => {
    const parse = (text: string) => {
      const value = Number(text);
      return text.trim() === "" || !Number.isFinite(value) || value < 0 ? null : value;
    };
    const nextMin = parse(minText);
    const nextMax = parse(maxText);
    if (nextMin !== min || nextMax !== max) onApply(nextMin, nextMax);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") apply();
  };

  const inputClasses = `${fieldControlClasses} h-10 border-line-strong`;

  return (
    <fieldset className="border-t border-line py-5">
      <legend className="mb-3 text-sm font-bold">
        Price <span className="font-normal text-ink-muted">({SITE.currency})</span>
      </legend>
      <div className="flex items-center gap-2">
        <input
          type="text"
          inputMode="decimal"
          maxLength={9}
          placeholder="From"
          aria-label={`Minimum price in ${SITE.currency}`}
          value={minText}
          onChange={(event) => setMinText(event.target.value.replace(/[^\d.]/g, ""))}
          onBlur={apply}
          onKeyDown={handleKeyDown}
          className={inputClasses}
        />
        <span aria-hidden className="text-ink-muted">
          -
        </span>
        <input
          type="text"
          inputMode="decimal"
          maxLength={9}
          placeholder="To"
          aria-label={`Maximum price in ${SITE.currency}`}
          value={maxText}
          onChange={(event) => setMaxText(event.target.value.replace(/[^\d.]/g, ""))}
          onBlur={apply}
          onKeyDown={handleKeyDown}
          className={inputClasses}
        />
      </div>
    </fieldset>
  );
}
