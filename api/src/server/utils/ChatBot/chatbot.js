const { StateFactory } = require('./states');

class Chatbot {
  constructor(messengerId, stateType, chatbotInfos) {
    this.messengerId = messengerId;
    this.chatbotInfos = chatbotInfos;
    this.setState(stateType);
  }

  setState(stateType) {
    this.state = StateFactory(stateType);
    this.state.setContext(this);
    this.stateType = stateType;
  }

  async changeState(stateType) {
    this.setState(stateType);
    //We add a delay so these messages arrives after the ones sent before changing state
    await this.sendIntroMessages(1000);
  }

  async handleEvent(webhookEvent) {
    await this.state.handleEvent(webhookEvent);
  }

  async sendIntroMessages(delay = 0) {
    const messages = await this.sendIntroMessages();
    this.state.sendMessages(this.messengerId, messages, delay);
  }
}

module.exports = Chatbot;
