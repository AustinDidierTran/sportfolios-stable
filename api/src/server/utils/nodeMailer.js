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

async function getHtml(title, content, link, buttonName) {
  return `<html><body style="font-family:Helvetica"><h1>${title}</h1><p>${content}</p><a href=${link} target="_blank"><button>${buttonName}</button></a><img src=${LOGO_ENUM.LOGO_256X256}></img><br/><footer> <p> Powered by <a href=${CLIENT_BASE_URL} target="_blank"> ${CLIENT_BASE_URL} </a></p></body> </html>`;
}

async function sendConfirmationEmail({ email, token, successRoute }) {
  const language = await getLanguageFromEmail(email);
  let html = '';
  let subject = '';
  let title = '';
  let content = '';
  let link = '';
  let buttonName = '';
  if (language === LANGUAGE_ENUM.ENGLISH) {
    subject = 'Confirm your email address. | Sportfolios';
    title = 'Email confirmation';
    content =
      'To confirm your email, please click on the following link 👇';
    buttonName = 'Confirmation';
  } else {
    subject = `Confirmation de l'adresse courriel | Sportfolios`;
    title = 'Confirmation du courriel';
    content =
      'Pour confirmer votre addresse courriel cliquez sur le lien suivant 👇';
    buttonName = 'Confirmation';
  }
  if (successRoute) {
    link = `${CLIENT_BASE_URL}/confirmEmail/${token}?successRoute=${successRoute}`;
  } else {
    link = `${CLIENT_BASE_URL}/confirmEmail/${token}`;
  }
  html = await getHtml(title, content, link, buttonName);
  await sendMail({
    email,
    subject,
    html,
  });
}

async function sendReceiptEmail({ email, receipt }) {
  const language = await getLanguageFromEmail(email);
  let html = '';
  let subject = '';
  let title = '';
  let content = '';
  let link = receipt;
  let buttonName = '';
  if (language === LANGUAGE_ENUM.ENGLISH) {
    title = 'Your receipt';
    content = 'To see your receipt, click on the following link 👇';
    subject = 'Order receipt | Sportfolios';
  } else {
    title = 'Votre reçu';
    content = 'Pour voir votre reçu, cliquez sur le lien suivant 👇';
    subject = `Reçu de commande | Sportfolios`;
  }
  html = await getHtml(title, content, link, buttonName);
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
  let title = '';
  let content = '';
  let link = `${CLIENT_BASE_URL}/${event.id}?tab=settings`;
  let buttonName = '';
  if (language === LANGUAGE_ENUM.ENGLISH) {
    title = 'New registration!';
    content = `A new team named ${team.name} has registered to your event ${event.name} with success. You can access to your event here 👇`;
    buttonName = 'Event';
    subject = 'New registration to your tournament | Sportfolios';
  } else {
    title = 'Nouvelle inscription!';
    content = `Une équipe nommée ${team.name} s'est inscrite à votre événement ${event.name} avec succès. Vous pouvez accéder au status de votre événement ici 👇`;
    buttonName = 'Événement';
    subject = 'Nouvelle inscription à votre tournoi | Sportfolios';
  }
  html = await getHtml(title, content, link, buttonName);
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
  let title = '';
  let content = '';
  let link = `${CLIENT_BASE_URL}/cart`;
  let buttonName = '';
  if (language === LANGUAGE_ENUM.ENGLISH) {
    title = `Registration ${team.name}`;
    content = `Your team ${team.name} is officially registered to ${event.name}. The tournament is awaiting your payment. You can pay by going on the following link 👇`;
    subject = `Registration ${team.name} | Sportfolios`;
  } else {
    title = `Inscription ${team.name}`;
    content = `Votre équipe ${team.name} est officiellement acceptée au tournoi ${event.name}. Le tournoi est maintenant en attente de paiement. Vous pouvez payer en vous rendant au lien suivant 👇`;
    subject = `Inscription ${team.name} | Sportfolios`;
  }
  html = await getHtml(title, content, link, buttonName);
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
  let title = '';
  let content = '';
  let link = `${CLIENT_BASE_URL}/recoveryEmail?token=${token}&email=${email}`;
  let buttonName = '';
  if (language === LANGUAGE_ENUM.ENGLISH) {
    title = 'Password recovery';
    content =
      'You forgot your password? Click here to get it back 👇';
    subject = 'Recover your password | Sportfolios';
  } else {
    title = 'Récupération de votre mot de passe';
    content =
      'Vous avez oublié votre mot de passe? Voici le lien pour le retrouver 👇';
    subject = 'Courriel de récupération de compte | Sportfolios';
  }
  html = await getHtml(title, content, link, buttonName);
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
