import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { invoiceId } = JSON.parse(event.body);

    if (!invoiceId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invoice ID is required.' }),
      };
    }

    // Retrieve the invoice to confirm it's still open
    const invoice = await stripe.invoices.retrieve(invoiceId);

    if (invoice.status !== 'open') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: `Invoice is no longer payable (status: ${invoice.status}).` }),
      };
    }

    // If the invoice already has a payment_intent, use that
    if (invoice.payment_intent) {
      const existingPI = await stripe.paymentIntents.retrieve(invoice.payment_intent);

      // If the existing PI can still be confirmed, return it
      if (existingPI.status === 'requires_payment_method' || existingPI.status === 'requires_confirmation') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            clientSecret: existingPI.client_secret,
            paymentIntentId: existingPI.id,
            amount: invoice.amount_due,
            currency: invoice.currency,
          }),
        };
      }
    }

    // Finalize the invoice if it's in draft (shouldn't be, but just in case)
    let finalInvoice = invoice;
    if (invoice.status === 'draft') {
      finalInvoice = await stripe.invoices.finalizeInvoice(invoiceId);
    }

    // Create a new payment intent for the invoice amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalInvoice.amount_due,
      currency: finalInvoice.currency || 'usd',
      metadata: {
        invoice_id: finalInvoice.id,
        invoice_number: finalInvoice.number,
      },
      description: `Payment for Invoice ${finalInvoice.number}`,
      receipt_email: finalInvoice.customer_email || undefined,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: finalInvoice.amount_due,
        currency: finalInvoice.currency,
      }),
    };
  } catch (err) {
    console.error('Payment intent error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Could not set up payment. Please try again.' }),
    };
  }
};
