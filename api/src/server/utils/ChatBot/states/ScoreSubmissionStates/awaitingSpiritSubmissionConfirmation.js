const State = require('../state');
const {
  SCORE_SUBMISSION_CHATBOT_STATES,
  BASIC_CHATBOT_STATES,
  MESSENGER_MESSAGES_FR,
} = require('../../../../../../../common/enums');

class AwaitingSpiritSubmissionConfirmation extends State {
  handleEvent(webhookEvent) {
    let nextState;
    if (this.isYes(webhookEvent)) {
      //TODO SAVE Spirit
      this.sendMessages(
        webhookEvent.sender.id,
        MESSENGER_MESSAGES_FR.SUBMIT_CONFIRMATION,
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
        MESSENGER_MESSAGES_FR.I_DONT_UNDERSTAND,
        this.getIntroMessages(),
      ]);
    }
    if (nextState) {
      this.context.changeState(nextState);
    }
  }

  getIntroMessages() {
    //TODO personalise if victory or defeat
    return MESSENGER_MESSAGES_FR.SPIRIT_CONFIRMATION;
  }
}

module.exports = AwaitingSpiritSubmissionConfirmation;
