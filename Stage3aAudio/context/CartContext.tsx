// context/CartContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { Product } from "@/lib/data";

// Define the shape of a cart item
export interface CartItem extends Product {
  quantity: number;
}

// Define the shape of the context
interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create the provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Add to cart (or update quantity if already exists)
  const addToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        // Update quantity
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  // Update quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      // Remove if quantity is 0 or less
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Memoized values for cart total and count
  const cartTotal = useMemo(
    () =>
      cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const value = {
    cart,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
