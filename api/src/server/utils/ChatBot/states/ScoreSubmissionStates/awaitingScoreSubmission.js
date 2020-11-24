const State = require('../state');
const {
  SCORE_SUBMISSION_CHATBOT_STATES,
  BASIC_CHATBOT_STATES,
} = require('../../../../../../../common/enums');
const i18n = require('../../../../../i18n.config');
const Response = require('../../response');

class AwaitingScoreSubmission extends State {
  handleEvent(webhookEvent) {
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
      this.context.changeState(nextState);
    }
  }

  getIntroMessages() {
    const opponentTeams = this.context.chatbotInfos.opponentTeams;
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
      return [
        Response.genText(
          i18n.__('score_submission.explaination_many', {
            teamNames,
            example,
          }),
        ),
      ];
    } else {
      return [
        Response.genText(i18n.__('score_submission.explaination')),
      ];
    }
  }
}

module.exports = AwaitingScoreSubmission;
