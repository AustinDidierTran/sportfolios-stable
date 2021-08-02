const State = require('../state');
const {
  BASIC_CHATBOT_STATES,
} = require('../../../../../../../common/enums');
const queries = require('../../../../service/facebook');
const Response = require('../../response');
const i18n = require('../../../../../i18n.config');

class NotLinked extends State {
  async handleEvent(webhookEvent) {
    const ref = this.getRef(webhookEvent);
    if (ref) {
      await this.handleLinking(ref, webhookEvent.sender.id);
    } else {
      this.handleNoRef(webhookEvent.sender.id);
    }
  }

  async handleLinking(userId, messengerId) {
    const success = await queries.linkMessengerAccountAllIncluded(
      userId,
      messengerId,
    );
    if (!success) {
      this.sendMessages(
        messengerId,
        Response.genText(i18n.__('connection.error')),
      );
      return;
    }
    await this.context.changeState(BASIC_CHATBOT_STATES.HOME);
  }

  handleNoRef(messengerId) {
    this.sendMessages(
      messengerId,
      Response.genText(i18n.__('connection.no_ref')),
    );
  }

  getIntroMessages() {
    return {
      messages: [Response.genText(i18n.__('connection.no_ref'))],
    };
  }
}

module.exports = NotLinked;
