import moment from 'moment';
import * as queries from '../../db/queries/memberships.js';

export const getMembers = async (personId: any, organisationId: any): Promise<any> =>  {
  const members: any = await queries.getMembers(personId, organisationId);

  const reduce = members.reduce((prev :any, curr: any) => {
    let addCurr = true;
    const filter = prev.filter((p: any) => {
      if (p.member_type != curr.member_type) {
        return true;
      } else {
        if (moment(p.expiration_date) > moment(curr.expiration_date)) {
          addCurr = false;
          return true;
        } else {
          return false;
        }
      }
    });
    if (addCurr) {
      return [...filter, curr];
    }
    return filter;
  }, []);

  const res = reduce.map((m: any) => ({
    membershipId: m.membership_id,
    organizationId: m.organization_id,
    personId: m.person_id,
    memberType: m.member_type,
    expirationDate: m.expiration_date,
    id: m.id,
    status: m.status,
    memberNumber: m.member_number
  }));
  return res;
};
