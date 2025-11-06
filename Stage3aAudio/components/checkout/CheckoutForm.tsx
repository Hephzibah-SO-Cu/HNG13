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
import Image from "next/image"; 
import FormInput from "@/components/shared/FormInput";
import RadioInput from "@/components/shared/RadioInput";
import Summary from "@/components/checkout/Summary";
import OrderConfirmation from "@/components/checkout/OrderConfirmation";
import toast from 'react-hot-toast'; // 1. Import toast

const SHIPPING_FEE = 50;
const VAT_RATE = 0.2;

export default function CheckoutForm() {
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const createOrder = useMutation(api.orders.createOrder);

  const {
    register,
    handleSubmit,
    watch,
    // 2. Get `isSubmitting` to handle duplicate submissions
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "eMoney",
    },
  });

  const paymentMethod = watch("paymentMethod");
  const vat = cartTotal * VAT_RATE;
  const grandTotal = cartTotal + SHIPPING_FEE;

  const onSubmit: SubmitHandler<CheckoutFormData> = async (data) => {
    if (cart.length === 0) {
      // 3. Add toast for empty cart
      toast.error("Your cart is empty. Please add items.");
      return; 
    }
    
    console.log("Form data submitted:", data);
    
    const orderData = {
      customerName: data.name,
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
      })),
      subtotal: cartTotal,
      shipping: SHIPPING_FEE,
      taxes: vat,
      grandTotal: grandTotal,
    };

    try {
      await createOrder(orderData);
      // 4. Add success toast
      toast.success("Order placed successfully!");
      setIsOrderComplete(true);
    } catch (error) {
      console.error("Failed to create order:", error);
      // 5. Add error toast
      toast.error("There was an error placing your order.");
    }
  };

  const handleFinish = () => {
    clearCart();
    router.push("/");
  };

  if (isOrderComplete) {
    return <OrderConfirmation onFinish={handleFinish} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col lg:flex-row lg:gap-8">
        {/* --- LEFT SIDE: FORM FIELDS --- */}
        <div className="bg-white rounded-lg p-6 md:p-8 lg:w-2/3">
          {/* ... (form fields are unchanged) ... */}
          <h1 className="text-h4 md:text-h3 mb-8">Checkout</h1>
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
          {/* 6. Pass `isSubmitting` prop to Summary */}
          <Summary
            shipping={SHIPPING_FEE}
            vat={vat}
            grandTotal={grandTotal}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </form>
  );
}