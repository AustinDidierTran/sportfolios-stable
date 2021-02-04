const {
    getEntityRole: getEntityRoleHelper
} = require('../api/src/db/helpers/entity');

const {
    addAllFields: addAllFieldsHelper
} = require('../api/src/db/helpers/entity');

const {
    addAllTimeslots: addAllTimeslotsHelper
} = require('../api/src/db/helpers/entity');

const {
    ENTITIES_ROLE_ENUM,
    INVOICE_STATUS_ENUM,
    STATUS_ENUM,
    REJECTION_ENUM,
    NOTIFICATION_TYPE,
    GLOBAL_ENUM,
    ROSTER_ROLE_ENUM,
    ROUTES_ENUM,
    TABS_ENUM,
  } = require('../common/enums');

  const { ERROR_ENUM } = require('../common/errors');


class InteractiveToolController {

    static async addAll(body, userId) {
        // console.log('ok ok ok oko kok ok ok ok oko k k');
        console.log('passe dans le controlleur');
        const { eventId, fieldsArray, timeslotsArray, gamesArray } = body;
        const fields = [];
        const games = [];
        const timeslots = [];

        
        if (fieldsArray.length !== 0) {
            fields = addAllFieldsHelper(eventId, fieldsArray);
        }

        console.log(timeslotsArray);
        if (timeslotsArray.length !== 0) {
            timeslots = addAllTimeslotsHelper(eventId, timeslotsArray);
        }

        // if (gamesArray.lenght !== 0) {
        //     games = addAllGamesHelper(eventId, gamesArray);
        // }

        const res = {
            fieldsSaved: fields,
            timeslotSaved: timeslots,
            gamesSaved: games,
        }

        console.log('voici le resultat:' + res);  
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
module.exports = { InteractiveToolController : InteractiveToolController };