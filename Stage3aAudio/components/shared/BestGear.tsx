// components/shared/BestGear.tsx
import Image from "next/image";

export default function BestGear() {
  return (
    <section className="container mt-32 mb-32 px-6 text-center md:px-10 lg:px-0 lg:text-left">
      <div className="flex flex-col-reverse items-center gap-16 lg:flex-row lg:gap-32">
        {/* Text Content */}
        <div className="lg:w-1/2">
          <h2 className="text-h4 md:text-h2 max-w-[500px] mx-auto lg:mx-0">
            Bringing you the <span className="text-primary">best</span> audio
            gear
          </h2>
          <p className="mt-8 text-body opacity-50">
            Located at the heart of New York City, Audiophile is the premier
            store for high end headphones, earphones, speakers, and audio
            accessories. We have a large showroom and luxury demonstration rooms
            available for you to test out a wide range of our products. Stop by
            our store to meet some of the fantastic people who make Audiophile the
            best place to buy your portable audio gear.
          </p>
        </div>

        {/* Image */}
        <div className="w-full rounded-lg lg:w-1/2 overflow-hidden">
          <Image
            src="/assets/shared/mobile/image-best-gear.jpg"
            alt="Man enjoying music with headphones"
            width={540}
            height={588}
            className="h-full w-full object-cover md:hidden"
          />
          <Image
            src="/assets/shared/tablet/image-best-gear.jpg"
            alt="Man enjoying music with headphones"
            width={540}
            height={588}
            className="hidden md:block lg:hidden h-full w-full object-cover"
          />
          <Image
            src="/assets/shared/desktop/image-best-gear.jpg"
            alt="Man enjoying music with headphones"
            width={540}
            height={588}
            className="hidden lg:block h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

