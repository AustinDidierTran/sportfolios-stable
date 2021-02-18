const {
  updateInitialPositionPhase: updateInitialPositionPhaseHelper,
  updateFinalPositionPhase: updateFinalPositionPhaseHelper,
  updateOriginPhase: updateOriginPhaseHelper,
  deleteTeamPhase: deleteTeamPhaseHelper,
  addTeamPhase: addTeamPhaseHelper,
} = require('../api/src/db/helpers/entity');

const { ENTITIES_ROLE_ENUM } = require('../common/enums');

const { ERROR_ENUM } = require('../common/errors');

class phaseRankingsController {
  static async updateInitialPositionPhase(body) {
    const { phaseId, teams, eventId, userId } = body;
    console.log({
      phaseId,
      teams,
      eventId,
      userId,
    });

    if (
      !(await this.isAllowed(
        eventId,
        userId,
        ENTITIES_ROLE_ENUM.EDITOR,
      ))
    ) {
      throw new Error(ERROR_ENUM.ACCESS_DENIED);
    }
    const res = await updateInitialPositionPhaseHelper(
      phaseId,
      teams,
    );
    return res;
  }
  static async updateFinalPositionPhase(body) {
    const { phaseId, teams, eventId, userId } = body;
    console.log({
      phaseId,
      teams,
      eventId,
      userId,
    });

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
  static async updateOriginPhase(body) {
    const { phaseId, teams, eventId, userId } = body;
    console.log({
      phaseId,
      teams,
      eventId,
      userId,
    });

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
  static async updateOriginPhase(body) {
    const { phaseId, teams, eventId, userId } = body;
    console.log({
      phaseId,
      teams,
      eventId,
      userId,
    });

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
  static async addTeamPhase(body) {
    const { phaseId, rosterId,initialPosition, eventId, userId } = body;
    console.log({
      phaseId, rosterId,initialPosition, eventId, userId 
    });

    if (
      !(await this.isAllowed(
        eventId,
        userId,
        ENTITIES_ROLE_ENUM.EDITOR,
      ))
    ) {
      throw new Error(ERROR_ENUM.ACCESS_DENIED);
    }
    const res = await addTeamPhaseHelper(phaseId, rosterId,initialPosition);
    return res;
  }
  static async deleteTeamPhase(body) {
    const { phaseId, initialPosition, eventId, userId } = body;
    console.log({
      phaseId,
      initialPosition,
      eventId,
      userId,
    });

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
module.exports = { phaseRankingsController };
