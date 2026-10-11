"use client";

import { useCallback, useMemo, type ReactNode } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { createStrictContext } from "@/lib/create-strict-context";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { isUserProfileOrNull } from "@/lib/storage-guards";
import type { UserProfile } from "@/types";

interface AuthContextValue {
  user: UserProfile | null;
  login: (user: UserProfile) => void;
  logout: () => void;
  hydrated: boolean;
}

const [AuthContextProvider, useAuth] =
  createStrictContext<AuthContextValue>("Auth");

export { useAuth };

/** Mock authentication: any valid email works and the profile lives in localStorage. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser, hydrated] = useLocalStorage<UserProfile | null>(
    STORAGE_KEYS.user,
    null,
    isUserProfileOrNull,
  );

  const login = useCallback(
    (profile: UserProfile) => setUser(profile),
    [setUser],
  );
  const logout = useCallback(() => setUser(null), [setUser]);

  const value = useMemo(
    () => ({ user, login, logout, hydrated }),
    [user, login, logout, hydrated],
  );

  return <AuthContextProvider value={value}>{children}</AuthContextProvider>;
}
