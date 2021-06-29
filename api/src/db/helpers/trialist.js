const knex = require('../connection');

function createEvaluation(evaluation) {
  return knex('evaluations')
    .insert({
      exercise_id: evaluation.exerciseId,
      coach_id: evaluation.coachId,
      person_id: evaluation.personId,
      session_id: evaluation.sessionId,
      game_id: evaluation.gameId,
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
      'evaluations.exercise_id',
      'evaluations.person_id',
      'evaluations.created_at',
      'rating',
      'entities_general_infos.name as coach_name',
      'exercises.name as exercise_name',
      'evaluations.coach_id',
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

function createExercise(exercise) {
  return knex('exercises')
    .insert({
      name: exercise.name,
      description: exercise.description,
    })
    .returning('*');
}

function updateExercise(exercise) {
  return knex('exercises')
    .update({
      name: exercise.name,
      description: exercise.description,
    })
    .where({ id: exercise.id })
    .returning('*');
}

function getSessionById(sessionId) {
  return knex('sessions').where({ id: sessionId });
}

function linkExerciseToTeam(team_id, exercise_id) {
  return knex('team_exercises').insert({ team_id, exercise_id });
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
