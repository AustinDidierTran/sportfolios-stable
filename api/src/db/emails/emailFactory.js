const AddeddToRoster = require('./addedToRoster');
const ScoreSubmissionRequest = require('./scoreSubmissionRequest');
const {
  NOTIFICATION_TYPE,
  ROUTES_ENUM,
} = require('./../../../../common/enums');
const ejs = require('ejs');
const i18n = require('../../i18n.config');
const { formatLinkWithAuthToken } = require('./utils');
const map = {
  [NOTIFICATION_TYPE.ADDED_TO_ROSTER]: AddeddToRoster,
  [NOTIFICATION_TYPE.SCORE_SUBMISSION_REQUEST]: ScoreSubmissionRequest,
};

module.exports = async function EmailFactory(infos) {
  const { type, ...otherInfos } = infos;
  const emailTemplate = map[type];
  if (!emailTemplate) {
    // eslint-disable-next-line no-console
    console.error(
      `Email type ${type} not implemented in emailFactory`,
    );
    return;
  }
  const { html, subject } = await emailTemplate(otherInfos);
  const text = i18n.__({
    phrase: 'emails.unsubscribe_footer',
    locale: infos.locale,
  });
  const link = await formatLinkWithAuthToken(
    infos.userId,
    `${ROUTES_ENUM.userSettings}#notifications`,
  );
  const unsubscribeFooter = await ejs.renderFile(
    __dirname + '/templates/unsubscribeFooter.ejs',
    { link, text },
  );
  return { html: html + unsubscribeFooter, subject };
};
