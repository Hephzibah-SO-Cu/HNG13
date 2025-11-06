// components/cart/CartModal.tsx
"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import CartQuantitySelector from "./CartQuantitySelector";
import toast from 'react-hot-toast'; // 1. Import toast

interface CartModalProps {
  onClose: () => void;
}

export default function CartModal({ onClose }: CartModalProps) {
  const { cart, cartCount, cartTotal, clearCart } = useCart();

  return (
    <>
      {/* --- BACKDROP --- */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-40"
        onClick={onClose}
      />

      {/* --- MODAL (FIXED) --- */}
      {/* 1. Changed `absolute` to `fixed` to stop scroll */}
      <div
        className="fixed z-50 mt-6 rounded-lg bg-white p-8 top-[90px] w-[90%] 
                   left-1/2 -translate-x-1/2 
                   md:w-[377px] md:left-auto md:-translate-x-0 md:right-10"
      >
        {cart.length === 0 ? (
          <p className="text-body text-center">Your cart is empty.</p>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h6 className="uppercase">Cart ({cartCount})</h6>
              <button
                onClick={() => {
                  clearCart();
                  toast.success("Cart cleared"); // 2. Added toast
                }}
                className="text-body text-black opacity-50 underline hover:text-primary"
              >
                Remove all
              </button>
            </div>

            {/* Item List */}
            <div className="flex flex-col gap-6 mb-8">
              {/* ... (item map is unchanged) ... */}
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.image.mobile} // Using mobile image, it's small
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
                  <CartQuantitySelector product={item} />
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-body uppercase opacity-50">Total</p>
              <p className="text-h6">$ {cartTotal.toLocaleString()}</p>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              onClick={onClose}
              className="inline-block w-full text-sub uppercase tracking-[1px] font-bold text-center px-[30px] py-[15px] transition-colors bg-primary text-white hover:bg-primary-light"
            >
              Checkout
            </Link>
          </>
        )}
      </div>
    </>
  );
}