import {
  addAllFields as addAllFieldsHelper,
  addAllTimeslots as addAllTimeslotsHelper,
  addAllGames as addAllGamesHelper,
} from '../../db/queries/entity-deprecate.js';

import { isAllowed } from '../../db/queries/utils.js';
import { ENTITIES_ROLE_ENUM } from '../../../../common/enums/index.js';
import { ERROR_ENUM } from '../../../../common/errors/index.js';

async function addAll(body, userId) {
  const { eventId, fieldsArray, timeslotsArray, gamesArray } = body;
  let fields = [];
  let games = [];
  let timeslots = [];

  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  if (fieldsArray.length !== 0) {
    fields = await addAllFieldsHelper(eventId, fieldsArray);
  }

  if (timeslotsArray.length !== 0) {
    timeslots = await addAllTimeslotsHelper(eventId, timeslotsArray);
  }

  if (gamesArray.length !== 0) {
    games = await addAllGamesHelper(eventId, gamesArray);
  }

  const res = {
    fieldsSaved: fields,
    timeslotSaved: timeslots,
    gamesSaved: games,
  };

  return res;
}

export { addAll };
