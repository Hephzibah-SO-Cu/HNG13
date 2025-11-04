// components/checkout/Summary.tsx
"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";

interface SummaryProps {
  shipping: number;
  vat: number;
  grandTotal: number;
}

export default function Summary({ shipping, vat, grandTotal }: SummaryProps) {
  const { cart, cartTotal } = useCart();

  return (
    <div className="bg-white rounded-lg p-6 md:p-8 mt-8 lg:mt-0">
      <h3 className="text-h6 uppercase mb-8">Summary</h3>

      {/* Item List */}
      <div className="flex flex-col gap-6 mb-8">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={item.image.mobile}
                alt={item.name}
                width={64}
                height={64}
                className="rounded-lg"
              />
              <div>
                <p className="text-body font-bold">{item.shortName}</p>
                <p className="text-sm font-bold text-black opacity-50">
                  $ {item.price.toLocaleString()}
                </p>
              </div>
            </div>
            <span className="text-body font-bold opacity-50">
              x{item.quantity}
            </span>
          </div>
        ))}
      </div>

      {/* Price Calculation */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <p className="text-body uppercase opacity-50">Total</p>
          <p className="text-h6">$ {cartTotal.toLocaleString()}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-body uppercase opacity-50">Shipping</p>
          <p className="text-h6">$ {shipping.toLocaleString()}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-body uppercase opacity-50">VAT (Included)</p>
          <p className="text-h6">$ {vat.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="flex justify-between mt-4">
          <p className="text-body uppercase opacity-50">Grand Total</p>
          <p className="text-h6 text-primary">$ {grandTotal.toLocaleString()}</p>
        </div>
      </div>

      {/* Submit Button */}
      {/* The `type="submit"` links this button to the <form> it's inside */}
      <button
        type="submit"
        className="w-full text-sub uppercase tracking-[1px] font-bold text-center px-[30px] py-[15px] transition-colors bg-primary text-white hover:bg-primary-light mt-8"
      >
        Continue & Pay
      </button>
    </div>
  );
}
