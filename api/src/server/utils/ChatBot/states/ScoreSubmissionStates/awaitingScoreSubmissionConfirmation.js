const State = require('../state');
const {
  SCORE_SUBMISSION_CHATBOT_STATES,
  BASIC_CHATBOT_STATES,
  MESSENGER_MESSAGES_FR,
} = require('../../../../../../../common/enums');

class AwaitingScoreSubmissionConfirmation extends State {
  handleEvent(webhookEvent) {
    let nextState;
    if (this.isYes(webhookEvent)) {
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.SPIRIT_SUBMISSION_REQUEST_SENT;
      //TODO SAVE SCORE
    } else if (this.isNo(webhookEvent)) {
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SCORE_SUBMISSION;
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
    return MESSENGER_MESSAGES_FR.SCORE_SUBMISSION_VICTORY;
  }
}

module.exports = AwaitingScoreSubmissionConfirmation;
