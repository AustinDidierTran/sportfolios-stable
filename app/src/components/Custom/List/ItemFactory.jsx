import {
  GLOBAL_ENUM,
  LIST_ITEM_ENUM,
} from '../../../../../common/enums';
import AppItem from './AppItem';
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
import RosterItem from './RosterItem';
import SalesItem from './SalesItem';
import TeamItem from './TeamItem';

const ItemMap = {
  [GLOBAL_ENUM.EVENT]: EventItem,
  [GLOBAL_ENUM.ORGANIZATION]: OrganizationItem,
  [GLOBAL_ENUM.PERSON]: PersonItem,
  [GLOBAL_ENUM.TEAM]: TeamItem,
  [LIST_ITEM_ENUM.APP_ITEM]: AppItem,
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
  [LIST_ITEM_ENUM.ROSTER_ITEM]: RosterItem,
  [LIST_ITEM_ENUM.SALES]: SalesItem,
};

export default function ItemFactory(props) {
  const { type } = props;

  const Item = ItemMap[type];

  if (!Item) {
    /* eslint-disable-next-line */
    console.error(`${type} is not supported in ItemFactory`);
    return DefaultItem;
  }

  return Item;
}
