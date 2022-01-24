import State from '../state.js';
import {
  BASIC_CHATBOT_STATES,
  SCORE_SUBMISSION_CHATBOT_STATES,
} from '../../../../../../../common/enums/index.js';
import { MESSENGER_QUICK_REPLIES } from '../../../enums/index.js';
import Response from '../../response.js';
import i18n from '../../../../../i18n.config.js';
import { isScoreSuggestionAlreadySubmitted } from '../../../../../db/queries/entity-deprecate.js';

class ScoreSubmissionRequestSent extends State {
  async handleEvent(webhookEvent) {
    let nextState;
    const chatbotInfos = this.context.chatbotInfos;
    if (this.isYes(webhookEvent)) {
      if (
        await isScoreSuggestionAlreadySubmitted({
          game_id: chatbotInfos.gameId,
          submitted_by_roster: chatbotInfos.myRosterId,
        })
      ) {
        this.sendMessages(
          webhookEvent.sender.id,
          Response.genText(i18n.__('score_submission.already_submitted')),
        );
        nextState =
          SCORE_SUBMISSION_CHATBOT_STATES.SPIRIT_SUBMISSION_REQUEST_SENT;
      } else {
        nextState = SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SCORE_SUBMISSION;
      }
    } else if (this.isNo(webhookEvent)) {
      this.sendMessages(
        webhookEvent.sender.id,
        Response.genText(i18n.__('ok_back_to_menu')),
      );
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else if (this.isStartOver(webhookEvent)) {
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else {
      this.sendIDontUnderstand(webhookEvent);
    }
    if (nextState) {
      await this.context.changeState(nextState);
    }
  }

  getIntroMessages() {
    const userName = this.context.chatbotInfos.userName;
    const opponentTeams = this.context.chatbotInfos.opponentTeams;
    const teamQuantity = opponentTeams.length;
    const opponentTeamName =
      teamQuantity === 1
        ? opponentTeams[0].teamName
        : opponentTeams.reduce(
            (acc, cur, i) =>
              acc +
              (i < teamQuantity - 1 ? ', ' : ' ' + i18n.__('and') + ' ') +
              cur.teamName,
            '',
          );
    return {
      messages: [
        Response.genQuickReply(
          i18n.__('score_submission.request', userName, opponentTeamName),
          MESSENGER_QUICK_REPLIES.CONFIRMATION,
        ),
      ],
    };
  }
}

export default ScoreSubmissionRequestSent;
