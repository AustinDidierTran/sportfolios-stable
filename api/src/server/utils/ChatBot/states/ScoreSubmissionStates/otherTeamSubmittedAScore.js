import i18n from '../../../../../i18n.config.js';
import { SCORE_SUBMISSION_CHATBOT_STATES } from '../../../../../../../common/enums/index.js';
import response from '../../response.js';
import State from '../state.js';

class otherTeamSubmittedAScore extends State {
  async getIntroMessages() {
    const chatbotInfos = this.context.chatbotInfos;
    const submittedBy = chatbotInfos.submittedBy;
    const eventName = chatbotInfos.eventName;

    return {
      messages: [
        response.genText(
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

export default otherTeamSubmittedAScore;
