const AddeddToRosterEmail = require('./addedToRosterEmail');
const EmailConfirmationEmail = require('./emailConfirmationEmail');
const PersonRegistrationToAdminEmail = require('./personRegistrationToAdminEmail');
const RecoveryEmail = require('./recoveryEmail');
const ScoreSubmissionRequestEmail = require('./scoreSubmissionRequestEmail');
const SendReceiptEmail = require('./sendReceiptEmail');
const TeamRegistrationToAdminEmail = require('./teamRegistrationToAdminEmail');
const TeamRegistrationEmail = require('./teamRegistrationEmail');
const TransferPersonEmail = require('./transferPersonEmail');
const ImportMemberEmail = require('./importMemberEmail');
const {
  NOTIFICATION_TYPE,
  ROUTES_ENUM,
} = require('./../../../../common/enums');
const ejs = require('ejs');
const i18n = require('../../i18n.config');
const { formatLinkWithAuthToken } = require('./utils');
const map = {
  [NOTIFICATION_TYPE.ADDED_TO_ROSTER]: AddeddToRosterEmail,
  [NOTIFICATION_TYPE.EMAIL_CONFIRMATION]: EmailConfirmationEmail,
  [NOTIFICATION_TYPE.IMPORT_MEMBER]: ImportMemberEmail,
  [NOTIFICATION_TYPE.PERSON_REGISTRATION_TO_ADMIN]: PersonRegistrationToAdminEmail,
  [NOTIFICATION_TYPE.RECOVERY_EMAIL]: RecoveryEmail,
  [NOTIFICATION_TYPE.SCORE_SUBMISSION_REQUEST]: ScoreSubmissionRequestEmail,
  [NOTIFICATION_TYPE.SEND_RECEIPT]: SendReceiptEmail,
  [NOTIFICATION_TYPE.TEAM_REGISTRATION_TO_ADMIN]: TeamRegistrationToAdminEmail,
  [NOTIFICATION_TYPE.TEAM_REGISTRATION]: TeamRegistrationEmail,
  [NOTIFICATION_TYPE.TRANSFER_PERSON]: TransferPersonEmail,
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

  if (infos.withoutFooter) {
    return { html, subject };
  }
  const link = await formatLinkWithAuthToken(
    infos.userId,
    `/page${ROUTES_ENUM.userSettings}#notifications`,
  );
  const unsubscribeFooter = await ejs.renderFile(
    __dirname + '/templates/unsubscribeFooter.ejs',
    { link, text },
  );
  return { html: html + unsubscribeFooter, subject };
};
