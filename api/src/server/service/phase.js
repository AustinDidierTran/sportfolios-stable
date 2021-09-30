import {
  addPhase as addPhaseHelper,
  getPrerankPhase as getPrerankPhaseHelper,
  updatePhase as updatePhaseHelper,
  updatePhaseGamesRosterId as updatePhaseGamesRosterIdHelper,
  updatePhaseOrder as updatePhaseOrderHelper,
  updatePhaseRankingsSpots as updatePhaseRankingsSpotsHelper,
  updatePhaseFinalRanking as updatePhaseFinalRankingHelper,
  updateManualRanking as updateManualRankingHelper,
  deletePhase as deletePhaseHelper,
} from '../../db/queries/entity-deprecate.js';

import { ENTITIES_ROLE_ENUM, PHASE_STATUS_ENUM, PHASE_TYPE_ENUM } from '../../../../common/enums/index.js';
import { ERROR_ENUM } from '../../../../common/errors/index.js';
import { isAllowed } from '../../db/queries/utils.js';

async function addPhase(body, userId) {
  const { phase, spots, eventId, type } = body;

  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return addPhaseHelper(phase, spots, eventId, type);
}

async function getPrerankPhase(eventId, userId) {
  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  const prerank = await getPrerankPhaseHelper(eventId);
  return { phaseId: prerank.id, spots: prerank.spots };
}

async function updatePhase(body, userId) {
  const {
    eventId,
    phaseId,
    phaseName,
    spots,
    status,
    type,
    finalRanking,
    manualRanking,
  } = body;
  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
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

  if (
    (spots || spots === 0) &&
    type != PHASE_TYPE_ENUM.ELIMINATION_BRACKET
  ) {
    await updatePhaseRankingsSpotsHelper({
      phaseId,
      spots,
      eventId,
    });
  }

  if (status === PHASE_STATUS_ENUM.STARTED) {
    await updatePhaseGamesRosterIdHelper(phaseId);
  }

  if (finalRanking) {
    return updatePhaseFinalRankingHelper(phaseId, finalRanking);
  }

  if (manualRanking) {
    return updateManualRankingHelper(phaseId, manualRanking);
  }
  return res;
}

async function updatePhaseOrder(body, userId) {
  const { orderedPhases, eventId } = body;
  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return updatePhaseOrderHelper(orderedPhases, eventId);
}

async function deletePhase(query, userId) {
  const { phaseId, eventId } = query;
  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  return deletePhaseHelper(phaseId, eventId);
}

export {
  addPhase,
  getPrerankPhase,
  updatePhase,
  updatePhaseOrder,
  deletePhase,
};
