const { CHATBOT_STATES } = require('../../../../../../common/enums');
const AwaitingScoreSubmissionState = require('./awaitingScoreSubmission');
const ScoreSubmissionRequestSent = require('./scoreSubmissionRequestSent');
const InitialState = require('./initialState');
const NotLinked = require('./notLinked');

const stateMap = {
  [CHATBOT_STATES.AWAITING_SCORE_SUBMISSION]: AwaitingScoreSubmissionState,
  [CHATBOT_STATES.SCORE_SUBMISSION_REQUEST_SENT]: ScoreSubmissionRequestSent,
  [CHATBOT_STATES.HOME]: InitialState,
  [CHATBOT_STATES.NOT_LINKED]: NotLinked,
};

function StateFactory(state) {
  const stateClass = stateMap[state];
  if (!stateClass) {
    // eslint-disable-next-line no-console
    console.error(`State ${state} is not implemented in factory yet`);
    return new InitialState();
  }
  return new stateClass();
}

module.exports = StateFactory;
