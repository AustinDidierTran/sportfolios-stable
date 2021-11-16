import ejs from 'ejs';
import i18n from '../../i18n.config.js';

export default async function importMemberEmail(infos) {
  const { organizationName, token, locale, buttonLink } = infos;

  const text = i18n.__(
    {
      phrase: 'emails.import_member_text',
      locale,
    },
    organizationName,
    organizationName,
    token,
    token,
    organizationName,
  );
  const buttonText = i18n.__({
    phrase: 'emails.import_member_button',
    locale,
  });
  const subject = i18n.__(
    {
      phrase: 'emails.import_member_subject',
      locale,
    },
    organizationName,
  );

  const html = await ejs.renderFile(
    __dirname + '/templates/htmlAndButton.ejs',
    { buttonLink, text, buttonText },
  );
  return { html, subject };
}
