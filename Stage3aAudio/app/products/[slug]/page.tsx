// app/products/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { products, Product } from "@/lib/data";
import { useEffect, useState } from "react";
import CategoryNav from "@/components/CategoryNav";
import BestGear from "@/components/shared/BestGear";
import GoBackButton from "@/components/GoBackButton";
import ProductDetailCard from "@/components/products/ProductDetailCard";
import ProductFeatures from "@/components/products/ProductFeatures";
import ProductBoxContents from "@/components/products/ProductBoxContents";
import ProductGallery from "@/components/products/ProductGallery";
import RelatedProducts from "@/components/products/RelatedProducts";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (slug) {
      const foundProduct = products.find((p) => p.slug === slug);
      setProduct(foundProduct || null);
    }
  }, [slug]);

  if (!product) {
    return <div>Loading product...</div>;
  }

  return (
    <div className="container pt-4 md:pt-8 lg:pt-20">
      {/* 1. Go Back Link */}
      <GoBackButton />

      {/* 2. Main Product Card */}
      <ProductDetailCard product={product} />

      {/* 3. Features & In the Box */}
      <section className="mt-20 flex flex-col lg:flex-row lg:gap-32">
        <ProductFeatures features={product.features} />
        <ProductBoxContents items={product.inTheBox} />
      </section>

      {/* 4. Product Gallery */}
      <ProductGallery gallery={product.gallery} />

      {/* 5. Related Products */}
      <RelatedProducts relatedSlugs={product.relatedProducts} />

      {/* 6. Category Nav */}
      <CategoryNav />

      {/* 7. Best Gear */}
      <BestGear />
    </div>
  );
}
