const knex = require('../connection');

async function createEvaluation(evaluation) {
  const [res] = await knex('evaluations')
    .insert({
      exercise_id: evaluation.exerciseId,
      coach_id: evaluation.coachId,
      person_id: evaluation.personId,
      session_id: evaluation.sessionId,
      value: evaluation.value,
    })
    .onConflict([
      'coach_id',
      'exercise_id',
      'person_id',
      'session_id',
    ])
    .merge()
    .returning('*');

  const comments = await knex('evaluation_comments').where({
    evaluation_id: res.id,
  });

  evaluation.commentsId.map(async comm => {
    if (!comments.find(c => c.comment_id === comm)) {
      await knex('evaluation_comments').insert({
        evaluation_id: res.id,
        comment_id: comm,
      });
    }
  });

  const commentsToRemove = comments.filter(
    x => !evaluation.commentsId.includes(x.comment_id),
  );

  commentsToRemove.map(
    async c =>
      await knex('evaluation_comments')
        .del()
        .where({ evaluation_id: res.id, comment_id: c.comment_id }),
  );

  return res;
}

function getAllCommentSuggestions() {
  return knex('comments');
}

async function getPlayerLastEvaluation(playerId) {
  const res = await knex('evaluations')
    .select(
      'evaluations.session_id',
      'evaluations.exercise_id',
      'evaluations.person_id',
      'evaluations.created_at',
      'value',
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

async function getPlayerSessionsEvaluations(teamId, personId) {
  const res = await knex('team_rosters')
    .select(
      'sessions.name',
      'sessions.start_date as startDate',
      'playerEvaluation.evaluations',
    )
    .where({ team_id: teamId })
    .whereNotNull('sessions.start_date')
    .leftJoin(
      'sessions',
      'sessions.roster_id',
      '=',
      'team_rosters.id',
    )
    .leftJoin(
      knex('evaluations')
        .select(
          knex.raw(
            "json_agg(json_build_object('exerciseId', evaluations.exercise_id, 'coachId', evaluations.coach_id, 'personId', evaluations.person_id, 'value', evaluations.value, 'exerciseName', exercises.name)) AS evaluations",
          ),
          'session_id',
        )
        .leftJoin(
          'exercises',
          'exercises.id',
          '=',
          'evaluations.exercise_id',
        )
        .where('evaluations.person_id', '=', personId)
        .groupBy('session_id')
        .as('playerEvaluation'),
      'playerEvaluation.session_id',
      '=',
      'sessions.id',
    )
    .limit(5)
    .orderBy('sessions.start_date', 'desc');

  return res;
}

async function getCoachEvaluations(coachId, sessionId, exerciseId) {
  const res = await knex('evaluations')
    .where({
      coach_id: coachId,
      session_id: sessionId,
      exercise_id: exerciseId,
    })
    .select(
      'value',
      'person_id',
      'coach_id',
      'exercise_id',
      'session_id',
      'id',
    )
    .orderBy('created_at', 'desc');

  const comments = [];

  await Promise.all(
    res.map(async r => {
      const c = await getEvaluationComments(r.id);
      comments.push(c.map(comment => comment.comment_id));
    }),
  );

  const transformed = res.map((r, i) => ({
    ...r,
    commentsId: comments[i],
  }));

  return transformed.map(t => ({
    coachId: t.coach_id,
    exerciseId: t.exercise_id,
    personId: t.person_id,
    id: t.id,
    value: t.value,
    sessionId: t.session_id,
    commentsId: t.commentsId,
  }));
}

async function getEvaluationComments(evaluationId) {
  const res = await knex('evaluation_comments')
    .select('comment_id')
    .where({
      evaluation_id: evaluationId,
    });

  return res;
}

async function createTeamExercise(exercise, team_id) {
  const newExercise = await knex('exercises')
    .insert({
      name: exercise.name,
      description: exercise.description,
      type: exercise.type,
    })
    .returning('*');

  return knex('team_exercises').insert({
    team_id,
    exercise_id: newExercise[0].id,
  });
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

async function getExerciseById(exerciseId) {
  const [res] = await knex('exercises').where({ id: exerciseId });
  return res;
}

function getExercicesByTeamId(team_id) {
  return knex('team_exercises')
    .where({ team_id })
    .leftJoin(
      'exercises',
      'team_exercises.exercise_id',
      '=',
      'exercises.id',
    );
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
