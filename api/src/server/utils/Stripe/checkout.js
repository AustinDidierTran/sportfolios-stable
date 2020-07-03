import api from '../../../../../app/src/actions/api';

const INVOICE_CREATED_ENUM = {
  EVENT: async (metadata, stripe) => {
    const { team_id, event_id } = metadata;
    const { invoice_id, status } = stripe;
    await api('/api/entity/register', {
      method: 'POST',
      body: JSON.stringify({
        team_id,
        event_id,
        invoice_id,
        status,
      }),
    });
  },
  STORE: () => {},
  MEMBERSHIPS: async () => {
    await api('/api/entity/member', {
      method: 'POST',
      body: JSON.stringify({
        member_type: Number(membershipType),
        person_id: personId,
        organization_id: entityId,
        expiration_date: expirationDate,
      }),
    });
  },
};
const INVOICE_PAID_ENUM = {
  EVENT: async (metadata, stripe) => {
    const { roster_id, event_id } = metadata;
    const { invoice_id, status } = stripe;
    await api('/api/entity/updateRegistration', {
      method: 'PUT',
      body: JSON.stringify({
        roster_id,
        event_id,
        invoice_id,
        status,
      }),
    });
  },
  STORE: () => {},
  MEMBERSHIPS: () => {},
};

export { INVOICE_CREATED_ENUM, INVOICE_PAID_ENUM };
