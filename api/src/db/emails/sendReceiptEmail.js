import ejs from 'ejs';
import i18n from '../../i18n.config.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function SendReceiptEmail(infos) {
  const { receipt, locale } = infos;

  const buttonLink = receipt;
  const text = i18n.__({
    phrase: 'emails.send_receipt_text',
    locale,
  });
  const buttonText = i18n.__({
    phrase: 'emails.send_receipt_button',
    locale,
  });
  const subject = i18n.__({
    phrase: 'emails.send_receipt_subject',
    locale,
  });
  const html = await ejs.renderFile(
    __dirname + '/templates/textAndButton.ejs',
    { buttonLink, text, buttonText },
  );
  return { html, subject };
}
