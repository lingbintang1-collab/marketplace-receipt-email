import { infrai } from "./infrai.ts";

export type Order = {
  id: string;
  customerEmail: string;
  itemName: string;
  amountCents: number;
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  })[character] as string);
}

export function sendOrderReceipt(order: Order) {
  const amount = (order.amountCents / 100).toFixed(2);
  const orderId = escapeHtml(order.id);
  const itemName = escapeHtml(order.itemName);

  return infrai.email.send(
    {
      to: order.customerEmail,
      subject: `Receipt for order ${order.id}`,
      html: `<h1>Thanks for your order</h1><p>Order <strong>${orderId}</strong></p><p>${itemName}: <strong>$${amount}</strong></p>`,
    },
    `marketplace-receipt-${order.id}`,
  );
}
