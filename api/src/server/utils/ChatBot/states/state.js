const { MESSENGER_PAYLOADS } = require('../../enums');
const queries = require('../../../../db/queries/facebook');
const Response = require('../response');
const i18n = require('../../../../i18n.config');

class State {
  setContext(context) {
    this.context = context;
  }

  getIntroMessages() {
    throw new Error(
      'You need to implement the method getIntroMessages',
    );
  }

  // eslint-disable-next-line no-unused-vars
  async handleEvent(webhookEvent) {
    throw new Error('You need to implement the method handleEvent');
  }

  getText(webhookEvent) {
    if (
      webhookEvent &&
      webhookEvent.message &&
      webhookEvent.message.text
    ) {
      return webhookEvent.message.text.trim().toLowerCase();
    }
    return;
  }

  getPayload(webhookEvent) {
    if (
      webhookEvent &&
      webhookEvent.message &&
      webhookEvent.message.quick_reply &&
      webhookEvent.message.quick_reply.payload
    ) {
      return webhookEvent.message.quick_reply.payload;
    } else if (
      webhookEvent &&
      webhookEvent.postback &&
      webhookEvent.postback.payload
    ) {
      return webhookEvent.postback.payload;
    }
    return;
  }

  getFirstEntity(nlp, name) {
    return (
      nlp &&
      nlp.entities &&
      nlp.entities[name] &&
      nlp.entities[name][0]
    );
  }

  getNumber(webhookEvent) {
    const text = this.getText(webhookEvent);
    return Number(text);
  }

  isYes(webhookEvent) {
    const text = this.getText(webhookEvent);
    const payload = this.getPayload(webhookEvent);
    return (
      text === 'yes' ||
      text === 'oui' ||
      payload === MESSENGER_PAYLOADS.YES
    );
  }

  isNo(webhookEvent) {
    const text = this.getText(webhookEvent);
    const payload = this.getPayload(webhookEvent);
    return (
      text === 'no' ||
      text === 'non' ||
      payload === MESSENGER_PAYLOADS.NO
    );
  }

  isStartOver(webhookEvent) {
    const greeting = this.getFirstEntity(
      webhookEvent.message.nlp,
      'greetings',
    );
    const isGreeting = greeting && greeting.confidence > 0.8;
    const text = this.getText(webhookEvent);
    const payload = this.getPayload(webhookEvent);
    return (
      isGreeting ||
      text === 'recommencer' ||
      text === 'start over' ||
      payload === MESSENGER_PAYLOADS.START_OVER
    );
  }

  isScore(webhookEvent) {
    const text = this.getText(webhookEvent);
    return /^[0-9]+-[0-9]+$/i.test(text);
  }

  getRef(webhookEvent) {
    if (webhookEvent.postback && webhookEvent.postback.referral) {
      return webhookEvent.postback.referral.ref;
    }
    if (webhookEvent.referral) {
      return webhookEvent.referral.ref;
    }
  }

  getScores(webhookEvent) {
    const text = this.getText(webhookEvent);
    return text.split('-');
  }

  isValidSpirit(webhookEvent) {
    const number = this.getNumber(webhookEvent);
    return Number.isInteger(number) && number >= 0 && number < 5;
  }

  isStop(webhookEvent) {
    const text = this.getText(webhookEvent);
    const payload = this.getPayload(webhookEvent);
    return (
      text === 'stop' ||
      text === 'annuler' ||
      text === 'cancel' ||
      payload === MESSENGER_PAYLOADS.STOP
    );
  }

  async sendIDontUnderstand(webhookEvent) {
    const messengerId = webhookEvent.sender.id;
    const message = webhookEvent.message.text;
    const state = this.context.stateType;
    this.sendMessages(messengerId, [
      Response.genText(i18n.__('i_dont_understand')),
      ...(await this.getIntroMessages()),
    ]);
    queries.logMessage({ messenger_id: messengerId, state, message });
  }

  sendMessages(messengerId, messages) {
    if (Array.isArray(messages)) {
      let delay = 0;
      for (const message of messages) {
        //Sending with a delay so the messages arrives in the right order
        setTimeout(
          () => queries.sendMessage(messengerId, message),
          delay * 2000,
        );
        delay++;
      }
    } else {
      queries.sendMessage(messengerId, messages);
    }
  }
}

module.exports = State;
