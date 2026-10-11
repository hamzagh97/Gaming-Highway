"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconButton } from "./IconButton";
import { Overlay } from "./Overlay";

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
} as const;

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  size?: keyof typeof sizeClasses;
  children: ReactNode;
}

/** Centered dialog on desktop, bottom sheet on mobile. */
export function Modal({ open, onClose, title, size = "md", children }: ModalProps) {
  return (
    <Overlay
      open={open}
      onClose={onClose}
      label={title}
      panelClassName={cn("w-full animate-slide-up sm:animate-pop", sizeClasses[size])}
    >
      <div className="flex max-h-[90dvh] flex-col overflow-hidden rounded-t-2xl bg-surface shadow-pop sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 className="text-lg font-bold">{title}</h2>
          <IconButton label="Close dialog" size="sm" onClick={onClose}>
            <X size={18} aria-hidden />
          </IconButton>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </Overlay>
  );
}
