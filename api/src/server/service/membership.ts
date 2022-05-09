import moment from 'moment';
import * as queries from '../../db/queries/memberships.js';
import * as shopQueries from '../../db/queries/shop.js';

import {getMembership, addMemberManually, addMember as addMemberHelper } from '../../db/queries/entity-deprecate.js';
import {getEntity } from '../service/entity-deprecate.js';


export const getMembers = async (personId: any, organizationId: any): Promise<any> =>  {
  const members: any = await queries.getMembers(personId, organizationId);

  const reduce = members.reduce((prev: any, curr: any) => {
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

export const addMember = async (body: any , userId: any): Promise<any> => {
  const { membershipId, organizationId, personId } = body;

  const membership = await getMembership(membershipId);
  if (membership.price === 0) {
    return addMemberManually({
      ...body,
      termsAndConditionsId: membership.terms_and_conditions_id,
    });
  }

  const [memberNumber] = await queries.getMemberNumber(personId, organizationId);
  if(memberNumber === undefined){
    await queries.addMemberNumber(personId, organizationId);
  }

  const res = await addMemberHelper({
    ...body,
    termsAndConditionsId: membership.terms_and_conditions_id,
  });
  
  const person = (await getEntity(personId)).basicInfos;
  const organization = (await getEntity(organizationId)).basicInfos;

  await shopQueries.addMembershipCartItem(
    {
      ...membership,
      membershipId: membership.id,
      id: res.id,
      person,
      organization,
      sellerEntityId: organizationId,
    },
    userId,
  );
  return res;
}
