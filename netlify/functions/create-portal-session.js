// netlify/functions/create-portal-session.js
// Creates a Stripe Customer Portal session for the given email and
// returns the hosted portal URL for the client to redirect to.
// Requires STRIPE_SECRET_KEY in Netlify environment variables.

const https = require('https');
const querystring = require('querystring');

function stripeRequest(method, path, key, formBody) {
  return new Promise(function(resolve, reject) {
    var body = formBody ? querystring.stringify(formBody) : '';
    var options = {
      hostname: 'api.stripe.com',
      path: path,
      method: method,
      headers: {
        'Authorization': 'Basic ' + Buffer.from(key + ':').toString('base64'),
        'Stripe-Version': '2023-10-16'
      }
    };
    if (body) {
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }
    var req = https.request(options, function(res) {
      var data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function() {
        try {
          var parsed = JSON.parse(data);
          if (res.statusCode >= 400) reject(new Error(parsed.error?.message || 'Stripe error ' + res.statusCode));
          else resolve(parsed);
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

exports.handler = async function(event) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Stripe is not configured.' }) };
  }

  var email = '';
  try {
    var parsed = JSON.parse(event.body || '{}');
    email = (parsed.email || '').trim().toLowerCase();
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request body.' }) };
  }
  if (!email || !email.includes('@')) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Valid email address required.' }) };
  }

  var origin = (event.headers && (event.headers.origin || event.headers.Origin)) || 'https://tmncreative.com';
  var returnUrl = origin.replace(/\/$/, '') + '/pay';

  try {
    var customers = await stripeRequest('GET', '/v1/customers?email=' + encodeURIComponent(email) + '&limit=1', key);
    if (!customers.data || customers.data.length === 0) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'No account found for that email.' }) };
    }
    var customerId = customers.data[0].id;

    var session = await stripeRequest('POST', '/v1/billing_portal/sessions', key, {
      customer: customerId,
      return_url: returnUrl
    });

    return { statusCode: 200, headers, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    console.error('Portal session error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Could not open the billing portal. Please try again or contact us.' }) };
  }
};
