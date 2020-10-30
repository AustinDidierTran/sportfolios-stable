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

  changeState(stateType) {
    this.setState(stateType);
    this.state.sendMessages(
      this.messengerId,
      this.state.getIntroMessages(),
    );
  }

  handleEvent(webhookEvent) {
    this.state.handleEvent(webhookEvent);
  }
}

module.exports = Chatbot;
