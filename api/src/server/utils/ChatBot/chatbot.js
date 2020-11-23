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
    //We add a delay so these messages arrives after the ones sent before changing state
    setTimeout(
      () =>
        this.state.sendMessages(
          this.messengerId,
          this.state.getIntroMessages(),
        ),
      1000,
    );
  }

  handleEvent(webhookEvent) {
    this.state.handleEvent(webhookEvent);
  }

  sendIntroMessages() {
    this.state.sendMessages(
      this.messengerId,
      this.state.getIntroMessages(),
    );
  }
}

module.exports = Chatbot;
