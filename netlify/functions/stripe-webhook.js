// netlify/functions/stripe-webhook.js
// Receives Stripe webhook events and sends email notification on invoice.paid.
// Requires environment variables:
//   STRIPE_WEBHOOK_SECRET - from Stripe webhook endpoint settings
//   RESEND_API_KEY - from resend.com (free tier)

const crypto = require('crypto');
const https = require('https');

function verifyStripeSignature(payload, sigHeader, secret) {
  var parts = {};
  sigHeader.split(',').forEach(function(item) {
    var kv = item.split('=');
    if (kv[0] === 't') parts.t = kv[1];
    if (kv[0] === 'v1' && !parts.v1) parts.v1 = kv[1];
  });
  if (!parts.t || !parts.v1) return false;

  var signedPayload = parts.t + '.' + payload;
  var expected = crypto
    .createHmac('sha256', secret)
    .update(signedPayload, 'utf8')
    .digest('hex');

  // Timing-safe comparison
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, 'utf8'),
      Buffer.from(parts.v1, 'utf8')
    );
  } catch (e) {
    return false;
  }
}

function sendEmail(apiKey, to, subject, html) {
  return new Promise(function(resolve, reject) {
    var body = JSON.stringify({
      from: 'TMN Creative <notifications@tmncreative.com>',
      to: [to],
      subject: subject,
      html: html
    });

    var options = {
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    var req = https.request(options, function(res) {
      var data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function() {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error('Resend error ' + res.statusCode + ': ' + data));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function formatCents(cents, currency) {
  var dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (currency || 'usd').toUpperCase()
  }).format(dollars);
}

exports.handler = async function(event) {
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  var webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  var resendKey = process.env.RESEND_API_KEY;

  if (!webhookSecret || !resendKey) {
    console.error('Missing env vars: STRIPE_WEBHOOK_SECRET or RESEND_API_KEY');
    return { statusCode: 500, body: 'Server misconfigured' };
  }

  // Verify Stripe signature
  var sig = event.headers['stripe-signature'];
  if (!sig) {
    return { statusCode: 400, body: 'Missing stripe-signature header' };
  }

  var rawBody = event.body;
  if (event.isBase64Encoded) {
    rawBody = Buffer.from(rawBody, 'base64').toString('utf8');
  }

  if (!verifyStripeSignature(rawBody, sig, webhookSecret)) {
    console.error('Invalid Stripe signature');
    return { statusCode: 400, body: 'Invalid signature' };
  }

  // Parse event
  var stripeEvent;
  try {
    stripeEvent = JSON.parse(rawBody);
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  // Only handle invoice.paid
  if (stripeEvent.type === 'invoice.paid') {
    var invoice = stripeEvent.data.object;
    var amount = formatCents(invoice.amount_paid, invoice.currency);
    var customerEmail = invoice.customer_email || 'unknown';
    var customerName = invoice.customer_name || customerEmail;
    var invoiceNumber = invoice.number || invoice.id;
    var description = '';

    if (invoice.lines && invoice.lines.data && invoice.lines.data.length > 0) {
      description = invoice.lines.data
        .map(function(l) { return l.description; })
        .filter(Boolean)
        .join(', ');
    }
    if (!description) description = 'Invoice ' + invoiceNumber;

    var subject = 'Payment received: ' + amount + ' from ' + customerName;

    var html = [
      '<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px">',
      '<h2 style="color:#0F172A;margin:0 0 8px">Payment Received</h2>',
      '<p style="color:#64748B;margin:0 0 24px;font-size:14px">A Stripe invoice was just paid.</p>',
      '<table style="width:100%;border-collapse:collapse;font-size:14px">',
      '<tr><td style="padding:8px 0;color:#94A3B8;width:120px">Amount</td><td style="padding:8px 0;color:#0F172A;font-weight:600">' + amount + '</td></tr>',
      '<tr><td style="padding:8px 0;color:#94A3B8">Client</td><td style="padding:8px 0;color:#0F172A">' + customerName + '</td></tr>',
      '<tr><td style="padding:8px 0;color:#94A3B8">Email</td><td style="padding:8px 0;color:#0F172A">' + customerEmail + '</td></tr>',
      '<tr><td style="padding:8px 0;color:#94A3B8">Invoice</td><td style="padding:8px 0;color:#0F172A">' + invoiceNumber + '</td></tr>',
      '<tr><td style="padding:8px 0;color:#94A3B8">Description</td><td style="padding:8px 0;color:#0F172A">' + description + '</td></tr>',
      '</table>',
      '<hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0">',
      '<p style="color:#94A3B8;font-size:12px;margin:0">View in <a href="https://dashboard.stripe.com/invoices" style="color:#C6A24A">Stripe Dashboard</a></p>',
      '</div>'
    ].join('');

    try {
      await sendEmail(resendKey, 'hello@tmncreative.com', subject, html);
      console.log('Payment notification sent: ' + amount + ' from ' + customerEmail);
    } catch (err) {
      console.error('Email send failed:', err.message);
      // Still return 200 so Stripe doesn't retry
    }
  }

  // Always return 200 so Stripe doesn't retry
  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
