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
      'rating',
      'entities_general_infos.name as coach_name',
      'exercises.name as exercise_name',
      'event_time_slots.date as game_date',
      'sessions.start_date as session_date',
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
    .leftJoin(
      'event_time_slots',
      'event_time_slots.event_id',
      '=',
      'evaluations.game_id',
    )
    .leftJoin(
      'sessions',
      'sessions.id',
      '=',
      'evaluations.session_id',
    );

  console.log(res);

  return res;
}

module.exports = {
  createEvaluation,
  getAllCommentSuggestions,
  getPlayerLastEvaluation,
};
