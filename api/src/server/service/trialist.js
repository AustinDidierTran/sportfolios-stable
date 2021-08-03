const {
  createEvaluation: createEvaluationHelper,
  getAllCommentSuggestions: getAllCommentSuggestionsHelper,
  getPlayerLastEvaluation: getPlayerLastEvaluationhelper,
  getPlayerSessionsEvaluations: getPlayerSessionsEvaluationsHelper,
  createTeamExercise: createTeamExerciseHelper,
  updateExercise: updateExerciseHelper,
  getSessionById: getSessionByIdHelper,
  getCoachEvaluations: getCoachEvaluationsHelper,
  getEvaluationComments: getEvaluationCommentsHelper,
  getExerciseById: getExerciseByIdHelper,
  addExerciseToSessions: addExerciseToSessionsHelper,
  getSessionsByExerciseId: getSessionsByExerciseIdHelper,
  addExercisesToSession: addExercisesToSessionHelper,
  updateSession: updateSessionHelper,
  createComment: createCommentHelper,
} = require('../../db/queries/trialist');

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

module.exports = {
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
