const {
  getEntity: getEntityHelper,
  eventInfos: eventInfosHelper,
} = require('../api/src/db/helpers/entity');

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
    return data;
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
    return {
      basicInfos: res.basicInfos,
      navBar: this.getNavBar(),
    };
  }
}

module.exports = { EventController: EventController };
