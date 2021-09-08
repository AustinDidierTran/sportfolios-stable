import knex from '../connection.js';

async function getEventPaymentOption(stripePriceId) {
  let [option] = await knex('event_payment_options')
    .select('*')
    .where({ team_stripe_price_id: stripePriceId });
  if (option) {
    return option;
  }

  [option] = await knex('event_payment_options')
    .select('*')
    .where({ individual_stripe_price_id: stripePriceId });
  return option;
}

const getEventInfoById = async (eventId) => {
  const [event] = await knex('events_infos')
    .select('creator_id')
    .where({
      id: eventId,
    });
  return event;
}

const getTeamsRegisteredInfo = async (eventId) => {
  return await knex('event_rosters')
    .select(
      'event_rosters.payment_option_id as paymentOptionId',
      'user_email.email as email',
      'stripe_invoice_item.user_id as userId',
      'stripe_invoice_item.invoice_item_id as invoiceItemId',
      'stripe_invoice_item.stripe_price_id as stripePriceId',
      'stripe_invoice_item.metadata as metadata',
      'stripe_invoice_item.seller_entity_id as sellerEntityId',
      'event_rosters.registration_status as registrationStatus',
      'event_rosters.roster_id as rosterId',
      'event_rosters.team_id as teamId',
      'event_rosters.invoice_item_id as invoiceItemId',
      'event_rosters.status as status',
      'event_rosters.created_at as registeredOn',
      'event_rosters.informations as informations'
    )
    .where('event_rosters.event_id', eventId)
    .leftJoin('stripe_invoice_item', function () {
      this.on('stripe_invoice_item.invoice_item_id', '=', 'event_rosters.invoice_item_id').onNotNull('event_rosters.invoice_item_id')
    })
    .join('entities_role', function () {
      this.on('entities_role.entity_id', '=', 'event_rosters.team_id').andOn('entities_role.role', '=', 1)
    })
    .join('user_entity_role', function () {
      this.on('user_entity_role.entity_id', '=', 'entities_role.entity_id_admin')
    })
    .leftJoin('user_email',
      'user_email.user_id', '=', 'user_entity_role.user_id',
    );
}

const getPaymentOptionById = async (paymentOptionId) => {
  const [option] = await knex('event_payment_options')
    .select('*')
    .where({ id: paymentOptionId });
  return option;
}


async function getTeamsAcceptedRegistered(eventId) {
  const teams = await knex('event_rosters')
    .select('*')
    .whereIn('registration_status', [
      STATUS_ENUM.ACCEPTED,
      STATUS_ENUM.ACCEPTED_FREE,
    ])
    .andWhere({
      event_id: eventId,
    });
  return teams;
}

async function getRegistrationStatus(rosterId) {
  const [registration] = await knex('event_rosters')
    .select('registration_status')
    .where({
      roster_id: rosterId,
    });

  return registration.registration_status;
}

export {
  getEventPaymentOption,
  getEventInfoById,
  getTeamsRegisteredInfo,
  getPaymentOptionById,
  getTeamsAcceptedRegistered,
  getRegistrationStatus
};
