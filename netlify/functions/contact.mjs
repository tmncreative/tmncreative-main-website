// Contact form handler
// For production, connect to an email service like SendGrid, Resend, or Mailgun.
// For now, this logs submissions and returns success.
// Winston can also use Netlify Forms (add netlify attribute to form in HTML) as a simpler alternative.

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
    const data = JSON.parse(event.body);
    const { name, email, phone, type, washes, message } = data;

    if (!name || !email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Name and email are required.' }),
      };
    }

    // Log the submission (visible in Netlify function logs)
    console.log('=== NEW CONTACT SUBMISSION ===');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Phone: ${phone || 'Not provided'}`);
    console.log(`Type: ${type || 'Not specified'}`);
    console.log(`Wash Locations: ${washes || 'Not specified'}`);
    console.log(`Message: ${message || 'No message'}`);
    console.log('==============================');

    // TODO: Add email sending here via SendGrid, Resend, or Mailgun
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'QC Atlantic <noreply@qcatlantic.com>',
    //   to: 'wmatney@qcatlantic.com',
    //   subject: `New inquiry from ${name}`,
    //   html: `<p><strong>Name:</strong> ${name}</p>...`
    // });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Submission received.' }),
    };
  } catch (err) {
    console.error('Contact form error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Something went wrong.' }),
    };
  }
};
