import ejs from 'ejs';
import i18n from '../../i18n.config.js';

export default async function transferPersonEmail(infos) {
  const { sendedName, senderName, buttonLink, locale } = infos;

  const text = i18n.__(
    {
      phrase: 'emails.transfer_person_text',
      locale,
    },
    senderName,
    sendedName,
  );
  const buttonText = i18n.__({
    phrase: 'emails.transfer_person_button',
    locale,
  });
  const subject = i18n.__(
    {
      phrase: 'emails.transfer_person_subject',
      locale,
    },
    senderName,
  );
  const html = await ejs.renderFile(
    __dirname + '/templates/textAndButton.ejs',
    { buttonLink, text, buttonText },
  );
  return { html, subject };
}
