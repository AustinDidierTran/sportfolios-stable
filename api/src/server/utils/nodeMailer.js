const nodemailer = require('nodemailer');

const key = require('./keys/google-keys.json');

const YOUR_EMAIL_ADDRESS = 'info@sportfolios.app';

async function sendMail({ sendTo, subject, text }) {
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

module.exports = {
  sendMail,
};
