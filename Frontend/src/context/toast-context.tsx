"use client";

import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { createStrictContext } from "@/lib/create-strict-context";

export type ToastTone = "success" | "error" | "info";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
  action?: ToastAction;
}

interface ToastOptions {
  tone?: ToastTone;
  action?: ToastAction;
  /** Milliseconds before the toast dismisses itself. */
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  toast: (message: string, options?: ToastOptions) => void;
  dismiss: (id: number) => void;
}

const [ToastContextProvider, useToast] = createStrictContext<ToastContextValue>("Toast");

export { useToast };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, { tone = "info", action, duration = 3500 }: ToastOptions = {}) => {
      const id = nextId.current++;
      setToasts((current) => [...current.slice(-2), { id, message, tone, action }]);
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);

  return <ToastContextProvider value={value}>{children}</ToastContextProvider>;
}
