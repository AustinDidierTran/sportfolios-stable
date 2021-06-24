const {
  createEvaluation: createEvaluationHelper,
  getAllCommentSuggestions: getAllCommentSuggestionsHelper,
  getPlayerLastEvaluation: getPlayerLastEvaluationhelper,
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

module.exports = {
  createEvaluation,
  getAllCommentSuggestions,
  getPlayerLastEvaluation,
};
