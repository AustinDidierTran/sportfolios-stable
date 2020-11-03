const State = require('../state');
const {
  SCORE_SUBMISSION_CHATBOT_STATES,
} = require('../../../../../../../common/enums');
const { MESSENGER_QUICK_REPLIES } = require('../../../enums');
const Response = require('../../response');
const i18n = require('../../../../../i18n.config');

class Home extends State {
  handleEvent(webhookEvent) {
    let nextState;
    if (this.isStartMock(webhookEvent)) {
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.SCORE_SUBMISSION_REQUEST_SENT;
      this.context.chatbotInfos.opponentTeamName =
        'Didier et les fantastiques';
    } else {
      sendIDontUnderstand(webhookEvent);
    }
    if (nextState) {
      this.context.changeState(nextState);
    }
  }

  getIntroMessages() {
    return [
      Response.genText(i18n.__('menu.welcome')),
      Response.genQuickReply(
        i18n.__('menu.help'),
        MESSENGER_QUICK_REPLIES.MENU_ACTIONS,
      ),
    ];
  }
}

module.exports = Home;
