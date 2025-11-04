// convex/orders.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api"; // We need this to schedule the action

const orderItem = v.object({
  name: v.string(),
  price: v.number(),
  quantity: v.number(),
});

export const createOrder = mutation({
  args: {
    customerName: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    zipcode: v.string(),
    city: v.string(),
    country: v.string(),
    items: v.array(orderItem),
    subtotal: v.number(),
    shipping: v.number(),
    taxes: v.number(),
    grandTotal: v.number(),
    paymentMethod: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Save the order to the database
    const orderId = await ctx.db.insert("orders", {
      ...args,
      status: "pending",
    });

    // --- THIS IS THE FIX ---
    // 2. Schedule the email action to run in the background
    // We pass all the arguments, plus the new orderId
    await ctx.scheduler.runAfter(0, api.email.sendConfirmation, {
      ...args,
      orderId: orderId, // Pass the ID to the action
    });
    // --- END FIX ---

    return orderId;
  },
});

