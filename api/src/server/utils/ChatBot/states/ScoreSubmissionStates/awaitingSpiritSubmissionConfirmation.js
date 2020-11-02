const State = require('../state');
const {
  SCORE_SUBMISSION_CHATBOT_STATES,
  BASIC_CHATBOT_STATES,
  MESSENGER_QUICK_REPLIES,
} = require('../../../../../../../common/enums');
const i18n = require('../../../../../i18n.config');
const Response = require('../../response');

class AwaitingSpiritSubmissionConfirmation extends State {
  handleEvent(webhookEvent) {
    let nextState;
    if (this.isYes(webhookEvent)) {
      //TODO SAVE Spirit
      this.sendMessages(
        webhookEvent.sender.id,
        Response.genText(i18n.__('spirit_submission.confirmed')),
      );
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else if (this.isNo(webhookEvent)) {
      //TODO Newstate that ask which modification
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SPIRIT_RULES;
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
    const total = Object.values(
      this.context.chatbotInfos.spirit,
    ).reduce((t, value) => t + value, 0);
    return Response.genQuickReply(
      i18n.__('spirit_submission.confirmation', {
        ...this.context.chatbotInfos.spirit,
        total,
      }),
      MESSENGER_QUICK_REPLIES.CONFIRMATION,
    );
  }
}

module.exports = AwaitingSpiritSubmissionConfirmation;
