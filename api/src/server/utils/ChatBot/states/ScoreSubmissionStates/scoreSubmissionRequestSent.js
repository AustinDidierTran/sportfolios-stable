const State = require('../state');
const {
  BASIC_CHATBOT_STATES,
  SCORE_SUBMISSION_CHATBOT_STATES,
} = require('../../../../../../../common/enums');
const { MESSENGER_QUICK_REPLIES } = require('../../../enums');
const Response = require('../../response');
const i18n = require('../../../../../i18n.config');

class ScoreSubmissionRequestSent extends State {
  handleEvent(webhookEvent) {
    let nextState;
    if (this.isYes(webhookEvent)) {
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SCORE_SUBMISSION;
    } else if (this.isNo(webhookEvent)) {
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else if (this.isStartOver(webhookEvent)) {
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else {
      sendIDontUnderstand(webhookEvent);
    }
    if (nextState) {
      this.context.changeState(nextState);
    }
  }

  getIntroMessages() {
    const userName = this.context.chatbotInfos.userName;
    const opponentTeamName = this.context.chatbotInfos
      .opponentTeamName;
    return Response.genQuickReply(
      i18n.__('score_submission.request', {
        userName,
        opponentTeamName,
      }),
      MESSENGER_QUICK_REPLIES.CONFIRMATION,
    );
  }
}

module.exports = ScoreSubmissionRequestSent;
