const {
  addPhase: addPhaseHelper,
  getPrerankPhase: getPrerankPhaseHelper,
  updatePhase: updatePhaseHelper,
  updatePhaseGamesRosterId: updatePhaseGamesRosterIdHelper,
  updatePhaseOrder: updatePhaseOrderHelper,
  updatePhaseRankingsSpots: updatePhaseRankingsSpotsHelper,
  updatePhaseFinalRanking: updatePhaseFinalRankingHelper,
  updateManualRanking: updateManualRankingHelper,
  deletePhase: deletePhaseHelper,
} = require('../../db/queries/entity');

const {
  ENTITIES_ROLE_ENUM,
  PHASE_STATUS_ENUM,
  PHASE_TYPE_ENUM,
} = require('../../../../common/enums');

const { ERROR_ENUM } = require('../../../../common/errors');
const { isAllowed } = require('../../db/queries/utils');

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
module.exports = {
  addPhase,
  getPrerankPhase,
  updatePhase,
  updatePhaseOrder,
  deletePhase,
};
