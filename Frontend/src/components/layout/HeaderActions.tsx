"use client";

import { Heart, LogOut, ShoppingCart, User } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { useUI } from "@/context/ui-context";
import { useWishlist } from "@/context/wishlist-context";
import { cn } from "@/lib/cn";

interface HeaderActionProps {
  label: string;
  count?: number;
  onClick: () => void;
  children: ReactNode;
}

function HeaderAction({
  label,
  count = 0,
  onClick,
  children,
}: HeaderActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={count > 0 ? `${label}, ${count} items` : label}
      className="relative flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-bold transition hover:bg-primary-soft"
    >
      <span className="relative">
        {children}
        {count > 0 && (
          // Keyed by count so the badge re-pops whenever the number changes.
          <span
            key={count}
            className="absolute -right-2 -top-2 grid min-w-5 animate-pop place-items-center rounded-full bg-brand px-1 text-[11px] font-bold leading-5 text-on-brand"
          >
            {count}
          </span>
        )}
      </span>
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}

export function HeaderActions({ className }: { className?: string }) {
  const { user, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const { itemCount } = useCart();
  const { openModal } = useUI();
  const { toast } = useToast();

  const firstName = user?.name.split(" ")[0];

  return (
    <div className={cn("flex items-center", className)}>
      {user ? (
        <div className="group relative">
          <button
            type="button"
            aria-haspopup="menu"
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-bold transition hover:bg-primary-soft"
          >
            <User size={22} aria-hidden />
            <span className="hidden lg:inline">Hi, {firstName}</span>
          </button>
          <div className="invisible absolute right-0 top-full z-50 w-48 translate-y-1 rounded-xl border border-line bg-surface p-1.5 text-ink opacity-0 shadow-pop transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
            <p className="truncate px-3 py-2 text-xs text-ink-muted">
              {user.email}
            </p>
            <button
              type="button"
              onClick={() => {
                logout();
                toast("You have been signed out", { tone: "info" });
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-surface-muted"
            >
              <LogOut size={16} aria-hidden />
              Sign out
            </button>
          </div>
        </div>
      ) : (
        <HeaderAction label="Sign in" onClick={() => openModal("login")}>
          <User size={22} aria-hidden />
        </HeaderAction>
      )}

      <HeaderAction
        label="Wishlist"
        count={wishlistCount}
        onClick={() => openModal("wishlist")}
      >
        <Heart size={22} aria-hidden />
      </HeaderAction>

      <HeaderAction
        label="Cart"
        count={itemCount}
        onClick={() => openModal("cart")}
      >
        <ShoppingCart size={22} aria-hidden />
      </HeaderAction>
    </div>
  );
}
