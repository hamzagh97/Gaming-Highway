import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductRow } from "@/components/product/ProductRow";
import { getDealProducts } from "@/lib/catalog";
import { CountdownTimer } from "./CountdownTimer";

export function DealsSection() {
  const deals = getDealProducts(10);

  return (
    <section className="py-6">
      <Container>
        <div className="rounded-card bg-primary-soft p-4 shadow-card sm:p-6">
          <SectionHeader
            title="🔥 Hot deals"
            subtitle="Biggest game discounts today"
            trailing={<CountdownTimer />}
          />
          <ProductRow products={deals} />
        </div>
      </Container>
    </section>
  );
}
