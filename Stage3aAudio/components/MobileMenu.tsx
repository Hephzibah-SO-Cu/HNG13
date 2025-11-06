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
      
      {/* --- MENU PANEL (FIXED) --- */}
      {/* 1. Changed `absolute` to `fixed` to stop scroll */}
      <div className="fixed top-[90px] left-0 right-0 z-40 bg-white rounded-b-lg shadow-lg">
        <CategoryNav
          onLinkClick={onClose}
          className="pt-16 pb-8" // Tighter padding for mobile menu
        />
      </div>
    </>
  );
}