"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useToast, type ToastTone } from "@/context/toast-context";
import { cn } from "@/lib/cn";

const toneIcons: Record<ToastTone, typeof Info> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const toneClasses: Record<ToastTone, string> = {
  success: "text-success",
  error: "text-danger",
  info: "text-brand",
};

export function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((item) => {
        const Icon = toneIcons[item.tone];
        return (
          <div
            key={item.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm animate-pop items-center gap-3 rounded-xl border border-line-strong bg-surface-muted px-4 py-3 text-sm text-ink shadow-pop"
          >
            <Icon size={20} aria-hidden className={cn("shrink-0", toneClasses[item.tone])} />
            <span className="flex-1 font-medium">{item.message}</span>
            {item.action && (
              <button
                type="button"
                onClick={() => {
                  item.action?.onClick();
                  dismiss(item.id);
                }}
                className="shrink-0 font-bold text-brand hover:underline"
              >
                {item.action.label}
              </button>
            )}
            <button type="button" aria-label="Dismiss" onClick={() => dismiss(item.id)} className="shrink-0 text-white/60 hover:text-white">
              <X size={16} aria-hidden />
            </button>
          </div>
        );
      })}
    </div>
  );
}
