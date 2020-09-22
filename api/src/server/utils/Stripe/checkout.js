const {
  addMember,
  deleteRegistration,
  updateRegistration,
} = require('../../../db/helpers/entity');

const {
  addItemToPaidStoreItems,
} = require('../../../db/helpers/shop');

const INVOICE_CREATED_ENUM = {
  EVENT: async (metadata, stripe) => {
    const { roster_id: rosterId, event_id: eventId } = metadata;
    const { invoiceItemId, status } = stripe;
    await updateRegistration(
      rosterId,
      eventId,
      invoiceItemId,
      status,
    );
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
  EVENT: async body => {
    const { rosterId, eventId, status, invoiceItemId } = body;
    await updateRegistration(
      rosterId,
      eventId,
      invoiceItemId,
      status,
    );
    await addItemToPaidStoreItems(body);
  },
  STORE: async body => {
    await addItemToPaidStoreItems(body);
  },
  MEMBERSHIPS: () => {},
};

const INVOICE_REFUND_ENUM = {
  EVENT: async (metadata, stripe) => {
    const { rosterId, eventId } = metadata;
    const { invoiceItemId } = stripe;
    await deleteRegistration(rosterId, eventId, invoiceItemId);
  },
};

module.exports = {
  INVOICE_CREATED_ENUM,
  INVOICE_PAID_ENUM,
  INVOICE_REFUND_ENUM,
};
