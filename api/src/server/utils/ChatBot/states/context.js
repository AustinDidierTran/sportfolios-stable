export class context {
  constructor(initialState) {
    this.state = initialState;
    this.state.setContext(this);
  }

  setState(state) {
    this.setState(state);
  }

  handleEvent(webhookEvent) {
    this.state.handleEvent(webhookEvent);
  }
}
