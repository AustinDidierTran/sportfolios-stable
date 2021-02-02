const ejs = require('ejs');
const i18n = require('../../i18n.config');

module.exports = async function TeamPendingRegistrationToAdminEmail(
  infos,
) {
  const { teamName, eventName, locale, buttonLink } = infos;

  const text = i18n.__(
    {
      phrase: 'emails.team_registration_pending_to_admin_text',
      locale,
    },
    teamName,
    eventName,
  );

  const buttonText = i18n.__({
    phrase: 'emails.team_registration_to_admin_button',
    locale,
  });

  const subject = i18n.__(
    {
      phrase: 'emails.team_registration_to_admin_subject',
      locale,
    },
    teamName,
  );
  const html = await ejs.renderFile(
    __dirname + '/templates/textAndButton.ejs',
    { buttonLink, text, buttonText },
  );
  return { html, subject };
};
