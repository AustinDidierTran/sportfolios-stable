import ejs from 'ejs';
import i18n from '../../i18n.config.js';

export default async function CartItemAddedPlayerEmail(infos) {
  const { teamName, eventName, locale, buttonLink } = infos;

  const text = i18n.__(
    { phrase: 'emails.cart_item_added_player_text', locale },
    teamName,
    eventName,
  );
  const buttonText = i18n.__({
    phrase: 'emails.cart_item_added_player_button',
    locale,
  });
  const subject = i18n.__({
    phrase: 'emails.cart_item_added_player_subject',
    locale,
  });
  const html = await ejs.renderFile(
    __dirname + '/templates/textAndButton.ejs',
    { buttonLink, text, buttonText },
  );
  return { html, subject };
};
