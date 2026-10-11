"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { cn } from "@/lib/cn";

export type OverlayPlacement = "center" | "left" | "right";

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name of the dialog. */
  label: string;
  placement?: OverlayPlacement;
  panelClassName?: string;
  children: ReactNode;
}

const placementClasses: Record<OverlayPlacement, string> = {
  center: "items-end justify-center sm:items-center sm:p-4",
  left: "justify-start",
  right: "justify-end",
};

/** Shared portal, backdrop, scroll lock and Escape handling for Modal and Drawer. */
export function Overlay({
  open,
  onClose,
  label,
  placement = "center",
  panelClassName,
  children,
}: OverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useLockBodyScroll(open);
  useEscapeKey(onClose, open);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className={cn("fixed inset-0 z-50 flex", placementClasses[placement])}>
      <div
        aria-hidden
        className="absolute inset-0 animate-fade-in bg-black/70 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={cn("relative outline-none", panelClassName)}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
