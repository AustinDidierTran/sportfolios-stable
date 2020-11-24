const State = require('../state');
const {
  SCORE_SUBMISSION_CHATBOT_STATES,
  BASIC_CHATBOT_STATES,
} = require('../../../../../../../common/enums');
const { MESSENGER_QUICK_REPLIES } = require('../../../enums');
const i18n = require('../../../../../i18n.config');
const Response = require('../../response');
const {
  addScoreSuggestion,
} = require('../../../../../db/helpers/entity');

class AwaitingScoreSubmissionConfirmation extends State {
  async handleEvent(webhookEvent) {
    let nextState;
    if (this.isYes(webhookEvent)) {
      const chatbotInfos = this.context.chatbotInfos;
      const score = {};
      score[chatbotInfos.myRosterId] = chatbotInfos.myScore;
      chatbotInfos.opponentTeams.forEach(
        team => (score[team.rosterId] = team.score),
      );
      const res = await addScoreSuggestion({
        game_id: chatbotInfos.game_id,
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
        Response.genText(text),
      );
      //TODO handle spirit for more than one team
      if (this.context.chatbotInfos.opponentTeams.length > 1) {
        nextState = BASIC_CHATBOT_STATES.HOME;
      } else {
        nextState =
          SCORE_SUBMISSION_CHATBOT_STATES.SPIRIT_SUBMISSION_REQUEST_SENT;
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
      this.context.changeState(nextState);
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
      return [
        Response.genQuickReply(
          i18n.__(text, {
            opponentTeamName: this.context.chatbotInfos
              .opponentTeams[0].teamName,
            myScore,
            opponentScore: opponentTeams[0].score,
          }),
          MESSENGER_QUICK_REPLIES.CONFIRMATION,
        ),
      ];
    } else {
      let scores = `${i18n.__('your_team')} (${
        this.context.chatbotInfos.myTeamName
      }): ${myScore}\n`;
      scores = opponentTeams.reduce(
        (acc, cur) => acc + `${cur.teamName}: ${cur.score}`,
        scores,
      );
      return [
        Response.genQuickReply(
          i18n.__('confirmation.many', {
            scores,
          }),
          MESSENGER_QUICK_REPLIES.CONFIRMATION,
        ),
      ];
    }
  }
}

module.exports = AwaitingScoreSubmissionConfirmation;
