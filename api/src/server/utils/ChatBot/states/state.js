export class State {
  constructor() {}

  setContext(context) {
    this.context = context;
  }

  // eslint-disable-next-line no-unused-vars
  handleEvent(webhookEvent) {
    throw new Error('You need to implement the method handleEvent');
  }
}
