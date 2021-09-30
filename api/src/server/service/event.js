import {
  getEntity as getEntityHelper,
  eventInfos as eventInfosHelper,
  getRemainingSpots,
  getOptions,
} from '../../db/queries/entity-deprecate.js';
import { getPaymentOptionById } from '../../db/queries/event.js';

import * as queries from '../../db/queries/event.js';

import moment from 'moment';

const getEventInfo = async (eventId, userId) => {
  const data = await eventInfosHelper(eventId, userId);
  const remainingSpots = await getRemainingSpots(eventId);
  const options = await getOptions(eventId);
  let registrationStart, registrationEnd;
  let isEarly,
    isLate = true;

  if (Array.isArray(options) && options.length) {
    isLate = options.every(
      option => moment(option.endTime) < moment(),
    );
    isEarly = options.every(
      option => moment(option.startTime) > moment(),
    );
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
  let res = await getEntityHelper(eventId, userId);
  const eventInfo = await getEventInfo(eventId, userId);
  return {
    basicInfos: res.basicInfos,
    eventInfo,
  };
};

export const getAllEventsWithAdmins = async ({
  limit,
  page,
  query,
}) => {
  return queries.getAllEventsWithAdmins(
    Number(limit),
    Number(page),
    query,
  );
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
