const State = require('./state');
const { CHATBOT_STATES } = require('../../../../../../common/enums');

class InitialState extends State {
  handleEvent(webhookEvent) {
    let nextState;
    if (this.isStartMock(webhookEvent)) {
      console.log('MOCK');
      nextState = CHATBOT_STATES.SCORE_SUBMISSION_REQUEST_SENT;
    } else {
      console.log('default');
    }
    if (nextState) {
      this.context.setState(nextState);
    }
  }
}

module.exports = InitialState;
