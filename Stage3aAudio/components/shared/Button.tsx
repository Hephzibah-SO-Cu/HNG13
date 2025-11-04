// components/shared/Button.tsx
import Link from "next/link";

type ButtonProps = {
  href: string;
  variant?: "primary" | "secondary" | "outline" | "subtle";
  children: React.ReactNode;
  className?: string;
};

// This is a reusable button component based on your design system.
export default function Button({
  href,
  variant = "primary",
  children,
  className = "",
}: ButtonProps) {
  const baseStyles =
    "inline-block text-sub uppercase tracking-[1px] font-bold text-center px-[30px] py-[15px] transition-colors";

  const styles = {
    primary: "bg-primary text-white hover:bg-primary-light",
    secondary: "bg-black-pure text-white hover:bg-gray-darker",
    outline:
      "bg-transparent text-black border border-black hover:bg-black hover:text-white",
    subtle:
      "bg-transparent text-black opacity-50 hover:text-primary hover:opacity-100",
  };

  return (
    <Link
      href={href}
      className={`${baseStyles} ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
