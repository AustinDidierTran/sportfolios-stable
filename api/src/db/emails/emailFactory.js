const AddeddToRoster = require('./addedToRoster');
const { NOTIFICATION_TYPE } = require('./../../../../common/enums');
const { CLIENT_BASE_URL } = require('../../../../conf');
const ejs = require('ejs');
const i18n = require('../../i18n.config');

const map = {
  [NOTIFICATION_TYPE.ADDED_TO_ROSTER]: AddeddToRoster,
};

module.exports = async function EmailFactory(infos) {
  const { type, ...otherInfos } = infos;
  const emailTemplate = map[type];
  const { html, subject } = await emailTemplate(otherInfos);
  const text = i18n.__({
    phrase: 'emails.unsubscribe_footer',
    locale: infos.locale,
  });
  const link = `${CLIENT_BASE_URL}/userSettings#notifications`;
  const unsubscribeFooter = await ejs.renderFile(
    __dirname + '/templates/unsubscribeFooter.ejs',
    { link, text },
  );
  return { html: html + unsubscribeFooter, subject };
};
