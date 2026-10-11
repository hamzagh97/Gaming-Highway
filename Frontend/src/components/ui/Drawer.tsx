"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconButton } from "./IconButton";
import { Overlay } from "./Overlay";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: "left" | "right";
  footer?: ReactNode;
  children: ReactNode;
}

/** Full-height side panel with a scrollable body and an optional pinned footer. */
export function Drawer({ open, onClose, title, side = "right", footer, children }: DrawerProps) {
  return (
    <Overlay
      open={open}
      onClose={onClose}
      label={title}
      placement={side}
      panelClassName={cn(
        "h-full w-[min(100vw,26rem)]",
        side === "right" ? "animate-slide-in-right" : "animate-slide-in-left",
      )}
    >
      <div className="flex h-full flex-col bg-surface shadow-pop">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 className="text-lg font-bold">{title}</h2>
          <IconButton label="Close panel" size="sm" onClick={onClose}>
            <X size={18} aria-hidden />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && <div className="border-t border-line bg-surface p-4">{footer}</div>}
      </div>
    </Overlay>
  );
}
