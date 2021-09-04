import ejs from 'ejs';
import i18n from '../../i18n.config.js';

export default async function RecoveryEmail(infos) {
  const { locale, buttonLink } = infos;

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
  const html = await ejs.renderFile(
    __dirname + '/templates/textAndButton.ejs',
    { buttonLink, text, buttonText },
  );
  return { html, subject };
};
