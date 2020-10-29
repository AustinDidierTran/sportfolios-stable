const State = require('../state');
const {
  SCORE_SUBMISSION_CHATBOT_STATES,
  MESSENGER_MESSAGES_FR,
} = require('../../../../../../../common/enums');

class Home extends State {
  handleEvent(webhookEvent) {
    let nextState;
    if (this.isStartMock(webhookEvent)) {
      console.log('MOCK');
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.SCORE_SUBMISSION_REQUEST_SENT;
    } else {
      this.sendMessages(webhookEvent.sender.id, [
        MESSENGER_MESSAGES_FR.I_DONT_UNDERSTAND,
        MESSENGER_MESSAGES_FR.HELP,
      ]);
    }
    if (nextState) {
      this.context.changeState(nextState);
    }
  }

  getIntroMessages() {
    return [
      MESSENGER_MESSAGES_FR.WELCOME,
      MESSENGER_MESSAGES_FR.HELP,
    ];
  }
}

module.exports = Home;
