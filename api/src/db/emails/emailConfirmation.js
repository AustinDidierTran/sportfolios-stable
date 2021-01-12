const ejs = require('ejs');
const i18n = require('../../i18n.config');
const { formatLinkWithAuthToken } = require('./utils');
const { TABS_ENUM } = require('../../../../common/enums');
module.exports = async function AddedToRoster(infos) {
  const { token, successRoute, locale } = infos;
  let buttonLink = '';
  if (successRoute) {
    buttonlink = `${CLIENT_BASE_URL}/confirmEmail/${token}?successRoute=${successRoute}`;
  } else {
    buttonlink = `${CLIENT_BASE_URL}/confirmEmail/${token}`;
  }
  const text = i18n.__({
    phrase: 'emails.email_confirmation_text',
    locale,
  });
  const buttonText = i18n.__({
    phrase: 'emails.email_confirmation_button',
    locale,
  });
  const subject = i18n.__({
    phrase: 'emails.email_confirmation_subject',
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
