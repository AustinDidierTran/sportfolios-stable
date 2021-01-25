const ejs = require('ejs');
const i18n = require('../../i18n.config');

module.exports = async function AddedToRosterEmail(infos) {
  const { name, teamName, locale, buttonLink } = infos;

  const text = i18n.__(
    { phrase: 'emails.added_to_roster_text', locale },
    name,
    teamName,
  );
  const buttonText = i18n.__({
    phrase: 'emails.added_to_roster_button',
    locale,
  });
  const subject = i18n.__({
    phrase: 'emails.added_to_roster_subject',
    locale,
  });
  const html = await ejs.renderFile(
    __dirname + '/templates/textAndButton.ejs',
    { buttonLink, text, buttonText },
  );
  return { html, subject };
};
