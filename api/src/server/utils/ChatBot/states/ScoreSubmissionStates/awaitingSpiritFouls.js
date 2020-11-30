const State = require('../state');
const {
  SCORE_SUBMISSION_CHATBOT_STATES,
  BASIC_CHATBOT_STATES,
} = require('../../../../../../../common/enums');
const { MESSENGER_QUICK_REPLIES } = require('../../../enums');
const i18n = require('../../../../../i18n.config');
const Response = require('../../response');

class AwaitingSpiritFouls extends State {
  async handleEvent(webhookEvent) {
    let nextState;
    if (this.isValidSpirit(webhookEvent)) {
      const score = this.getNumber(webhookEvent);
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SPIRIT_EQUITY;
      this.context.chatbotInfos.opponentTeams[0].spirit.fouls = score;
    } else if (
      this.isStop(webhookEvent) ||
      this.isStartOver(webhookEvent)
    ) {
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else {
      this.sendIDontUnderstand(webhookEvent);
    }
    if (nextState) {
      await this.context.changeState(nextState);
    }
  }

  getIntroMessages() {
    return [
      Response.genQuickReply(
        i18n.__('spirit_submission.fouls'),
        MESSENGER_QUICK_REPLIES.SPIRIT,
      ),
    ];
  }
}

module.exports = AwaitingSpiritFouls;
