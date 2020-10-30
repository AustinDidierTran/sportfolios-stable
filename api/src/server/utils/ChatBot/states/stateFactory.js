const {
  BASIC_CHATBOT_STATES,
  SCORE_SUBMISSION_CHATBOT_STATES,
} = require('../../../../../../common/enums');
const {
  AwaitingScoreSubmission,
  ScoreSubmissionRequestSent,
  AwaitingScoreSubmissionConfirmation,
  SpiritSubmissionRequestSent,
} = require('./ScoreSubmissionStates');
const { Home, NotLinked } = require('./BasicStates');

const stateMap = {
  [SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SCORE_SUBMISSION]: AwaitingScoreSubmission,
  [SCORE_SUBMISSION_CHATBOT_STATES.SCORE_SUBMISSION_REQUEST_SENT]: ScoreSubmissionRequestSent,
  [SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SCORE_SUBMISSION_CONFIRMATION]: AwaitingScoreSubmissionConfirmation,
  [SCORE_SUBMISSION_CHATBOT_STATES.SPIRIT_SUBMISSION_REQUEST_SENT]: SpiritSubmissionRequestSent,
  [BASIC_CHATBOT_STATES.HOME]: Home,
  [BASIC_CHATBOT_STATES.NOT_LINKED]: NotLinked,
};

function StateFactory(state) {
  const stateClass = stateMap[state];
  if (!stateClass) {
    // eslint-disable-next-line no-console
    console.error(`State ${state} is not implemented in factory yet`);
    return new Home();
  }
  return new stateClass();
}

module.exports = StateFactory;
