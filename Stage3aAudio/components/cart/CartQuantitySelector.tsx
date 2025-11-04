// components/cart/CartQuantitySelector.tsx
// A smaller, cart-specific version
"use client";

import { useCart } from "@/context/CartContext";
import { CartItem } from "@/context/CartContext";

interface CartQuantitySelectorProps {
  product: CartItem;
}

export default function CartQuantitySelector({
  product,
}: CartQuantitySelectorProps) {
  const { updateQuantity } = useCart();

  const handleDecrement = () => {
    updateQuantity(product.id, product.quantity - 1);
  };

  const handleIncrement = () => {
    updateQuantity(product.id, product.quantity + 1);
  };

  return (
    <div className="flex items-center justify-between bg-gray-light w-24 h-8">
      <button
        onClick={handleDecrement}
        className="w-1/3 h-full text-sub text-black opacity-25 hover:opacity-100 hover:text-primary"
      >
        -
      </button>
      <span className="w-1/3 h-full flex items-center justify-center text-sm font-bold text-black">
        {product.quantity}
      </span>
      <button
        onClick={handleIncrement}
        className="w-1/3 h-full text-sub text-black opacity-25 hover:opacity-100 hover:text-primary"
      >
        +
      </button>
    </div>
  );
}
