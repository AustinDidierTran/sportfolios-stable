const ejs = require('ejs');
const i18n = require('../../i18n.config');

module.exports = async function importMemberEmail(infos) {
  const { organizationName, token, locale, buttonLink } = infos;

  const text = i18n.__(
    {
      phrase: 'emails.import_member_text',
      locale,
    },
    organizationName,
    organizationName,
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
};
