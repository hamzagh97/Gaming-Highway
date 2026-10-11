import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Product } from "@/types";
import { ProductRow } from "./ProductRow";

interface ProductShelfProps {
  title: string;
  subtitle?: string;
  products: Product[];
  actionHref?: string;
}

/** Titled, padded section containing a product row. */
export function ProductShelf({
  title,
  subtitle,
  products,
  actionHref,
}: ProductShelfProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-6">
      <Container>
        <div className="rounded-card bg-surface p-4 shadow-card sm:p-6">
          <SectionHeader
            title={title}
            subtitle={subtitle}
            actionHref={actionHref}
          />
          <ProductRow products={products} />
        </div>
      </Container>
    </section>
  );
}
