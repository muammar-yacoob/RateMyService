require('dotenv').config();
const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({
  access_token: process.env.ACCESS_TOKEN,
  refresh_token: process.env.REFRESH_TOKEN,
  scope: 'https://www.googleapis.com/auth/gmail.send',
  token_type: 'Bearer',
  expiry_date: (new Date()).getTime() + (1000 * 60 * 60) // 1 hour
});

async function sendEmail({from, to, subject, text, html, attachments = []}) {
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  let emailParts = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: multipart/related; boundary="nodejs_email"',
    '',
    '--nodejs_email',
    'Content-Type: text/html; charset=UTF-8',
    '',
    html,
  ];

  attachments.forEach((attachment) => {
    emailParts = emailParts.concat([
      '',
      '--nodejs_email',
      `Content-Type: ${attachment.type}; name="${attachment.name}"`,
      'Content-Disposition: inline',
      `Content-Transfer-Encoding: base64`,
      `Content-ID: <${attachment.cid}>`,
      '',
      attachment.content,
    ]);
  });

  emailParts.push('--nodejs_email--');

  const email = emailParts.join('\n').trim();
  const encodedMessage = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  try {
    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
    console.log(`Message sent: id ${res.data.id}`);
    return res.data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

module.exports = { sendEmail };
