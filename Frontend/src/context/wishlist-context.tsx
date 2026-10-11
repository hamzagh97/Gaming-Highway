"use client";

import { useCallback, useMemo, type ReactNode } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { createStrictContext } from "@/lib/create-strict-context";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { isStringList } from "@/lib/storage-guards";
import { useToast } from "./toast-context";

interface WishlistContextValue {
  ids: string[];
  count: number;
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
}

const [WishlistContextProvider, useWishlist] =
  createStrictContext<WishlistContextValue>("Wishlist");

export { useWishlist };

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useLocalStorage<string[]>(
    STORAGE_KEYS.wishlist,
    [],
    isStringList,
  );
  const { toast } = useToast();

  const has = useCallback(
    (productId: string) => ids.includes(productId),
    [ids],
  );

  const toggle = useCallback(
    (productId: string) => {
      const saved = ids.includes(productId);
      setIds((current) =>
        current.includes(productId)
          ? current.filter((id) => id !== productId)
          : [...current, productId],
      );
      toast(saved ? "Removed from your wishlist" : "Saved to your wishlist", {
        tone: saved ? "info" : "success",
      });
    },
    [ids, setIds, toast],
  );

  const value = useMemo(
    () => ({ ids, count: ids.length, has, toggle }),
    [ids, has, toggle],
  );

  return (
    <WishlistContextProvider value={value}>{children}</WishlistContextProvider>
  );
}
