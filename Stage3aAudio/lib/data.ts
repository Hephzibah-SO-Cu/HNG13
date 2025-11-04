// lib/data.ts
// MASSIVE UPDATE
// Adding price, features, box contents, gallery, and related products
// This will power all 6 product pages.

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName: string; // For cart, e.g., "XX99 MK II"
  category: "headphones" | "speakers" | "earphones";
  isNew: boolean;
  price: number;
  description: string;
  features: string; // Will be split by \n\n for paragraphs
  inTheBox: { quantity: number; item: string }[];
  image: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  gallery: {
    first: { mobile: string; tablet: string; desktop: string };
    second: { mobile: string; tablet: string; desktop: string };
    third: { mobile: string; tablet: string; desktop: string };
  };
  relatedProducts: string[]; // Slugs of related products
}

export const products: Product[] = [
  // --- HEADPHONES ---
  {
    id: "prod-xx99-mk2",
    slug: "xx99-mark-two-headphones",
    name: "XX99 Mark II Headphones",
    shortName: "XX99 MK II",
    category: "headphones",
    isNew: true,
    price: 2999,
    description:
      "The new XX99 Mark II headphones is the pinnacle of pristine audio. It redefines your premium headphone experience by reproducing the balanced depth and precision of studio-quality sound.",
    features:
      "Featuring a genuine leather head strap and premium memory foam ear cups, you can enjoy hours of listening comfort. It includes intuitive controls designed for any situation. Whether you’re taking a business call or just relaxing at home, the built-in mic is readily available.\n\nAs the headphones all others are measured against, the XX99 Mark II demonstrates over five decades of audio expertise, redefining the critical listening experience. This pair of headphones represents eternal pursuit of the perfect sound, backed by sound scientific principles and intuitive design elements.",
    inTheBox: [
      { quantity: 1, item: "Headphone Unit" },
      { quantity: 2, item: "Replacement Earcups" },
      { quantity: 1, item: "User Manual" },
      { quantity: 1, item: "3.5mm 5m Audio Cable" },
      { quantity: 1, item: "Travel Bag" },
    ],
    image: {
      mobile: "/assets/product-xx99-mark-two-headphones/mobile/image-product.jpg",
      tablet: "/assets/product-xx99-mark-two-headphones/tablet/image-product.jpg",
      desktop: "/assets/product-xx99-mark-two-headphones/desktop/image-product.jpg",
    },
    gallery: {
      first: {
        mobile: "/assets/product-xx99-mark-two-headphones/mobile/image-gallery-1.jpg",
        tablet: "/assets/product-xx99-mark-two-headphones/tablet/image-gallery-1.jpg",
        desktop: "/assets/product-xx99-mark-two-headphones/desktop/image-gallery-1.jpg",
      },
      second: {
        mobile: "/assets/product-xx99-mark-two-headphones/mobile/image-gallery-2.jpg",
        tablet: "/assets/product-xx99-mark-two-headphones/tablet/image-gallery-2.jpg",
        desktop: "/assets/product-xx99-mark-two-headphones/desktop/image-gallery-2.jpg",
      },
      third: {
        mobile: "/assets/product-xx99-mark-two-headphones/mobile/image-gallery-3.jpg",
        tablet: "/assets/product-xx99-mark-two-headphones/tablet/image-gallery-3.jpg",
        desktop: "/assets/product-xx99-mark-two-headphones/desktop/image-gallery-3.jpg",
      },
    },
    relatedProducts: ["xx99-mark-one-headphones", "xx59-headphones", "zx9-speaker"],
  },
  {
    id: "prod-xx99-mk1",
    slug: "xx99-mark-one-headphones",
    name: "XX99 Mark I Headphones",
    shortName: "XX99 MK I",
    category: "headphones",
    isNew: false,
    price: 1750,
    description:
      "As the gold standard for headphones, the original XX99 Mark I offers detailed and accurate audio reproduction for audiophiles, mixing engineers, and music aficionados alike in a comfortable, fit-for-life design.",
    features:
      "As the headphones all others are measured against, the XX99 Mark I demonstrates over five decades of audio expertise, redefining the critical listening experience. This pair of headphones represents eternal pursuit of the perfect sound, backed by sound scientific principles and intuitive design elements.\n\nFeaturing a genuine leather head strap and premium memory foam ear cups, you can enjoy hours of listening comfort. It includes intuitive controls designed for any situation. Whether you’re taking a business call or just relaxing at home, the built-in mic is readily available.",
    inTheBox: [
      { quantity: 1, item: "Headphone Unit" },
      { quantity: 2, item: "Replacement Earcups" },
      { quantity: 1, item: "User Manual" },
      { quantity: 1, item: "3.5mm 5m Audio Cable" },
    ],
    image: {
      mobile: "/assets/product-xx99-mark-one-headphones/mobile/image-product.jpg",
      tablet: "/assets/product-xx99-mark-one-headphones/tablet/image-product.jpg",
      desktop: "/assets/product-xx99-mark-one-headphones/desktop/image-product.jpg",
    },
    gallery: {
      first: {
        mobile: "/assets/product-xx99-mark-one-headphones/mobile/image-gallery-1.jpg",
        tablet: "/assets/product-xx99-mark-one-headphones/tablet/image-gallery-1.jpg",
        desktop: "/assets/product-xx99-mark-one-headphones/desktop/image-gallery-1.jpg",
      },
      second: {
        mobile: "/assets/product-xx99-mark-one-headphones/mobile/image-gallery-2.jpg",
        tablet: "/assets/product-xx99-mark-one-headphones/tablet/image-gallery-2.jpg",
        desktop: "/assets/product-xx99-mark-one-headphones/desktop/image-gallery-2.jpg",
      },
      third: {
        mobile: "/assets/product-xx99-mark-one-headphones/mobile/image-gallery-3.jpg",
        tablet: "/assets/product-xx99-mark-one-headphones/tablet/image-gallery-3.jpg",
        desktop: "/assets/product-xx99-mark-one-headphones/desktop/image-gallery-3.jpg",
      },
    },
    relatedProducts: ["xx99-mark-two-headphones", "xx59-headphones", "zx9-speaker"],
  },
  {
    id: "prod-xx59",
    slug: "xx59-headphones",
    name: "XX59 Headphones",
    shortName: "XX59",
    category: "headphones",
    isNew: false,
    price: 899,
    description:
      "Enjoy your audio privately thanks to the isolation design of the XX59 headphones. It features unparalleled comfort and a detailed sound signature to transport you into audio bliss.",
    features:
      "These headphones have been created from durable, high-quality materials tough enough to take anywhere. Its compact folding design fuses comfort and minimalist style making it perfect for travel. Flawless transmission is assured by the latest wireless technology engineered for audio synchronization with videos.\n\nMore than just headphones, the XX59 is a sound experience aimed at listeners serious about audio. They deliver deep rich bass with exceptional detail and clarity. With a balanced natural sound, you’ll hear audio as the artist intended.",
    inTheBox: [
      { quantity: 1, item: "Headphone Unit" },
      { quantity: 2, item: "Replacement Earcups" },
      { quantity: 1, item: "User Manual" },
      { quantity: 1, item: "3.5mm 5m Audio Cable" },
    ],
    image: {
      mobile: "/assets/product-xx59-headphones/mobile/image-product.jpg",
      tablet: "/assets/product-xx59-headphones/tablet/image-product.jpg",
      desktop: "/assets/product-xx59-headphones/desktop/image-product.jpg",
    },
    gallery: {
      first: {
        mobile: "/assets/product-xx59-headphones/mobile/image-gallery-1.jpg",
        tablet: "/assets/product-xx59-headphones/tablet/image-gallery-1.jpg",
        desktop: "/assets/product-xx59-headphones/desktop/image-gallery-1.jpg",
      },
      second: {
        mobile: "/assets/product-xx59-headphones/mobile/image-gallery-2.jpg",
        tablet: "/assets/product-xx59-headphones/tablet/image-gallery-2.jpg",
        desktop: "/assets/product-xx59-headphones/desktop/image-gallery-2.jpg",
      },
      third: {
        mobile: "/assets/product-xx59-headphones/mobile/image-gallery-3.jpg",
        tablet: "/assets/product-xx59-headphones/tablet/image-gallery-3.jpg",
        desktop: "/assets/product-xx59-headphones/desktop/image-gallery-3.jpg",
      },
    },
    relatedProducts: ["xx99-mark-two-headphones", "xx99-mark-one-headphones", "zx9-speaker"],
  },

  // --- SPEAKERS ---
  {
    id: "prod-zx9",
    slug: "zx9-speaker",
    name: "ZX9 Speaker",
    shortName: "ZX9",
    category: "speakers",
    isNew: true,
    price: 4500,
    description:
      "Upgrade your sound system with the all new ZX9 active speaker. It’s a bookshelf speaker system that offers truly wireless connectivity -- creating new possibilities for more pleasing and practical audio setups.",
    features:
      "Connect via Bluetooth or nearly any wired source. This speaker features optical, digital coaxial, USB Type-B, stereo RCA, and stereo XLR inputs, allowing you to have up to five wired source devices connected for easy switching. Improved bluetooth technology offers near lossless audio quality at up to 328ft (100m).\n\nDiscover clear, more natural sounding highs than the competition with ZX9’s signature planar diaphragm tweeter. Equally important is its powerful room-shaking bass courtesy of a 6.5” aluminum alloy bass unit. You’ll be able to enjoy equal sound quality whether in a large room or small den. Furthermore, you will experience new sensations from old songs since it can respond to even the subtle waveforms.",
    inTheBox: [
      { quantity: 2, item: "Speaker Unit" },
      { quantity: 2, item: "Speaker Cloth Panel" },
      { quantity: 1, item: "User Manual" },
      { quantity: 1, item: "3.5mm 5m Audio Cable" },
      { quantity: 1, item: "10m Optical Cable" },
    ],
    image: {
      mobile: "/assets/product-zx9-speaker/mobile/image-product.jpg",
      tablet: "/assets/product-zx9-speaker/tablet/image-product.jpg",
      desktop: "/assets/product-zx9-speaker/desktop/image-product.jpg",
    },
    gallery: {
      first: {
        mobile: "/assets/product-zx9-speaker/mobile/image-gallery-1.jpg",
        tablet: "/assets/product-zx9-speaker/tablet/image-gallery-1.jpg",
        desktop: "/assets/product-zx9-speaker/desktop/image-gallery-1.jpg",
      },
      second: {
        mobile: "/assets/product-zx9-speaker/mobile/image-gallery-2.jpg",
        tablet: "/assets/product-zx9-speaker/tablet/image-gallery-2.jpg",
        desktop: "/assets/product-zx9-speaker/desktop/image-gallery-2.jpg",
      },
      third: {
        mobile: "/assets/product-zx9-speaker/mobile/image-gallery-3.jpg",
        tablet: "/assets/product-zx9-speaker/tablet/image-gallery-3.jpg",
        desktop: "/assets/product-zx9-speaker/desktop/image-gallery-3.jpg",
      },
    },
    relatedProducts: ["zx7-speaker", "xx99-mark-one-headphones", "xx59-headphones"],
  },
  {
    id: "prod-zx7",
    slug: "zx7-speaker",
    name: "ZX7 Speaker",
    shortName: "ZX7",
    category: "speakers",
    isNew: false,
    price: 3500,
    description:
      "Stream high quality sound wirelessly with minimal loss. The ZX7 bookshelf speaker uses high-end audiophile components that represents the pinnacle of acoustic reproduction.",
    features:
      "Reap the advantages of a flat diaphragm tweeter cone. This provides a fast response rate and excellent high frequencies that lower tiered bookshelf speakers cannot provide. The woofer is made from composite high-strength material that enhances structural integrity ensuring fidelity in even the most demanding music.\n\nThe ZX7 speaker is the perfect blend of stylish design and high performance. It houses an advanced digital signal processing (DSP) chip to present lossless audio. With the long range wireless reeiver, you can stream music from your computer, phone,, or tablet with no loss in quality.",
    inTheBox: [
      { quantity: 2, item: "Speaker Unit" },
      { quantity: 2, item: "Speaker Cloth Panel" },
      { quantity: 1, item: "User Manual" },
      { quantity: 1, item: "3.5mm 5m Audio Cable" },
      { quantity: 1, item: "7.5m Optical Cable" },
    ],
    image: {
      mobile: "/assets/product-zx7-speaker/mobile/image-product.jpg",
      tablet: "/assets/product-zx7-speaker/tablet/image-product.jpg",
      desktop: "/assets/product-zx7-speaker/desktop/image-product.jpg",
    },
    gallery: {
      first: {
        mobile: "/assets/product-zx7-speaker/mobile/image-gallery-1.jpg",
        tablet: "/assets/product-zx7-speaker/tablet/image-gallery-1.jpg",
        desktop: "/assets/product-zx7-speaker/desktop/image-gallery-1.jpg",
      },
      second: {
        mobile: "/assets/product-zx7-speaker/mobile/image-gallery-2.jpg",
        tablet: "/assets/product-zx7-speaker/tablet/image-gallery-2.jpg",
        desktop: "/assets/product-zx7-speaker/desktop/image-gallery-2.jpg",
      },
      third: {
        mobile: "/assets/product-zx7-speaker/mobile/image-gallery-3.jpg",
        tablet: "/assets/product-zx7-speaker/tablet/image-gallery-3.jpg",
        desktop: "/assets/product-zx7-speaker/desktop/image-gallery-3.jpg",
      },
    },
    relatedProducts: ["zx9-speaker", "xx99-mark-one-headphones", "xx59-headphones"],
  },

  // --- EARPHONES ---
  {
    id: "prod-yx1",
    slug: "yx1-earphones",
    name: "YX1 Wireless Earphones",
    shortName: "YX1",
    category: "earphones",
    isNew: true,
    price: 599,
    description:
      "Tailor your listening experience with bespoke dynamic drivers from the new YX1 Wireless Earphones. Enjoy incredible high-fidelity sound even in noisy environments with its active noise cancellation feature.",
    features:
      "Experience impressive sound quality from the compact and ergonomic YX1 Wireless Earphones. Enjoy your music freely in a truly wireless way with Bluetooth 5.0 and an impressive battery life of upV to 40 hours.\n\nThe YX1 Wireless Earphones features customizable controls for volume, music, calls, and voice assistants built into both earbuds. The new 7mm dynamic drivers deliver intuitive sound that transports you to chaotic battlefields and events, and immersive music environments.",
    inTheBox: [
      { quantity: 2, item: "Earphone Unit" },
      { quantity: 6, item: "Multi-size Earplugs" },
      { quantity: 1, item: "User Manual" },
      { quantity: 1, item: "USB-C Charging Cable" },
      { quantity: 1, item: "Travel Pouch" },
    ],
    image: {
      mobile: "/assets/product-yx1-earphones/mobile/image-product.jpg",
      tablet: "/assets/product-yx1-earphones/tablet/image-product.jpg",
      desktop: "/assets/product-yx1-earphones/desktop/image-product.jpg",
    },
    gallery: {
      first: {
        mobile: "/assets/product-yx1-earphones/mobile/image-gallery-1.jpg",
        tablet: "/assets/product-yx1-earphones/tablet/image-gallery-1.jpg",
        desktop: "/assets/product-yx1-earphones/desktop/image-gallery-1.jpg",
      },
      second: {
        mobile: "/assets/product-yx1-earphones/mobile/image-gallery-2.jpg",
        tablet: "/assets/product-yx1-earphones/tablet/image-gallery-2.jpg",
        desktop: "/assets/product-yx1-earphones/desktop/image-gallery-2.jpg",
      },
      third: {
        mobile: "/assets/product-yx1-earphones/mobile/image-gallery-3.jpg",
        tablet: "/assets/product-yx1-earphones/tablet/image-gallery-3.jpg",
        desktop: "/assets/product-yx1-earphones/desktop/image-gallery-3.jpg",
      },
    },
    relatedProducts: ["xx99-mark-one-headphones", "xx59-headphones", "zx9-speaker"],
  },
];

