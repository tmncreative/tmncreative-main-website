import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const sig = event.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Webhook signature verification failed.' }),
    };
  }

  // Handle payment_intent.succeeded
  if (stripeEvent.type === 'payment_intent.succeeded') {
    const paymentIntent = stripeEvent.data.object;
    const invoiceId = paymentIntent.metadata?.invoice_id;

    if (invoiceId) {
      try {
        // Mark the invoice as paid
        await stripe.invoices.pay(invoiceId, {
          paid_out_of_band: true,
        });
        console.log(`Invoice ${invoiceId} marked as paid.`);
      } catch (err) {
        // Invoice might already be paid or in a different state
        console.log(`Could not mark invoice ${invoiceId} as paid:`, err.message);
      }
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ received: true }),
  };
};
