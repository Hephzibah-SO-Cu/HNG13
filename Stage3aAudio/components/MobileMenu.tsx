// components/MobileMenu.tsx
import CategoryNav from "./CategoryNav";

interface MobileMenuProps {
  onClose: () => void;
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
  return (
    <>
      {/* --- BACKDROP --- */}
      <div
        className="fixed inset-0 z-30 bg-black bg-opacity-40"
        onClick={onClose}
      />
      
      {/* --- MENU PANEL --- */}
      <div className="absolute top-[90px] left-0 right-0 z-40 bg-white rounded-b-lg shadow-lg">
        {/* We re-use CategoryNav, but pass `onLinkClick` to close the menu
            and a custom class to fix the padding */}
        <CategoryNav
          onLinkClick={onClose}
          className="pt-16 pb-8" // Tighter padding for mobile menu
        />
      </div>
    </>
  );
}

