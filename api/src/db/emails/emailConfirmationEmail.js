const ejs = require('ejs');
const i18n = require('../../i18n.config');
const { ROUTES_ENUM } = require('../../../../common/enums');
const {
  formatClientRoute,
} = require('../../../../common/utils/stringFormat');

module.exports = async function emailConfirmationEmail(infos) {
  const { token, redirectUrl, locale } = infos;
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
  const html = await ejs.renderFile(
    __dirname + '/templates/textAndButton.ejs',
    { buttonLink, text, buttonText },
  );
  return { html, subject };
};
