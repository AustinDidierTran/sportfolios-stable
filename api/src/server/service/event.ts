import moment from 'moment';
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
import * as entityQueries from '../../db/queries/entity.js';
import * as cartQueries from '../../db/queries/cart.js';
import * as personQueries from '../../db/queries/person.js';
import * as teamQueries from '../../db/queries/team.js';
import { ERROR_ENUM } from '../../../../common/errors/index.js';
import { isAllowed } from '../../db/queries/utils.js';
import {
  ENTITIES_ROLE_ENUM,
  GLOBAL_ENUM,
  CART_ITEM,
  INVOICE_STATUS_ENUM,
  NOTIFICATION_TYPE,
} from '../../../../common/enums/index.js';
import { Roster, Person } from '../../../../typescript/types';
import { sendNotification } from './notification.js';
import { sendCartItemAddedPlayerEmail } from '../utils/nodeMailer.js';

const getEventInfo = async (eventId: any, userId: any): Promise<any> => {
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

export const getEventGameType = async (eventId: any): Promise<any> => {
  const [event]: any = await queries.getEventTypeGame(eventId);

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
      options: event.games[0].eventTicketOptions.map((option: any) => ({
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

export const getEvent = async (eventId: any, userId: any): Promise<any> => {
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

export const getAllEventsWithAdmins = async ({
  limit,
  page,
  query,
}: any): Promise<any> => {
  return queries.getAllEventsWithAdmins(Number(limit), Number(page), query);
};

export const deleteEvent = async (id: any, restore = 'false') => {
  if (restore === 'false') {
    return entityQueries.deleteEventById(id);
  }

  return entityQueries.restoreEventById(id);
};

export const getAllPeopleRegisteredNotInTeamsInfos = async (
  eventId: any,
  userId: any,
) => {
  const p = await queries.getAllPeopleRegisteredNotInTeamsInfos(
    eventId,
    userId,
  );
  return p;
};

export const verifyTeamNameIsUnique = async ({
  name,
  eventId,
}: any): Promise<any> => {
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
export const getRankings = async (eventId: any): Promise<any> => {
  const rankings = await queries.getRankings(eventId);

  return rankings;
};

export async function getPaymentOption(paymentOptionId: any): Promise<any> {
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
  name: any,
  startDate: any,
  endDate: any,
  photoUrl: any,
  eventType: any,
  maximumSpots: any,
  creatorId: any,
  ticketLimit: any,
): Promise<any> => {
  if (name && name.length > 64) {
    throw ERROR_ENUM.VALUE_IS_INVALID;
  }

  if (!creatorId) {
    throw ERROR_ENUM.VALUE_IS_REQUIRED;
  }
  const phaseRankings = Array(maximumSpots)
    .fill(0)
    // eslint-disable-next-line
    .map((_, i) => ({ initial_position: i + 1 }));

  const entity = await knex.transaction(async (trx: any) => {
    const entity: any = await queries.createEvent({
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

export const addEventTickets = async (body: any, userId: any): Promise<any> => {
  const ticketOptions: any = await ticketQueries.getTicketOptionsByEventTicketOptionsIds(
    body.map((ticket: any) => ticket.id),
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
    body.map(async (ticket: any) => {
      // See if item already exist
      const stripePriceId = ticketOptions.find((to: any) => to.id === ticket.id)
        .stripe_price_id;

      const item = await shopQueries.getCartItemByStripePriceId(
        stripePriceId,
        userId,
      );

      // If yes, simply increase the quantity
      if (item) {
        return cartQueries.updateCartItemQuantity(
          item.quantity + ticket.quantity,
          stripePriceId,
          userId,
        );
      }

      // Else, insert
      return cartQueries.insertCartItem({
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

export const putRosterIdInRankings = async (
  body: any,
  userId: any,
): Promise<any> => {
  const { newRosterId, rankingId } = body;
  const eventId = await queries.getEventByRankingId(rankingId);

  if (!(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  return queries.updateRosterIdInRankings(newRosterId, rankingId);
};

export const getRostersEmails = async (
  eventId: string,
  userId: string,
): Promise<Roster[]> => {
  if (!(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  const rostersEmails = await queries.getRostersEmails(eventId);

  return rostersEmails.map(
    (r: any) =>
      ({
        id: r.roster_id,
        team: {
          name: r.entitiesGeneralInfos.name,
          id: r.team_id,
          photoUrl: r.entitiesGeneralInfos.photo_url,
          verifiedAt: r.entitiesGeneralInfos.verified_at,
          deletedAt: r.entitiesGeneralInfos.deleted_at,
        },
        players: r.rosterPlayers.map(
          (p: any) =>
            ({
              surname: p.entitiesGeneralInfos.surname,
              name: p.entitiesGeneralInfos.name,
              id: p.person_id,
              photoUrl: p.entitiesGeneralInfos.photo_url,
              verifiedAt: p.entitiesGeneralInfos.verified_at,
              deletedAt: p.entitiesGeneralInfos.deleted_at,
              emails: p.userEntityRole.userEmail.map((u: any) => u.email),
            } as Person),
        ),
      } as Roster),
  );
};

export const addPlayerToRoster = async (
  body: any,
  userId: string,
): Promise<any> => {
  const { personId, role, isSub, rosterId } = body;
  const [eventRoster] = (await queries.getEventAndTeamFromRoster(
    rosterId,
  )) as any;
  const [personInfos] = (await personQueries.getPersonAllInfos(
    personId,
  )) as any;

  if (
    !(await isAllowed(
      eventRoster.teamRoster.team_id,
      userId,
      ENTITIES_ROLE_ENUM.EDITOR,
    ))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  let paymentStatus = INVOICE_STATUS_ENUM.FREE;
  if (
    eventRoster.eventPaymentOptions &&
    eventRoster.eventPaymentOptions.individual_price > 0
  ) {
    paymentStatus = INVOICE_STATUS_ENUM.OPEN;
  }
  const infos = {
    event: {
      id: eventRoster.event_id,
      name: eventRoster.eventGeneralInfos.name,
    },
    team: {
      id: eventRoster.teamRoster.team_id,
      name: eventRoster.entitiesGeneralInfos.name,
    },
    name: personInfos.name,
  };

  const res = await teamQueries.addPlayerToRoster(
    eventRoster.roster_id,
    personId,
    isSub,
    paymentStatus,
    role,
  );
  await teamQueries.addPlayersToTeam(eventRoster.team_id, [personId], role);

  if (
    (eventRoster.status === INVOICE_STATUS_ENUM.FREE ||
      eventRoster.status === INVOICE_STATUS_ENUM.PAID) &&
    eventRoster.eventPaymentOptions &&
    eventRoster.eventPaymentOptions.individual_price > 0 &&
    !isSub
  ) {
    const cartItem = cartQueries.insertCartItem({
      stripePriceId: eventRoster.eventPaymentOptions.individual_stripe_price_id,
      metadata: {
        eventId: eventRoster.event_id,
        sellerEntityId: eventRoster.eventPaymentOptions.stripePrice.owner_id,
        isIndividualOption: true,
        personId,
        name: personInfos.name,
        buyerId: personId,
        rosterId,
        team: infos.team,
      },
      quantity: 1,
      selected: true,
      type: GLOBAL_ENUM.EVENT,
      userId: personInfos.userEntityRole.user_id,
      personId,
    });

    if (cartItem) {
      await sendCartItemAddedPlayerEmail({
        email: personInfos.userEntityRole.userEmail[0].email,
        teamName: infos.team.name,
        eventName: infos.event.name,
        language: personInfos.userEntityRole.user.language,
        userId: personInfos.userEntityRole.user_id,
      });
    }
  }

  if (personInfos.userEntityRole.user_id === userId) {
    return res;
  }

  sendNotification(
    NOTIFICATION_TYPE.ADDED_TO_EVENT,
    personInfos.userEntityRole.user_id,
    infos,
  );

  return res;
};
