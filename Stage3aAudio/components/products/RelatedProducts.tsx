// components/products/RelatedProducts.tsx
import { products } from "@/lib/data";
import Image from "next/image";
import Button from "@/components/shared/Button";
import Link from "next/link";

interface RelatedProductsProps {
  relatedSlugs: string[];
}

export default function RelatedProducts({ relatedSlugs }: RelatedProductsProps) {
  const related = products.filter((p) => relatedSlugs.includes(p.slug));

  return (
    <section 
    style={{padding: "0 3rem"}}
    className="mt-32">
      <h3 className="text-h5 md:text-h3 uppercase text-center mb-10 md:mb-14">
        You may also like
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-4 lg:gap-8">
        {related.map((product) => (
          <div key={product.id} className="flex flex-col items-center">
            {/* Image */}
            <div className="relative w-full h-32 md:h-80 rounded-lg overflow-hidden">
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
            {/* Title */}
            <h5 className="text-h5 uppercase mt-8 md:mt-10 mb-8">
              {product.shortName}
            </h5>
            {/* Button */}
            <Button href={`/products/${product.slug}`} variant="primary">
              See Product
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
