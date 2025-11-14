// components/products/ProductDetailCard.tsx
"use client";

import Image from "next/image";
import { Product } from "@/lib/data";
import QuantitySelector from "@/components/products/QuantitySelector";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import toast from 'react-hot-toast'; // 1. Import toast

interface ProductDetailCardProps {
  product: Product;
}

export default function ProductDetailCard({ product }: ProductDetailCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // 2. Add toast notification
    toast.success(`${quantity} x ${product.shortName} added to cart!`);
  };

  return (
    <section 
    style={{padding: "0 3rem"}}
    className="flex flex-col md:flex-row md:items-center md:gap-16 lg:gap-32">
      {/* Image Section */}
      <div className="w-full h-[327px] md:h-[480px] lg:h-[560px] md:w-2/5 lg:w-1/2 relative rounded-lg overflow-hidden">
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
      <div className="md:w-3/5 lg:w-1/2 mt-8 md:mt-0">
        {product.isNew && (
          <span className="overline-text text-primary">NEW PRODUCT</span>
        )}
        <h2 className="text-h4 md:text-h2 mt-4 uppercase">
          {product.name}
        </h2>
        <p className="text-body opacity-50 my-6 md:my-8">
          {product.description}
        </p>
        <p className="text-h6 font-bold tracking-[1.3px] mb-8">
          $ {product.price.toLocaleString()}
        </p>

        {/* Add to Cart Section */}
        <div className="flex items-center gap-4">
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
          <button
            onClick={handleAddToCart}
            className="inline-block text-sub uppercase tracking-[1px] font-bold text-center px-[30px] py-[15px] transition-colors bg-primary text-white hover:bg-primary-light"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}