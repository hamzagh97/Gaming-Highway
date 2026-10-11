"use client";

import { ModalRoot } from "@/components/modals/ModalRoot";
import { ToastViewport } from "@/components/ui/ToastViewport";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { ToastProvider } from "@/context/toast-context";
import { UIProvider } from "@/context/ui-context";
import { WishlistProvider } from "@/context/wishlist-context";
import type { ReactNode } from "react";

/** Composes every context provider plus the global overlays. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <UIProvider>
              {children}
              <ModalRoot />
              <ToastViewport />
            </UIProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
