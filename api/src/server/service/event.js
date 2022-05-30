import knex from '../../db/connection.js';
import {
  getEntity as getEntityHelper,
  eventInfos as eventInfosHelper,
  getRemainingSpots,
  getOptions,
} from '../../db/queries/entity-deprecate.js';
import { getPaymentOptionById } from '../../db/queries/event.js';
import * as queries from '../../db/queries/event.js';
import * as gameQueries from '../../db/queries/game.js';
import * as shopQueries from '../../db/queries/shop.js';
import * as ticketQueries from '../../db/queries/ticket.js';

import moment from 'moment';
import { ERROR_ENUM } from '../../../../common/errors/index.js';
import {
  ENTITIES_ROLE_ENUM,
  GLOBAL_ENUM,
} from '../../../../common/enums/index.js';
import { CART_ITEM } from '../../../../common/enums/index.js';
import { isAllowed } from './entity-deprecate.js';

const getEventInfo = async (eventId, userId) => {
  const data = await eventInfosHelper(eventId, userId);
  const remainingSpots = await getRemainingSpots(eventId);
  const options = await getOptions(eventId);
  let registrationStart, registrationEnd;
  let isEarly,
    isLate = true;

  if (Array.isArray(options) && options.length) {
    isLate = options.every(option => moment(option.endTime) < moment());
    isEarly = options.every(option => moment(option.startTime) > moment());
    registrationStart = options.reduce(
      (a, b) => (moment(a) < moment(b.startTime) ? a : b.startTime),
      options[0].startTime,
    );
    registrationEnd = options.reduce(
      (a, b) => (moment(a) > moment(b.endTime) ? a : b.endTime),
      options[0].endTime,
    );
  }
  return {
    ...data,
    remainingSpots,
    options,
    registrationStart,
    registrationEnd,
    isEarly,
    isLate,
  };
};

export const getEvent = async (eventId, userId) => {
  const res = await getEntityHelper(eventId, userId);
  const eventInfo = await getEventInfo(eventId, userId);

  if (eventInfo.eventType === 'game') {
    const game = await getEventGameType(eventId);
    return {
      ...game,
    };
  }

  return {
    basicInfos: res.basicInfos,
    eventInfo,
  };
};

export const getAllEventsWithAdmins = async ({ limit, page, query }) => {
  return queries.getAllEventsWithAdmins(Number(limit), Number(page), query);
};

export const deleteEvent = async (id, restore = 'false') => {
  if (restore === 'false') {
    return queries.deleteEventById(id);
  }

  return queries.restoreEventById(id);
};

export const getAllPeopleRegisteredNotInTeamsInfos = async (
  eventId,
  userId,
) => {
  const p = await queries.getAllPeopleRegisteredNotInTeamsInfos(
    eventId,
    userId,
  );
  return p;
};

export const verifyTeamNameIsUnique = async ({ name, eventId }) => {
  const teamNameIsUnique = await queries.getTeamNameUniquenessInEvent(
    name,
    eventId,
  );

  return teamNameIsUnique;
};

/**
 * Currently only returns spirit rankings, but should eventually return
 * prerankings and phase rankings
 */
export const getRankings = async eventId => {
  const rankings = await queries.getRankings(eventId);

  return rankings;
};
export async function getPaymentOption(paymentOptionId) {
  const option = await getPaymentOptionById(paymentOptionId);
  if (!option) {
    return null;
  }
  return {
    teamStripePriceId: option.team_stripe_price_id,
    eventId: option.event_id,
    name: option.name,
    teamPrice: option.team_price,
    startTime: option.start_time,
    endTime: option.end_time,
    individualPrice: option.individual_price,
    individualStripePriceId: option.individual_stripe_price_id,
    id: option.id,
    teamActivity: option.team_activity,
    teamAcceptation: option.team_acceptation,
    playerAcceptation: option.player_acceptation,
    informations: option.informations,
  };
}

export const addEvent = async (
  name,
  startDate,
  endDate,
  photoUrl,
  eventType,
  maximumSpots,
  creatorId,
  ticketLimit,
) => {
  if (name && name.length > 64) {
    throw ERROR_ENUM.VALUE_IS_INVALID;
  }

  if (!creatorId) {
    throw ERROR_ENUM.VALUE_IS_REQUIRED;
  }

  const phaseRankings = Array(maximumSpots)
    .fill(0)
    .map((_, i) => ({ initial_position: i + 1 }));

  const entity = await knex.transaction(async trx => {
    const entity = await queries.createEvent({
      name,
      startDate,
      endDate,
      photoUrl,
      eventType,
      maximumSpots,
      creatorId,
      phaseRankings,
      trx,
    });
    if (eventType == 'game') {
      await gameQueries.createGame(
        entity.event.id,
        entity.event.phases[0].id,
        ticketLimit,
        trx,
      );
    }
    return entity;
  });

  return { id: entity.id };
};

export const getEventGameType = async eventId => {
  const [event] = await queries.getEventTypeGame(eventId);

  return {
    name: event.eventsInfos.name,
    creator: {
      id: event.eventsInfos.creatorEntities.id,
      name: event.eventsInfos.creatorEntities.entitiesGeneralInfos.name,
      photoUrl:
        event.eventsInfos.creatorEntities.entitiesGeneralInfos.photo_url,
      verifiedAt: event.eventsInfos.creatorEntities.verified_at,
    },
    startDate: event.eventsInfos.start_date,
    photoUrl: event.eventsInfos.photo_url,
    type: GLOBAL_ENUM.EVENT,
    id: eventId,
    eventType: event.type,
    description: event.eventsInfos.description,
    tickets: {
      options: event.games[0].eventTicketOptions.map(option => ({
        id: option.id,
        name: option.name,
        description: option.description,
        price: option.stripePrice.amount,
        limit: event.games[0].ticket_limit,
      })),
      limit: event.games[0].ticket_limit,
    },
  };
};
export const addEventTickets = async (body, userId) => {
  const ticketOptions = await ticketQueries.getTicketOptionsByEventTicketOptionsIds(
    body.map(ticket => ticket.id),
  );

  // const ticketPaid = ticketOptions.map(
  //   ticket => ticket.eventTicketPaid,
  // );
  // const ticketsRemaining =
  //   ticketOptions[0].games.ticket_limit - ticketPaid.length;
  // const ticketBought = body.reduce(
  //   (count, ticket) => count + ticket.quantity,
  //   0,
  // );
  // if (ticketsRemaining < ticketBought) {
  //   throw new Error(ERROR_ENUM.NOT_ENOUGH_PLACE_REMAINING);
  // }

  await Promise.all(
    body.map(async ticket => {
      // See if item already exist
      const stripePriceId = ticketOptions.find(to => to.id === ticket.id)
        .stripe_price_id;

      const item = await shopQueries.getCartItemByStripePriceId(
        stripePriceId,
        userId,
      );

      // If yes, simply increase the quantity
      if (item) {
        return shopQueries.updateCartItemQuantity(
          item.quantity + ticket.quantity,
          stripePriceId,
          userId,
        );
      }

      // Else, insert
      return shopQueries.insertCartItem({
        stripePriceId,
        metadata: ticket.metadata,
        quantity: ticket.quantity,
        selected: true,
        type: CART_ITEM.EVENT_TICKET,
        userId: userId,
      });
    }),
  );
};

export const putRosterIdInRankings = async (body, userId) => {
  const { newRosterId, rankingId } = body;
  const eventId = await queries.getEventIdByRankingId(rankingId);

  if (!(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  await queries.updateRosterIdInRankings(newRosterId, rankingId);

  await gameQueries.updateRosterInGames(newRosterId, rankingId);
};
