import ejs from 'ejs';
import i18n from '../../i18n.config.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function personRegistrationToAdminEmail(infos) {
  const {
    completeName,
    eventName,
    placesLeft,
    locale,
    buttonLink,
  } = infos;

  let text = '';
  if (placesLeft === 0) {
    text = i18n.__(
      {
        phrase: 'emails.person_registration_to_admin_text_no_spot',
        locale,
      },
      completeName,
      eventName,
    );
  } else if (placesLeft === 1) {
    text = i18n.__(
      {
        phrase: 'emails.person_registration_to_admin_text_one_spot',
        locale,
      },
      completeName,
      eventName,
    );
  } else if (placesLeft > 1) {
    text = i18n.__(
      { phrase: 'emails.person_registration_to_admin_text', locale },
      completeName,
      eventName,
      placesLeft,
    );
  } else {
    text = i18n.__(
      {
        phrase: 'emails.person_registration_to_admin_no_places_text',
        locale,
      },
      completeName,
      eventName,
    );
  }

  const buttonText = i18n.__({
    phrase: 'emails.person_registration_to_admin_button',
    locale,
  });

  const subject = i18n.__({
    phrase: 'emails.person_registration_to_admin_subject',
    locale,
  });
  const html = await ejs.renderFile(
    __dirname + '/templates/textAndButton.ejs',
    { buttonLink, text, buttonText },
  );
  return { html, subject };
}
