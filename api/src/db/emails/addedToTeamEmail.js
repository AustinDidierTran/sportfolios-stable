import ejs from 'ejs';
import i18n from '../../i18n.config.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function AddedToTeamEmail(infos) {
  const { teamName, locale, buttonLink } = infos;

  const text = i18n.__(
    { phrase: 'emails.added_to_team_text', locale },
    teamName,
  );
  const buttonText = i18n.__({
    phrase: 'emails.added_to_team_button',
    locale,
  });
  const subject = i18n.__({
    phrase: 'emails.added_to_team_subject',
    locale,
  });
  const html = await ejs.renderFile(
    __dirname + '/templates/textAndButton.ejs',
    { buttonLink, text, buttonText },
  );
  return { html, subject };
}
