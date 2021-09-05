import ejs from 'ejs';
import i18n from '../../i18n.config.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function CartItemAddedPlayerEmail(infos) {
  console.log('d', 1);
  const { teamName, eventName, locale, buttonLink } = infos;

  console.log(infos);

  const text = i18n.__(
    { phrase: 'emails.cart_item_added_player_text', locale },
    teamName,
    eventName,
  );
  console.log('d', 2);
  const buttonText = i18n.__({
    phrase: 'emails.cart_item_added_player_button',
    locale,
  });
  console.log('d', 3);
  const subject = i18n.__({
    phrase: 'emails.cart_item_added_player_subject',
    locale,
  });
  console.log('d', 4);
  const html = await ejs.renderFile(
    __dirname + '/templates/textAndButton.ejs',
    { buttonLink, text, buttonText },
  );
  console.log('d', 5);
  return { html, subject };
}
