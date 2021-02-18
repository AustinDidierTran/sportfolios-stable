const {
    getPhaseRankings: getPhaseRankingsHelper,
} = require('../api/src/db/helpers/entity');

const {
    ENTITIES_ROLE_ENUM,
  } = require('../common/enums');

const { ERROR_ENUM } = require('../common/errors');


class RankingsController {

    static async getPhaseRankings(phaseId){
       const res = await getPhaseRankingsHelper(phaseId);
       return res;
    }
}
module.exports = { RankingsController }; 