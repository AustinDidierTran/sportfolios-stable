const ejs = require('ejs');
const i18n = require('../../i18n.config');
const { formatLinkWithAuthToken } = require('./utils');
const { TABS_ENUM } = require('../../../../common/enums');
module.exports = async function AddedToRoster(infos) {
  const { name, teamName, eventId, locale, userId } = infos;

  const buttonLink = await formatLinkWithAuthToken(
    userId,
    `/${eventId}?tab=${TABS_ENUM.ROSTERS}`,
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
