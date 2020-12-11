const { StateFactory } = require('./states');
const { setChatbotInfos } = require('../../../db/queries/facebook');
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

  async saveState() {
    setChatbotInfos(this.messengerId, {
      state: this.stateType,
      chatbot_infos: JSON.stringify(this.chatbotInfos),
    });
  }

  async sendIntroMessages(delay = 0) {
    let finalMessages = [];
    let state = this.stateType;
    do {
      this.setState(state);
      const {
        messages,
        nextState,
      } = await this.state.getIntroMessages();
      finalMessages = finalMessages.concat(messages);
      state = nextState;
    } while (state);
    this.saveState();
    this.state.sendMessages(this.messengerId, finalMessages, delay);
  }
}

module.exports = Chatbot;
