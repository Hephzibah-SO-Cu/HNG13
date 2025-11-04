// components/GoBackButton.tsx
"use client";

import { useRouter } from "next/navigation";

export default function GoBackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="text-body text-black opacity-50 hover:text-primary hover:opacity-100 mb-6"
    >
      Go Back
    </button>
  );
}
