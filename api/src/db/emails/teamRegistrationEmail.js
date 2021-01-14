const ejs = require('ejs');
const i18n = require('../../i18n.config');
const { formatLinkWithAuthToken } = require('./utils');
const {
  ROUTES_ENUM,
  TABS_ENUM,
} = require('../../../../common/enums');
const {
  formatRoute,
} = require('../../../../common/utils/stringFormat');

module.exports = async function TeamRegistrationEmail(infos) {
  const {
    teamName,
    eventName,
    eventId,
    isFreeOption,
    locale,
    userId,
  } = infos;

  let buttonLink = '';
  let text = '';
  let buttonText = '';

  if (isFreeOption) {
    buttonLink = await formatLinkWithAuthToken(
      userId,
      formatRoute(
        ROUTES_ENUM.entity,
        { id: eventId },
        { tab: TABS_ENUM.ROSTERS },
      ),
    );
    text = i18n.__(
      { phrase: 'emails.team_registration_free_text', locale },
      teamName,
      eventName,
    );
    buttonText = i18n.__({
      phrase: 'emails.team_registration_free_button',
      locale,
    });
  } else {
    buttonLink = await formatLinkWithAuthToken(
      userId,
      formatRoute(ROUTES_ENUM.cart),
    );
    text = i18n.__(
      { phrase: 'emails.team_registration_text', locale },
      teamName,
      eventName,
    );
    buttonText = i18n.__({
      phrase: 'emails.team_registration_button',
      locale,
    });
  }

  const subject = i18n.__(
    {
      phrase: 'emails.team_registration_subject',
      locale,
    },
    teamName,
  );
  const html = await ejs.renderFile(
    __dirname + '/templates/textAndButton.ejs',
    { buttonLink, text, buttonText },
  );
  return { html, subject };
};
