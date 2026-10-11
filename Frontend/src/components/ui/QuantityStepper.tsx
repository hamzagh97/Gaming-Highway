import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  size = "md",
  className,
}: QuantityStepperProps) {
  const buttonClasses = cn(
    "grid place-items-center text-ink transition hover:bg-surface-muted disabled:opacity-40 disabled:hover:bg-transparent",
    size === "sm" ? "size-8" : "size-10",
  );

  return (
    <div
      role="group"
      aria-label="Quantity"
      className={cn("inline-flex items-center overflow-hidden rounded-lg border border-line-strong bg-surface", className)}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className={buttonClasses}
      >
        <Minus size={14} aria-hidden />
      </button>
      <span aria-live="polite" className="min-w-8 text-center text-sm font-bold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className={buttonClasses}
      >
        <Plus size={14} aria-hidden />
      </button>
    </div>
  );
}
