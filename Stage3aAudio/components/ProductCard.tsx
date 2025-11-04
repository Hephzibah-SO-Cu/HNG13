// components/ProductCard.tsx
// This is the new, responsive, alternating product card
import Image from "next/image";
import Button from "@/components/shared/Button";
import { Product } from "@/lib/data";

interface ProductCardProps {
  product: Product;
  reverse?: boolean; // To control the alternating layout
}

export default function ProductCard({ product, reverse = false }: ProductCardProps) {
  return (
    <div
      className={`flex flex-col items-center text-center lg:flex-row lg:gap-32 lg:text-left ${
        reverse ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Image Section */}
      <div className="w-full h-[352px] md:h-[352px] lg:h-[560px] lg:w-1/2 relative rounded-lg overflow-hidden">
        <Image
          src={product.image.mobile}
          alt={product.name}
          fill
          className="object-cover md:hidden"
        />
        <Image
          src={product.image.tablet}
          alt={product.name}
          fill
          className="hidden md:block lg:hidden object-cover"
        />
        <Image
          src={product.image.desktop}
          alt={product.name}
          fill
          className="hidden lg:block object-cover"
        />
      </div>

      {/* Text Content Section */}
      <div className="lg:w-1/2 mt-8 md:mt-12 lg:mt-0">
        {product.isNew && (
          <span className="overline-text text-primary">NEW PRODUCT</span>
        )}
        <h2 className="text-h4 md:text-h2 mt-4 uppercase max-w-sm mx-auto lg:mx-0">
          {product.name}
        </h2>
        <p className="text-body opacity-50 my-6 md:my-8">
          {product.description}
        </p>
        <Button href={`/products/${product.slug}`} variant="primary">
          See Product
        </Button>
      </div>
    </div>
  );
}
