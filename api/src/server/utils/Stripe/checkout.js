const {
  addMember,
  updateRegistration,
} = require('../../../db/queries/entity');
const {
  INVOICE_STATUS_ENUM,
} = require('../../../../../common/enums');

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
  EVENT: async (metadata, stripe) => {
    const { rosterId, eventId } = metadata;
    const { status, invoiceItemId } = stripe;

    await updateRegistration({
      rosterId,
      eventId,
      invoiceItemId,
      status,
    });
  },
  STORE: () => {},
  MEMBERSHIPS: () => {},
};

const INVOICE_REFUND_ENUM = {
  EVENT: async (metadata, stripe) => {
    const { rosterId, eventId } = metadata;
    const { invoiceItemId } = stripe;
    await updateRegistration({
      rosterId,
      eventId,
      invoiceItemId,
      status: INVOICE_STATUS_ENUM.REFUNDED,
    });
  },
};

module.exports = {
  INVOICE_CREATED_ENUM,
  INVOICE_PAID_ENUM,
  INVOICE_REFUND_ENUM,
};
