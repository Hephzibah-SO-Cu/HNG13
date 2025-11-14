// components/Footer.tsx
import Link from "next/link";
import Image from "next/image"; // Use Image for all SVGs

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "HEADPHONES", href: "/category/headphones" },
  { name: "SPEAKERS", href: "/category/speakers" },
  { name: "EARPHONES", href: "/category/earphones" },
];

export default function Footer() {
  return (
    <footer 
    style={{padding: "0 3rem"}}
    className="bg-black text-white">
      <div className="container relative pt-12 pb-10 md:pt-14 md:pb-12 lg:pt-[75px] lg:pb-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 lg:left-0 h-1 w-[100px] bg-primary"></div>
        <div className="lg:flex lg:justify-between">
          {/* FIXED: Replaced <Logo /> with <Image /> */}
          <Image
            src="/assets/shared/desktop/logo.svg"
            alt="Audiophile"
            width={143}
            height={25}
            className="mx-auto md:mx-0"
          />
          <nav className="mt-8 md:mt-8 lg:mt-0">
            <ul className="flex flex-col items-center gap-4 md:flex-row md:gap-[34px]">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="subtitle-text hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="my-12 text-center text-body opacity-50 md:text-left lg:w-1/2">
          Audiophile is the best place to buy your portable audio equipment.
          We’re a small team of music lovers and sound specialists who are devoted
          to helping you get the most out of personal audio. Come and visit our
          demo facility - we’re open 7 days a week.
        </p>
        <div className="flex flex-col items-center gap-12 md:flex-row md:justify-between">
          <p className="text-body font-bold opacity-50">
            Copyright {new Date().getFullYear()}. All Rights Reserved
          </p>
          <div className="flex items-center gap-4">
            {/* FIXED: Replaced all Icon components with <Image /> */}
            <Link href="#" aria-label="Visit our Facebook page">
              <Image
                src="/assets/shared/desktop/icon-facebook.svg"
                alt="Facebook"
                width={24}
                height={24}
              />
            </Link>
            <Link href="#" aria-label="Visit our Twitter page">
              <Image
                src="/assets/shared/desktop/icon-twitter.svg"
                alt="Twitter"
                width={24}
                height={20}
              />
            </Link>
            <Link href="#" aria-label="Visit our Instagram page">
              <Image
                src="/assets/shared/desktop/icon-instagram.svg"
                alt="Instagram"
                width={24}
                height={24}
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

