const {
  getEntity: getEntityHelper,
} = require('../api/src/db/helpers/entity');

class OrganizationController {
  static async organization(orgId, userId) {
    let res = await getEntityHelper(orgId, userId);

    return {
      basicInfos: res.basicInfos,
    };
  }
}

module.exports = { OrganizationController: OrganizationController };
