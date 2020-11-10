const nodemailer = require('nodemailer');
const { CLIENT_BASE_URL } = require('../../../../conf');
const {
  LOGO_ENUM,
  LANGUAGE_ENUM,
} = require('../../../../common/enums');

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
    return await transporter.sendMail({
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
  return `<html><body style="font-family:Helvetica"><h1>${title}</h1><p>${content}</p><a href=${link} target="_blank"><button>${buttonName}</button></a><img src=${LOGO_ENUM.LOGO_256X256}></img><br/><footer> <p>  <a href=${CLIENT_BASE_URL} target="_blank"> sportfolios.app </a></p></body> </html>`;
}

async function getHtmlNoButton(title, content) {
  return `<html><body style="font-family:Helvetica"><h1>${title}</h1><p>${content}</p><img src=${LOGO_ENUM.LOGO_256X256}></img><br/><footer> <p>  <a href=${CLIENT_BASE_URL} target="_blank"> sportfolios.app </a></p></body> </html>`;
}

async function sendConfirmationEmail({
  email,
  language,
  token,
  successRoute,
}) {
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

const sendPersonTransferEmail = async ({
  email,
  sendedName,
  senderName,
  language,
  token,
}) => {
  let html = '';
  let subject = '';
  let title = '';
  let content = '';
  let link = '';
  let buttonName = '';
  if (language === LANGUAGE_ENUM.ENGLISH) {
    subject =
      senderName +
      ' wants to transfer a person to your account | Sportfolios';
    title = 'Person Transfer';
    content =
      senderName +
      ' wants to transfer the person ' +
      sendedName +
      ' on Sportfolios. Click on the following link to sign in and complete the transfer 👇';
    buttonName = 'Accept the transfer';
  } else {
    subject =
      senderName +
      ' veut transférer une personne à votre compte | Sportfolios';
    title = 'Transfert de personne';
    content =
      senderName +
      ' veut vous transférer la personne ' +
      sendedName +
      ' sur Sportfolios. Cliquez sur le lien suivant pour vous connecter et finaliser le transfert 👇';
    buttonName = 'Accepter le transfert';
  }
  link = `${CLIENT_BASE_URL}/transferPerson/${token}`;
  html = await getHtml(title, content, link, buttonName);
  return await sendMail({
    email,
    subject,
    html,
  });
};
const sendAddPersonToTeamEmail = async ({
  email,
  teamName,
  senderName,
  senderIsEventAdmin,
  language,
  token,
}) => {
  let html = '';
  let subject = '';
  let title = '';
  let content = '';
  let link = '';
  let buttonName = '';
  if (language === LANGUAGE_ENUM.ENGLISH) {
    title = 'Join ' + teamName;

    if (senderIsEventAdmin) {
      subject =
        'Invitation to join the team ' + teamName + ' | Sportfolios';

      content =
        'You have been invited to join a team on Sportfolios. Click on the following link to sign in and be part of the team 👇';
    } else {
      subject =
        senderName +
        ' wants to add you to his team ' +
        teamName +
        ' | Sportfolios';

      content =
        senderName +
        ' wants to add you to his team ' +
        teamName +
        ' on Sportfolios. Click on the following link to sign in and be part of the team 👇';
    }

    buttonName = 'Join ' + teamName;
  } else {
    title = 'Rejoindre ' + teamName;
    if (senderIsEventAdmin) {
      subject =
        "Invitation à joindre l'équipe " +
        teamName +
        ' | Sportfolios';

      content =
        "Vous venez d'être invité à joindre une équipe sur Sportfolios. Cliquez sur le lien suivant pour vous connecter et faire partie de l'équipe 👇";
    } else {
      subject =
        senderName +
        ' vous invite à joindre son équipe ' +
        teamName +
        ' | Sportfolios';

      content =
        senderName +
        " veut vous ajouter à son équipe sur Sportfolios. Cliquez sur le lien suivant pour vous connecter et faire partie de l'équipe 👇";
    }

    buttonName = 'Rejoindre ' + teamName;
  }
  link = `${CLIENT_BASE_URL}/transferPerson/${token}`;
  html = await getHtml(title, content, link, buttonName);
  return await sendMail({
    email,
    subject,
    html,
  });
};

async function sendReceiptEmail({ email, receipt, language }) {
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
    buttonName = 'Receipt';
  } else {
    title = 'Votre reçu';
    content = 'Pour voir votre reçu, cliquez sur le lien suivant 👇';
    subject = `Reçu de commande | Sportfolios`;
    buttonName = 'Reçu';
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
  placesLeft,
  language,
}) {
  let html = '';
  let subject = '';
  let title = '';
  let content = '';
  let link = `${CLIENT_BASE_URL}/${event.id}?tab=settings`;
  let buttonName = '';

  if (language === LANGUAGE_ENUM.ENGLISH) {
    title = 'New registration!';
    if (placesLeft > 1) {
      content = `A new team named ${team.name} has registered to your event ${event.name} with success, ${placesLeft} spots remaining. You can access to your event here 👇`;
    } else if (placesLeft === 1) {
      content = `A new team named ${team.name} has registered to your event ${event.name} with success, only one spot remaining. You can access to your event here 👇`;
    } else if (placesLeft === 0) {
      content = `A new team named ${team.name} has registered to your event ${event.name} with success, no more spots remaining. You can access to your event here 👇`;
    }
    buttonName = 'Event';
    subject = 'New registration to your tournament | Sportfolios';
  } else {
    title = 'Nouvelle inscription!';
    if (placesLeft > 1) {
      content = `Une équipe nommée ${team.name} s'est inscrite à votre événement ${event.name} avec succès, plus que ${placesLeft} places disponibles. Vous pouvez accéder au status de votre événement ici 👇`;
    } else if (placesLeft === 1) {
      content = `Une équipe nommée ${team.name} s'est inscrite à votre événement ${event.name} avec succès, plus qu'une seule place disponible. Vous pouvez accéder au status de votre événement ici 👇`;
    } else if (placesLeft === 0) {
      content = `Une équipe nommée ${team.name} s'est inscrite à votre événement ${event.name} avec succès, plus de place disponible. Vous pouvez accéder au status de votre événement ici 👇`;
    }
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

async function sendAcceptedRegistrationEmail({
  email,
  team,
  event,
  language,
  isFreeOption,
}) {
  let html = '';
  let subject = '';
  let title = '';
  let content = '';
  let link = `${CLIENT_BASE_URL}/cart`;
  let buttonName = '';
  if (language === LANGUAGE_ENUM.ENGLISH) {
    title = `Registration ${team.name}`;
    subject = `Registration ${team.name} | Sportfolios`;
    if (isFreeOption) {
      content = `Your team ${team.name} is officially registered to ${event.name}.`;
    } else {
      content = `Your team ${team.name} is officially registered to ${event.name}. The event is awaiting your payment. You can pay by going on the following link 👇`;
      buttonName = 'Pay your registration';
    }
  } else {
    title = `Inscription ${team.name}`;
    subject = `Inscription ${team.name} | Sportfolios`;
    if (isFreeOption) {
      content = `Votre équipe ${team.name} est officiellement acceptée à l'événement ${event.name}.`;
    } else {
      content = `Votre équipe ${team.name} est officiellement acceptée à l'événement ${event.name}. L'événement est maintenant en attente de paiement. Vous pouvez payer en vous rendant au lien suivant 👇`;
      buttonName = 'Payez votre inscription';
    }
  }
  html =
    buttonName !== ''
      ? await getHtml(title, content, link, buttonName)
      : await getHtmlNoButton(title, content);
  await sendMail({
    email,
    subject,
    html,
  });
}

async function sendRecoveryEmail({ email, token, language }) {
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
    buttonName = 'Recover password';
  } else {
    title = 'Récupération de votre mot de passe';
    content =
      'Vous avez oublié votre mot de passe? Voici le lien pour le retrouver 👇';
    subject = 'Courriel de récupération de compte | Sportfolios';
    buttonName = 'Récupération de mot de passe';
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
  sendPersonTransferEmail,
  sendAddPersonToTeamEmail,
  sendMail,
};
