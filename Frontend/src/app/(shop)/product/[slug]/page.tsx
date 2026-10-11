import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductShelf } from "@/components/product/ProductShelf";
import { ProductTabs } from "@/components/product/ProductTabs";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { getAllProducts, getPlatformBySlug, getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { ROUTES } from "@/lib/routes";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Game not found" };

  const platform = getPlatformBySlug(product.platform);
  return { title: `${product.title} (${platform?.shortName ?? product.platform})`, description: product.description };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const platform = getPlatformBySlug(product.platform);

  return (
    <>
      <Container className="space-y-6 py-5">
        <Breadcrumbs
          items={[
            { label: "Home", href: ROUTES.home },
            ...(platform ? [{ label: platform.name, href: ROUTES.browse({ device: platform.slug }) }] : []),
            { label: product.title },
          ]}
        />

        <div className="grid gap-8 rounded-card bg-surface p-4 shadow-card sm:p-6 lg:grid-cols-2">
          <ProductGallery product={product} />
          <ProductInfo product={product} />
        </div>

        <ProductTabs product={product} />
      </Container>

      <ProductShelf title="You may also like" products={getRelatedProducts(product)} />
    </>
  );
}
