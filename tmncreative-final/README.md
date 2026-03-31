# Pay Portal — Stripe Integration

This is the repeatable payment portal you drop into any client site.
Client uses Stripe normally. Portal pulls their invoices live. Zero manual maintenance.

---

## How It Works

1. Client creates an invoice in Stripe and sends it to their customer (normal Stripe workflow)
2. Customer visits `/pay` on the client's website
3. They enter their email address
4. The page calls a Netlify Function which queries Stripe's API live
5. Their open invoices appear with a Pay Now button that goes directly to Stripe's hosted payment page
6. Payment is handled entirely by Stripe

Client never touches GitHub or Netlify after initial setup. You never touch it either.

---

## Setup Per Client Site (5 minutes)

### Step 1 — Get a Stripe Restricted Key

Ask the client to do this, or screen share and walk them through it.

1. Stripe dashboard > Developers > API keys > Create restricted key
2. Name it something like "Website Pay Portal"
3. Set permissions: **Invoices — Read**, **Customers — Read**
4. Create key and copy it (starts with `rk_live_...`)

This is read-only. It cannot create charges, issue refunds, or touch any money. The client should be comfortable sharing it.

### Step 2 — Add It to Netlify

1. Netlify dashboard > Site > Site configuration > Environment variables
2. Add variable:
   - Key: `STRIPE_SECRET_KEY`
   - Value: the restricted key from Step 1
3. Save

### Step 3 — Redeploy

Netlify > Deploys > Trigger deploy. Takes 30 seconds. Done.

The `/pay` page is now live and connected to that client's Stripe account.

---

## File Structure

```
/
├── pay.html                          # Client-facing payment portal
├── netlify.toml                      # Build config, redirects
└── netlify/
    └── functions/
        └── lookup-invoice.js         # Serverless function, queries Stripe API
```

No `invoices.json`. No admin panel. No GitHub edits. Stripe is the source of truth.

---

## Client Workflow (Ongoing, Zero Involvement From You)

1. Client creates invoice in Stripe, sends to customer
2. Customer gets email from Stripe with payment link (they can pay directly from that)
3. If customer wants to pay via the website instead: goes to `/pay`, enters email, pays
4. Stripe handles payment confirmation, receipts, everything

---

## Troubleshooting

**"Stripe is not configured"** — `STRIPE_SECRET_KEY` env var is missing or the site hasn't redeployed since you added it.

**"No invoices found"** — Customer is entering a different email than what's on their Stripe record. Have them check the invoice email from Stripe.

**Invoices show as "draft"** — Client needs to finalize (send) the invoice in Stripe before it appears here. Draft invoices are intentionally hidden.

---

## Notes

- Only `open` and `paid` invoices show. Drafts and voided invoices are hidden.
- Open invoices sort first, newest to oldest.
- The Pay Now button goes to Stripe's hosted invoice page. Stripe handles the payment, card security, receipts — everything.
- This works with any Stripe account. Drop it into any client site by changing the `STRIPE_SECRET_KEY` env var.
