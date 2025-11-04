// components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react"; // 1. Import useState
import CartModal from "./cart/CartModal";
import MobileMenu from "./MobileMenu"; // 2. Import MobileMenu

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "HEADPHONES", href: "/category/headphones" },
  { name: "SPEAKERS", href: "/category/speakers" },
  { name: "EARPHONES", href: "/category/earphones" },
];

export default function Header() {
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 3. Add state for Mobile Menu

  // Function to toggle menu and ensure cart is closed
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setIsCartOpen(false); // Close cart when opening menu
    }
  };

  // Function to toggle cart and ensure menu is closed
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    if (!isCartOpen) {
      setIsMenuOpen(false); // Close menu when opening cart
    }
  };

  // Function to close both
  const closeModals = () => {
    setIsMenuOpen(false);
    setIsCartOpen(false);
  };

  return (
    <>
      <header className="bg-black-pure sticky top-0 z-50">
        <div className="container relative flex items-center justify-between border-b border-white border-opacity-20 h-[90px]">
          {/* 4. Wire up Hamburger button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden"
            aria-label="Open navigation menu"
          >
            <Image
              src="/assets/shared/tablet/icon-hamburger.svg"
              alt="Menu"
              width={16}
              height={15}
            />
          </button>
          <Link
            href="/"
            onClick={closeModals} // Close modals on logo click
            className="ml-10 md:ml-0 md:mr-auto lg:mr-0 lg:ml-0"
            aria-label="Audiophile homepage"
          >
            <Image
              src="/assets/shared/desktop/logo.svg"
              alt="Audiophile"
              width={143}
              height={25}
            />
          </Link>
          <nav className="hidden lg:block mx-auto">
            <ul className="flex items-center gap-[34px]">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`subtitle-text text-white hover:text-primary transition-colors
                    ${pathname === link.href ? "text-primary" : ""}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {/* 5. Wire up Cart button */}
          <button
            onClick={toggleCart}
            className="ml-auto"
            aria-label="Open cart"
          >
            <Image
              src="/assets/shared/desktop/icon-cart.svg"
              alt="Cart"
              width={23}
              height={20}
            />
          </button>
        </div>
      </header>

      {/* 6. Conditionally render the Modals */}
      {isMenuOpen && <MobileMenu onClose={closeModals} />}
      {isCartOpen && <CartModal onClose={closeModals} />}
    </>
  );
}

