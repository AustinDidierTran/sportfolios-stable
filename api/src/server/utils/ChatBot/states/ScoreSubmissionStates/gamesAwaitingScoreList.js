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
} = require('../../../../../db/helpers/entity');
const {
  getUserIdFromMessengerId,
} = require('../../../../../db/helpers');

class gamesAwaitingScoreList extends State {
  async handleEvent(webhookEvent) {
    let nextState;
    nextState = BASIC_CHATBOT_STATES.HOME;
    console.log(this.getPayload(webhookEvent));
    if (nextState) {
      this.context.changeState(nextState);
    }
  }

  async getIntroMessages() {
    const userId = await getUserIdFromMessengerId(
      this.context.messengerId,
    );
    const games = await getGamesWithAwaitingScore(userId);

    const buttons = games.map(game => {
      const opponentTeamsString = game.opponent_teams_names.concat(
        i18n.__('and'),
      );
      const date = new Date(game.timeslot);
      const dateString =
        date.getDate() + ' ' + i18n.__(MONTH_NAMES[date.getMonth()]);
      return {
        type: 'postback',
        payload: game.game_id,
        title: i18n.__('quick_replies.game_description', {
          date: dateString,
          teams: opponentTeamsString,
        }),
      };
    });
    return [
      Response.genButtonTemplate(
        i18n.__('score_submission.choose_game'),
        buttons,
      ),
    ];
  }
}

module.exports = gamesAwaitingScoreList;
