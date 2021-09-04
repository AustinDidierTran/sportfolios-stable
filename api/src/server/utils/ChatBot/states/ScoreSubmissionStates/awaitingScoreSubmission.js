import State from '../state.js';
import { SCORE_SUBMISSION_CHATBOT_STATES, BASIC_CHATBOT_STATES } from '../../../../../../../common/enums/index.js';
import i18n from '../../../../../i18n.config.js';
import Response from '../../response.js';

class AwaitingScoreSubmission extends State {
  async handleEvent(webhookEvent) {
    let nextState;
    if (this.isScore(webhookEvent)) {
      const score = this.getScores(webhookEvent);
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SCORE_SUBMISSION_CONFIRMATION;
      this.context.chatbotInfos.myScore = Number(score[0]);
      this.context.chatbotInfos.opponentTeams.forEach(
        (team, i) => (team.score = Number(score[i + 1])),
      );
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
    const opponentTeams = this.context.chatbotInfos.opponentTeams;
    const myTeamName = this.context.chatbotInfos.myTeamName;
    const teamQuantity = opponentTeams.length;
    if (teamQuantity > 1) {
      const teamNames = opponentTeams.reduce(
        (acc, cur, i) =>
          acc +
          `[${cur.teamName}]` +
          (i < teamQuantity - 1 ? '-' : ''),
        '',
      );
      const example = [...Array(teamQuantity).keys()].join('-');
      return {
        messages: [
          Response.genText(
            i18n.__(
              'score_submission.explaination_many',
              myTeamName,
              teamNames,
              example,
            ),
          ),
        ],
      };
    } else {
      return {
        messages: [
          Response.genText(
            i18n.__(
              'score_submission.explaination',
              myTeamName,
              opponentTeams[0].teamName,
            ),
          ),
        ],
      };
    }
  }
}

export default AwaitingScoreSubmission;
