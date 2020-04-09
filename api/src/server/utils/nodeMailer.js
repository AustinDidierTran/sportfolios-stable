const nodemailer = require('nodemailer');
const { CLIENT_BASE_URL } = require('../../../../conf');
const fs = require('fs');

let key;

try {
  key = require('./keys/google-keys.json');
} catch (e) {
  console.log(
    `There is an error, keys are probably simply not configured: ${e}`,
  );
}

const YOUR_EMAIL_ADDRESS = 'info@sportfolios.app';

// Do not export this function. Create your own who uses it, then export this one
async function sendMail({ email, subject, text }) {
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
      to: email,
      subject,
      text,
    });
  } catch (err) {
    console.error(err);
  }
}

async function sendConfirmationEmail({ email, token }) {
  await sendMail({
    email,
    subject: 'Confirm your email address.',
    text: `To confirm your email, please click on the following link: ${CLIENT_BASE_URL}/confirmEmail/${token}.`,
  });
}

async function sendRecoveryEmail({ email, token }) {
  await sendMail({
    email,
    subject: 'Recovery email.',
    text: `You forgot your password? Here is the link to recover your account: ${CLIENT_BASE_URL}/recoveryEmail/${token}.`,
  });
}

module.exports = {
  sendConfirmationEmail,
  sendRecoveryEmail,
};
