const {
  addAllFields: addAllFieldsHelper,
  addAllTimeslots: addAllTimeslotsHelper,
  addAllGames: addAllGamesHelper,
} = require('../api/src/db/helpers/entity');
const { isAllowed } = require('../api/src/db/helpers/utils');

const { ENTITIES_ROLE_ENUM } = require('../common/enums');
const { ERROR_ENUM } = require('../common/errors');

class InteractiveToolController {
  static async addAll(body, userId) {
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
      timeslots = await addAllTimeslotsHelper(
        eventId,
        timeslotsArray,
      );
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
}
module.exports = {
  InteractiveToolController: InteractiveToolController,
};
