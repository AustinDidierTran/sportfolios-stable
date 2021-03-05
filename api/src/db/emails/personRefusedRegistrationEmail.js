const ejs = require('ejs');
const i18n = require('../../i18n.config');

module.exports = async function PersonRefusedRegistrationEmail(
  infos,
) {
  const { personName, eventName, locale } = infos;

  const text = i18n.__(
    { phrase: 'emails.person_refused_registration_text', locale },
    eventName,
    personName,
  );

  const subject = i18n.__(
    {
      phrase: 'emails.person_refused_registration_subject',
      locale,
    },
    personName,
  );
  const html = await ejs.renderFile(
    __dirname + '/templates/text.ejs',
    { text },
  );
  return { html, subject };
};
