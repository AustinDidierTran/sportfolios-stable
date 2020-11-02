const State = require('../state');
const {
  SCORE_SUBMISSION_CHATBOT_STATES,
  BASIC_CHATBOT_STATES,
  MESSENGER_QUICK_REPLIES,
} = require('../../../../../../../common/enums');
const i18n = require('../../../../../i18n.config');
const Response = require('../../response');

class AwaitingSpiritFouls extends State {
  handleEvent(webhookEvent) {
    let nextState;
    if (this.isValidSpirit(webhookEvent)) {
      const score = this.getNumber(webhookEvent);
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SPIRIT_EQUITY;
      this.context.chatbotInfos.spirit.fouls = score;
      //TODO SAVE SCORE
    } else if (
      this.isStop(webhookEvent) ||
      this.isStartOver(webhookEvent)
    ) {
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else {
      this.sendMessages(webhookEvent.sender.id, [
        Response.genText(i18n.__('i_dont_understand')),
        this.getIntroMessages(),
      ]);
    }
    if (nextState) {
      this.context.changeState(nextState);
    }
  }

  getIntroMessages() {
    return Response.genQuickReply(
      i18n.__('spirit_submission.fouls'),
      MESSENGER_QUICK_REPLIES.SPIRIT,
    );
  }
}

module.exports = AwaitingSpiritFouls;
