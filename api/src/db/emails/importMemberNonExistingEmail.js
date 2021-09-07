import ejs from 'ejs';
import i18n from '../../i18n.config.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function importMemberNonExistingEmail(infos) {
  const { organizationName, token, locale, buttonLink } = infos;

  const text = i18n.__(
    {
      phrase: 'emails.import_member_non_existing_text',
      locale,
    },
    organizationName,
    organizationName,
    token,
    token,
    organizationName,
  );

  const buttonText = i18n.__({
    phrase: 'emails.import_member_non_existing_button',
    locale,
  });
  const subject = i18n.__(
    {
      phrase: 'emails.import_member_subject',
      locale,
    },
    organizationName,
  );
  const html = await ejs.renderFile(
    __dirname + '/templates/htmlAndButton.ejs',
    { buttonLink, text, buttonText },
  );
  return { html, subject };
}
