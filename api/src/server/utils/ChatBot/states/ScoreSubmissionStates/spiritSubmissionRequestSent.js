const State = require('../state');
const {
  SCORE_SUBMISSION_CHATBOT_STATES,
  BASIC_CHATBOT_STATES,
  MESSENGER_MESSAGES_FR,
} = require('../../../../../../../common/enums');

class SpiritSubmissionRequestSent extends State {
  handleEvent(webhookEvent) {
    let nextState;
    if (this.isYes(webhookEvent)) {
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SPIRIT_RULES;
    } else if (this.isNo(webhookEvent)) {
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else if (
      //TODO start over could restart the score submission process
      this.isStop(webhookEvent) ||
      this.isStartOver(webhookEvent)
    ) {
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else {
      //TODO log event when I_DONT_UNDERSTAND is sent, to know wich behaviour could be better
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
    return MESSENGER_MESSAGES_FR.SCORE_CONFIRMED_VICTORY;
  }
}

module.exports = SpiritSubmissionRequestSent;
