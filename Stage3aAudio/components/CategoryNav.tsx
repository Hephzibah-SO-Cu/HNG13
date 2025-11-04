// components/CategoryNav.tsx
import Link from "next/link";
import Image from "next/image";
import ArrowRightIcon from "@/public/assets/shared/desktop/icon-arrow-right.svg";

const categories = [
  {
    name: "Headphones",
    href: "/category/headphones",
    img: "/assets/shared/desktop/image-category-thumbnail-headphones.png",
  },
  {
    name: "Speakers",
    href: "/category/speakers",
    img: "/assets/shared/desktop/image-category-thumbnail-speakers.png",
  },
  {
    name: "Earphones",
    href: "/category/earphones",
    img: "/assets/shared/desktop/image-category-thumbnail-earphones.png",
  },
];

// --- FIX: Added `onLinkClick` and `className` props ---
interface CategoryNavProps {
  onLinkClick?: () => void;
  className?: string;
}

export default function CategoryNav({
  onLinkClick,
  className = "mt-32 mb-40", // Default margins for homepage
}: CategoryNavProps) {
  return (
    // Use the passed-in className
    <section className={`container ${className}`}>
      <div className="grid grid-cols-1 gap-[68px] md:grid-cols-3 md:gap-[10px] lg:gap-[30px]">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="relative flex flex-col items-center pt-[88px]"
          >
            <div className="absolute bottom-0 h-[165px] w-full rounded-lg bg-gray-light" />
            <div className="relative z-10 w-full h-[160px] -mt-[160px]">
              <Image
                src={cat.img}
                alt={cat.name}
                width={172}
                height={160}
                className="mx-auto absolute bottom-0 left-1/2 -translate-x-1/2"
              />
            </div>
            <div className="relative z-10 mt-9 text-center">
              <h6 className="uppercase">{cat.name}</h6>
              <Link
                href={cat.href}
                // Add the onClick handler here
                onClick={onLinkClick}
                className="group mt-4 inline-flex items-center gap-2 subtitle-text text-black opacity-50 hover:text-primary"
              >
                SHOP
                <Image
                  src="/assets/shared/desktop/icon-arrow-right.svg"
                  alt=""
                  width={8}
                  height={12}
                />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

