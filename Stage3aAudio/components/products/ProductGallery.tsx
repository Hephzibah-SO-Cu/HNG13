// components/products/ProductGallery.tsx
import Image from "next/image";
import { Product } from "@/lib/data";

interface ProductGalleryProps {
  gallery: Product["gallery"];
}

export default function ProductGallery({ gallery }: ProductGalleryProps) {
  return (
    <section className="mt-20 grid grid-cols-1 md:grid-cols-[1fr,1.5fr] gap-6">
      
      {/* --- THIS IS THE FIX ---
       *
       * I'm replacing md:h-auto with a specific height (md:h-[280px])
       * for the two small images.
       *
       * I'm replacing md:h-auto with md:h-full for the large image
       * to make it fill the full height of the two rows it spans.
       *
       * (280px + 280px + 24px gap = 584px total height)
       *
       * --- END FIX ---
       */}

      {/* First Image (Small) */}
      <div className="relative h-44 md:h-[280px] rounded-lg overflow-hidden">
        <Image
          src={gallery.first.mobile}
          alt="Gallery image 1"
          fill
          className="object-cover md:hidden"
        />
        <Image
          src={gallery.first.tablet}
          alt="Gallery image 1"
          fill
          className="hidden md:block lg:hidden object-cover"
        />
        <Image
          src={gallery.first.desktop}
          alt="Gallery image 1"
          fill
          className="hidden lg:block object-cover"
        />
      </div>

      {/* Second Image (Small) */}
      <div className="relative h-44 md:h-[280px] rounded-lg overflow-hidden md:row-start-2">
        <Image
          src={gallery.second.mobile}
          alt="Gallery image 2"
          fill
          className="object-cover md:hidden"
        />
        <Image
          src={gallery.second.tablet}
          alt="Gallery image 2"
          fill
          className="hidden md:block lg:hidden object-cover"
        />
        <Image
          src={gallery.second.desktop}
          alt="Gallery image 2"
          fill
          className="hidden lg:block object-cover"
        />
      </div>

      {/* Third Image (Large) */}
      <div className="relative h-96 md:h-full md:row-span-2 rounded-lg overflow-hidden">
        <Image
          src={gallery.third.mobile}
          alt="Gallery image 3"
          fill
          className="object-cover md:hidden"
        />
        <Image
          src={gallery.third.tablet}
          alt="Gallery image 3"
          fill
          className="hidden md:block lg:hidden object-cover"
        />
        <Image
          src={gallery.third.desktop}
          alt="Gallery image 3"
          fill
          className="hidden lg:block object-cover"
        />
      </div>
    </section>
  );
}

