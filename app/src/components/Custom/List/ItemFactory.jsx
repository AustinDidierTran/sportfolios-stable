import {
  GLOBAL_ENUM,
  LIST_ITEM_ENUM,
  NOTIFICATION_TYPE,
} from '../../../../../common/enums';
import AppItem from './AppItem';
import BankAccountItem from './BankAccountItem';
import CartItem from './CartItem';
import CreditCardItem from './CreditCardItem';
import DefaultItem from './DefaultItem';
import EventCreatorItem from './EventCreatorItem';
import EventItem from './EventItem';
import EventPaymentOptionItem from './EventPaymentOptionItem';
import MemberItem from './MemberItem';
import MembershipDetailItem from './MembershipDetailItem';
import MembershipItem from './MembershipItem';
import MembershipOrganizationItem from './MembershipOrganizationItem';
import OrganizationItem from './OrganizationItem';
import PaymentOptionItem from './PaymentOptionItem';
import PersonItem from './PersonItem';
import PurchasesItem from './PurchasesItem';
import RankingItem from './RankingItem';
import RankingWithStatsItem from './RankingWithStatsItem';
import ReportItemFactory from './ReportItemFactory';
import RosterItem from './RosterItem';
import SalesItem from './SalesItem';
import TeamItem from './TeamItem';
import {
  RosterNotification,
  ScoreSubmissionRequestNotification,
  ConfirmOrDeclineScoreNotification,
} from './NotificationItems';
import { AvatarAndTextSkeleton } from './SkeletonItems';
import NotificationSettingItem from './NotificationSettingItem';

const ItemMap = {
  [GLOBAL_ENUM.EVENT]: EventItem,
  [GLOBAL_ENUM.ORGANIZATION]: OrganizationItem,
  [GLOBAL_ENUM.PERSON]: PersonItem,
  [GLOBAL_ENUM.TEAM]: TeamItem,
  [LIST_ITEM_ENUM.APP_ITEM]: AppItem,
  [LIST_ITEM_ENUM.AVATAR_TEXT_SKELETON]: AvatarAndTextSkeleton,
  [LIST_ITEM_ENUM.BANK_ACCOUNT]: BankAccountItem,
  [LIST_ITEM_ENUM.CART]: CartItem,
  [LIST_ITEM_ENUM.CREDIT_CARD]: CreditCardItem,
  [LIST_ITEM_ENUM.EVENT_CREATOR]: EventCreatorItem,
  [LIST_ITEM_ENUM.EVENT_PAYMENT_OPTION]: EventPaymentOptionItem,
  [LIST_ITEM_ENUM.MEMBER]: MemberItem,
  [LIST_ITEM_ENUM.MEMBERSHIP_DETAIL]: MembershipDetailItem,
  [LIST_ITEM_ENUM.MEMBERSHIP_ORGANIZATION]: MembershipOrganizationItem,
  [LIST_ITEM_ENUM.MEMBERSHIP]: MembershipItem,
  [LIST_ITEM_ENUM.PAYMENT_OPTION]: PaymentOptionItem,
  [LIST_ITEM_ENUM.PURCHASES]: PurchasesItem,
  [LIST_ITEM_ENUM.RANKING_WITH_STATS]: RankingWithStatsItem,
  [LIST_ITEM_ENUM.RANKING]: RankingItem,
  [LIST_ITEM_ENUM.REPORT]: ReportItemFactory,
  [LIST_ITEM_ENUM.ROSTER_ITEM]: RosterItem,
  [LIST_ITEM_ENUM.SALES]: SalesItem,
  [LIST_ITEM_ENUM.AVATAR_TEXT_SKELETON]: AvatarAndTextSkeleton,
  [LIST_ITEM_ENUM.NOTIFICATION_SETTING]: NotificationSettingItem,
  [NOTIFICATION_TYPE.ADDED_TO_ROSTER]: RosterNotification,
  [NOTIFICATION_TYPE.SCORE_SUBMISSION_REQUEST]: ScoreSubmissionRequestNotification,
  [NOTIFICATION_TYPE.OTHER_TEAM_SUBMITTED_A_SCORE]: ConfirmOrDeclineScoreNotification,
};

export default function ItemFactory(props) {
  const { type } = props;
  const Item = ItemMap[type];

  if (!Item) {
    /* eslint-disable-next-line */
    //console.error(`${type} is not supported in ItemFactory`);
    return DefaultItem;
  }

  return Item;
}
