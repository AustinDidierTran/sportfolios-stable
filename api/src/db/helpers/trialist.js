const knex = require('../connection');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const moment = require('moment');

function createEvaluation(evaluation) {
  return knex('evaluations')
    .insert({
      exercise_id: evaluation.exercise_id,
      coach_id: evaluation.coach_id,
      person_id: evaluation.person_id,
      session_id: evaluation.session_id,
      game_id: evaluation.game_id,
      rating: evaluation.rating,
    })
    .returning('*');
}

function getAllCommentSuggestions() {
  return knex('comments');
}

async function getPlayerLastEvaluation(playerId) {
  let res = await knex('evaluations')
    .select(
      'evaluations.game_id',
      'evaluations.session_id',
      'rating',
      'entities_general_infos.name as coach_name',
      'exercises.name as exercise_name',
    )

    .where({ person_id: playerId })
    .leftJoin(
      'entities_general_infos',
      'entities_general_infos.entity_id',
      '=',
      'evaluations.coach_id',
    )
    .leftJoin(
      'exercises',
      'exercises.id',
      '=',
      'evaluations.exercise_id',
    )
    .limit(5)
    .orderBy('evaluations.created_at', 'desc');

  return res;
}

module.exports = {
  createEvaluation,
  getAllCommentSuggestions,
  getPlayerLastEvaluation,
};
