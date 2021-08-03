const {
  getEntity: getEntityHelper,
  eventInfos: eventInfosHelper,
  getRemainingSpots: getRemainingSpots,
  getOptions,
} = require('../../db/queries/entity');

const moment = require('moment');

async function getEventInfo(eventId, userId) {
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
}

async function getEvent(eventId, userId) {
  let res = await getEntityHelper(eventId, userId);
  const eventInfo = await getEventInfo(eventId, userId);
  return {
    basicInfos: res.basicInfos,
    eventInfo,
  };
}

module.exports = { getEvent };
