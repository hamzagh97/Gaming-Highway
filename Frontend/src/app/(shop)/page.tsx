import { DealsSection } from "@/components/home/DealsSection";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { PromoBanners } from "@/components/home/PromoBanners";
import { ServiceBar } from "@/components/home/ServiceBar";
import { ProductShelf } from "@/components/product/ProductShelf";
import { Container } from "@/components/ui/Container";
import { heroSlides } from "@/data/banners";
import {
  getBestSellers,
  getNewArrivals,
  getPreOrders,
  getTopRatedProducts,
} from "@/lib/catalog";

export default function HomePage() {
  return (
    <>
      <Container className="pt-4">
        <HeroCarousel slides={heroSlides} />
      </Container>

      <ServiceBar />
      {/* <PlatformGrid /> */}
      <DealsSection />
      <PromoBanners />

      <ProductShelf
        title="Best sellers"
        subtitle="What gamers are buying right now"
        products={getBestSellers()}
      />
      <ProductShelf
        title="Pre-orders"
        subtitle="Reserve upcoming releases"
        products={getPreOrders()}
      />
      <ProductShelf
        title="New releases"
        subtitle="Fresh on the shelf"
        products={getNewArrivals()}
      />

      <ProductShelf
        title="Top rated"
        subtitle="Loved by players"
        products={getTopRatedProducts()}
      />
      {/* <PublisherStrip /> */}
    </>
  );
}
