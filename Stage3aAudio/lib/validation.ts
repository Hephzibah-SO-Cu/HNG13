// lib/validation.ts
import { z } from "zod";

// We define the shape of our form data and its validation rules
export const checkoutSchema = z.object({
  // Billing Details
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is invalid"),

  // Shipping Info
  address: z.string().min(1, "Address is required"),
  zipcode: z.string().min(5, "ZIP code is invalid"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),

  // Payment Details
  paymentMethod: z.enum(["eMoney", "cashOnDelivery"]),

  // e-Money (conditionally required)
  eMoneyNumber: z.string().optional(),
  eMoneyPin: z.string().optional(),
});

// We can infer the TypeScript type from the schema
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
