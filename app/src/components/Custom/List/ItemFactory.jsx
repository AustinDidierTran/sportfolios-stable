import { GLOBAL_ENUM } from '../../../../../common/enums';
import DefaultItem from './DefaultItem';
import EventCreatorItem from './EventCreatorItem';
import MembershipDetailItem from './MembershipDetailItem';
import MembershipItem from './MembershipItem';
import OrganizationItem from './OrganizationItem';
import PersonItem from './PersonItem';
import TeamItem from './TeamItem';

const ItemMap = {
  [GLOBAL_ENUM.EVENT_CREATOR]: EventCreatorItem,
  [GLOBAL_ENUM.MEMBERSHIP_DETAIL]: MembershipDetailItem,
  [GLOBAL_ENUM.MEMBERSHIP]: MembershipItem,
  [GLOBAL_ENUM.ORGANIZATION]: OrganizationItem,
  [GLOBAL_ENUM.PERSON]: PersonItem,
  [GLOBAL_ENUM.TEAM]: TeamItem,
};

export default function ItemFactory(props) {
  const { type } = props;

  return ItemMap[type] || DefaultItem;
}
