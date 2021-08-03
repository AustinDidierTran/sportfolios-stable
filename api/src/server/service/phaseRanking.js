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

async function getPhaseRanking(phaseId) {
  const res = getPhaseRankingHelper(phaseId);
  return res;
}

async function updateInitialPositionPhase(body, userId) {
  const { phaseId, teams, eventId } = body;

  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  const res = await updateInitialPositionPhaseHelper(phaseId, teams);
  return res;
}
async function updateFinalPositionPhase(body, userId) {
  const { phaseId, teams, eventId } = body;

  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  const res = await updateFinalPositionPhaseHelper(phaseId, teams);
  return res;
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

  const res = await updateOriginPhaseHelper({
    phaseId,
    eventId,
    originPhase,
    originPosition,
    initialPosition,
  });
  return res;
}

async function deleteTeamPhase(body, userId) {
  const { phaseId, initialPosition, eventId } = body;

  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  const res = await deleteTeamPhaseHelper(phaseId, initialPosition);
  return res;
}
module.exports = {
  getPhaseRanking,
  updateInitialPositionPhase,
  updateFinalPositionPhase,
  updateTeamPhase,
  deleteTeamPhase,
};
