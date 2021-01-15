const ejs = require('ejs');
const i18n = require('../../i18n.config');
const { formatLinkWithAuthToken } = require('./utils');
const { TABS_ENUM } = require('../../../../common/enums');
module.exports = async function AddedToRosterEmail(infos) {
  const { name, eventName, eventId, gameId, locale, userId } = infos;
  const buttonLink = await formatLinkWithAuthToken(
    userId,
    formatRoute(
      ROUTES_ENUM.entity,
      { id: eventId },
      { tab: TABS_ENUM.SCHEDULE, game: gameId },
    ),
  );
  const text = i18n.__(
    { phrase: 'emails.score_submission_request_text', locale },
    name,
    eventName,
  );
  const buttonText = i18n.__({
    phrase: 'emails.score_submission_request_button',
    locale,
  });
  const subject = i18n.__({
    phrase: 'emails.score_submission_request_subject',
    locale,
  });
  const html = await ejs.renderFile(
    __dirname + '/templates/textAndButton.ejs',
    { buttonLink, text, buttonText },
  );
  return { html, subject };
};
