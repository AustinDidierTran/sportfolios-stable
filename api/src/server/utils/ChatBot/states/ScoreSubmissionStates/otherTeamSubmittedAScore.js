const i18n = require('../../../../../i18n.config');
const {
  SCORE_SUBMISSION_CHATBOT_STATES,
} = require('../../../../../../../common/enums');
const { genText } = require('../../response');
const State = require('../state');

class otherTeamSubmittedAScore extends State {
  async getIntroMessages() {
    const chatbotInfos = this.context.chatbotInfos;
    const submittedBy = chatbotInfos.submittedBy;
    const eventName = chatbotInfos.eventName;

    return {
      messages: [
        genText(
          i18n.__(
            '{{submittedBy}} submitted the following score for your game of the event {{eventName}}',
            { submittedBy, eventName },
          ),
        ),
      ],
      nextState:
        SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SCORE_SUBMISSION_CONFIRMATION,
    };
  }
}

module.exports = otherTeamSubmittedAScore;
