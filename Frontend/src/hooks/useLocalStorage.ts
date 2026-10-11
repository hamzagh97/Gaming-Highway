import { useEffect, useState } from "react";

/**
 * State persisted to localStorage. The first render always uses `initialValue`
 * so server and client markup match; the stored value is applied after mount
 * and `hydrated` flips to true once that has happened.
 *
 * Stored data is untrusted: when `isValid` is given, a value that fails the check
 * is discarded and `initialValue` is kept.
 */
export function useLocalStorage<T>(key: string, initialValue: T, isValid?: (value: unknown) => value is T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        const parsed: unknown = JSON.parse(raw);
        if (!isValid || isValid(parsed)) setValue(parsed as T);
      }
    } catch {
      // Ignore unreadable or blocked storage and keep the initial value.
    }
    setHydrated(true);
  }, [key, isValid]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage may be full or disabled; the app keeps working in memory.
    }
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}
