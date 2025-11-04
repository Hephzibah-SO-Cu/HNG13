import * as React from "react";

interface EmailProps {
  customerName: string;
  order: any; // The full order object
}

export default function ConfirmationEmail({
  customerName,
  order,
}: EmailProps) {
  const firstItem = order.items[0];

  return (
    <html lang="en">
      <head>
        <style>{`
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
          .container { width: 90%; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          .header { font-size: 24px; font-weight: bold; color: #D87D4A; }
          .content { margin-top: 20px; }
          .summary { margin-top: 20px; background-color: #F1F1F1; padding: 15px; border-radius: 8px; }
          .summary-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd; }
          .summary-total { display: flex; justify-content: space-between; padding-top: 15px; background-color: #101010; color: white; margin: 10px -15px -15px; padding: 15px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
          .button { display: inline-block; padding: 12px 20px; margin-top: 20px; background-color: #D87D4A; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">audiophile</div>
          <div className="content">
            <h2>Thank you for your order, {customerName}!</h2>
            <p>
              We've received your order and will begin processing it shortly.
              Your order ID is: <strong>{order.orderId}</strong>.
            </p>

            <h3>Order Summary</h3>
            <div className="summary">
              <div className="summary-item">
                <div style={{ display: "flex", alignItems: "center" }}>
                  {/* We can't use Next/Image, so we use a placeholder or absolute URL */}
                  {/* <img src={firstItem.image.mobile} alt={firstItem.name} width="50" style={{ borderRadius: "4px", marginRight: "10px" }} /> */}
                  <div>
                    <strong>{firstItem.name}</strong> (x{firstItem.quantity})
                    <br />
                    <small>
                      $ {firstItem.price.toLocaleString()}
                    </small>
                  </div>
                </div>
                <div>
                  <strong>
                    $ {(firstItem.price * firstItem.quantity).toLocaleString()}
                  </strong>
                </div>
              </div>
              {order.items.length > 1 && (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <small>and {order.items.length - 1} other item(s)</small>
                </div>
              )}
              <div className="summary-total">
                <strong>GRAND TOTAL</strong>
                <strong>$ {order.grandTotal.toLocaleString()}</strong>
              </div>
            </div>

            <h3>Shipping Details</h3>
            <p>
              {order.customerName}
              <br />
              {order.address}
              <br />
              {order.city}, {order.zipcode}
              <br />
              {order.country}
            </p>

            <p>
              For any questions, please contact our support team.
            </p>
            <a
              href="http://localhost:3000" // Replace with your deployed URL
              className="button"
            >
              View Your Order (Site)
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
