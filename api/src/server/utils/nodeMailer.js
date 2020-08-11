const nodemailer = require('nodemailer');
const { CLIENT_BASE_URL } = require('../../../../conf');
const { LOGO_ENUM } = require('../../../../common/enums');

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
async function sendMail({ email, subject, text, html }) {
  if (!key) {
    /* eslint-disable-next-line */
    console.log(
      `Google keys are not configured, aborting mail fire. Here was the email content: \n\n ${text ||
        html}`,
    );
    return;
  }

  const realSubject =
    process.env.NODE_ENV === 'development'
      ? `[DEV] | ${subject}`
      : subject;

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
      subject: realSubject,
      text,
      html,
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

async function sendAcceptedRegistrationEmail({ email, team, event }) {
  await sendMail({
    email,
    subject: `Inscription d'équipe | Sportfolios`,
    html: `<div><h1>inscription ${team.name}</h1><p>Votre équipe ${team.name} est officiellement acceptée au tournoi ${event.name}. L'organisation est maintenant en attente de paiement. Vous pouvez payer en vous rendant au lien suivant:<link> ${CLIENT_BASE_URL}/cart</link></p><img src=${LOGO_ENUM.LOGO}/></div>`,
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
  sendAcceptedRegistrationEmail,
  sendTeamRegistrationEmailToAdmin,
};
