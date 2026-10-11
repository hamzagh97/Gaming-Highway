import { useEffect, useState } from "react";

export interface CountdownParts {
  hours: number;
  minutes: number;
  seconds: number;
}

/** Counts down to the next local midnight. Returns null until mounted to avoid hydration mismatches. */
export function useCountdownToMidnight(): CountdownParts | null {
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      setRemainingMs(midnight.getTime() - now.getTime());
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (remainingMs === null) return null;
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}
