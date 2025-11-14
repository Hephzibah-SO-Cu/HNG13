// app/category/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { products, Product } from "@/lib/data"; // Import our mock data
import CategoryHeader from "@/components/CategoryHeader";
import ProductCard from "@/components/ProductCard";
import CategoryNav from "@/components/CategoryNav";
import BestGear from "@/components/shared/BestGear";
import { useEffect, useState } from "react";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<string>("");
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (slug) {
      const filteredProducts = products.filter(
        (p) => p.category === slug
      );
      setCategoryProducts(filteredProducts);
      // Set the title (e.g., "headphones" -> "HEADPHONES")
      setCategory(slug.toUpperCase());
    }
  }, [slug]);

  if (!categoryProducts.length) {
    // You can add a proper loading state or "not found" component here
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* 1. Category Header */}
      <CategoryHeader title={category} />

      {/* 2. Product List */}
      <section 
      style={{padding: "0 3rem"}}
      className="container mt-16 mb-32 flex flex-col gap-32">
        {categoryProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            // Alternate layout: first item (index 0) is normal, second (index 1) is reversed
            reverse={index % 2 === 1}
          />
        ))}
      </section>

      {/* 3. CategoryNav */}
      <CategoryNav />

      {/* 4. BestGear */}
      <BestGear />
    </div>
  );
}
