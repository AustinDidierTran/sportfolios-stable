const { StateFactory } = require('./states');

class Chatbot {
  constructor(chatbotInfos) {
    const { state } = chatbotInfos;
    this.chatbotInfos = chatbotInfos;
    this.setState(state);
  }

  setState(stateType) {
    this.state = StateFactory(stateType);
    this.state.setContext(this);
    this.chatbotInfos.state = stateType;
  }

  changeState(stateType) {
    this.setState(stateType);
    this.state.sendIntroMessages(this.chatbotInfos.messengerId);
  }

  handleEvent(webhookEvent) {
    this.state.handleEvent(webhookEvent);
  }
}

module.exports = Chatbot;
