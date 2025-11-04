// app/page.tsx
import Hero from "@/components/home/Hero";
import CategoryNav from "@/components/CategoryNav";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BestGear from "@/components/shared/BestGear";

// This assembles the homepage
export default function Home() {
  return (
    <>
      <Hero />
      <CategoryNav />
      <FeaturedProducts />
      <BestGear />
    </>
  );
}

