const ejs = require('ejs');
const i18n = require('../../i18n.config');
const { CLIENT_BASE_URL } = require('../../../../conf');

module.exports = async function AddedToRoster(infos) {
  const { name, eventName, eventId, gameId, locale } = infos;
  const buttonLink = `${CLIENT_BASE_URL}/${eventId}?tab=schedule&game=${gameId}`;
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
