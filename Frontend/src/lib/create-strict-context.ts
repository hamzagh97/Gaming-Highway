import { createContext, useContext } from "react";

/**
 * Creates a context whose consumer hook throws when used outside its provider,
 * so components never have to handle a missing value.
 */
export function createStrictContext<T>(name: string) {
  const Context = createContext<T | null>(null);

  function useStrictContext(): T {
    const value = useContext(Context);
    if (value === null) {
      throw new Error(`use${name} must be used inside <${name}Provider>`);
    }
    return value;
  }

  return [Context.Provider, useStrictContext] as const;
}
