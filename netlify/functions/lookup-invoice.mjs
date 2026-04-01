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
    const { invoiceNumber } = JSON.parse(event.body);

    if (!invoiceNumber || invoiceNumber.trim() === '') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invoice number is required.' }),
      };
    }

    const cleaned = invoiceNumber.trim().toUpperCase();

    // Search Stripe invoices by number
    // Stripe allows listing invoices and filtering, but the best approach
    // is to search using the invoice number field
    const invoices = await stripe.invoices.search({
      query: `number:"${cleaned}"`,
    });

    if (!invoices.data || invoices.data.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Invoice not found. Check the number and try again.' }),
      };
    }

    const invoice = invoices.data[0];

    // Only allow payment on open (unpaid) invoices
    if (invoice.status === 'paid') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'This invoice has already been paid.', status: 'paid' }),
      };
    }

    if (invoice.status === 'void') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'This invoice has been voided.', status: 'void' }),
      };
    }

    if (invoice.status !== 'open') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: `This invoice is not available for payment (status: ${invoice.status}).` }),
      };
    }

    // Return invoice details to the frontend
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        invoiceId: invoice.id,
        number: invoice.number,
        amountDue: invoice.amount_due,
        currency: invoice.currency,
        description: invoice.description || invoice.lines?.data?.[0]?.description || 'QC Atlantic Invoice',
        customerName: invoice.customer_name || '',
        customerEmail: invoice.customer_email || '',
        dueDate: invoice.due_date ? new Date(invoice.due_date * 1000).toLocaleDateString() : null,
        created: new Date(invoice.created * 1000).toLocaleDateString(),
        lineItems: invoice.lines?.data?.map((line) => ({
          description: line.description,
          amount: line.amount,
        })) || [],
      }),
    };
  } catch (err) {
    console.error('Invoice lookup error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Something went wrong. Please try again.' }),
    };
  }
};
