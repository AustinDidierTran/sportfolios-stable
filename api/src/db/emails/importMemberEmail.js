const ejs = require('ejs');
const i18n = require('../../i18n.config');
const { formatLinkWithAuthToken } = require('./utils');
const { CLIENT_BASE_URL } = require('../../../../conf');

module.exports = async function importMemberEmail(infos) {
  const { organizationName, token, locale, userId } = infos;

  const buttonLink = await formatLinkWithAuthToken(
    userId,
    `${CLIENT_BASE_URL}/userSettings`,
  );

  const text = i18n.__({
    phrase: 'emails.import_member_text',
    locale,
    organizationName,
    token,
  });
  const buttonText = i18n.__({
    phrase: 'emails.import_member_button',
    locale,
  });
  const subject = i18n.__({
    phrase: 'emails.import_member_subject',
    locale,
    organizationName,
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
