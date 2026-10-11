import { ScrollRow } from "@/components/ui/ScrollRow";
import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

/** Horizontally scrolling row of product cards. */
export function ProductRow({ products }: { products: Product[] }) {
  return (
    <ScrollRow>
      {products.map((product) => (
        <div
          key={product.id}
          className="w-[11rem] shrink-0 snap-start sm:w-[13rem] lg:w-[14.5rem]"
        >
          <ProductCard product={product} />
        </div>
      ))}
    </ScrollRow>
  );
}
