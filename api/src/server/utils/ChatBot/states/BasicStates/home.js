const State = require('../state');
const {
  SCORE_SUBMISSION_CHATBOT_STATES,
} = require('../../../../../../../common/enums');
const {
  MESSENGER_QUICK_REPLIES,
  MESSENGER_PAYLOADS,
} = require('../../../enums');
const Response = require('../../response');
const i18n = require('../../../../../i18n.config');

class Home extends State {
  isStartMock(webhookEvent) {
    const payload = this.getPayload(webhookEvent);
    const text = this.getText(webhookEvent);
    return payload === MESSENGER_PAYLOADS.MOCK || text === 'test';
  }

  handleEvent(webhookEvent) {
    let nextState;
    if (
      this.getPayload(webhookEvent) ===
        MESSENGER_PAYLOADS.SUBMIT_A_SCORE ||
      this.getText(webhookEvent) === 'score'
    ) {
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.GAMES_AWAITING_SCORE_LIST;
    } else {
      this.sendIDontUnderstand(webhookEvent);
    }
    if (nextState) {
      this.context.changeState(nextState);
    }
  }

  async getIntroMessages() {
    const count = (await getGamesWithAwaitingScore).length;
    return [
      Response.genText(i18n.__('menu.welcome')),
      Response.genText(i18n.__('menu.help')),
      Response.genQuickReply(
        i18n.__('games_awaiting_score_count', { count }),
        MESSENGER_QUICK_REPLIES.MENU_ACTIONS,
      ),
    ];
  }
}

module.exports = Home;
