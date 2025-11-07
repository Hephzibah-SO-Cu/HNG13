// components/home/Hero.tsx
// [MODIFIED]
import Button from "@/components/shared/Button";
import Image from "next/image";

export default function Hero() {
  return (
    // 3. APPLY THE NEW COLOR HERE
    <div className="bg-hero-black">
      <div
        className="container relative flex flex-col items-center justify-center text-center -mt-[90px] pt-[198px] pb-[110px] overflow-hidden
                      md:pt-[225px] md:pb-[167px]
                      lg:items-start lg:text-left lg:pt-[225px] lg:pb-[158px]"
      >
        {/* ... (Images are unchanged) ... */}
        <Image
          src="/assets/home/mobile/image-header.jpg"
          alt=""
          fill
          className="object-cover object-bottom md:hidden"
          priority
        />
        <Image
          src="/assets/home/tablet/image-header.jpg"
          alt=""
          fill
          className="hidden md:block lg:hidden object-cover object-bottom"
          priority
        />
        <Image
          src="/assets/home/desktop/image-hero.jpg"
          alt=""
          fill
          className="hidden lg:block object-cover object-right"
          priority
        />

        {/* ... (Content is unchanged) ... */}
        <div className="relative z-10 flex flex-col items-center lg:items-start max-w-sm">
          <span className="overline-text text-white opacity-50">
            New Product
          </span>
          <h1 className="mt-4 md:mt-6 text-white">XX99 Mark II Headphones</h1>
          <p className="mt-6 text-body text-white opacity-75">
            Experience natural, lifelike audio and exceptional build quality
            made for the passionate music enthusiast.
          </p>
          <Button
            href="/products/xx99-mark-two-headphones"
            variant="primary"
            className="mt-7 md:mt-10"
          >
            See Product
          </Button>
        </div>
      </div>
    </div>
  );
}