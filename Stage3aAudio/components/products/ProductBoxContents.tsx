// components/products/ProductBoxContents.tsx
interface ProductBoxContentsProps {
  items: { quantity: number; item: string }[];
}

export default function ProductBoxContents({ items }: ProductBoxContentsProps) {
  return (
    <div 
    style={{padding: "0 3rem"}}
    className="mt-20 md:flex md:gap-40 lg:flex-col lg:w-1/3 lg:mt-0 lg:gap-8">
      <h3 className="text-h5 md:text-h3 uppercase mb-6 md:mb-8 md:w-1/2 lg:w-full">
        In the Box
      </h3>
      <ul className="flex flex-col gap-2 md:w-1/2 lg:w-full">
        {items.map((item, index) => (
          <li key={index} className="flex">
            <span className="text-body font-bold text-primary w-8">
              {item.quantity}x
            </span>
            <span className="text-body opacity-50">{item.item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
    

