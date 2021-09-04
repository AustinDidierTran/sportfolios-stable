import { MESSENGER_PAYLOADS } from '../../enums/index.js';
import * as queries from '../../../service/facebook.js';
import Response from '../response.js';
import i18n from '../../../../i18n.config.js';
import { BASIC_CHATBOT_STATES } from '../../../../../../common/enums/index.js';

class State {
  setContext(context) {
    this.context = context;
  }

  /*
   *Returns an object in this pattern:
   * {
   *   messages: [array containing state entrance messages]
   *   nextState: (optional) defined if state needs to be changed
   * }
   *
   */
  getIntroMessages() {
    throw new Error(
      'You need to implement the method getIntroMessages',
    );
  }
  /*
   * Called on message reception
   * And must define how to handle this event
   */
  async handleEvent(webhookEvent) {
    if (this.isStop(webhookEvent) || this.isStartOver(webhookEvent)) {
      this.context.changeState(BASIC_CHATBOT_STATES.HOME);
    } else {
      this.sendIDontUnderstand(webhookEvent);
    }
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
      text === 'home' ||
      text === 'menu' ||
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
    const { messages } = await this.getIntroMessages();
    this.sendMessages(messengerId, [
      Response.genText(i18n.__('i_dont_understand')),
      ...messages,
    ]);
    queries.logMessage({ messenger_id: messengerId, state, message });
  }

  sendMessages(messengerId, messages, delay = 0) {
    if (Array.isArray(messages)) {
      let i = 0;
      for (const message of messages) {
        //Sending with a delay so the messages arrives in the right order
        setTimeout(
          () => queries.sendMessage(messengerId, message),
          i * 2000 + delay,
        );
        i++;
      }
    } else {
      queries.sendMessage(messengerId, messages);
    }
  }
}

export default State;
