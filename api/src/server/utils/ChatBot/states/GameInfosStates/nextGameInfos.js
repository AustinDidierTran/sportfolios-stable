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
const {
  getUserNextGame,
} = require('../../../../../db/helpers/entity');
const {
  getTimezoneFromPSID,
} = require('../../../../../db/helpers/facebook');

class NextGameInfos extends State {
  handleEvent(webhookEvent) {
    let nextState;
    if (this.isStop(webhookEvent) || this.isStartOver(webhookEvent)) {
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else {
      this.sendIDontUnderstand(webhookEvent);
    }
    if (nextState) {
      this.context.changeState(nextState);
    }
  }

  async getIntroMessages() {
    const userId = this.context.chatbotInfos.userId;
    const game = getUserNextGame(userId);
    const timeZone = getTimezoneFromPSID(this.context.messengerId);
    console.log(timeZone);
    return Response.genText(JSON.stringify([game]));
  }
}

module.exports = NextGameInfos;
