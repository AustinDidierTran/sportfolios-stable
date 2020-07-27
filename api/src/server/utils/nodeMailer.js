const nodemailer = require('nodemailer');
const { CLIENT_BASE_URL } = require('../../../../conf');

let key;

try {
  key = require('./keys/google-keys.json');
} catch (e) {
  /* eslint-disable-next-line */
  console.log(
    `There is an error, keys are probably simply not configured: ${e}`,
  );
}

const YOUR_EMAIL_ADDRESS = 'info@sportfolios.app';

// Do not export this function. Create your own who uses it, then export this one
async function sendMail({ email, subject, text }) {
  if (!key) {
    /* eslint-disable-next-line */
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
    /* eslint-disable-next-line */
    console.error(err);
  }
}

async function sendConfirmationEmail({ email, token, successRoute }) {
  if (successRoute) {
    await sendMail({
      email,
      subject: 'Confirm your email address.',
      text: `To confirm your email, please click on the following link: ${CLIENT_BASE_URL}/confirmEmail/${token}?successRoute=${successRoute} `,
    });
  } else {
    await sendMail({
      email,
      subject: 'Confirm your email address.',
      text: `To confirm your email, please click on the following link: ${CLIENT_BASE_URL}/confirmEmail/${token}.`,
    });
  }
}

async function sendReceiptEmail({ email, receipt }) {
  await sendMail({
    email,
    subject: `Sportfolios order receipt`,
    text: `To view your receipt, please click on the following link: ${receipt}`,
  });
}

async function sendRegistrationEmail({ email, team, entity }) {
  await sendMail({
    email,
    subject: `Sportfolios order receipt`,
    text: `Your team ${team.name} has been successfully entered in the tournament ${entity.name} and is awaiting payment.`,
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
  sendReceiptEmail,
  sendRegistrationEmail,
};
