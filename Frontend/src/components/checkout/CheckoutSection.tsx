import type { ReactNode } from "react";

interface CheckoutSectionProps {
  step: number;
  title: string;
  children: ReactNode;
}

export function CheckoutSection({ step, title, children }: CheckoutSectionProps) {
  return (
    <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
      <header className="mb-5 flex items-center gap-3">
        <span className="grid size-7 place-items-center rounded-full bg-brand text-sm font-bold text-on-brand">{step}</span>
        <h2 className="text-lg font-bold">{title}</h2>
      </header>
      {children}
    </section>
  );
}
