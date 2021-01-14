const ejs = require('ejs');
const i18n = require('../../i18n.config');
const { formatLinkWithAuthToken } = require('./utils');
const { CLIENT_BASE_URL } = require('../../../../conf');
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
      `${CLIENT_BASE_URL}/cart`,
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
      `${CLIENT_BASE_URL}/${eventId}`,
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

  const subject = i18n.__({
    phrase: 'emails.team_registration_subject',
    locale,
    teamName,
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
