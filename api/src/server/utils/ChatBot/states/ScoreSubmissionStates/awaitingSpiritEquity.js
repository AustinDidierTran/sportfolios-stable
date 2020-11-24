const State = require('../state');
const {
  SCORE_SUBMISSION_CHATBOT_STATES,
  BASIC_CHATBOT_STATES,
} = require('../../../../../../../common/enums');
const { MESSENGER_QUICK_REPLIES } = require('../../../enums');
const i18n = require('../../../../../i18n.config');
const Response = require('../../response');

class AwaitingSpiritEquity extends State {
  handleEvent(webhookEvent) {
    let nextState;
    if (this.isValidSpirit(webhookEvent)) {
      const score = this.getNumber(webhookEvent);
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SPIRIT_SELF_CONTROL;
      this.context.chatbotInfos.opponentTeams[0].spirit.equity = score;
    } else if (
      this.isStop(webhookEvent) ||
      this.isStartOver(webhookEvent)
    ) {
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else {
      this.sendIDontUnderstand(webhookEvent);
    }
    if (nextState) {
      this.context.changeState(nextState);
    }
  }

  getIntroMessages() {
    return [
      Response.genQuickReply(
        i18n.__('spirit_submission.equity'),
        MESSENGER_QUICK_REPLIES.SPIRIT,
      ),
    ];
  }
}

module.exports = AwaitingSpiritEquity;
