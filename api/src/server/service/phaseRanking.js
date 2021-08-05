const {
  updateInitialPositionPhase: updateInitialPositionPhaseHelper,
  updateFinalPositionPhase: updateFinalPositionPhaseHelper,
  updateOriginPhase: updateOriginPhaseHelper,
  deleteTeamPhase: deleteTeamPhaseHelper,
  getPhaseRanking: getPhaseRankingHelper,
} = require('../../db/queries/entity');

const { ENTITIES_ROLE_ENUM } = require('../../../../common/enums');

const { ERROR_ENUM } = require('../../../../common/errors');
const { isAllowed } = require('../../db/queries/utils');

function getPhaseRanking(phaseId) {
  return getPhaseRankingHelper(phaseId);
}

async function updateInitialPositionPhase(body, userId) {
  const { phaseId, teams, eventId } = body;

  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  return updateInitialPositionPhaseHelper(phaseId, teams);
}

async function updateFinalPositionPhase(body, userId) {
  const { phaseId, teams, eventId } = body;

  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return updateFinalPositionPhaseHelper(phaseId, teams);
}

async function updateTeamPhase(body, userId) {
  const {
    eventId,
    initialPosition,
    phaseId,
    originPhase,
    originPosition,
  } = body;

  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  return updateOriginPhaseHelper({
    phaseId,
    eventId,
    originPhase,
    originPosition,
    initialPosition,
  });
}

async function deleteTeamPhase(body, userId) {
  const { phaseId, initialPosition, eventId } = body;

  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return deleteTeamPhaseHelper(phaseId, initialPosition);
}
module.exports = {
  getPhaseRanking,
  updateInitialPositionPhase,
  updateFinalPositionPhase,
  updateTeamPhase,
  deleteTeamPhase,
};
