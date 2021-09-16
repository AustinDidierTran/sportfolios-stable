import State from '../state.js';
import { SCORE_SUBMISSION_CHATBOT_STATES, BASIC_CHATBOT_STATES } from '../../../../../../../common/enums/index.js';
import { MESSENGER_QUICK_REPLIES } from '../../../enums/index.js';
import i18n from '../../../../../i18n.config.js';
import Response from '../../response.js';
import { addScoreSuggestion } from '../../../../../db/queries/entity-deprecate.js';
import { ERROR_ENUM } from '../../../../../../../common/errors/index.js';

class AwaitingScoreSubmissionConfirmation extends State {
  async handleEvent(webhookEvent) {
    let nextState;
    if (this.isYes(webhookEvent)) {
      try {
        const chatbotInfos = this.context.chatbotInfos;
        const score = {};
        score[chatbotInfos.myRosterId] = chatbotInfos.myScore;
        chatbotInfos.opponentTeams.forEach(
          team => (score[team.rosterId] = team.score),
        );
        const res = await addScoreSuggestion({
          game_id: chatbotInfos.gameId,
          submitted_by_roster: chatbotInfos.myRosterId,
          submitted_by_person: chatbotInfos.playerId,
          score: JSON.stringify(score),
        });
        if (!res) {
          this.sendMessages(
            webhookEvent.sender.id,
            Response.genQuickReply(
              i18n.__('score_submission.failed'),
              MESSENGER_QUICK_REPLIES.CONFIRMATION,
            ),
          );
          return;
        }
        const myScore = chatbotInfos.myScore;
        const maxOpponentScore = this.context.chatbotInfos.opponentTeams.reduce(
          (acc, curr) => Math.max(acc, curr.score),
          0,
        );
        const text =
          myScore > maxOpponentScore
            ? 'score_submission.confirmed.victory'
            : 'score_submission.confirmed.other';
        this.sendMessages(
          webhookEvent.sender.id,
          Response.genText(i18n.__(text)),
        );

        //TODO handle spirit for more than one team
        if (this.context.chatbotInfos.opponentTeams.length > 1) {
          nextState = BASIC_CHATBOT_STATES.HOME;
        } else {
          nextState =
            SCORE_SUBMISSION_CHATBOT_STATES.SPIRIT_SUBMISSION_REQUEST_SENT;
        }
      } catch (e) {
        if (e.message == ERROR_ENUM.VALUE_ALREADY_EXISTS) {
          this.sendMessages(
            webhookEvent.sender.id,
            Response.genText(
              i18n.__('score_submission.already_submitted'),
            ),
          );
          nextState =
            SCORE_SUBMISSION_CHATBOT_STATES.SPIRIT_SUBMISSION_REQUEST_SENT;
        } else {
          throw e;
        }
      }
    } else if (this.isNo(webhookEvent)) {
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SCORE_SUBMISSION;
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
    const myScore = this.context.chatbotInfos.myScore;
    const opponentTeams = this.context.chatbotInfos.opponentTeams;
    const teamQuantity = opponentTeams.length;
    if (teamQuantity === 1) {
      const text =
        myScore > opponentTeams[0].score
          ? 'score_submission.confirmation.victory'
          : myScore == opponentTeams[0].score
            ? 'score_submission.confirmation.draw'
            : 'score_submission.confirmation.defeat';
      return {
        messages: [
          Response.genQuickReply(
            i18n.__(
              text,
              this.context.chatbotInfos.opponentTeams[0].teamName,
              myScore,
              opponentTeams[0].score,
            ),
            MESSENGER_QUICK_REPLIES.CONFIRMATION,
          ),
        ],
      };
    } else {
      let scores = `${i18n.__('your_team')} (${this.context.chatbotInfos.myTeamName
        }): ${myScore}\n`;
      scores = opponentTeams.reduce(
        (acc, cur) => acc + `${cur.teamName}: ${cur.score}`,
        scores,
      );
      return {
        messages: [
          Response.genQuickReply(
            i18n.__('confirmation.many', scores),
            MESSENGER_QUICK_REPLIES.CONFIRMATION,
          ),
        ],
      };
    }
  }
}

export default AwaitingScoreSubmissionConfirmation;
