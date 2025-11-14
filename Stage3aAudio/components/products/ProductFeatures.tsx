// components/products/ProductFeatures.tsx
interface ProductFeaturesProps {
  features: string;
}

export default function ProductFeatures({ features }: ProductFeaturesProps) {
  // Split the features string by newline characters for paragraphs
  const featureParagraphs = features.split("\n\n");

  return (
    <div 
    style={{padding: "0 3rem"}}
    className="lg:w-2/3">
      <h3 className="text-h5 md:text-h3 uppercase mb-6 md:mb-8">Features</h3>
      <div className="flex flex-col gap-6">
        {featureParagraphs.map((paragraph, index) => (
          <p key={index} className="text-body opacity-50">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
    

