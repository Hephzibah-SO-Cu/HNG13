// app/checkout/page.tsx
import GoBackButton from "@/components/GoBackButton";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  return (
    // The light gray page background
    <div className="bg-white-off">
      <div className="container pt-4 md:pt-12 lg:pt-20 pb-24">
        <GoBackButton />
        {/* CheckoutForm will contain the <form> and the <Summary /> card */}
        <CheckoutForm />
      </div>
    </div>
  );
}
