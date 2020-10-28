const State = require('./state');
const { CHATBOT_STATES } = require('../../../../../../common/enums');

class ScoreSubmissionRequestSent extends State {
  handleEvent(webhookEvent) {
    let nextState;
    if (this.isYes(webhookEvent)) {
      console.log('YES');
      nextState = CHATBOT_STATES.AWAITING_SCORE_SUBMISSION;
    } else if (this.isNo(webhookEvent)) {
      console.log('NO');
      nextState = CHATBOT_STATES.HOME;
    } else if (this.isStartOver(webhookEvent)) {
      console.log('Start over');
      nextState = CHATBOT_STATES.HOME;
    } else {
      console.log('DEFAULT');
    }
    this.context.setState(nextState);
  }
}

module.exports = ScoreSubmissionRequestSent;
