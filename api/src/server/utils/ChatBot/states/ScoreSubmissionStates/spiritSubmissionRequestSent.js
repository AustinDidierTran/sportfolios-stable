const State = require('../state');
const {
  SCORE_SUBMISSION_CHATBOT_STATES,
  BASIC_CHATBOT_STATES,
} = require('../../../../../../../common/enums');
const { MESSENGER_QUICK_REPLIES } = require('../../../enums');
const Response = require('../../response');
const i18n = require('../../../../../i18n.config');

class SpiritSubmissionRequestSent extends State {
  handleEvent(webhookEvent) {
    let nextState;
    if (this.isYes(webhookEvent)) {
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SPIRIT_RULES;
    } else if (this.isNo(webhookEvent)) {
      this.sendMessages(
        webhookEvent.sender.id,
        Response.genText(i18n.__('back_to_menu')),
      );
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else if (
      //TODO start over could restart the score submission process
      this.isStop(webhookEvent) ||
      this.isStartOver(webhookEvent)
    ) {
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else {
      this.sendIDontUnderstand(webhookEvent);
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
        ? 'score_submission.confirmed.victory'
        : 'score_submission.confirmed.other';
    return [
      Response.genQuickReply(
        i18n.__(text),
        MESSENGER_QUICK_REPLIES.CONFIRMATION,
      ),
    ];
  }
}

module.exports = SpiritSubmissionRequestSent;
