// app/layout.tsx
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext"; // 1. Import CartProvider

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Audiophile E-commerce",
  description: "HNG Stage 3a - Pixel-perfect e-commerce build",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} font-sans bg-white-off`}>
        <ConvexClientProvider>
          {/* 2. Wrap the app in the CartProvider */}
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}

