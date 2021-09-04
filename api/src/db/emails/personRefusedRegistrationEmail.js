import ejs from 'ejs';
import i18n from '../../i18n.config.js';

export default async function PersonRefusedRegistrationEmail(
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
