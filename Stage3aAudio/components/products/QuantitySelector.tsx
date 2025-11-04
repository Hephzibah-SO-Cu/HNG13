// components/products/QuantitySelector.tsx
"use client";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (quantity: number) => void;
}

export default function QuantitySelector({
  quantity,
  setQuantity,
}: QuantitySelectorProps) {
  
  const handleDecrement = () => {
    setQuantity(Math.max(1, quantity - 1)); // Don't go below 1
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="flex items-center justify-between bg-gray-light w-32 h-12">
      <button
        onClick={handleDecrement}
        className="w-1/3 h-full text-sub text-black opacity-25 hover:opacity-100 hover:text-primary"
      >
        -
      </button>
      <span className="w-1/3 h-full flex items-center justify-center text-sub font-bold text-black">
        {quantity}
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
