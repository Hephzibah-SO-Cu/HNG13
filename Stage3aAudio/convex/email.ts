// convex/email.ts
// [MODIFIED]
import { action } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

// Define args
const orderItem = v.object({
  name: v.string(),
  price: v.number(),
  quantity: v.number(),
});

export const sendConfirmation = action({
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
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error("Resend API key is not set.");
      return;
    }

    const resend = new Resend(resendApiKey);

    // Build the simple HTML string
    const orderId = args.orderId;
    const firstItem = args.items[0];
    
    // --- FIX: Added "Support/Contact info" paragraph ---
    const emailHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #D87D4A;">audiophile</h1>
          <h2>Thank you for your order, ${args.customerName}!</h2>
          <p>Your order (ID: <strong>${orderId}</strong>) has been received.</p>
          <div style="background-color: #F1F1F1; padding: 15px; border-radius: 8px;">
            <p><strong>${firstItem.name}</strong> (x${firstItem.quantity})</p>
            ${args.items.length > 1 ? `<p><small>and ${args.items.length - 1} other item(s)</small></p>` : ""}
            <div style="background-color: #101010; color: white; padding: 15px; border-radius: 0 0 8px 8px; margin-top: 10px;">
              <strong>GRAND TOTAL: $${args.grandTotal.toLocaleString()}</strong>
            </div>
          </div>
          <h3 style="margin-top: 20px;">Shipping Details:</h3>
          <p>
            ${args.address}<br>
            ${args.city}, ${args.zipcode}<br>
            ${args.country}
          </p>
          <p style="margin-top: 20px; font-size: 12px; color: #777;">
            For any questions or support, please contact us at support@audiophile.com.
          </p>
        </body>
      </html>
    `;
    // --- END FIX ---

    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: args.email,
        subject: "Your Audiophile Order Confirmation",
        html: emailHtml,
      });
      console.log(`Successfully sent email to ${args.email}`);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  },
});