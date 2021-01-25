const ejs = require('ejs');
const i18n = require('../../i18n.config');

module.exports = async function personRegistrationEmail(infos) {
  const { completeName, eventName, locale, buttonLink } = infos;

  const text = i18n.__(
    {
      phrase: 'emails.person_registration_text',
      locale,
    },
    completeName,
    eventName,
  );

  const buttonText = i18n.__({
    phrase: 'emails.person_registration_button',
    locale,
  });

  const subject = i18n.__(
    {
      phrase: 'emails.person_registration_subject',
      locale,
    },
    completeName,
  );

  const html = await ejs.renderFile(
    __dirname + '/templates/textAndButton.ejs',
    { buttonLink, text, buttonText },
  );
  return { html, subject };
};
