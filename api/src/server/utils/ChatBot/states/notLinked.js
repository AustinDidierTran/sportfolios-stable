const State = require('./state');
const {
  CHATBOT_STATES,
  MESSENGER_MESSAGES_FR,
} = require('../../../../../../common/enums');
const queries = require('../../../../db/queries/facebook');

class NotLinked extends State {
  handleEvent(webhookEvent) {
    let nextState;
    const ref = this.getRef(webhookEvent);
    if (ref) {
      this.handleLinking(ref, webhookEvent.sender.id);
      nextState = CHATBOT_STATES.HOME;
    } else {
      this.handleNoRef(webhookEvent.sender.id);
    }
    if (nextState) {
      this.context.setState(nextState);
    }
  }

  handleLinking(userId, messengerId) {
    queries.linkMessengerAccountAllIncluded(userId, messengerId);
  }

  handleNoRef(messengerId) {
    queries.sendMessage(
      messengerId,
      MESSENGER_MESSAGES_FR.GET_STARTED_NO_REF,
    );
  }
}

module.exports = NotLinked;
