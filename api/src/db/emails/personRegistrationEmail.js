const ejs = require('ejs');
const i18n = require('../../i18n.config');

module.exports = async function personRegistrationEmail(infos) {
  const {
    completeName,
    eventName,
    locale,
    isFreeOption,
    buttonLink,
  } = infos;

  let text = i18n.__(
    {
      phrase: 'emails.person_registration_text',
      locale,
    },
    completeName,
    eventName,
  );
  if (isFreeOption) {
    text = i18n.__(
      {
        phrase: 'emails.person_registration_text_free',
        locale,
      },
      completeName,
      eventName,
    );
  }

  let buttonText = i18n.__({
    phrase: 'emails.person_registration_button',
    locale,
  });

  if (isFreeOption) {
    buttonText = i18n.__({
      phrase: 'emails.person_registration_button_free',
      locale,
    });
  }

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
