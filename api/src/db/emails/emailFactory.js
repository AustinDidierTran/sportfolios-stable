import AddedToEventEmail from './addedToEventEmail.js';
import AddedToTeamEmail from './addedToTeamEmail.js';
import CartItemAddedPlayerEmail from './cartItemAddedPlayerEmail.js';
import EmailConfirmationEmail from './emailConfirmationEmail.js';
import PersonRegistrationToAdminEmail from './personRegistrationToAdminEmail.js';
import PersonPendingRegistrationToAdminEmail from './personPendingRegistrationToAdminEmail.js';
import RecoveryEmail from './recoveryEmail.js';
import OtherTeamSubmittedScore from './otherTeamSubmittedScore.js';
import ScoreSubmissionRequestEmail from './scoreSubmissionRequestEmail.js';
import SendReceiptEmail from './sendReceiptEmail.js';
import TeamRegistrationToAdminEmail from './teamRegistrationToAdminEmail.js';
import TeamRegistrationEmail from './teamRegistrationEmail.js';
import TeamUnregisteredEmail from './teamUnregisteredEmail.js';
import TeamUnregisteredAndRefundedEmail from './teamUnregisteredAndRefundedEmail.js';
import TeamRefusedRegistrationEmail from './teamRefusedRegistrationEmail.js';
import PersonRefusedRegistrationEmail from './personRefusedRegistrationEmail.js';
import TeamPendingRegistrationToAdminEmail from './teamPendingRegistrationToAdminEmail.js';
import PersonRegistrationEmail from './personRegistrationEmail.js';
import TransferPersonEmail from './transferPersonEmail.js';
import ImportMemberEmail from './importMemberEmail.js';
import ImportMemberNonExistingEmail from './importMemberNonExistingEmail.js';
import { NOTIFICATION_TYPE } from './../../../../common/enums/index.js';
import ejs from 'ejs';
import i18n from '../../i18n.config.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const map = {
  [NOTIFICATION_TYPE.ADDED_TO_EVENT]: AddedToEventEmail,
  [NOTIFICATION_TYPE.ADDED_TO_TEAM]: AddedToTeamEmail,
  [NOTIFICATION_TYPE.CART_ITEM_ADDED_PLAYER]: CartItemAddedPlayerEmail,
  [NOTIFICATION_TYPE.EMAIL_CONFIRMATION]: EmailConfirmationEmail,
  [NOTIFICATION_TYPE.IMPORT_MEMBER]: ImportMemberEmail,
  [NOTIFICATION_TYPE.IMPORT_MEMBER_NON_EXISTING]: ImportMemberNonExistingEmail,
  [NOTIFICATION_TYPE.PERSON_REGISTRATION_TO_ADMIN]: PersonRegistrationToAdminEmail,
  [NOTIFICATION_TYPE.PERSON_PENDING_REGISTRATION_TO_ADMIN]: PersonPendingRegistrationToAdminEmail,
  [NOTIFICATION_TYPE.RECOVERY_EMAIL]: RecoveryEmail,
  [NOTIFICATION_TYPE.OTHER_TEAM_SUBMITTED_A_SCORE]: OtherTeamSubmittedScore,
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

export default async function EmailFactory(infos) {
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
}
