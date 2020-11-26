const State = require('../state');
const {
  BASIC_CHATBOT_STATES,
  SCORE_SUBMISSION_CHATBOT_STATES,
  MONTH_NAMES,
} = require('../../../../../../../common/enums');
const { MESSENGER_QUICK_REPLIES } = require('../../../enums');
const Response = require('../../response');
const i18n = require('../../../../../i18n.config');
const {
  getGamesWithAwaitingScore,
  getGameTeams,
} = require('../../../../../db/helpers/entity');
const {
  getUserIdFromMessengerId,
} = require('../../../../../db/helpers');

class gamesAwaitingScoreList extends State {
  async handleEvent(webhookEvent) {
    let nextState;
    const requestedGame = this.getPayload(webhookEvent);
    if (requestedGame) {
      const { gameId, playerId } = JSON.parse(requestedGame);
      const teams = await getGameTeams(gameId, playerId);
      this.context.chatbotInfos.opponentTeams = [];
      this.context.chatbotInfos.gameId = gameId;
      this.context.chatbotInfos.playerId = playerId;
      chatbotInfos.playerId = playerId;
      let myTeamFound = false;
      teams.forEach(team => {
        if (!myTeamFound && team.player_id) {
          myTeamFound = true;
          this.context.chatbotInfos.myRosterId = team.roster_id;
          this.context.chatbotInfos.myTeamName = team.name;
        } else {
          this.context.chatbotInfos.opponentTeams.push({
            rosterId: team.roster_id,
            teamName: team.name,
          });
        }
        nextState =
          SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SCORE_SUBMISSION;
      });
    } else if (this.isStartOver(webhookEvent)) {
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else {
      this.sendIDontUnderstand(webhookEvent);
    }
    if (nextState) {
      this.context.changeState(nextState);
    }
  }

  async getIntroMessages() {
    const userId = await getUserIdFromMessengerId(
      this.context.messengerId,
    );
    const games = await getGamesWithAwaitingScore(userId);

    const quickReplies = games.map(game => {
      const opponentTeamsString = game.opponent_teams_names.join(
        ' ' + i18n.__('and') + ' ',
      );
      const date = new Date(game.timeslot);
      const dateString =
        date.getDate() +
        ' ' +
        i18n.__(MONTH_NAMES[date.getMonth()]).substring(0, 3) +
        '.';
      return {
        payload: JSON.stringify({
          gameId: game.game_id,
          playerId: game.player_id,
        }),
        title: dateString + ' VS ' + opponentTeamsString,
      };
    });
    return [
      Response.genQuickReply(
        i18n.__('score_submission.choose_game'),
        quickReplies,
      ),
    ];
  }
}

module.exports = gamesAwaitingScoreList;
