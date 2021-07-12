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

  evaluation.comments.map(async (comm, i) => {
    if (comments.find(c => c === comm)) {
      comments.splice(i, 1);
    } else {
      await knex('evaluation_comments').insert({
        evaluation_id: res.id,
        comment_id: comm,
      });
    }
  });

  comments.map(
    async c =>
      await knex('evaluation_comments')
        .where({ evaluation_id: res.id, comment_id: c })
        .del(),
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

  /*   res.map(async (r, index) => {
    console.log(r);
    const c = await knex('evaluation_comments')
      .select('comment_id')
      .where({
        evaluation_id: r.id,
      });
    const transformed = c.map(comment => comment.comment_id);
    console.log('T = ', transformed);
    res[index].comments = transformed;
  }); */

  const comments = [];

  await Promise.all(
    res.map(async (r, index) => {
      const c = await knex('evaluation_comments')
        .select('comment_id')
        .where({
          evaluation_id: r.id,
        });
      //  const transformed = c.map(comment => comment.comment_id);
      comments.push(c.map(comment => comment.comment_id));
    }),
  );

  const newobj = res.map((r, i) => ({ ...r, comments: comments[i] }));

  return newobj;
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
};
