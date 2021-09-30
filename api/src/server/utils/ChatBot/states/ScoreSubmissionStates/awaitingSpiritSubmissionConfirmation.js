import State from '../state.js';
import { SCORE_SUBMISSION_CHATBOT_STATES, BASIC_CHATBOT_STATES } from '../../../../../../../common/enums/index.js';
import { MESSENGER_QUICK_REPLIES } from '../../../enums/index.js';
import i18n from '../../../../../i18n.config.js';
import Response from '../../response.js';
import { addSpiritSubmission } from '../../../../../db/queries/entity-deprecate.js';
import { ERROR_ENUM } from '../../../../../../../common/errors/index.js';

class AwaitingSpiritSubmissionConfirmation extends State {
  async handleEvent(webhookEvent) {
    let nextState;
    if (this.isYes(webhookEvent)) {
      const chatbotInfos = this.context.chatbotInfos;
      //Saving spirit
      try {
        const spirit = {
          submitted_by_roster: chatbotInfos.myRosterId,
          submitted_by_person: chatbotInfos.playerId,
          game_id: chatbotInfos.gameId,
          submitted_for_roster:
            chatbotInfos.opponentTeams[0].rosterId,
          spirit_score: chatbotInfos.opponentTeams[0].spirit.total,
        };
        const res = await addSpiritSubmission(spirit);
        if (!res) {
          this.sendMessages(
            webhookEvent.sender.id,
            Response.genQuickReply(
              i18n.__('spirit_submission.failed'),
              MESSENGER_QUICK_REPLIES.CONFIRMATION,
            ),
          );
          return;
        }
        this.sendMessages(
          webhookEvent.sender.id,
          Response.genText(i18n.__('spirit_submission.confirmed')),
        );
        nextState =
          SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_ATTENDANCE;
      } catch (e) {
        if (e.message == ERROR_ENUM.VALUE_ALREADY_EXISTS) {
          this.sendMessages(webhookEvent.sender.id, [
            Response.genText(
              i18n.__('spirit_submission.already_submitted'),
            ),
            Response.genText(i18n.__('back_to_menu')),
          ]);
          nextState = BASIC_CHATBOT_STATES.HOME;
        } else {
          throw e;
        }
      }
    } else if (this.isNo(webhookEvent)) {
      //TODO Newstate that ask which modification
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SPIRIT_RULES;
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
    const total = Object.values(
      this.context.chatbotInfos.opponentTeams[0].spirit,
    ).reduce((t, value) => t + value, 0);
    this.context.chatbotInfos.opponentTeams[0].spirit.total = total;
    return {
      messages: [
        Response.genQuickReply(
          i18n.__('spirit_submission.confirmation', {
            ...this.context.chatbotInfos.opponentTeams[0].spirit,
            total,
          }),
          MESSENGER_QUICK_REPLIES.CONFIRMATION,
        ),
      ],
    };
  }
}

export default AwaitingSpiritSubmissionConfirmation;
