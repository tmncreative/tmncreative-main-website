# QC Atlantic Website

**Chemistry. Not Soap.**

Performance car wash chemistry website with integrated Stripe payment portal.

---

## Quick Deploy to Netlify

### Option A: GitHub (recommended for ongoing updates)
1. Push this folder to a GitHub repo
2. Go to [app.netlify.com](https://app.netlify.com)
3. Click "Add new site" > "Import an existing project"
4. Connect your GitHub repo
5. Build settings are auto-detected from `netlify.toml`
6. Add environment variables (see below)
7. Deploy

### Option B: Manual drag-and-drop
1. Run `npm install && npm run build` locally
2. Go to [app.netlify.com](https://app.netlify.com)
3. Drag the `dist` folder onto the deploy area
4. **Note:** Serverless functions (payment portal) require Option A

---

## Stripe Setup

### 1. Create a Stripe Account
- Go to [stripe.com](https://stripe.com) and sign up
- Complete business verification

### 2. Get API Keys
- Go to [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
- Copy the **Publishable key** (starts with `pk_test_` or `pk_live_`)
- Copy the **Secret key** (starts with `sk_test_` or `sk_live_`)

### 3. Add Environment Variables in Netlify
Go to **Site settings > Environment variables** and add:

| Variable | Value | Notes |
|---|---|---|
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | Frontend, public |
| `STRIPE_SECRET_KEY` | `sk_test_...` | Backend, secret |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | See webhook setup |

### 4. Set Up Stripe Webhook
- Go to [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
- Click "Add endpoint"
- URL: `https://your-site.netlify.app/api/stripe-webhook`
- Events: Select `payment_intent.succeeded`
- Copy the signing secret and add it as `STRIPE_WEBHOOK_SECRET` in Netlify

### 5. Create Invoices in Stripe
- Go to [dashboard.stripe.com/invoices](https://dashboard.stripe.com/invoices)
- Click "Create invoice"
- Add customer, line items, and amount
- **Finalize and send** the invoice
- The invoice number (e.g. QCA-0001) is what customers type on the website
- Customize your invoice number prefix in Stripe settings

---

## How the Payment Flow Works

1. Customer goes to the Pay page on qcatlantic.com
2. Types their invoice number (from the invoice Winston sent them)
3. System looks it up in Stripe and shows the amount due
4. Customer enters credit card via Stripe Elements (PCI compliant)
5. Payment processes, invoice marked as paid
6. Both customer and Winston get confirmation

Winston never handles card data. Stripe manages all PCI compliance.

---

## Going Live

When ready to accept real payments:
1. Complete Stripe business verification
2. Swap test keys for live keys in Netlify environment variables:
   - `pk_test_...` becomes `pk_live_...`
   - `sk_test_...` becomes `sk_live_...`
3. Create a new live webhook and update `STRIPE_WEBHOOK_SECRET`
4. Redeploy the site

---

## Local Development

```bash
npm install
cp .env.example .env    # Fill in your test keys
npm run dev             # Runs at localhost:5173
```

For serverless functions locally, install and use `netlify dev`:
```bash
npm install -g netlify-cli
netlify dev             # Runs site + functions at localhost:8888
```

---

## Project Structure

```
qcatlantic-site/
  index.html              # Root HTML
  netlify.toml            # Netlify build + redirect config
  package.json
  vite.config.js
  .env.example            # Environment variable template
  src/
    main.jsx              # React entry point
    App.jsx               # Main app with all pages + routing
    PaymentPage.jsx       # Stripe payment portal
  netlify/functions/
    lookup-invoice.mjs    # Searches Stripe for invoice by number
    pay-invoice.mjs       # Creates PaymentIntent for invoice
    stripe-webhook.mjs    # Handles payment confirmation
    contact.mjs           # Contact form handler
```
