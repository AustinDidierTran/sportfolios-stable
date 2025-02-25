import ejs from 'ejs';
import i18n from '../../i18n.config.js';

export default async function TeamUnregisteredEmail(infos) {
  const { teamName, eventName, locale, buttonLink } = infos;

  const text = i18n.__(
    { phrase: 'emails.team_unregistered_text', locale },
    eventName,
    teamName,
  );

  const subject = i18n.__(
    {
      phrase: 'emails.team_unregistered_subject',
      locale,
    },
    teamName,
  );
  const buttonText = i18n.__({
    phrase: 'emails.team_unregistered_button',
    locale,
  });

  const html = await ejs.renderFile(
    __dirname + '/templates/textAndButton.ejs',
    { buttonLink, text, buttonText },
  );
  return { html, subject };
}
