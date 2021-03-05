const AddedToRosterEmail = require('./addedToRosterEmail');
const CartItemAddedPlayerEmail = require('./cartItemAddedPlayerEmail');
const EmailConfirmationEmail = require('./emailConfirmationEmail');
const PersonRegistrationToAdminEmail = require('./personRegistrationToAdminEmail');
const PersonPendingRegistrationToAdminEmail = require('./personPendingRegistrationToAdminEmail');
const RecoveryEmail = require('./recoveryEmail');
const ScoreSubmissionRequestEmail = require('./scoreSubmissionRequestEmail');
const SendReceiptEmail = require('./sendReceiptEmail');
const TeamRegistrationToAdminEmail = require('./teamRegistrationToAdminEmail');
const TeamRegistrationEmail = require('./teamRegistrationEmail');
const TeamUnregisteredEmail = require('./teamUnregisteredEmail');
const TeamUnregisteredAndRefundedEmail = require('./teamUnregisteredAndRefundedEmail');
const TeamRefusedRegistrationEmail = require('./teamRefusedRegistrationEmail');
const PersonRefusedRegistrationEmail = require('./personRefusedRegistrationEmail');
const TeamPendingRegistrationToAdminEmail = require('./teamPendingRegistrationToAdminEmail');
const PersonRegistrationEmail = require('./personRegistrationEmail');
const TransferPersonEmail = require('./transferPersonEmail');
const ImportMemberEmail = require('./importMemberEmail');
const { NOTIFICATION_TYPE } = require('./../../../../common/enums');
const ejs = require('ejs');
const i18n = require('../../i18n.config');
const map = {
  [NOTIFICATION_TYPE.ADDED_TO_ROSTER]: AddedToRosterEmail,
  [NOTIFICATION_TYPE.CART_ITEM_ADDED_PLAYER]: CartItemAddedPlayerEmail,
  [NOTIFICATION_TYPE.EMAIL_CONFIRMATION]: EmailConfirmationEmail,
  [NOTIFICATION_TYPE.IMPORT_MEMBER]: ImportMemberEmail,
  [NOTIFICATION_TYPE.PERSON_REGISTRATION_TO_ADMIN]: PersonRegistrationToAdminEmail,
  [NOTIFICATION_TYPE.PERSON_PENDING_REGISTRATION_TO_ADMIN]: PersonPendingRegistrationToAdminEmail,
  [NOTIFICATION_TYPE.RECOVERY_EMAIL]: RecoveryEmail,
  [NOTIFICATION_TYPE.SCORE_SUBMISSION_REQUEST]: ScoreSubmissionRequestEmail,
  [NOTIFICATION_TYPE.SEND_RECEIPT]: SendReceiptEmail,
  [NOTIFICATION_TYPE.TEAM_REGISTRATION_TO_ADMIN]: TeamRegistrationToAdminEmail,
  [NOTIFICATION_TYPE.PERSON_REGISTRATION]: PersonRegistrationEmail,
  [NOTIFICATION_TYPE.TEAM_REGISTRATION]: TeamRegistrationEmail,
  [NOTIFICATION_TYPE.TEAM_UNREGISTERED]: TeamUnregisteredEmail,
  [NOTIFICATION_TYPE.TEAM_UNREGISTERED_AND_REFUNDED]: TeamUnregisteredAndRefundedEmail,
  [NOTIFICATION_TYPE.TEAM_REFUSED_REGISTRATION]: TeamRefusedRegistrationEmail,
  [NOTIFICATION_TYPE.PERSON_REFUSED_REGISTRATION]: PersonRefusedRegistrationEmail,
  [NOTIFICATION_TYPE.TEAM_PENDING_REGISTRATION_ADMIN]: TeamPendingRegistrationToAdminEmail,
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

  const unsubscribeFooter = await ejs.renderFile(
    __dirname + '/templates/unsubscribeFooter.ejs',
    { link: infos.footerLink, text },
  );
  return { html: html + unsubscribeFooter, subject };
};
