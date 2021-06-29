const {
  createEvaluation: createEvaluationHelper,
  getAllCommentSuggestions: getAllCommentSuggestionsHelper,
  getPlayerLastEvaluation: getPlayerLastEvaluationhelper,
  createExercise: createExerciseHelper,
  updateExercise: updateExerciseHelper,
  getSessionById: getSessionByIdHelper,
  linkExerciseToTeam: linkExerciseToTeamHelper,
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

async function createExercise(exercise) {
  const res = await createExerciseHelper(exercise);
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

async function linkExerciseToTeam(teamId, exerciseId) {
  const res = await linkExerciseToTeamHelper(teamId, exerciseId);
  if (!res) {
    return;
  }

  return res;
}

module.exports = {
  createEvaluation,
  getAllCommentSuggestions,
  getPlayerLastEvaluation,
  createExercise,
  updateExercise,
  getSessionById,
  linkExerciseToTeam,
};
