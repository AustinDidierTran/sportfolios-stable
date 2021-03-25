const {
  getEntity: getEntityHelper,
} = require('../api/src/db/helpers/entity');

class OrganizationController {
  static async entity(orgId, userId) {
    let res = await getEntityHelper(orgId, userId);

    return {
      basicInfos: res.basicInfos,
    };
  }
}

module.exports = { OrganizationController: OrganizationController };
