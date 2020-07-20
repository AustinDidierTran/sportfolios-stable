const {
  addMember,
  updateRegistration,
} = require('../../../db/queries/entity');

const INVOICE_CREATED_ENUM = {
  EVENT: async (metadata, stripe) => {
    const { roster_id: rosterId, event_id: eventId } = metadata;
    const { invoice_id: invoiceId, status } = stripe;
    await updateRegistration(rosterId, eventId, invoiceId, status);
  },
  STORE: () => {},
  MEMBERSHIPS: async () => {
    await addMember(
      Number(membershipType),
      entityId,
      personId,
      expirationDate,
    );
  },
};
const INVOICE_PAID_ENUM = {
  EVENT: async (metadata, stripe) => {
    const { rosterId, eventId } = metadata;
    const { id: invoiceId, status } = stripe;

    await updateRegistration({
      rosterId,
      eventId,
      invoiceId,
      status,
    });
  },
  STORE: () => {},
  MEMBERSHIPS: () => {},
};

module.exports = { INVOICE_CREATED_ENUM, INVOICE_PAID_ENUM };
