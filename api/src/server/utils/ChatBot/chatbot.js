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
    this.state.sendMessages(
      this.chatbotInfos.messengerId,
      this.state.getIntroMessages(),
    );
  }

  handleEvent(webhookEvent) {
    this.state.handleEvent(webhookEvent);
  }
}

module.exports = Chatbot;
