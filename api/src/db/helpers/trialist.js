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

module.exports = {
  createEvaluation,
};
