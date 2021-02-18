const {
  addPhase: addPhaseHelper,
  getEntityRole: getEntityRoleHelper,
  updatePhase: updatePhaseHelper,
  updatePhaseRankingsSpots: updatePhaseRankingsSpotsHelper,
} = require('../api/src/db/helpers/entity');

const { ENTITIES_ROLE_ENUM } = require('../common/enums');

const { ERROR_ENUM } = require('../common/errors');

class PhaseController {
  static async addPhase(body, userId) {
    const { phase, spots, eventId } = body;
    console.log({ phase, spots, eventId });

    if (
      !(await this.isAllowed(
        eventId,
        userId,
        ENTITIES_ROLE_ENUM.EDITOR,
      ))
    ) {
      throw new Error(ERROR_ENUM.ACCESS_DENIED);
    }
    const res = await addPhaseHelper(phase, spots, eventId);
    return res;
  }

  static async updatePhase(body, userId) {
    console.log('updatePhase');
    const { eventId, phaseId, phaseName, spots, isDone } = body;
    console.log({ eventId, phaseId, phaseName, spots, isDone });
    if (
      !(await this.isAllowed(
        eventId,
        userId,
        ENTITIES_ROLE_ENUM.EDITOR,
      ))
    ) {
      throw new Error(ERROR_ENUM.ACCESS_DENIED);
    }
    const res = await updatePhaseHelper({
      eventId,
      phaseId,
      phaseName,
      spots,
      isDone,
    });

    if (spots) {
      await updatePhaseRankingsSpotsHelper({ phaseId, spots });
    }
    if (isDone === true || isDone === false) {
      console.log('allo');
      //Update all phase that reference the phase that is donw
    }
    return res;
  }

  static async isAllowed(
    entityId,
    userId,
    acceptationRole = ENTITIES_ROLE_ENUM.ADMIN,
  ) {
    const role = await getEntityRoleHelper(entityId, userId);
    return role <= acceptationRole;
  }
}
module.exports = { PhaseController };
