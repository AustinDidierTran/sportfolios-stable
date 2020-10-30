const State = require('../state');
const {
  SCORE_SUBMISSION_CHATBOT_STATES,
  BASIC_CHATBOT_STATES,
  MESSENGER_MESSAGES_FR,
} = require('../../../../../../../common/enums');

class AwaitingScoreSubmission extends State {
  handleEvent(webhookEvent) {
    let nextState;
    if (this.isScore(webhookEvent)) {
      const score = this.getScores(webhookEvent);
      console.log(`MY SCORE ${score[0]} OPPONENT ${score[1]}`);
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SCORE_SUBMISSION_CONFIRMATION;
      this.context.chatbotInfos.myScore = Number(score[0]);
      this.context.chatbotInfos.opponentScore = Number(score[1]);
    } else if (
      this.isStop(webhookEvent) ||
      this.isStartOver(webhookEvent)
    ) {
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else {
      this.sendMessages(webhookEvent.sender.id, [
        MESSENGER_MESSAGES_FR.I_DONT_UNDERSTAND,
        MESSENGER_MESSAGES_FR.SCORE_SUBMITION_EXPLAINATION,
      ]);
    }
    if (nextState) {
      this.context.changeState(nextState);
    }
  }

  getIntroMessages() {
    return MESSENGER_MESSAGES_FR.SCORE_SUBMITION_EXPLAINATION;
  }
}

module.exports = AwaitingScoreSubmission;
