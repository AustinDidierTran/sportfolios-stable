import State from '../state.js';
import { SCORE_SUBMISSION_CHATBOT_STATES, BASIC_CHATBOT_STATES } from '../../../../../../../common/enums/index.js';
import { MESSENGER_QUICK_REPLIES } from '../../../enums/index.js';
import Response from '../../response.js';
import i18n from '../../../../../i18n.config.js';
import { isSpiritAlreadySubmitted } from '../../../../../db/queries/entity-deprecate.js';

class SpiritSubmissionRequestSent extends State {
  async handleEvent(webhookEvent) {
    let nextState;
    const chatbotInfos = this.context.chatbotInfos;
    if (this.isYes(webhookEvent)) {
      if (
        await isSpiritAlreadySubmitted({
          game_id: chatbotInfos.gameId,
          submitted_by_roster: chatbotInfos.myRosterId,
          submitted_for_roster:
            chatbotInfos.opponentTeams[0].rosterId,
        })
      ) {
        this.sendMessages(webhookEvent.sender.id, [
          Response.genText(
            i18n.__('spirit_submission.already_submitted'),
          ),
          Response.genText(i18n.__('back_to_menu')),
        ]);
        nextState = BASIC_CHATBOT_STATES.HOME;
      } else {
        nextState =
          SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SPIRIT_RULES;
      }
    } else if (this.isNo(webhookEvent)) {
      nextState = SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_ATTENDANCE;
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
      await this.context.changeState(nextState);
    }
  }

  getIntroMessages() {
    return {
      messages: [
        Response.genQuickReply(
          i18n.__('spirit_submission.request'),
          MESSENGER_QUICK_REPLIES.CONFIRMATION,
        ),
      ],
    };
  }
}

export default SpiritSubmissionRequestSent;
