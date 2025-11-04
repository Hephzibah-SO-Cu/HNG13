// components/home/FeaturedProducts.tsx
import Image from "next/image";
import Button from "@/components/shared/Button";
// We don't import the pattern, we just use an <img> tag

export default function FeaturedProducts() {
  return (
    <section className="container flex flex-col gap-6 md:gap-8">
      {/* --- ZX9 SPEAKER (Large) --- */}
      <div
        className="relative flex flex-col items-center overflow-hidden rounded-lg bg-primary px-6 py-14 text-center text-white
                   md:py-16 
                   lg:flex-row lg:py-0 lg:px-24 lg:text-left"
      >
        {/*
          *
          * THIS IS THE FIX:
          * Replaced <CirclesPattern /> with <Image />
          *
          */}
        <Image
          src="/assets/home/desktop/pattern-circles.svg"
          alt=""
          width={944} // Original SVG width
          height={944} // Original SVG height
          className="absolute z-0 scale-[2.5] -top-32 md:-top-72 lg:scale-100 lg:-top-12 lg:left-0"
        />

        {/* Image */}
        <div className="relative z-10 w-full lg:w-1/2">
          <Image
            src="/assets/home/desktop/image-speaker-zx9.png"
            alt="ZX9 Speaker"
            width={410}
            height={493}
            className="mx-auto -mb-4 w-40 md:w-48 lg:w-auto lg:translate-y-[85px]"
          />
        </div>

        {/* Text Content */}
        <div className="relative z-10 mt-8 lg:mt-0 lg:w-1/2 lg:pl-16">
          <h2 className="text-h2 md:text-h1 text-white">ZX9 Speaker</h2>
          <p className="mt-6 mb-10 text-body opacity-75">
            Upgrade to premium speakers that are phenomenally built to deliver
            truly remarkable sound.
          </p>
          <Button href="/products/zx9-speaker" variant="secondary">
            See Product
          </Button>
        </div>
      </div>

      {/* --- ZX7 SPEAKER (Medium) --- */}
      <div className="relative flex h-[320px] items-center overflow-hidden rounded-lg">
        {/* Background Image */}
        <Image
          src="/assets/home/mobile/image-speaker-zx7.jpg"
          alt="ZX7 Speaker"
          fill
          className="object-cover md:hidden"
        />
        <Image
          src="/assets/home/tablet/image-speaker-zx7.jpg"
          alt="ZX7 Speaker"
          fill
          className="hidden md:block lg:hidden object-cover"
        />
        <Image
          src="/assets/home/desktop/image-speaker-zx7.jpg"
          alt="ZX7 Speaker"
          fill
          className="hidden lg:block object-cover"
        />

        {/* Content */}
        <div className="relative z-10 ml-6 md:ml-16">
          <h3 className="text-h3 text-black">ZX7 Speaker</h3>
          <Button
            href="/products/zx7-speaker"
            variant="outline"
            className="mt-8"
          >
            See Product
          </Button>
        </div>
      </div>

      {/* --- YX1 EARPHONES (Small) --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-[11px] lg:gap-[30px]">
        {/* Image Half */}
        <div className="relative h-52 w-full rounded-lg md:h-[320px] overflow-hidden">
          <Image
            src="/assets/home/mobile/image-earphones-yx1.jpg"
            alt="YX1 Earphones"
            fill
            className="object-cover md:hidden"
          />
          <Image
            src="/assets/home/tablet/image-earphones-yx1.jpg"
            alt="YX1 Earphones"
            fill
            className="hidden md:block lg:hidden object-cover"
          />
          <Image
            src="/assets/home/desktop/image-earphones-yx1.jpg"
            alt="YX1 Earphones"
            fill
            className="hidden lg:block object-cover"
          />
        </div>

        {/* Content Half */}
        <div className="flex h-52 flex-col justify-center rounded-lg bg-gray-light px-6 md:h-[320px] md:px-10 lg:px-24">
          <h3 className="text-h3 text-black">YX1 Earphones</h3>
          <Button
            href="/products/yx1-earphones"
            variant="outline"
            className="mt-8"
          >
            See Product
          </Button>
        </div>
      </div>
    </section>
  );
}

