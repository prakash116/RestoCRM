import { CuisineSection } from "@/components/home/CuisineSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Hero } from "@/components/home/Hero";
import { PartnerLogos } from "@/components/home/PartnerLogos";
import { PopularDishes } from "@/components/home/PopularDishes";
import { PricingSection } from "@/components/home/PricingSection";
import { PromoCarousel } from "@/components/home/PromoCarousel";
import { RestaurantBenefits } from "@/components/home/RestaurantBenefits";
import { RestaurantSection } from "@/components/home/RestaurantSection";
import { cuisines } from "@/data/cuisines";
import { getTrendingDishes } from "@/data/dishes";
import { getFeaturedRestaurants } from "@/data/restaurants";
import { buildSearchIndex } from "@/lib/search";

/**
 * Marketplace homepage.
 *
 * A Server Component that fetches once and hands data down. Only four
 * children hydrate — the search field, the promo carousel, the filter row and
 * the hero's floating cards — so the vast majority of this page is HTML by the
 * time it reaches the browser.
 */
export default function HomePage() {
  const searchIndex = buildSearchIndex();
  const restaurants = getFeaturedRestaurants();
  const dishes = getTrendingDishes();

  return (
    <>
      <Hero searchIndex={searchIndex} />
      <PromoCarousel />
      <RestaurantSection restaurants={restaurants} />
      <PopularDishes dishes={dishes} />
      <CuisineSection cuisines={cuisines} />
      <RestaurantBenefits />
      <PricingSection />
      <PartnerLogos />
      <FinalCTA />
    </>
  );
}
