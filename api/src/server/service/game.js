import { ENTITIES_ROLE_ENUM } from '../../../../common/enums/index.js';
import { ERROR_ENUM } from '../../../../common/errors/index.js';
import { isAllowed } from './entity-deprecate.js';

import * as queries from '../../db/queries/game.js';

export const submitSpiritScore = async (body, userId) => {
  const {
    submittedByPerson,
    submittedByRoster,
    submittedForRoster,
    gameId,
    spiritScore,
    comment,
  } = body;

  if (
    !(await isAllowed(
      submittedByPerson,
      userId,
      ENTITIES_ROLE_ENUM.EDITOR,
    ))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  if (
    queries.isSpiritAlreadySubmmited(
      gameId,
      submittedByRoster,
      submittedForRoster,
    )
  )
    // Add spirit to score submission
    await queries.submitSpiritScore({
      submittedByPerson,
      submittedByRoster,
      submittedForRoster,
      gameId,
      spiritScore,
      comment,
    });

  // As of now, set the score of the game to the said spirit
  await queries.updateGameSpirit({
    submittedForRoster,
    gameId,
    spiritScore,
  });
};

export const updateGameScore = async (body, userId) => {
  const { eventId, gameId, rosters } = body;

  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  await queries.updateTeamGameScores(gameId, rosters);

  return gameId;
};
