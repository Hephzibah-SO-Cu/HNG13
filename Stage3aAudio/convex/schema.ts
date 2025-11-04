// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Define the structure for an item in the cart/order
const orderItem = v.object({
  // productId: v.id("products"), // <-- REMOVED THIS
  name: v.string(),
  price: v.number(),
  quantity: v.number(),
});

export default defineSchema({
  // You'll need a products table later
  products: defineTable({
    name: v.string(),
    // ... other product fields
  }),

  // Orders table as required by the task
  orders: defineTable({
    // Customer details
    customerName: v.string(),
    email: v.string(),
    phone: v.string(),

    // Shipping details
    address: v.string(),
    zipcode: v.string(),
    city: v.string(),
    country: v.string(),

    // Items and Totals
    items: v.array(orderItem),
    subtotal: v.number(),
    shipping: v.number(),
    taxes: v.number(),
    grandTotal: v.number(),

    // Order metadata
    status: v.string(), // e.g., "pending", "shipped"
    paymentMethod: v.string(), // e.g., "e-Money", "Cash on Delivery"
  }).index("by_email", ["email"]), // To find orders by customer
});

