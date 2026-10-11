"use client";

import { useCountdownToMidnight } from "@/hooks/useCountdownToMidnight";
import { padTwo } from "@/lib/format";

const LABELS = ["hours", "minutes", "seconds"] as const;

export function CountdownTimer() {
  const time = useCountdownToMidnight();
  const values = time ? [time.hours, time.minutes, time.seconds] : null;

  return (
    <div className="flex items-center gap-1.5" role="timer" aria-label="Time left on today's deals">
      <span className="hidden text-sm font-semibold text-ink-soft sm:inline">Ends in</span>
      {LABELS.map((label, index) => (
        <span key={label} className="flex items-center gap-1.5">
          <span className="grid min-w-9 place-items-center rounded-md bg-page px-1.5 py-1 text-sm font-bold tabular-nums text-brand">
            {values ? padTwo(values[index]) : "--"}
          </span>
          {index < LABELS.length - 1 && <span aria-hidden className="font-bold">:</span>}
        </span>
      ))}
    </div>
  );
}
