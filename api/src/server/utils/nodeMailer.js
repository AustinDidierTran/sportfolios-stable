const nodemailer = require('nodemailer');
const { NOTIFICATION_TYPE } = require('../../../../common/enums');
const emailFactory = require('../../db/emails/emailFactory');

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
async function sendMail({ email: emailProps, subject, text, html }) {
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
    let email = emailProps;
    if (process.env.NODE_ENV === 'development') {
      email = process.env.YOUR_EMAIL;
    }
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

async function sendConfirmationEmail({
  email,
  language,
  token,
  successRoute,
}) {
  const fullEmail = await emailFactory({
    type: NOTIFICATION_TYPE.EMAIL_CONFIRMATION,
    token,
    successRoute,
    locale: language,
    withoutFooter: true,
  });

  if (!fullEmail) {
    return;
  }
  const { html, subject, text } = fullEmail;
  sendMail({ html, email, subject, text });
}

const sendPersonTransferEmail = async ({
  email,
  sendedName,
  senderName,
  language,
  token,
}) => {
  const fullEmail = await emailFactory({
    type: NOTIFICATION_TYPE.TRANSFER_PERSON,
    token,
    sendedName,
    senderName,
    locale: language,
    withoutFooter: true,
  });

  if (!fullEmail) {
    return;
  }
  const { html, subject, text } = fullEmail;
  sendMail({ html, email, subject, text });
  return fullEmail;
};

const sendAddPersonToTeamEmail = async ({
  email,
  teamName,
  senderName,
  language,
  token,
  eventId,
  userId,
}) => {
  const fullEmail = await emailFactory({
    type: NOTIFICATION_TYPE.ADDED_TO_ROSTER,
    name: senderName,
    teamName,
    locale: language,
    token,
    eventId,
    userId,
  });

  if (!fullEmail) {
    return;
  }

  const { html, subject, text } = fullEmail;
  sendMail({ html, email, subject, text });
};

async function sendReceiptEmail({
  email,
  receipt,
  language,
  userId,
}) {
  const fullEmail = await emailFactory({
    type: NOTIFICATION_TYPE.SEND_RECEIPT,
    receipt,
    locale: language,
    userId,
  });
  if (!fullEmail) {
    return;
  }
  const { html, subject, text } = fullEmail;
  sendMail({ html, email, subject, text });
}

async function sendTeamRegistrationEmailToAdmin({
  email,
  team,
  event,
  placesLeft,
  language,
  userId,
}) {
  const fullEmail = await emailFactory({
    type: NOTIFICATION_TYPE.TEAM_REGISTRATION_TO_ADMIN,
    teamName: team.name,
    eventName: event.name,
    eventId: event.id,
    placesLeft,
    locale: language,
    userId,
  });

  if (!fullEmail) {
    return;
  }
  const { html, subject, text } = fullEmail;
  sendMail({ html, email, subject, text });
}

async function sendPersonRegistrationEmailToAdmin({
  email,
  person,
  event,
  placesLeft,
  language,
  userId,
}) {
  const fullEmail = await emailFactory({
    type: NOTIFICATION_TYPE.PERSON_REGISTRATION_TO_ADMIN,
    completeName: person.complete_name,
    eventName: event.name,
    eventId: event.id,
    placesLeft,
    locale: language,
    userId,
  });

  if (!fullEmail) {
    return;
  }
  const { html, subject, text } = fullEmail;
  sendMail({ html, email, subject, text });
}

async function sendAcceptedRegistrationEmail({
  email,
  team,
  event,
  language,
  isFreeOption,
  userId,
}) {
  const fullEmail = await emailFactory({
    type: NOTIFICATION_TYPE.TEAM_REGISTRATION,
    teamName: team.name,
    eventName: event.name,
    eventId: event.id,
    isFreeOption,
    locale: language,
    userId,
  });

  if (!fullEmail) {
    return;
  }
  const { html, subject, text } = fullEmail;
  sendMail({ html, email, subject, text });
}

async function sendRecoveryEmail({ email, token, language }) {
  const fullEmail = await emailFactory({
    type: NOTIFICATION_TYPE.RECOVERY_EMAIL,
    locale: language,
    token,
    email,
    withoutFooter: true,
  });

  if (!fullEmail) {
    return;
  }
  const { html, subject, text } = fullEmail;
  sendMail({ html, email, subject, text });
}
async function sendImportMemberEmail({
  email,
  token,
  language,
  organizationName,
  userId,
}) {
  const fullEmail = await emailFactory({
    type: NOTIFICATION_TYPE.IMPORT_MEMBER,
    locale: language,
    organizationName,
    token,
    userId,
  });

  if (!fullEmail) {
    return;
  }
  const { html, subject, text } = fullEmail;
  sendMail({ html, email, subject, text });
}

module.exports = {
  sendConfirmationEmail,
  sendRecoveryEmail,
  sendReceiptEmail,
  sendAcceptedRegistrationEmail,
  sendTeamRegistrationEmailToAdmin,
  sendPersonRegistrationEmailToAdmin,
  sendPersonTransferEmail,
  sendAddPersonToTeamEmail,
  sendImportMemberEmail,
  sendMail,
};
