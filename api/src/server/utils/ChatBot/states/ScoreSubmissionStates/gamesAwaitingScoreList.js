import State from '../state.js';
import { BASIC_CHATBOT_STATES, SCORE_SUBMISSION_CHATBOT_STATES, MONTH_NAMES } from '../../../../../../../common/enums/index.js';
import Response from '../../response.js';
import i18n from '../../../../../i18n.config.js';
import { getGamesWithAwaitingScore, getGameTeams } from '../../../../../db/queries/entity.js';
import { getUserIdFromMessengerId } from '../../../../../db/queries/user.js';
import { MESSENGER_QUICK_REPLIES } from '../../../enums/index.js';

class gamesAwaitingScoreList extends State {
  async handleEvent(webhookEvent) {
    let nextState;
    const requestedGame = this.getPayload(webhookEvent);
    if (this.isStartOver(webhookEvent) || this.isStop(webhookEvent)) {
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else if (requestedGame) {
      const { gameId, playerId, myRosterId, eventId } = JSON.parse(
        requestedGame,
      );
      const teams = await getGameTeams(gameId, playerId);
      this.context.chatbotInfos.opponentTeams = [];
      this.context.chatbotInfos.gameId = gameId;
      this.context.chatbotInfos.playerId = playerId;
      this.context.chatbotInfos.myRosterId = myRosterId;
      this.context.chatbotInfos.eventId = eventId;
      teams.forEach(team => {
        if (team.roster_id === myRosterId) {
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
    } else {
      await this.sendIDontUnderstand(webhookEvent);
    }
    if (nextState) {
      await this.context.changeState(nextState);
    }
  }

  async getIntroMessages() {
    const userId = await getUserIdFromMessengerId(
      this.context.messengerId,
    );
    //Facebook limit the maximum quick replies amount to 13
    const games = await getGamesWithAwaitingScore(userId, 13);
    if (games.length === 0) {
      return {
        messages: [
          Response.genQuickReply(
            i18n.__('score_submission.no_game_awaiting_score'),
            MESSENGER_QUICK_REPLIES.ENDPOINT_ACTIONS,
          ),
        ],
      };
    }
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
          myRosterId: game.roster_id,
          eventId: game.event_id,
        }),
        title: dateString + ' VS ' + opponentTeamsString,
      };
    });
    return {
      messages: [
        Response.genQuickReply(
          i18n.__('score_submission.choose_game'),
          quickReplies,
        ),
      ],
    };
  }
}

export default gamesAwaitingScoreList;
