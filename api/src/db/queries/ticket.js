import knex from '../connection.js';
import { eventTicketOptions } from '../models/eventTicketOptions.js';
import { eventTicketPaid } from '../models/eventTicketPaid.js';

export const getTicketOptionsById = async ticketIds => {
  const res = await knex('event_ticket_options')
    .select('id', 'stripe_price_id', 'game_id')
    .whereIn('id', ticketIds);

  return res;
};

// TO BE REFACTORED
export const createEventTicketOption = async (
  stripePriceId,
  name,
  description,
  gameId,
  photoUrl,
) => {
  const insertObj = {
    stripe_price_id: stripePriceId,
    name,
    description,
    game_id: gameId,
    photo_url: photoUrl,
  };

  return knex('event_ticket_options')
    .insert(insertObj)
    .returning('*');
};

export const getTicketOptionByInvoiceItemId = async invoiceItemId => {
  const [res] = await eventTicketOptions
    .query()
    .withGraphJoined('stripePrice.stripeInvoiceItem')
    .where('invoice_item_id', invoiceItemId);

  return res;
};

export const createEventTicketPaid = async (
  invoiceItemId,
  eventTicketOptionsId,
  quantity = 1,
) => {
  console.log({ invoiceItemId, eventTicketOptionsId });

  const insertObj = Array(quantity).fill({
    event_ticket_options_id: eventTicketOptionsId,
    invoice_item_id: invoiceItemId,
  });

  const res = await eventTicketPaid.query().insertGraph(insertObj);

  return res;
};

export const getTicketPaidByStripePriceIds = async stripePriceIds => {
  const res = await eventTicketPaid
    .query()
    .withGraphJoined('eventTicketOptions')
    .whereIn('event_ticket_options.stripe_price_id', stripePriceIds);
  return res;
};
export const getTicketOptionsByStripePriceIds = async stripePriceIds => {
  const res = await eventTicketOptions
    .query()
    .whereIn('event_ticket_options.stripe_price_id', stripePriceIds)
    .withGraphJoined('games');

  return res;
};

export const getTicketOptionsByEventTicketOptionsIds = async eventTicketOptionsIds => {
  const res = await eventTicketOptions
    .query()
    .withGraphJoined('[games, eventTicketPaid]')
    .whereIn('event_ticket_options.id', eventTicketOptionsIds);

  return res;
};

export const getCountTicketPaidByGameId = async gameId => {
  const res = await eventTicketPaid
    .query()
    .withGraphJoined('eventTicketOptions.games')
    .whereIn('games.id', gameId)
    .count('*');
  return res;
};

export const getPurchasedTicketsByGameId = async gameId => {
  const res = await eventTicketPaid
    .query()
    .withGraphJoined(
      '[stripeInvoiceItem.[stripePrice, userEmail, userPrimaryPerson.entitiesGeneralInfos], eventTicketOptions]',
      { minimize: true },
    )
    .where('_t5.game_id', gameId)
    .orderBy('event_ticket_paid.created_at');
  return res;
};
