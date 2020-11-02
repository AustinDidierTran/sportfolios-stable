const State = require('../state');
const {
  BASIC_CHATBOT_STATES,
} = require('../../../../../../../common/enums');
const queries = require('../../../../../db/queries/facebook');
const Response = require('../../response');
const i18n = require('../../../../../i18n.config');

class NotLinked extends State {
  handleEvent(webhookEvent) {
    let nextState;
    const ref = this.getRef(webhookEvent);
    if (ref) {
      this.handleLinking(ref, webhookEvent.sender.id);
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else {
      this.handleNoRef(webhookEvent.sender.id);
    }
    if (nextState) {
      this.context.changeState(nextState);
    }
  }

  handleLinking(userId, messengerId) {
    queries.linkMessengerAccountAllIncluded(userId, messengerId);
  }

  handleNoRef(messengerId) {
    this.sendMessages(
      messengerId,
      Response.genText(i18n.__('connection.no_ref')),
    );
  }

  getIntroMessages() {
    return Response.genText(i18n.__('connection.no_ref'));
  }
}

module.exports = NotLinked;
