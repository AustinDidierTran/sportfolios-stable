const {
  getEntity: getEntityHelper,
  eventInfos: eventInfosHelper,
  getRemainingSpots: getRemainingSpots,
  getOptions,
} = require('../api/src/db/helpers/entity');

const moment = require('moment');

class EventController {
  static async getEventInfo(eventId, userId) {
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

  static async event(eventId, userId) {
    let res = await getEntityHelper(eventId, userId);
    const eventInfo = await this.getEventInfo(eventId, userId);
    return {
      basicInfos: res.basicInfos,
      eventInfo,
    };
  }
}

module.exports = { EventController: EventController };
