import State from '../state.js';
import { SCORE_SUBMISSION_CHATBOT_STATES, BASIC_CHATBOT_STATES } from '../../../../../../../common/enums/index.js';
import { MESSENGER_QUICK_REPLIES } from '../../../enums/index.js';
import i18n from '../../../../../i18n.config.js';
import Response from '../../response.js';

class AwaitingSpiritRules extends State {
  async handleEvent(webhookEvent) {
    let nextState;
    if (this.isValidSpirit(webhookEvent)) {
      const score = this.getNumber(webhookEvent);
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SPIRIT_FOULS;
      if (this.context.chatbotInfos.opponentTeams[0].spirit) {
        this.context.chatbotInfos.spirit.rules = score;
      } else {
        this.context.chatbotInfos.opponentTeams[0].spirit = {
          rules: score,
        };
      }
    } else if (
      this.isStop(webhookEvent) ||
      this.isStartOver(webhookEvent)
    ) {
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else {
      this.sendIDontUnderstand(webhookEvent);
    }
    if (nextState) {
      await this.context.changeState(nextState);
    }
  }

  getIntroMessages() {
    return {
      messages: [
        Response.genQuickReply(
          i18n.__('spirit_submission.rules'),
          MESSENGER_QUICK_REPLIES.SPIRIT,
        ),
      ],
    };
  }
}

export default AwaitingSpiritRules;
