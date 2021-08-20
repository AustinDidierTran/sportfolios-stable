import {
  updateInitialPositionPhase as updateInitialPositionPhaseHelper,
  updateFinalPositionPhase as updateFinalPositionPhaseHelper,
  updateOriginPhase as updateOriginPhaseHelper,
  deleteTeamPhase as deleteTeamPhaseHelper,
  getPhaseRanking as getPhaseRankingHelper,
} from '../../db/queries/entity.js';

import { ENTITIES_ROLE_ENUM } from '../../../../common/enums/index.js';
import { ERROR_ENUM } from '../../../../common/errors/index.js';
import { isAllowed } from '../../db/queries/utils.js';

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

export {
  getPhaseRanking,
  updateInitialPositionPhase,
  updateFinalPositionPhase,
  updateTeamPhase,
  deleteTeamPhase,
};
