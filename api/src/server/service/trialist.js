import {
  createEvaluation as createEvaluationHelper,
  getAllCommentSuggestions as getAllCommentSuggestionsHelper,
  getPlayerLastEvaluation as getPlayerLastEvaluationhelper,
  getPlayerSessionsEvaluations as getPlayerSessionsEvaluationsHelper,
  createTeamExercise as createTeamExerciseHelper,
  updateExercise as updateExerciseHelper,
  getSessionById as getSessionByIdHelper,
  getCoachEvaluations as getCoachEvaluationsHelper,
  getEvaluationComments as getEvaluationCommentsHelper,
  getExerciseById as getExerciseByIdHelper,
  addExerciseToSessions as addExerciseToSessionsHelper,
  getSessionsByExerciseId as getSessionsByExerciseIdHelper,
  addExercisesToSession as addExercisesToSessionHelper,
  updateSession as updateSessionHelper,
  createComment as createCommentHelper,
} from '../../db/queries/trialist.js';

function createEvaluation(evaluation) {
  return createEvaluationHelper(evaluation);
}

function createComment(content, personId, exerciseId) {
  return createCommentHelper(content, personId, exerciseId);
}

function getAllCommentSuggestions(personId, exerciseId) {
  return getAllCommentSuggestionsHelper(personId, exerciseId);
}

function getPlayerLastEvaluation(playerId) {
  return getPlayerLastEvaluationhelper(playerId);
}

function getPlayerSessionsEvaluations(teamId, personId) {
  return getPlayerSessionsEvaluationsHelper(teamId, personId);
}

function getCoachEvaluations(coachId, sessionId, exerciseId) {
  return getCoachEvaluationsHelper(coachId, sessionId, exerciseId);
}

function getEvaluationComments(evaluationId) {
  return getEvaluationCommentsHelper(evaluationId);
}

function createTeamExercise(exercise, teamId) {
  return createTeamExerciseHelper(exercise, teamId);
}

function updateExercise(exercise) {
  return updateExerciseHelper(exercise);
}

function updateSession(session) {
  return updateSessionHelper(session);
}

function getSessionById(session_id) {
  return getSessionByIdHelper(session_id);
}

function getSessionsByExerciseId(exerciseId) {
  return getSessionsByExerciseIdHelper(exerciseId);
}

function getExerciseById(exerciseId) {
  return getExerciseByIdHelper(exerciseId);
}

function addExerciseToSessions(exerciseId, sessionsId) {
  return addExerciseToSessionsHelper(exerciseId, sessionsId);
}

function addExercisesToSession(sessionId, exercisesId) {
  return addExercisesToSessionHelper(sessionId, exercisesId);
}

export {
  createEvaluation,
  getAllCommentSuggestions,
  getPlayerLastEvaluation,
  getPlayerSessionsEvaluations,
  createTeamExercise,
  updateExercise,
  getSessionById,
  getCoachEvaluations,
  getEvaluationComments,
  getExerciseById,
  addExerciseToSessions,
  getSessionsByExerciseId,
  addExercisesToSession,
  updateSession,
  createComment,
};
