const ejs = require('ejs');
const i18n = require('../../i18n.config');
const { formatLinkWithAuthToken } = require('./utils');
const { CLIENT_BASE_URL } = require('../../../../conf');
module.exports = async function personRegistrationToAdminEmail(
  infos,
) {
  const {
    teamName,
    eventName,
    eventId,
    placesLeft,
    locale,
    userId,
  } = infos;

  const buttonLink = await formatLinkWithAuthToken(
    userId,
    `${CLIENT_BASE_URL}/${eventId}?tab=settings`,
  );
  let text = '';
  if (placesLeft === 0) {
    text = i18n.__(
      {
        phrase: 'emails.person_registration_to_admin_text_no_spot',
        locale,
      },
      eventName,
      teamName,
    );
  }
  if (placesLeft === 1) {
    text = i18n.__(
      {
        phrase: 'emails.person_registration_to_admin_text_one_spot',
        locale,
      },
      eventName,
      teamName,
    );
  }
  if (placesLeft > 1) {
    text = i18n.__(
      { phrase: 'emails.person_registration_to_admin_text', locale },
      eventName,
      teamName,
      placesLeft,
    );
  }
  const buttonText = i18n.__({
    phrase: 'emails.person_registration_to_admin_button',
    locale,
  });
  const subject = i18n.__({
    phrase: 'emails.person_registration_to_admin_subject',
    locale,
  });
  try {
    const html = await ejs.renderFile(
      __dirname + '/templates/textAndButton.ejs',
      { buttonLink, text, buttonText },
    );
    return { html, subject };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};
