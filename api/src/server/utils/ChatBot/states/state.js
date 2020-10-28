const {
  MESSENGER_PAYLOADS,
} = require('../../../../../../common/enums');
class State {
  setContext(context) {
    this.context = context;
  }

  // eslint-disable-next-line no-unused-vars
  handleEvent(webhookEvent) {
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
      text.includes('recommencer') ||
      text.includes('start over') ||
      payload === MESSENGER_PAYLOADS.START_OVER
    );
  }

  isStartMock(webhookEvent) {
    const payload = this.getPayload(webhookEvent);
    const text = this.getText(webhookEvent);
    return (
      payload === MESSENGER_PAYLOADS.MOCK || text.includes('test')
    );
  }

  isScore(webhookEvent) {
    const text = this.getText(webhookEvent);
    return /^[0-9]+-[0-9]+$/i.test(text);
  }

  getScores(webhookEvent) {
    const text = this.getText(webhookEvent);
    return text.split('-');
  }

  isValidSpirit(webhookEvent) {
    const number = this.getNumber(webhookEvent);
    return (
      number && Number.isInteger(number) && number >= 0 && number <= 5
    );
  }

  isStop(webhookEvent) {
    const text = this.getText(webhookEvent);
    const payload = this.getPayload(webhookEvent);
    return (
      text.includes('stop') ||
      text.includes('annuler') ||
      text.includes('cancel') ||
      payload === MESSENGER_PAYLOADS.STOP
    );
  }
}

module.exports = State;
