const State = require('../state');
const {
  SCORE_SUBMISSION_CHATBOT_STATES,
} = require('../../../../../../../common/enums');

class Home extends State {
  handleEvent(webhookEvent) {
    let nextState;
    if (this.isStartMock(webhookEvent)) {
      console.log('MOCK');
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.SCORE_SUBMISSION_REQUEST_SENT;
    } else {
      console.log('default');
    }
    if (nextState) {
      this.context.changeState(nextState);
    }
  }
}

module.exports = Home;
