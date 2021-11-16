import ejs from 'ejs';
import i18n from '../../i18n.config.js';

export default async function TeamRefusedRegistrationEmail(infos) {
  const { teamName, eventName, locale } = infos;

  const text = i18n.__(
    { phrase: 'emails.team_refused_registration_text', locale },
    eventName,
    teamName,
  );

  const subject = i18n.__(
    {
      phrase: 'emails.team_refused_registration_subject',
      locale,
    },
    teamName,
  );
  const html = await ejs.renderFile(
    __dirname + '/templates/text.ejs',
    { text },
  );
  return { html, subject };
}
