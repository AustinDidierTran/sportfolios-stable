const ejs = require('ejs');
const i18n = require('../../i18n.config');
const {
  TABS_ENUM,
  ROUTES_ENUM,
} = require('../../../../common/enums');
const {
  formatRoute,
} = require('../../../../common/utils/stringFormat');
const { formatLinkWithAuthToken } = require('./utils');

module.exports = async function AddedToRosterEmail(infos) {
  const { name, teamName, eventId, locale, userId } = infos;

  const buttonLink = await formatLinkWithAuthToken(
    userId,
    formatRoute(
      ROUTES_ENUM.entity,
      { id: eventId },
      { tab: TABS_ENUM.ROSTERS },
    ),
  );
  const text = i18n.__(
    { phrase: 'emails.added_to_roster_text', locale },
    name,
    teamName,
  );
  const buttonText = i18n.__({
    phrase: 'emails.added_to_roster_button',
    locale,
  });
  const subject = i18n.__({
    phrase: 'emails.added_to_roster_subject',
    locale,
  });
  const html = await ejs.renderFile(
    __dirname + '/templates/textAndButton.ejs',
    { buttonLink, text, buttonText },
  );
  return { html, subject };
};
