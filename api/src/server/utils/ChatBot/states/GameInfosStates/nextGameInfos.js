const State = require('../state');
const {
  BASIC_CHATBOT_STATES,
  MILLIS_TIME_ENUM,
} = require('../../../../../../../common/enums');
const { MESSENGER_QUICK_REPLIES } = require('../../../enums');
const Response = require('../../response');
const i18n = require('../../../../../i18n.config');
const {
  getUserNextGame,
} = require('../../../../../db/helpers/entity');
const {
  getTimezoneFromPSID,
} = require('../../../../../db/helpers/facebook');
const {
  getUserIdFromMessengerId,
} = require('../../../../../db/helpers');
const moment = require('moment');
class NextGameInfos extends State {
  async handleEvent(webhookEvent) {
    let nextState;
    if (this.isStop(webhookEvent) || this.isStartOver(webhookEvent)) {
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else {
      this.sendIDontUnderstand(webhookEvent);
    }
    if (nextState) {
      await this.context.changeState(nextState);
    }
  }

  async getIntroMessages() {
    const userId = await getUserIdFromMessengerId(
      this.context.messengerId,
    );
    const game = await getUserNextGame(userId);
    const timeZone = await getTimezoneFromPSID(
      this.context.messengerId,
    );
    if (!game || game.length === 0) {
      return [
        Response.genQuickReply(
          i18n.__('game_infos.no_game'),
          MESSENGER_QUICK_REPLIES.ENDPOINT_ACTIONS,
        ),
      ];
    }
    const date = new Date(
      new Date(game.timeslot).valueOf() +
        timeZone * MILLIS_TIME_ENUM.ONE_HOUR,
    );
    const infos = {
      event: game.event_name,
      field: game.field,
      timeslot: moment(date).format('LLL'),
      opponentTeams: game.opponent_teams_names.join(
        ' ' + i18n.__('and') + ' ',
      ),
    };
    return [
      Response.genQuickReply(
        i18n.__('game_infos.next_game', infos),
        MESSENGER_QUICK_REPLIES.ENDPOINT_ACTIONS,
      ),
    ];
  }
}

module.exports = NextGameInfos;
