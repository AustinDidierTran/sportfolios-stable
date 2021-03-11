const {
  addPhase: addPhaseHelper,
  getEntityRole: getEntityRoleHelper,
  getPrerankPhase: getPrerankPhaseHelper,
  updatePhase: updatePhaseHelper,
  updatePhaseOrder: updatePhaseOrderHelper,
  updatePhaseRankingsSpots: updatePhaseRankingsSpotsHelper,
  updatePhaseRankingRoster: updatePhaseRankingRosterHelper,
  updatePhaseFinalRanking: updatePhaseFinalRankingHelper,
} = require('../api/src/db/helpers/entity');

const { ENTITIES_ROLE_ENUM } = require('../common/enums');

const { ERROR_ENUM } = require('../common/errors');

class PhaseController {
  static async addPhase(body, userId) {
    const { phase, spots, eventId } = body;

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

  static async getPrerankPhase(eventId, userId) {
    if (
      !(await this.isAllowed(
        eventId,
        userId,
        ENTITIES_ROLE_ENUM.EDITOR,
      ))
    ) {
      throw new Error(ERROR_ENUM.ACCESS_DENIED);
    }
    const prerank = await getPrerankPhaseHelper(eventId);
    const res = {
      phaseId: prerank.id,
      spots: prerank.spots,
    };
    return res;
  }

  static async updatePhaseOrder(body, userId) {
    const { orderedPhases, eventId } = body;
    if (
      !(await this.isAllowed(
        eventId,
        userId,
        ENTITIES_ROLE_ENUM.EDITOR,
      ))
    ) {
      throw new Error(ERROR_ENUM.ACCESS_DENIED);
    }
    const res = await updatePhaseOrderHelper(orderedPhases, eventId);
    return res;
  }

  static async updatePhase(body, userId) {
    const {
      eventId,
      phaseId,
      phaseName,
      spots,
      status,
      rankingsToUpdate,
      finalRanking,
    } = body;
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
      status,
    });

    if (rankingsToUpdate) {
      await updatePhaseRankingRosterHelper(phaseId, rankingsToUpdate);
    }

    if (spots || spots === 0) {
      await updatePhaseRankingsSpotsHelper({ phaseId, spots });
    }

    if (finalRanking) {
      return updatePhaseFinalRankingHelper(phaseId, finalRanking);
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
