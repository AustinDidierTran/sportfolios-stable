const { StateFactory } = require('./states');

class Chatbot {
  constructor(initialState) {
    this.setState(initialState);
  }

  setState(stateType) {
    const state = StateFactory(stateType);
    this.state = state;
    this.stateType = stateType;
    this.state.setContext(this);
  }

  handleEvent(webhookEvent) {
    this.state.handleEvent(webhookEvent);
  }
}

module.exports = Chatbot;
