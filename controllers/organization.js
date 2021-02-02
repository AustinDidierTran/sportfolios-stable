const {
  getEntity: getEntityHelper
} = require('../api/src/db/helpers/entity');

const TABS_ENUM = {
  HOME: 'home',
  ABOUT: 'about',
  CART: 'cart',
  EDIT_EVENTS: 'editEvents',
  EDIT_PERSON_INFOS: 'editPersonInfos',
  EDIT_RANKINGS: 'editRankings',
  EDIT_RESULTS: 'editResults',
  EDIT_ROSTERS: 'editRosters',
  EDIT_SCHEDULE: 'editSchedule',
  EVENT_INFO: 'eventInfo',
  EVENTS: 'events',
  GENERAL: 'general',
  PURCHASES: 'purchases',
  RANKINGS: 'rankings',
  RESULTS: 'results',
  ROSTERS: 'roster',
  SCHEDULE: 'schedule',
  SETTINGS: 'settings',
  SHOP: 'shop',
};

class OrganizationController {

  static getNavBar() {
    return [
      {
        value: 'home',
        label: 'home',
      },
      {
        value: 'events',
        label: 'events',
      },
      {
        value: 'league',
        label: 'league',
      },
      {
        value: 'about',
        label: 'about',
      }
    ];
  }

  static async about(orgId, userId) {

    let res = await getEntityHelper(orgId, userId);
    return {
      basicInfos: res.basicInfos,
      navBar: this.getNavBar(),
    };
  }

  static async events(orgId, userId) {

    let res = await getEntityHelper(orgId, userId);

    return {
      basicInfos: res.basicInfos,
      navBar: this.getNavBar(),
    };
  }

  static async home(orgId, userId) {

    let res = await getEntityHelper(orgId, userId);

    return {
      basicInfos: res.basicInfos,
      navBar: this.getNavBar(),
    };
  }

  static async league(orgId, userId) {

    let res = await getEntityHelper(orgId, userId);

    return {
      basicInfos: res.basicInfos,
      navBar: this.getNavBar(),
    };
  }
}

module.exports = { OrganizationController: OrganizationController };