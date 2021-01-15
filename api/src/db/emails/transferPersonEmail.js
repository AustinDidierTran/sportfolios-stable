const ejs = require('ejs');
const i18n = require('../../i18n.config');
const {
  formatRoute,
} = require('../../../../common/utils/stringFormat');
const { CLIENT_BASE_URL } = require('../../../../conf');
const { ROUTES_ENUM } = require('../../../../common/enums');

module.exports = async function transferPersonEmail(infos) {
  const { token, sendedName, senderName, locale } = infos;
  const buttonLink = formatRoute(
    `${CLIENT_BASE_URL}${ROUTES_ENUM.transferPerson}/${token}`,
  );

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
};
