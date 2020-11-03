const State = require('../state');
const {
  SCORE_SUBMISSION_CHATBOT_STATES,
  BASIC_CHATBOT_STATES,
} = require('../../../../../../../common/enums');
const { MESSENGER_QUICK_REPLIES } = require('../../../enums');
const i18n = require('../../../../../i18n.config');
const Response = require('../../response');

class AwaitingScoreSubmissionConfirmation extends State {
  handleEvent(webhookEvent) {
    let nextState;
    if (this.isYes(webhookEvent)) {
      //TODO SAVE SCORE
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.SPIRIT_SUBMISSION_REQUEST_SENT;
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
        Response.genText(i18n.__('i_dont_understand')),
        this.getIntroMessages(),
      ]);
    }
    if (nextState) {
      this.context.changeState(nextState);
    }
  }

  getIntroMessages() {
    const myScore = this.context.chatbotInfos.myScore;
    const opponentScore = this.context.chatbotInfos.opponentScore;
    const text =
      myScore > opponentScore
        ? 'score_submission.confirmation.victory'
        : myScore == opponentScore
        ? 'score_submission.confirmation.draw'
        : 'score_submission.confirmation.defeat';
    return Response.genQuickReply(
      i18n.__(text, {
        opponentTeamName: this.context.chatbotInfos.opponentTeamName,
        myScore,
        opponentScore,
      }),
      MESSENGER_QUICK_REPLIES.CONFIRMATION,
    );
  }
}

module.exports = AwaitingScoreSubmissionConfirmation;
