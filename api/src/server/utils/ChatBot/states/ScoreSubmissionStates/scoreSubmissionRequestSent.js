const State = require('../state');
const {
  BASIC_CHATBOT_STATES,
  SCORE_SUBMISSION_CHATBOT_STATES,
  MESSENGER_MESSAGES_FR,
} = require('../../../../../../../common/enums');

class ScoreSubmissionRequestSent extends State {
  handleEvent(webhookEvent) {
    let nextState;
    if (this.isYes(webhookEvent)) {
      console.log('YES');
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SCORE_SUBMISSION;
    } else if (this.isNo(webhookEvent)) {
      console.log('NO');
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else if (this.isStartOver(webhookEvent)) {
      console.log('Start over');
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else {
      console.log('DEFAULT');
    }
    this.context.changeState(nextState);
  }

  getIntroMessages() {
    return MESSENGER_MESSAGES_FR.REQUEST_SCORE_SUBMISSION;
  }
}

module.exports = ScoreSubmissionRequestSent;
