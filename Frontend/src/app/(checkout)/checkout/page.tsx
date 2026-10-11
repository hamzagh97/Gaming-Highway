import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/CheckoutView";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <Container className="py-6">
      <h1 className="mb-6 text-2xl font-extrabold">Checkout</h1>
      <CheckoutView />
    </Container>
  );
}
