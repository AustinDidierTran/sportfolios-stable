const nodemailer = require('nodemailer');
const { CLIENT_BASE_URL } = require('../../../../conf');
const fs = require('fs');

const key =
  fs.existsSync('./keys/google-keys.json') &&
  require('./keys/google-keys.json');

console.log('key', key);

const YOUR_EMAIL_ADDRESS = 'info@sportfolios.app';

async function sendMail({ sendTo, subject, text }) {
  if (!key) {
    console.log(
      `Google keys are not configured, aborting mail fire. Here was the email content: \n\n ${text}`,
    );
    return;
  }
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: YOUR_EMAIL_ADDRESS,
      serviceClient: key.client_id,
      privateKey: key.private_key,
    },
  });
  try {
    await transporter.verify();
    await transporter.sendMail({
      from: YOUR_EMAIL_ADDRESS,
      to: sendTo,
      subject,
      text,
    });
  } catch (err) {
    console.error(err);
  }
}

async function sendConfirmationEmail({ sendTo, token }) {
  await sendMail({
    sendTo,
    subject: 'Confirm your email address.',
    text: `To confirm your email, please click on the following link: ${CLIENT_BASE_URL}/confirmEmail?token=${token}.`,
  });
}

module.exports = {
  sendMail,
  sendConfirmationEmail,
};
