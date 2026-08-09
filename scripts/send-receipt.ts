import { sendOrderReceipt } from "../src/receipt.ts";

const recipient = process.env.RECEIPT_TO;
if (!recipient) throw new Error("Set RECEIPT_TO to the customer's email address.");

const result = await sendOrderReceipt({
  id: "order-1042",
  customerEmail: recipient,
  itemName: "Marketplace canvas tote",
  amountCents: 2400,
});

console.log(`Receipt sent: ${result.message_id}`);
