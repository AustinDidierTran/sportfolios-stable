const State = require('./state');
const { CHATBOT_STATES } = require('../../../../../../common/enums');

class AwaitingScoreSubmissionState extends State {
  handleEvent(webhookEvent) {
    let nextState;
    if (this.isScore(webhookEvent)) {
      const score = this.getScores(webhookEvent);
      console.log(`MY SCORE ${score[0]} OPPONENT ${score[1]}`);
      nextState =
        CHATBOT_STATES.AWAITING_SCORE_SUBMISSION_CONFIRMATION;
    } else if (this.isStop(webhookEvent)) {
      console.log('STOP');
      nextState = CHATBOT_STATES.HOME;
    } else {
      console.log('DEFAULT');
    }
    if (nextState) {
      this.context.setState(nextState);
    }
  }
}

module.exports = AwaitingScoreSubmissionState;
