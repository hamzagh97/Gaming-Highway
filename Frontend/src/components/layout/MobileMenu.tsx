"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { useAuth } from "@/context/auth-context";
import { useUI } from "@/context/ui-context";
import { genres, platforms } from "@/data/platforms";
import { ROUTES } from "@/lib/routes";

const rowClasses =
  "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition hover:bg-primary-soft";

export function MobileMenu() {
  const { modal, closeModal, openModal } = useUI();
  const { user } = useAuth();

  return (
    <Drawer open={modal === "menu"} onClose={closeModal} title="Menu" side="left">
      <div className="space-y-1 border-b border-line p-3">
        <button type="button" onClick={() => openModal("login")} className={rowClasses}>
          <User size={20} aria-hidden />
          {user ? `Signed in as ${user.name}` : "Sign in or create account"}
        </button>
      </div>

      <div className="p-3 pb-0">
        <Link
          href={ROUTES.browse()}
          onClick={closeModal}
          className="shine flex h-11 items-center justify-center rounded-lg bg-brand text-sm font-extrabold text-on-brand"
        >
          Browse all games
        </Link>
      </div>

      <p className="px-6 pb-1 pt-4 text-xs font-bold uppercase tracking-wide text-ink-muted">Platforms</p>
      <ul className="p-3 pt-0">
        {platforms.map((platform) => (
          <li key={platform.slug}>
            <Link href={ROUTES.browse({ device: platform.slug })} onClick={closeModal} className={rowClasses}>
              <span aria-hidden className="text-xl">
                {platform.emoji}
              </span>
              {platform.name}
            </Link>
          </li>
        ))}
      </ul>

      <p className="px-6 pb-1 pt-2 text-xs font-bold uppercase tracking-wide text-ink-muted">Genres</p>
      <ul className="p-3 pt-0">
        {genres.map((genre) => (
          <li key={genre.slug}>
            <Link href={ROUTES.browse({ genre: genre.slug })} onClick={closeModal} className={rowClasses}>
              <span aria-hidden className="text-xl">
                {genre.emoji}
              </span>
              {genre.name}
            </Link>
          </li>
        ))}
      </ul>
    </Drawer>
  );
}
