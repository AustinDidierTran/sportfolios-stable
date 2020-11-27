const State = require('../state');
const {
  SCORE_SUBMISSION_CHATBOT_STATES,
  GAME_INFOS_CHATBOT_STATES,
} = require('../../../../../../../common/enums');
const {
  MESSENGER_QUICK_REPLIES,
  MESSENGER_PAYLOADS,
} = require('../../../enums');
const Response = require('../../response');
const i18n = require('../../../../../i18n.config');
const {
  getGamesWithAwaitingScore,
} = require('../../../../../db/helpers/entity');
const {
  getUserIdFromMessengerId,
} = require('../../../../../db/helpers');

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
    return [
      Response.genText(i18n.__('menu.welcome')),
      Response.genText(i18n.__('menu.help')),
      Response.genQuickReply(
        i18n.__('menu.games_awaiting_score_count', { count }),
        MESSENGER_QUICK_REPLIES.MENU_ACTIONS,
      ),
    ];
  }
}

module.exports = Home;
