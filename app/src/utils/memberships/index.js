import {
  getMembershipLength,
  getMembershipUnit,
} from '../stringFormats';
import { ROUTES, goTo } from '../../actions/goTo';
import api from '../../actions/api';

export const addMembership = async (personId, stripePriceId) => {
  await api('/api/shop/addCartItem', {
    method: 'POST',
    body: JSON.stringify({
      stripePriceId,
    }),
  });
  goTo(ROUTES.cart);
};

export const getMemberships = async entityId => {
  const { data } = await api(
    `/api/entity/memberships/?id=${entityId}`,
  );
  return data.map(d => ({
    entityId: d.entity_id,
    fixedDate: d.fixed_date,
    length: d.length,
    membershipType: d.membershipType,
    price: d.price,
    stripePriceId: d.stripe_price_id,
  }));
};

export const updateMembership = async (
  membershipType,
  personId,
  entityId,
  expirationDate,
  stripePriceId,
) => {
  await api('/api/entity/member', {
    method: 'PUT',
    body: JSON.stringify({
      member_type: Number(membershipType),
      person_id: personId,
      organization_id: entityId,
      expiration_date: expirationDate,
    }),
  });
  await api('/api/shop/addCartItem', {
    method: 'POST',
    body: JSON.stringify({
      stripePriceId,
    }),
  });
  goTo(ROUTES.cart);
};

export const getExpirationDate = (length, date) => {
  if (length) {
    return moment().add(
      getMembershipLength(length),
      getMembershipUnit(length),
    );
  } else if (date) {
    return moment(new Date(date));
  } else {
    return null;
  }
};
