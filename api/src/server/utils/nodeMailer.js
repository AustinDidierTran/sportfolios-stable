const nodemailer = require('nodemailer');
const { CLIENT_BASE_URL } = require('../../../../conf');
const {
  LOGO_ENUM,
  LANGUAGE_ENUM,
} = require('../../../../common/enums');
const { getLanguageFromEmail } = require('../../db/helpers/index');

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
  const language = await getLanguageFromEmail(email);
  let html = '';
  let subject = '';
  if (language === LANGUAGE_ENUM.ENGLISH) {
    subject = 'Confirm your email address. | Sportfolios';
  } else {
    subject = `Confirmation de l'adresse courriel | Sportfolios`;
  }
  if (successRoute) {
    if (language === LANGUAGE_ENUM.ENGLISH) {
      html = `<div><h1>Email confirmation</h1><p>To confirm your email, please click on the following link: <link>${CLIENT_BASE_URL}/confirmEmail/${token}?successRoute=${successRoute}</link></p><img src=${LOGO_ENUM.LOGO}></img></div>`;
    } else {
      html = `<div><h1>Confirmation du courriel</h1><p>Pour confirmer votre addresse courriel cliquez sur le lien suivant: <link>${CLIENT_BASE_URL}/confirmEmail/${token}?successRoute=${successRoute}</link></p><img src=${LOGO_ENUM.LOGO}></img></div>`;
    }
    await sendMail({
      email,
      subject,
      html,
    });
  } else {
    if (language === LANGUAGE_ENUM.ENGLISH) {
      html = `<div><h1>Email confirmation</h1><p>To confirm your email, please click on the following link: <link>${CLIENT_BASE_URL}/confirmEmail/${token}</link></p><img src=${LOGO_ENUM.LOGO}></img></div>`;
    } else {
      html = `<div><h1>Confirmation du courriel</h1><p>Pour confirmer votre addresse courriel cliquez sur le lien suivant: <link>${CLIENT_BASE_URL}/confirmEmail/${token}</link></p><img src=${LOGO_ENUM.LOGO}></img></div>`;
    }
    await sendMail({
      email,
      subject,
      html,
    });
  }
}

async function sendReceiptEmail({ email, receipt }) {
  const language = await getLanguageFromEmail(email);
  let html = '';
  let subject = '';
  if (language === LANGUAGE_ENUM.ENGLISH) {
    html = `<div><h1>Your receipt</h1><p>To see your receipt, click on the following link:<link>${receipt}</link></p><img src=${LOGO_ENUM.LOGO}></img></div>`;
    subject = 'Order receipt | Sportfolios';
  } else {
    html = `<div><h1>Votre reçu</h1><p>Pour voir votre reçu, cliquez sur le lien suivant:<link>${receipt}</link></p><img src=${LOGO_ENUM.LOGO}></img></div>`;
    subject = `Reçu de commande | Sportfolios`;
  }
  await sendMail({
    email,
    subject,
    html,
  });
}

async function sendTeamRegistrationEmailToAdmin({
  email,
  team,
  event,
}) {
  const language = await getLanguageFromEmail(email);
  let html = '';
  let subject = '';
  if (language === LANGUAGE_ENUM.ENGLISH) {
    html = `<div><h1>New registration!</h1><p>A new team named ${team.name} has registered to your event ${event.name} with success. You can access to your event here:<link> ${CLIENT_BASE_URL}/${event.id}?tab=settings</link></p><img src=${LOGO_ENUM.LOGO}></img></div>`;
    subject = 'New registration to your tournament | Sportfolios';
  } else {
    html = `<div><h1>Nouvelle inscription!</h1><p>Une équipe nommée ${team.name} s'est inscrite à votre événement ${event.name} avec succès. Vous pouvez accéder au status de votre événement ici:<link> ${CLIENT_BASE_URL}/${event.id}?tab=settings</link></p><img src=${LOGO_ENUM.LOGO}></img></div>`;
    subject = 'Nouvelle inscription à votre tournoi | Sportfolios';
  }
  await sendMail({
    email,
    subject,
    html,
  });
}

async function sendAcceptedRegistrationEmail({ email, team, event }) {
  const language = await getLanguageFromEmail(email);
  let html = '';
  let subject = '';
  if (language === LANGUAGE_ENUM.ENGLISH) {
    html = `<div><h1>Registration ${team.name}</h1><p>Your team ${team.name} is officially registered to ${event.name}. The tournament is awaiting your payment. You can pay by going on the following link:<link> ${CLIENT_BASE_URL}/cart</link></p><img src=${LOGO_ENUM.LOGO}></img></div>`;
    subject = `Registration ${team.name} | Sportfolios`;
  } else {
    html = `<div><h1>Inscription ${team.name}</h1><p>Votre équipe ${team.name} est officiellement acceptée au tournoi ${event.name}. Le tournoi est maintenant en attente de paiement. Vous pouvez payer en vous rendant au lien suivant:<link> ${CLIENT_BASE_URL}/cart</link></p><img src=${LOGO_ENUM.LOGO}></img></div>`;
    subject = `Inscription ${team.name} | Sportfolios`;
  }
  await sendMail({
    email,
    subject,
    html,
  });
}

async function sendRecoveryEmail({ email, token }) {
  const language = await getLanguageFromEmail(email);
  let html = '';
  let subject = '';
  if (language === LANGUAGE_ENUM.ENGLISH) {
    html = `<div><h1>Password recovery</h1><p>You forgot your password? Voici le lien pour le retrouver: <link>${CLIENT_BASE_URL}/recoveryEmail?token=${token}&email=${email}</link>. </p><img src=${LOGO_ENUM.LOGO}></img></div>`;
    subject = 'Recover your password | Sportfolios';
  } else {
    html = `<div><h1>Récupération de votre mot de passe</h1><p>Vous avez oublié votre mot de passe? Voici le lien pour le retrouver: <link>${CLIENT_BASE_URL}/recoveryEmail?token=${token}&email=${email}</link>. </p><img src=${LOGO_ENUM.LOGO}></img></div>`;
    subject = 'Courriel de récupération de compte | Sportfolios';
  }
  await sendMail({
    email,
    subject,
    html,
  });
}
module.exports = {
  sendConfirmationEmail,
  sendRecoveryEmail,
  sendReceiptEmail,
  sendAcceptedRegistrationEmail,
  sendTeamRegistrationEmailToAdmin,
};
