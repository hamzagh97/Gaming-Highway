import type { ReactNode } from "react";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/lib/constants";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <CheckoutHeader />
      <main>{children}</main>
      <footer className="py-8">
        <Container>
          <p className="text-center text-xs text-ink-muted">© 2026 {SITE.name}. Demo checkout, no payment is processed.</p>
        </Container>
      </footer>
    </>
  );
}
