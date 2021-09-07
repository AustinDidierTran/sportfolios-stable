import ejs from 'ejs';
import i18n from '../../i18n.config.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
