const {
  getEntity: getEntityHelper,
} = require('../api/src/db/helpers/entity');

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
      },
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
