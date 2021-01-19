const ejs = require('ejs');
const i18n = require('../../i18n.config');
const { formatLinkWithAuthToken } = require('./utils');
const { ROUTES_ENUM } = require('../../../../common/enums');
const {
  formatRoute,
} = require('../../../../common/utils/stringFormat');
module.exports = async function personRegistrationEmail(infos) {
  const { completeName, eventName, eventId, locale, userId } = infos;

  const buttonLink = await formatLinkWithAuthToken(
    userId,
    formatRoute(ROUTES_ENUM.entity, { id: eventId }),
  );

  const text = i18n.__(
    {
      phrase: 'emails.person_registration_text',
      locale,
    },
    completeName,
    eventName,
  );

  const buttonText = i18n.__({
    phrase: 'emails.person_registration_button',
    locale,
  });

  const subject = i18n.__(
    {
      phrase: 'emails.person_registration_subject',
      locale,
    },
    completeName,
  );

  const html = await ejs.renderFile(
    __dirname + '/templates/textAndButton.ejs',
    { buttonLink, text, buttonText },
  );
  return { html, subject };
};
