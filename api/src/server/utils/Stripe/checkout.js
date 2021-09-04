import { INVOICE_STATUS_ENUM } from '../../../../../common/enums/index.js';
import { getLanguageFromEmail } from '../../../db/queries/user.js';

import {
  addMember,
  deleteRegistration,
  updateRegistration,
  updateRegistrationPerson,
  updatePlayerPaymentStatus,
  updateMembershipInvoice,
  addPlayerCartItem,
  getRoster,
  getEmailPerson,
  getUserIdFromPersonId,
} from '../../../db/queries/entity.js';

import { addItemToPaidStoreItems } from '../../../db/queries/shop.js';
import { sendCartItemAddedPlayerEmail } from '../nodeMailer.js';

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
  STORE: () => { },
  MEMBERSHIPS: async () => {
    await addMember({
      membershipType: Number(membershipType),
      organizationId: entityId,
      personId,
      expirationDate,
    });
  },
};
const INVOICE_PAID_ENUM = {
  EVENT: async body => {
    const { metadata, eventId, status, invoiceItemId } = body;

    if (metadata.isIndividualOption) {
      updatePlayerPaymentStatus(body);
    } else {
      const { rosterId, person } = metadata;
      if (rosterId) {
        await updateRegistration(
          rosterId,
          eventId,
          invoiceItemId,
          status,
        );
        const players = await getRoster(rosterId);

        await Promise.all(
          players.map(async p => {
            if (p.paymentStatus == INVOICE_STATUS_ENUM.OPEN) {
              const {
                cartItem,
                event,
                team,
              } = await addPlayerCartItem({
                personId: p.personId,
                name: p.name,
                rosterId,
                isSub: p.isSub,
              });
              if (cartItem) {
                const email = await getEmailPerson(p.personId);
                const userId = await getUserIdFromPersonId(
                  p.personId,
                );
                const language = await getLanguageFromEmail(email);
                await sendCartItemAddedPlayerEmail({
                  email,
                  teamName: team.name,
                  eventName: event.name,
                  language,
                  userId,
                });
              }
            }
          }),
        );
      }
      if (person) {
        await updateRegistrationPerson(
          person.id,
          eventId,
          invoiceItemId,
          status,
        );
      }
    }

    await addItemToPaidStoreItems(body);
  },
  STORE: async body => {
    await addItemToPaidStoreItems(body);
  },
  MEMBERSHIPS: async body => {
    await updateMembershipInvoice(body);
    await addItemToPaidStoreItems(body);
  },
  DONATION: async body => {
    await addItemToPaidStoreItems(body);
  },
};

const INVOICE_REFUND_ENUM = {
  EVENT: async (metadata, stripe) => {
    const { rosterId, eventId } = metadata;
    const { invoiceItemId } = stripe;
    await deleteRegistration(rosterId, eventId, invoiceItemId);
  },
};

export {
  INVOICE_CREATED_ENUM,
  INVOICE_PAID_ENUM,
  INVOICE_REFUND_ENUM,
};
