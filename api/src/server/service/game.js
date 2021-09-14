import { ENTITIES_ROLE_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import { isAllowed } from './entity';

import * as queries from '../../db/queries/game.js';

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
