import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Container";
import { ROUTES } from "@/lib/routes";

export function CheckoutHeader() {
  return (
    <header className="bg-surface shadow-sm">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />
        <p className="hidden items-center gap-2 text-sm font-bold sm:flex">
          <Lock size={16} aria-hidden />
          Secure checkout
        </p>
        <Link href={ROUTES.home} className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">
          <ArrowLeft size={16} aria-hidden />
          Continue shopping
        </Link>
      </Container>
    </header>
  );
}
