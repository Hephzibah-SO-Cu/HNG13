// components/checkout/CheckoutForm.tsx
"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutFormData } from "@/lib/validation";
import { useCart } from "@/context/CartContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

// --- FIX: ADDED MISSING IMPORT ---
import Image from "next/image"; 
import FormInput from "@/components/shared/FormInput";
import RadioInput from "@/components/shared/RadioInput";
import Summary from "@/components/checkout/Summary";
import OrderConfirmation from "@/components/checkout/OrderConfirmation";

// Define constants for shipping and tax
const SHIPPING_FEE = 50;
const VAT_RATE = 0.2; // 20%

export default function CheckoutForm() {
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const createOrder = useMutation(api.orders.createOrder);

  // 1. Initialize react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "eMoney", // Default payment method
    },
  });

  const paymentMethod = watch("paymentMethod");

  // 2. Calculate totals
  const vat = cartTotal * VAT_RATE;
  const grandTotal = cartTotal + SHIPPING_FEE; // VAT is shown, but task implies it's included in total

  // 3. Handle form submission
  const onSubmit: SubmitHandler<CheckoutFormData> = async (data) => {
    
    // --- FIX: PREVENT EMPTY CART SUBMISSION ---
    if (cart.length === 0) {
      console.error("Cannot checkout with an empty cart.");
      // In a real app, you'd show a toast notification here
      return; 
    }
    // --- END FIX ---
    
    console.log("Form data submitted:", data);
    
    // --- FIX: CORRECTLY MAP FORM DATA TO CONVEX ARGS ---
    const orderData = {
      customerName: data.name, // Map data.name to customerName
      email: data.email,
      phone: data.phone,
      address: data.address,
      zipcode: data.zipcode,
      city: data.city,
      country: data.country,
      paymentMethod: data.paymentMethod,
      items: cart.map(item => ({
        name: item.shortName,
        price: item.price,
        quantity: item.quantity,
        // We removed productId from the schema, so we don't send it
      })),
      subtotal: cartTotal,
      shipping: SHIPPING_FEE,
      taxes: vat,
      grandTotal: grandTotal,
    };
    // --- END FIX ---

    try {
      // 4. Call Convex mutation
      await createOrder(orderData);
      
      // 5. Show success modal
      setIsOrderComplete(true);
      // We don't clear cart yet, as modal needs it

    } catch (error) {
      console.error("Failed to create order:", error);
      // TODO: Show an error toast to the user
    }
  };

  const handleFinish = () => {
    // 6. Clear cart and go home
    clearCart();
    router.push("/");
  };

  // If order is complete, show the modal instead of the form
  if (isOrderComplete) {
    return <OrderConfirmation onFinish={handleFinish} />;
  }

  return (
    // 7. Main form element with responsive layout
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col lg:flex-row lg:gap-8">
        {/* --- LEFT SIDE: FORM FIELDS --- */}
        <div className="bg-white rounded-lg p-6 md:p-8 lg:w-2/3">
          <h1 className="text-h4 md:text-h3 mb-8">Checkout</h1>

          {/* Billing Details */}
          <section>
            <h2 className="subtitle-text text-primary mb-4">Billing Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Name"
                name="name"
                register={register}
                error={errors.name}
              />
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="alexei@mail.com"
                register={register}
                error={errors.email}
              />
              <FormInput
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="+1 202-555-0136"
                register={register}
                error={errors.phone}
              />
            </div>
          </section>

          {/* Shipping Info */}
          <section className="mt-8">
            <h2 className="subtitle-text text-primary mb-4">Shipping Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Your Address"
                name="address"
                className="md:col-span-2"
                register={register}
                error={errors.address}
              />
              <FormInput
                label="ZIP Code"
                name="zipcode"
                register={register}
                error={errors.zipcode}
              />
              <FormInput
                label="City"
                name="city"
                register={register}
                error={errors.city}
              />
              <FormInput
                label="Country"
                name="country"
                register={register}
                error={errors.country}
              />
            </div>
          </section>

          {/* Payment Details */}
          <section className="mt-8">
            <h2 className="subtitle-text text-primary mb-4">Payment Details</h2>
            <div className="md:grid md:grid-cols-2 md:gap-6">
              <p className="text-body font-bold mb-4">Payment Method</p>
              <div className="flex flex-col gap-4">
                <RadioInput
                  label="e-Money"
                  name="paymentMethod"
                  value="eMoney"
                  register={register}
                  checked={paymentMethod === "eMoney"}
                />
                <RadioInput
                  label="Cash on Delivery"
                  name="paymentMethod"
                  value="cashOnDelivery"
                  register={register}
                  checked={paymentMethod === "cashOnDelivery"}
                />
              </div>
            </div>

            {/* Conditional Inputs */}
            {paymentMethod === "eMoney" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FormInput
                  label="e-Money Number"
                  name="eMoneyNumber"
                  register={register}
                  error={errors.eMoneyNumber}
                />
                <FormInput
                  label="e-Money PIN"
                  name="eMoneyPin"
                  type="password"
                  register={register}
                  error={errors.eMoneyPin}
                />
              </div>
            )}
            
            {paymentMethod === "cashOnDelivery" && (
              <div className="flex items-center gap-6 mt-6">
                <Image src="/assets/checkout/icon-cash-on-delivery.svg" alt="" width={48} height={48} />
                <p className="text-body opacity-50">
                  The ‘Cash on Delivery’ option enables you to pay in cash when
                  our delivery courier arrives at your residence. Just make sure
                  your address is correct so that your order will not be
                  cancelled.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* --- RIGHT SIDE: SUMMARY CARD --- */}
        <div className="lg:w-1/3">
          <Summary
            shipping={SHIPPING_FEE}
            vat={vat}
            grandTotal={grandTotal}
          />
        </div>
      </div>
    </form>
  );
}

