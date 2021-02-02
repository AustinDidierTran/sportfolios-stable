const nodemailer = require('nodemailer');
const {
  NOTIFICATION_TYPE,
  ROUTES_ENUM,
  TABS_ENUM,
} = require('../../../../common/enums');
const {
  formatRoute,
  formatClientRoute,
} = require('../../../../common/utils/stringFormat');
const emailFactory = require('../../db/emails/emailFactory');

const {
  formatLinkWithAuthToken,
  formatFooterLink,
} = require('../../db/emails/utils');
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
  redirectUrl,
}) {
  let buttonLink = '';
  if (redirectUrl) {
    buttonlink = formatClientRoute(
      ROUTES_ENUM.confirmEmail,
      { token },
      { redirectUrl },
    );
  } else {
    buttonLink = formatClientRoute(ROUTES_ENUM.confirmEmail, {
      token,
    });
  }
  const fullEmail = await emailFactory({
    type: NOTIFICATION_TYPE.EMAIL_CONFIRMATION,
    locale: language,
    buttonLink,
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
  const buttonLink = formatClientRoute(ROUTES_ENUM.transferPerson, {
    token,
  });

  const fullEmail = await emailFactory({
    type: NOTIFICATION_TYPE.TRANSFER_PERSON,
    token,
    sendedName,
    senderName,
    locale: language,
    buttonLink,
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
  eventId,
  userId,
}) => {
  const footerLink = formatFooterLink(userId);

  const buttonLink = await formatLinkWithAuthToken(
    userId,
    formatRoute(
      ROUTES_ENUM.entity,
      { id: eventId },
      { tab: TABS_ENUM.ROSTERS },
    ),
  );

  const fullEmail = await emailFactory({
    type: NOTIFICATION_TYPE.ADDED_TO_ROSTER,
    name: senderName,
    teamName,
    locale: language,
    buttonLink,
    footerLink,
  });

  if (!fullEmail) {
    return;
  }

  const { html, subject, text } = fullEmail;
  sendMail({ html, email, subject, text });
};

const sendCartItemAddedPlayerEmail = async ({
  email,
  teamName,
  eventName,
  language,
  userId,
}) => {
  const footerLink = formatFooterLink(userId);

  const buttonLink = await formatLinkWithAuthToken(
    userId,
    formatRoute(ROUTES_ENUM.cart),
  );

  const fullEmail = await emailFactory({
    type: NOTIFICATION_TYPE.CART_ITEM_ADDED_PLAYER,
    teamName,
    eventName,
    locale: language,
    buttonLink,
    footerLink,
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
  const footerLink = formatFooterLink(userId);

  const fullEmail = await emailFactory({
    type: NOTIFICATION_TYPE.SEND_RECEIPT,
    receipt,
    locale: language,
    footerLink,
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
  const footerLink = formatFooterLink(userId);

  const buttonLink = await formatLinkWithAuthToken(
    userId,
    formatRoute(
      ROUTES_ENUM.entity,
      { id: event.id },
      { tab: TABS_ENUM.SETTINGS },
    ),
  );
  const fullEmail = await emailFactory({
    type: NOTIFICATION_TYPE.TEAM_REGISTRATION_TO_ADMIN,
    teamName: team.name,
    eventName: event.name,
    placesLeft,
    locale: language,
    buttonLink,
    footerLink,
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
  const footerLink = formatFooterLink(userId);

  const buttonLink = await formatLinkWithAuthToken(
    userId,
    formatRoute(
      ROUTES_ENUM.entity,
      { id: event.id },
      { tab: TABS_ENUM.SETTINGS },
    ),
  );
  const fullEmail = await emailFactory({
    type: NOTIFICATION_TYPE.PERSON_REGISTRATION_TO_ADMIN,
    completeName: person.complete_name,
    eventName: event.name,
    placesLeft,
    locale: language,
    buttonLink,
    footerLink,
  });

  if (!fullEmail) {
    return;
  }
  const { html, subject, text } = fullEmail;
  sendMail({ html, email, subject, text });
}

async function sendTeamAcceptedRegistrationEmail({
  email,
  team,
  event,
  language,
  isFreeOption,
  userId,
}) {
  const footerLink = formatFooterLink(userId);

  let buttonLink = '';
  if (isFreeOption) {
    buttonLink = await formatLinkWithAuthToken(
      userId,
      formatRoute(
        ROUTES_ENUM.entity,
        { id: event.id },
        { tab: TABS_ENUM.ROSTERS },
      ),
    );
  } else {
    buttonLink = await formatLinkWithAuthToken(
      userId,
      formatRoute(ROUTES_ENUM.cart),
    );
  }
  const fullEmail = await emailFactory({
    type: NOTIFICATION_TYPE.TEAM_REGISTRATION,
    teamName: team.name,
    eventName: event.name,
    isFreeOption,
    locale: language,
    buttonLink,
    footerLink,
  });

  if (!fullEmail) {
    return;
  }
  const { html, subject, text } = fullEmail;
  sendMail({ html, email, subject, text });
}
async function sendTeamPendingRegistrationEmailToAdmin({
  email,
  team,
  event,
  language,
  userId,
}) {
  const footerLink = formatFooterLink(userId);

  let buttonLink = '';
  if (isFreeOption) {
    buttonLink = await formatLinkWithAuthToken(
      userId,
      formatRoute(
        ROUTES_ENUM.entity,
        { id: event.id },
        { tab: TABS_ENUM.ROSTERS },
      ),
    );
  } else {
    buttonLink = await formatLinkWithAuthToken(
      userId,
      formatRoute(ROUTES_ENUM.cart),
    );
  }
  const fullEmail = await emailFactory({
    type: NOTIFICATION_TYPE.TEAM_PENDING_REGISTRATION_ADMIN,
    teamName: team.name,
    eventName: event.name,
    locale: language,
    buttonLink,
    footerLink,
  });

  if (!fullEmail) {
    return;
  }
  const { html, subject, text } = fullEmail;
  sendMail({ html, email, subject, text });
}

async function sendPersonRegistrationEmail({
  email,
  person,
  event,
  language,
  userId,
}) {
  const footerLink = formatFooterLink(userId);

  const buttonLink = await formatLinkWithAuthToken(
    userId,
    formatRoute(ROUTES_ENUM.entity, { id: event.id }),
  );

  const fullEmail = await emailFactory({
    type: NOTIFICATION_TYPE.PERSON_REGISTRATION,
    completeName: person.complete_name,
    eventName: event.name,
    locale: language,
    buttonLink,
    footerLink,
  });

  if (!fullEmail) {
    return;
  }
  const { html, subject, text } = fullEmail;
  sendMail({ html, email, subject, text });
}

async function sendRecoveryEmail({ email, token, language }) {
  const buttonLink = formatClientRoute(
    ROUTES_ENUM.recoveryEmail,
    null,
    { token, email },
  );

  const fullEmail = await emailFactory({
    type: NOTIFICATION_TYPE.RECOVERY_EMAIL,
    locale: language,
    buttonLink,
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
  const footerLink = formatFooterLink(userId);

  const buttonLink = await formatLinkWithAuthToken(
    userId,
    `${ROUTES_ENUM.userSettings}`,
  );
  const fullEmail = await emailFactory({
    type: NOTIFICATION_TYPE.IMPORT_MEMBER,
    locale: language,
    organizationName,
    token,
    buttonLink,
    footerLink,
  });

  if (!fullEmail) {
    return;
  }
  const { html, subject, text } = fullEmail;
  sendMail({ html, email, subject, text });
}

module.exports = {
  sendAddPersonToTeamEmail,
  sendConfirmationEmail,
  sendImportMemberEmail,
  sendMail,
  sendPersonRegistrationEmail,
  sendPersonRegistrationEmailToAdmin,
  sendPersonTransferEmail,
  sendReceiptEmail,
  sendRecoveryEmail,
  sendTeamAcceptedRegistrationEmail,
  sendTeamPendingRegistrationEmailToAdmin,
  sendTeamRegistrationEmailToAdmin,
};
