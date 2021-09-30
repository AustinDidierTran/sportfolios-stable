import State from '../state.js';
import { SCORE_SUBMISSION_CHATBOT_STATES, GAME_INFOS_CHATBOT_STATES } from '../../../../../../../common/enums/index.js';
import { MESSENGER_QUICK_REPLIES, MESSENGER_PAYLOADS } from '../../../enums/index.js';
import Response from '../../response.js';
import i18n from '../../../../../i18n.config.js';
import { getGamesWithAwaitingScore } from '../../../../../db/queries/entity-deprecate.js';
import { getUserIdFromMessengerId } from '../../../../../db/queries/user.js';

class Home extends State {
  isStartMock(webhookEvent) {
    const payload = this.getPayload(webhookEvent);
    const text = this.getText(webhookEvent);
    return payload === MESSENGER_PAYLOADS.MOCK || text === 'test';
  }

  async handleEvent(webhookEvent) {
    let nextState;
    const payload = this.getPayload(webhookEvent);
    const text = this.getText(webhookEvent);
    if (
      payload === MESSENGER_PAYLOADS.SUBMIT_A_SCORE ||
      text === 'score'
    ) {
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.GAMES_AWAITING_SCORE_LIST;
    } else if (
      payload === MESSENGER_PAYLOADS.NEXT_GAME ||
      text === 'partie' ||
      text === 'game'
    ) {
      nextState = GAME_INFOS_CHATBOT_STATES.NEXT_GAME_INFOS;
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
    const count = (await getGamesWithAwaitingScore(userId)).length;
    i18n.setLocale('fr');
    const responses = [
      Response.genText(i18n.__('menu.welcome')),
      Response.genQuickReply(
        i18n.__('menu.help'),
        MESSENGER_QUICK_REPLIES.MENU_ACTIONS,
      ),
    ];
    if (count) {
      responses.push(
        Response.genQuickReply(
          i18n.__n('menu.games_awaiting_score_count', count),
          MESSENGER_QUICK_REPLIES.MENU_ACTIONS,
        ),
      );
    }
    return { messages: responses };
  }
}

export default Home;
