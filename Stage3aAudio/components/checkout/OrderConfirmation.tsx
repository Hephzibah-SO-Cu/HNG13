// components/checkout/OrderConfirmation.tsx
"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";

interface OrderConfirmationProps {
  onFinish: () => void;
}

const SHIPPING_FEE = 50; // Define shipping fee locally

export default function OrderConfirmation({ onFinish }: OrderConfirmationProps) {
  // --- FIX: Get cartTotal, and check for firstItem ---
  const { cart, cartTotal } = useCart();
  const firstItem = cart.length > 0 ? cart[0] : null;
  // Calculate grandTotal locally
  const grandTotal = cartTotal + SHIPPING_FEE;
  // --- END FIX ---

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40" />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] md:w-[540px] bg-white rounded-lg p-8 md:p-12">
        <Image
          src="/assets/checkout/icon-order-confirmation.svg"
          alt=""
          width={64}
          height={64}
        />
        <h2 className="text-h5 md:text-h3 uppercase mt-6 md:mt-8">
          Thank you<br />for your order
        </h2>
        <p className="text-body opacity-50 mt-4 md:mt-6">
          You will receive an email confirmation shortly.
        </p>

        {/* --- FIX: Only render summary if we have an item --- */}
        {firstItem ? (
          <div className="my-6 md:my-8 md:flex">
            {/* Item List */}
            <div className="bg-gray-light p-6 rounded-t-lg md:rounded-l-lg md:rounded-r-none md:w-3/5">
              <div className="flex items-center justify-between border-b border-gray-300 pb-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={firstItem.image.mobile}
                    alt={firstItem.name}
                    width={50}
                    height={50}
                    className="rounded-lg"
                  />
                  <div>
                    <p className="text-body font-bold">{firstItem.shortName}</p>
                    <p className="text-sm font-bold text-black opacity-50">
                      $ {firstItem.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className="text-body font-bold opacity-50">
                  x{firstItem.quantity}
                </span>
              </div>
              {cart.length > 1 && (
                <p className="text-sm text-center font-bold opacity-50 pt-3">
                  and {cart.length - 1} other item(s)
                </p>
              )}
            </div>

            {/* Grand Total */}
            <div className="bg-black text-white p-6 rounded-b-lg md:rounded-r-lg md:rounded-l-none md:w-2/5 md:flex md:flex-col md:justify-center">
              <p className="text-body uppercase opacity-50 mb-2">Grand Total</p>
              <p className="text-h6 text-white">$ {grandTotal.toLocaleString()}</p>
            </div>
          </div>
        ) : (
          // Fallback in case cart was empty (though we now block this)
          <div className="my-6 md:my-8 p-6 bg-gray-light rounded-lg">
            <p className="text-body opacity-50">Your order is being processed.</p>
          </div>
        )}
        
        {/* Back to Home Button */}
        <button
          onClick={onFinish}
          className="w-full text-sub uppercase tracking-[1px] font-bold text-center px-[30px] py-[15px] transition-colors bg-primary text-white hover:bg-primary-light"
        >
          Back to Home
        </button>
      </div>
    </>
  );
}

