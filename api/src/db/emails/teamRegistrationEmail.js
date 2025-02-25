import ejs from 'ejs';
import i18n from '../../i18n.config.js';

export default async function TeamRegistrationEmail(infos) {
  const {
    teamName,
    eventName,
    isFreeOption,
    locale,
    buttonLink,
  } = infos;

  let text = '';
  let buttonText = '';

  if (isFreeOption) {
    text = i18n.__(
      { phrase: 'emails.team_registration_free_text', locale },
      teamName,
      eventName,
    );
    buttonText = i18n.__({
      phrase: 'emails.team_registration_free_button',
      locale,
    });
  } else {
    text = i18n.__(
      { phrase: 'emails.team_registration_text', locale },
      teamName,
      eventName,
    );
    buttonText = i18n.__({
      phrase: 'emails.team_registration_button',
      locale,
    });
  }

  const subject = i18n.__(
    {
      phrase: 'emails.team_registration_subject',
      locale,
    },
    teamName,
  );
  const html = await ejs.renderFile(
    __dirname + '/templates/textAndButton.ejs',
    { buttonLink, text, buttonText },
  );
  return { html, subject };
}
