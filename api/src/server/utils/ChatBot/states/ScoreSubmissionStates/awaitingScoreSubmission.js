const State = require('../state');
const {
  SCORE_SUBMISSION_CHATBOT_STATES,
  BASIC_CHATBOT_STATES,
} = require('../../../../../../../common/enums');

class AwaitingScoreSubmissionState extends State {
  handleEvent(webhookEvent) {
    let nextState;
    if (this.isScore(webhookEvent)) {
      const score = this.getScores(webhookEvent);
      console.log(`MY SCORE ${score[0]} OPPONENT ${score[1]}`);
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SCORE_SUBMISSION_CONFIRMATION;
    } else if (this.isStop(webhookEvent)) {
      console.log('STOP');
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else {
      console.log('DEFAULT');
    }
    if (nextState) {
      this.context.changeState(nextState);
    }
  }
}

module.exports = AwaitingScoreSubmissionState;
