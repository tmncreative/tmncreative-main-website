// netlify/functions/lookup-invoice.js
// Queries Stripe directly for invoices by customer email.
// Requires STRIPE_SECRET_KEY set in Netlify environment variables.

const https = require('https');

function stripeGet(path, key) {
  return new Promise(function(resolve, reject) {
    const options = {
      hostname: 'api.stripe.com',
      path: path,
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(key + ':').toString('base64'),
        'Stripe-Version': '2023-10-16'
      }
    };
    const req = https.request(options, function(res) {
      var body = '';
      res.on('data', function(chunk) { body += chunk; });
      res.on('end', function() {
        try {
          var parsed = JSON.parse(body);
          if (res.statusCode >= 400) reject(new Error(parsed.error?.message || 'Stripe error ' + res.statusCode));
          else resolve(parsed);
        } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function formatAmount(amount_cents, currency) {
  var dollars = amount_cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (currency || 'usd').toUpperCase()
  }).format(dollars);
}

exports.handler = async function(event) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Stripe is not configured for this site.' })
    };
  }

  const email = (event.queryStringParameters?.email || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Valid email address required.' })
    };
  }

  try {
    // Find customer by email
    const customers = await stripeGet(
      '/v1/customers?email=' + encodeURIComponent(email) + '&limit=5',
      key
    );

    if (!customers.data || customers.data.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ invoices: [], found: false })
      };
    }

    // Collect invoices from all matching customers (e.g. duplicates)
    var allInvoices = [];
    for (var i = 0; i < customers.data.length; i++) {
      var cid = customers.data[i].id;
      var result = await stripeGet(
        '/v1/invoices?customer=' + cid + '&limit=20&expand[]=data.customer',
        key
      );
      if (result.data) allInvoices = allInvoices.concat(result.data);
    }

    // Filter to invoices that are open or paid (skip drafts and voided)
    var filtered = allInvoices.filter(function(inv) {
      return inv.status === 'open' || inv.status === 'paid';
    });

    // Sort: open first, then by date descending
    filtered.sort(function(a, b) {
      if (a.status !== b.status) return a.status === 'open' ? -1 : 1;
      return b.created - a.created;
    });

    var invoices = filtered.map(function(inv) {
      // Get best description from line items
      var desc = inv.description;
      if (!desc && inv.lines && inv.lines.data && inv.lines.data.length > 0) {
        desc = inv.lines.data.map(function(l) { return l.description; }).filter(Boolean).join(', ');
      }
      if (!desc) desc = 'Invoice ' + (inv.number || inv.id);

      return {
        id: inv.id,
        number: inv.number || inv.id,
        description: desc,
        amount: formatAmount(inv.amount_due, inv.currency),
        amount_paid: formatAmount(inv.amount_paid, inv.currency),
        due: inv.due_date
          ? new Date(inv.due_date * 1000).toISOString().split('T')[0]
          : null,
        created: new Date(inv.created * 1000).toISOString().split('T')[0],
        status: inv.status,
        url: inv.hosted_invoice_url || null
      };
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ invoices: invoices, found: true })
    };

  } catch (err) {
    console.error('Stripe lookup error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Could not retrieve invoices. Please try again or contact us.' })
    };
  }
};
