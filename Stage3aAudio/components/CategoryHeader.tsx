// components/CategoryHeader.tsx
// This is the new black banner component
interface CategoryHeaderProps {
  title: string;
}

export default function CategoryHeader({ title }: CategoryHeaderProps) {
  return (
    <div className="bg-black-pure text-white h-24 md:h-60 flex items-center justify-center -mt-[90px] pt-[90px]">
      <h2 className="text-h4 md:text-h2 uppercase">{title}</h2>
    </div>
  );
}
