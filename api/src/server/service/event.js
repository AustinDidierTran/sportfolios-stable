import {
  getEntity as getEntityHelper,
  eventInfos as eventInfosHelper,
  getRemainingSpots,
  getOptions,
} from '../../db/queries/entity.js';

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

export const getAllPeopleRegisteredNotInTeamsInfos = async (eventId, userId) => {
  const p = await queries.getAllPeopleRegisteredNotInTeamsInfos(eventId, userId);
  return p;
}

/**
 * Currently only returns spirit rankings, but should eventually return
 * prerankings and phase rankings
 */
export const getRankings = async eventId => {
  const rankings = await queries.getRankings(eventId);

  return rankings;
};
