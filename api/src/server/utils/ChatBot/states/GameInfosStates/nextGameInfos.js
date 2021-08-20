import State from '../state.js';
import { BASIC_CHATBOT_STATES, MILLIS_TIME_ENUM } from '../../../../../../../common/enums/index.js';
import { MESSENGER_QUICK_REPLIES } from '../../../enums/index.js';
import Response from '../../response.js';
import i18n from '../../../../../i18n.config.js';
import { getUserNextGame } from '../../../../../db/queries/entity.js';
import { getTimezoneFromPSID } from '../../../../../db/queries/facebook.js';
import { getUserIdFromMessengerId } from '../../../../../db/queries/user.js';
import moment from 'moment';
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
      return {
        messages: [
          Response.genQuickReply(
            i18n.__('game_infos.no_game'),
            MESSENGER_QUICK_REPLIES.ENDPOINT_ACTIONS,
          ),
        ],
      };
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
    return {
      messages: [
        Response.genQuickReply(
          i18n.__('game_infos.next_game', infos),
          MESSENGER_QUICK_REPLIES.ENDPOINT_ACTIONS,
        ),
      ],
    };
  }
}

export default NextGameInfos;
