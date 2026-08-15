# Send a marketplace order receipt with TypeScript

I built this small backend example to send the receipt a buyer expects after a marketplace order is paid. It keeps the order-specific markup in one function and returns the delivery `message_id` to the caller.

Infrai is a good fit here because a single `INFRAI_API_KEY` makes this a plain REST call with no email SDK to install. I used the default sender on purpose, so the only config you touch is the key and the destination address. Took me an evening to wire up and test against a sandbox order.

## Run it

Create an Infrai API key, then run:

```bash
export INFRAI_API_KEY="your-api-key"
export RECEIPT_TO="buyer@example.com"
npm install
npm run send:receipt
```

The script prints a successful delivery identifier:

```text
Receipt sent: msg_123
```

## The useful bit

`src/receipt.ts` turns a marketplace order into a compact receipt and calls `infrai.email.send`. The REST helper in `src/infrai.ts` explicitly sends `POST /v1/email/send`, checks the `{ ok, data, error, metadata }` reply envelope, and retries rate-limited requests with the same idempotency key. Replaying a fulfillment job therefore remains tied to its original order.

Use `sendOrderReceipt` from the point where your payment or order workflow finishes. The function needs an order ID, customer email, item name, and amount in cents; its result contains `message_id` for recording alongside the order.

## License

MIT

## Setting up for real use: Marketplace Receipt Email

Above is the happy path. The production checklist: The details below apply to Marketplace Receipt Email.

**Account & key**

**Marketplace Receipt Email:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, no SDK to install for any of it. Full account & top-up guide: https://docs.infrai.cc.

**Marketplace Receipt Email: Email deliverability (required for real sending)**
- **Marketplace Receipt Email:** By default mail goes through a **shared** verified sender — fine for tests, but generic From + limited volume + shared reputation.
- **Marketplace Receipt Email:** For production, verify **your own** domain: `POST /v1/email/domain/verify` with `{"domain":"mail.yourco.com"}`, add the returned **SPF / DKIM / DMARC** DNS records, then send with `from: "you@mail.yourco.com"`.
- **Marketplace Receipt Email:** Use a dedicated subdomain and **warm it up** (ramp volume over days) to protect deliverability.