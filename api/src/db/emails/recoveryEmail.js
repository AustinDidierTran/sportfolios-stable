const ejs = require('ejs');
const i18n = require('../../i18n.config');
const { CLIENT_BASE_URL } = require('../../../../conf');

module.exports = async function RecoveryEmail(infos) {
  const { token, locale, email } = infos;

  const buttonLink = `${CLIENT_BASE_URL}/page/recoveryEmail?token=${token}&email=${email}`;

  const text = i18n.__({
    phrase: 'emails.recovery_email_text',
    locale,
  });
  const buttonText = i18n.__({
    phrase: 'emails.recovery_email_button',
    locale,
  });
  const subject = i18n.__({
    phrase: 'emails.recovery_email_subject',
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
