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
    subject: `Reçu de commande | Sportfolios`,
    text: `Pour voir votre reçu, cliquez sur le lien suivant: ${receipt}.`,
  });
}

const sendTeamRegistrationEmailToAdmin = async ({
  email,
  team,
  event,
}) => {
  await sendMail({
    email,
    subject: 'Nouvelle inscription à votre tournoi | Sportfolios',
    text: `Une équipe nommée ${team.name} s'est inscrite à votre événement ${event.name} avec succès. Vous pouvez accéder au status de votre événement ici: ${CLIENT_BASE_URL}/${event.id}?tab=settings`,
  });
};

async function sendRegistrationEmail({ email, team, entity }) {
  await sendMail({
    email,
    subject: `Inscription d'équipe | Sportfolios`,
    text: `Votre équipe ${team.name} a été ajoutée au tournoi ${entity.name} avec succès. Elle est maintenant en attente de paiement. Vous pouvez payer en vous rendant au lien suivant: ${CLIENT_BASE_URL}/cart`,
  });
}

async function sendRecoveryEmail({ email, token }) {
  await sendMail({
    email,
    subject: 'Courriel de récupération de compte | Sportfolios',
    text: `Vous avez oublié votre mot de passe? Voici le lien pour le retrouver: ${CLIENT_BASE_URL}/recoveryEmail?token=${token}&email=${email}.`,
  });
}
module.exports = {
  sendConfirmationEmail,
  sendRecoveryEmail,
  sendReceiptEmail,
  sendRegistrationEmail,
  sendTeamRegistrationEmailToAdmin,
};
