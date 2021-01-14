const ejs = require('ejs');
const i18n = require('../../i18n.config');
const { formatLinkWithAuthToken } = require('./utils');
const {
  TABS_ENUM,
  ROUTES_ENUM,
} = require('../../../../common/enums');
const {
  formatRoute,
} = require('../../../../common/utils/stringFormat');

module.exports = async function TeamRegistrationToAdminEmail(infos) {
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
    formatRoute(
      ROUTES_ENUM.entity,
      { id: eventId },
      { tab: TABS_ENUM.SETTINGS },
    ),
  );
  let text = '';
  if (placesLeft === 0) {
    text = i18n.__(
      {
        phrase: 'emails.team_registration_to_admin_text_no_spot',
        locale,
      },
      teamName,
      eventName,
    );
  } else if (placesLeft === 1) {
    text = i18n.__(
      {
        phrase: 'emails.team_registration_to_admin_text_one_spot',
        locale,
      },
      teamName,
      eventName,
    );
  } else if (placesLeft > 1) {
    text = i18n.__(
      { phrase: 'emails.team_registration_to_admin_text', locale },
      teamName,
      eventName,
      placesLeft,
    );
  } else {
    text = i18n.__(
      {
        phrase: 'emails.team_registration_to_admin_no_places_text',
        locale,
      },
      teamName,
      eventName,
    );
  }
  const buttonText = i18n.__({
    phrase: 'emails.team_registration_to_admin_button',
    locale,
  });
  const subject = i18n.__({
    phrase: 'emails.team_registration_to_admin_subject',
    locale,
  });
  const html = await ejs.renderFile(
    __dirname + '/templates/textAndButton.ejs',
    { buttonLink, text, buttonText },
  );
  return { html, subject };
};
