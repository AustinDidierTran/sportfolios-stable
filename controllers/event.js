const {
  getEntity: getEntityHelper,
  eventInfos: eventInfosHelper,
  getRemainingSpots: getRemainingSpots,
  getOptions
} = require('../api/src/db/helpers/entity');

const moment = require('moment');

class EventController {
  static getNavBar() {
    return [
      {
        value: 'home',
        label: 'home',
      },
      {
        value: 'rankings',
        label: 'rankings',
      },
      {
        value: 'teams',
        label: 'team.teams',
      },
      {
        value: 'schedule',
        label: 'schedule',
      },
      {
        value: 'about',
        label: 'about',
      },
    ];
  }

  static async getEventInfo(eventId, userId) {
    const data = await eventInfosHelper(eventId, userId);
    const remainingSpots = await getRemainingSpots(eventId);
    const options = await getOptions(eventId);

    let registrationStart, registrationEnd;
    let isEarly, isLate = true;

    if (Array.isArray(options)) {
      isLate = options.every((option) => moment(option.endTime) < moment());
      isEarly = options.every((option) => moment(option.startTime) > moment());
      registrationStart = options.reduce((a, b) => moment(a.startTime) < moment(b.startTime) ? a.startTime : b.startTime, options[0]);
      registrationEnd = options.reduce((a, b) => moment(a.endTime) > moment(b.endTime) ? a.endTime : b.endTime, options[0]);
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

  static async about(eventId, userId) {
    let res = await getEntityHelper(eventId, userId);
    const eventInfo = await this.getEventInfo(eventId, userId);
    return {
      basicInfos: res.basicInfos,
      navBar: this.getNavBar(),
      eventInfo,
    };
  }
  static async home(eventId, userId) {
    let res = await getEntityHelper(eventId, userId);
    const eventInfo = await this.getEventInfo(eventId, userId);
    return {
      basicInfos: res.basicInfos,
      navBar: this.getNavBar(),
      eventInfo,
    };
  }

  static async teams(eventId, userId) {
    let res = await getEntityHelper(eventId, userId);
    const eventInfo = await this.getEventInfo(eventId, userId);
    return {
      basicInfos: res.basicInfos,
      navBar: this.getNavBar(),
      eventInfo,
    };
  }

  static async schedule(eventId, userId) {
    let res = await getEntityHelper(eventId, userId);
    const eventInfo = await this.getEventInfo(eventId, userId);
    return {
      basicInfos: res.basicInfos,
      navBar: this.getNavBar(),
      eventInfo,
    };
  }

  static async editSchedule(eventId, userId) {
    let res = await getEntityHelper(eventId, userId);
    const eventInfo = await this.getEventInfo(eventId, userId);
    return {
      basicInfos: res.basicInfos,
      navBar: this.getNavBar(),
      eventInfo,
    };
  }
  static async editRosters(eventId, userId) {
    let res = await getEntityHelper(eventId, userId);
    const eventInfo = await this.getEventInfo(eventId, userId);
    return {
      basicInfos: res.basicInfos,
      navBar: this.getNavBar(),
      eventInfo,
    };
  }

  static async editRankings(eventId, userId) {
    let res = await getEntityHelper(eventId, userId);
    const eventInfo = await this.getEventInfo(eventId, userId);
    return {
      basicInfos: res.basicInfos,
      navBar: this.getNavBar(),
      eventInfo,
    };
  }

  static async edit(eventId, userId) {
    let res = await getEntityHelper(eventId, userId);
    const eventInfo = await this.getEventInfo(eventId, userId);
    return {
      basicInfos: res.basicInfos,
      navBar: this.getNavBar(),
      eventInfo,
    };
  }

  static async rankings(eventId, userId) {
    let res = await getEntityHelper(eventId, userId);
    const eventInfo = await this.getEventInfo(eventId, userId);
    return {
      basicInfos: res.basicInfos,
      navBar: this.getNavBar(),
      eventInfo,
    };
  }
}

module.exports = { EventController: EventController };
