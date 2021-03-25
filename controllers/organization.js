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
        label: 'event.events',
      },
      {
        value: 'memberships',
        label: 'member.memberships',
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

  static async memberships(orgId, userId) {
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

  static async edit(orgId, userId) {
    let res = await getEntityHelper(orgId, userId);

    return {
      basicInfos: res.basicInfos,
      navBar: this.getNavBar(),
    };
  }
}

module.exports = { OrganizationController: OrganizationController };
