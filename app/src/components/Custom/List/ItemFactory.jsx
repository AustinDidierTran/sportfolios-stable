import { GLOBAL_ENUM } from '../../../../../common/enums';
import DefaultItem from './DefaultItem';
import EventCreatorItem from './EventCreatorItem';
import EventItem from './EventItem';
import MembershipDetailItem from './MembershipDetailItem';
import MembershipItem from './MembershipItem';
import OrganizationItem from './OrganizationItem';
import PersonItem from './PersonItem';
import TeamItem from './TeamItem';
import PaymentOptionItem from './PaymentOptionItem';
import RosterItem from './RosterItem';
import RankingItem from './RankingItem';
import RankingWithStatsItem from './RankingWithStatsItem';
import PurchasesItem from './PurchasesItem';
import CartItem from './CartItem';
import SalesItem from './SalesItem';
import AppItem from './AppItem';

const ItemMap = {
  [GLOBAL_ENUM.EVENT_CREATOR]: EventCreatorItem,
  [GLOBAL_ENUM.EVENT]: EventItem,
  [GLOBAL_ENUM.MEMBERSHIP_DETAIL]: MembershipDetailItem,
  [GLOBAL_ENUM.MEMBERSHIP]: MembershipItem,
  [GLOBAL_ENUM.ORGANIZATION]: OrganizationItem,
  [GLOBAL_ENUM.PERSON]: PersonItem,
  [GLOBAL_ENUM.TEAM]: TeamItem,
  [GLOBAL_ENUM.PAYMENT_OPTION]: PaymentOptionItem,
  [GLOBAL_ENUM.ROSTER_ITEM]: RosterItem,
  [GLOBAL_ENUM.RANKING_WITH_STATS]: RankingWithStatsItem,
  [GLOBAL_ENUM.RANKING]: RankingItem,
  [GLOBAL_ENUM.PURCHASES]: PurchasesItem,
  [GLOBAL_ENUM.CART]: CartItem,
  [GLOBAL_ENUM.SALES]: SalesItem,
  [GLOBAL_ENUM.APP_ITEM]: AppItem,
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
