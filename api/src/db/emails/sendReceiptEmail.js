const ejs = require('ejs');
const i18n = require('../../i18n.config');
module.exports = async function SendReceiptEmail(infos) {
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
  try {
    const html = await ejs.renderFile(
      __dirname + '/templates/textAndButton.ejs',
      { buttonLink, text, buttonText },
    );
    return { html, subject };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};
