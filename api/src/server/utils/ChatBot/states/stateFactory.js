import {
  BASIC_CHATBOT_STATES,
  SCORE_SUBMISSION_CHATBOT_STATES,
  GAME_INFOS_CHATBOT_STATES,
} from '../../../../../../common/enums/index.js';

import {
  AwaitingScoreSubmission,
  ScoreSubmissionRequestSent,
  AwaitingScoreSubmissionConfirmation,
  SpiritSubmissionRequestSent,
  AwaitingSpiritSubmissionConfirmation,
  AwaitingSpiritRules,
  AwaitingSpiritFouls,
  AwaitingSpiritEquity,
  AwaitingSpiritCommunication,
  AwaitingSpiritSelfControl,
  GamesAwaitingScoreList,
  AwaitingAttendance,
  OtherTeamSubmittedAScore,
} from './ScoreSubmissionStates/index.js';

import { Home, NotLinked } from './BasicStates/index.js';
import { NextGameInfos } from './GameInfosStates/index.js';

const stateMap = {
  [SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SCORE_SUBMISSION]: AwaitingScoreSubmission,
  [SCORE_SUBMISSION_CHATBOT_STATES.SCORE_SUBMISSION_REQUEST_SENT]: ScoreSubmissionRequestSent,
  [SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SCORE_SUBMISSION_CONFIRMATION]: AwaitingScoreSubmissionConfirmation,
  [SCORE_SUBMISSION_CHATBOT_STATES.SPIRIT_SUBMISSION_REQUEST_SENT]: SpiritSubmissionRequestSent,
  [BASIC_CHATBOT_STATES.HOME]: Home,
  [BASIC_CHATBOT_STATES.NOT_LINKED]: NotLinked,
  [SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SPIRIT_CONFIRMATION]: AwaitingSpiritSubmissionConfirmation,
  [SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SPIRIT_RULES]: AwaitingSpiritRules,
  [SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SPIRIT_FOULS]: AwaitingSpiritFouls,
  [SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SPIRIT_EQUITY]: AwaitingSpiritEquity,
  [SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SPIRIT_COMMUNICATION]: AwaitingSpiritCommunication,
  [SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SPIRIT_SELF_CONTROL]: AwaitingSpiritSelfControl,
  [SCORE_SUBMISSION_CHATBOT_STATES.GAMES_AWAITING_SCORE_LIST]: GamesAwaitingScoreList,
  [SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_ATTENDANCE]: AwaitingAttendance,
  [SCORE_SUBMISSION_CHATBOT_STATES.OTHER_TEAM_SUBMITTED_A_SCORE]: OtherTeamSubmittedAScore,
  [GAME_INFOS_CHATBOT_STATES.NEXT_GAME_INFOS]: NextGameInfos,
};

function StateFactory(state) {
  const stateClass = stateMap[state];
  if (!stateClass) {
    throw new Error(
      `State ${state} is not implemented in factory yet`,
    );
  }
  return new stateClass();
}

export default StateFactory;
