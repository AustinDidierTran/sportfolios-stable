const {
  createEvaluation: createEvaluationHelper,
  getAllCommentSuggestions: getAllCommentSuggestionsHelper,
  getPlayerLastEvaluation: getPlayerLastEvaluationhelper,
  getPlayerSessionsEvaluations: getPlayerSessionsEvaluationsHelper,
  createTeamExercise: createTeamExerciseHelper,
  updateExercise: updateExerciseHelper,
  getSessionById: getSessionByIdHelper,
  getExercicesByTeamId: getExercicesByTeamIdHelper,
  getCoachEvaluations: getCoachEvaluationsHelper,
  getEvaluationComments: getEvaluationCommentsHelper,
  getExerciseById: getExerciseByIdHelper,
} = require('../helpers/trialist');

async function createEvaluation(evaluation) {
  const res = await createEvaluationHelper(evaluation);
  if (!res) {
    return;
  }

  return res;
}

async function getAllCommentSuggestions() {
  const res = await getAllCommentSuggestionsHelper();
  if (!res) {
    return;
  }
  return res;
}

async function getPlayerLastEvaluation(playerId) {
  const res = await getPlayerLastEvaluationhelper(playerId);
  if (!res) {
    return;
  }
  return res;
}

async function getPlayerSessionsEvaluations(teamId, personId) {
  const res = await getPlayerSessionsEvaluationsHelper(
    teamId,
    personId,
  );
  if (!res) {
    return;
  }
  return res;
}

async function getCoachEvaluations(coachId, sessionId, exerciseId) {
  const res = await getCoachEvaluationsHelper(
    coachId,
    sessionId,
    exerciseId,
  );

  if (!res) {
    return;
  }
  return res;
}

async function getEvaluationComments(evaluationId) {
  const res = await getEvaluationCommentsHelper(evaluationId);
  if (!res) {
    return;
  }
  return res;
}

async function createTeamExercise(exercise, teamId) {
  const res = await createTeamExerciseHelper(exercise, teamId);
  if (!res) {
    return;
  }

  return res;
}

async function updateExercise(exercise) {
  const res = await updateExerciseHelper(exercise);
  if (!res) {
    return;
  }

  return res;
}

async function getSessionById(session_id) {
  const res = await getSessionByIdHelper(session_id);
  if (!res) {
    return;
  }

  return res;
}

async function getExercicesByTeamId(teamId) {
  const res = await getExercicesByTeamIdHelper(teamId);
  if (!res) {
    return;
  }

  return res;
}

async function getExerciseById(exerciseId) {
  const res = await getExerciseByIdHelper(exerciseId);
  if (!res) {
    return;
  }

  return res;
}

module.exports = {
  createEvaluation,
  getAllCommentSuggestions,
  getPlayerLastEvaluation,
  getPlayerSessionsEvaluations,
  createTeamExercise,
  updateExercise,
  getSessionById,
  getExercicesByTeamId,
  getCoachEvaluations,
  getEvaluationComments,
  getExerciseById,
};
