const {
  updateInitialPositionPhase: updateInitialPositionPhaseHelper,
  updateFinalPositionPhase: updateFinalPositionPhaseHelper,
  updateOriginPhase: updateOriginPhaseHelper,
  deleteTeamPhase: deleteTeamPhaseHelper,
  addTeamPhase: addTeamPhaseHelper,
  getEntityRole: getEntityRoleHelper,
} = require('../api/src/db/helpers/entity');

const { ENTITIES_ROLE_ENUM } = require('../common/enums');

const { ERROR_ENUM } = require('../common/errors');

class PhaseRankingController {

  static async updateInitialPositionPhase(body, userId) {
    const { phaseId, teams, eventId } = body;

    if (
      !(await this.isAllowed(
        eventId,
        userId,
        ENTITIES_ROLE_ENUM.EDITOR,
      ))
    ) {
      throw new Error(ERROR_ENUM.ACCESS_DENIED);
    }

    const res = await updateInitialPositionPhaseHelper(phaseId, teams);
    return res;
  }
  static async updateFinalPositionPhase(body, userId) {
    const { phaseId, teams, eventId } = body;

    if (
      !(await this.isAllowed(
        eventId,
        userId,
        ENTITIES_ROLE_ENUM.EDITOR,
      ))
    ) {
      throw new Error(ERROR_ENUM.ACCESS_DENIED);
    }
    const res = await updateFinalPositionPhaseHelper(phaseId, teams);
    return res;
  }

  static async updateOriginPhase(body, userId) {
    const { phaseId, teams, eventId } = body;

    if (
      !(await this.isAllowed(
        eventId,
        userId,
        ENTITIES_ROLE_ENUM.EDITOR,
      ))
    ) {
      throw new Error(ERROR_ENUM.ACCESS_DENIED);
    }
    const res = await updateOriginPhaseHelper(phaseId, teams);
    return res;
  }
  
  static async updateOriginPhase(body, userId) {
    const { phaseId, teams, eventId } = body;

    if (
      !(await this.isAllowed(
        eventId,
        userId,
        ENTITIES_ROLE_ENUM.EDITOR,
      ))
    ) {
      throw new Error(ERROR_ENUM.ACCESS_DENIED);
    }
    const res = await updateOriginPhaseHelper(phaseId, teams);
    return res;
  }

  static async updateTeamPhase(body, userId) {
    const {
      eventId,
      team,
      initialPosition,
      phaseId,
    } = body;

    const rosterId=team;

    if (
      !(await this.isAllowed(
        eventId,
        userId,
        ENTITIES_ROLE_ENUM.EDITOR,
      ))
    ) {
      throw new Error(ERROR_ENUM.ACCESS_DENIED);
    }

    const res = await addTeamPhaseHelper(
      phaseId,
      rosterId,
      initialPosition,
    );
    return res;
  }

  static async deleteTeamPhase(body, userId) {
    const { phaseId, initialPosition, eventId } = body;

    if (
      !(await this.isAllowed(
        eventId,
        userId,
        ENTITIES_ROLE_ENUM.EDITOR,
      ))
    ) {
      throw new Error(ERROR_ENUM.ACCESS_DENIED);
    }
    const res = await deleteTeamPhaseHelper(phaseId, initialPosition);
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
module.exports = { PhaseRankingController };
