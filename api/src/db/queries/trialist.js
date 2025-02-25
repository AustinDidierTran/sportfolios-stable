import knex from '../connection.js';

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

async function createComment(content, personId, exerciseId) {
  const [res] = await knex('comments')
    .insert({
      person_id: personId,
      content,
      exercise_id: exerciseId,
    })
    .returning('*');

  return res;
}

function getAllCommentSuggestions(personId, exerciseId) {
  return knex('comments').where({
    person_id: personId,
    exercise_id: exerciseId,
  });
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

function updateSession(session) {
  return knex('sessions')
    .update({
      name: session.name,
      start_date: session.startDate,
    })
    .where({ id: session.id })
    .returning('*');
}

async function getSessionById(sessionId) {
  const [res] = await knex('sessions').where({ id: sessionId });
  return res;
}

function getSessionsByExerciseId(exerciseId) {
  return knex('session_exercises')
    .select('session_id')
    .where({ exercise_id: exerciseId });
}

async function getExerciseById(exerciseId) {
  const [res] = await knex('exercises').where({ id: exerciseId });
  return res;
}

async function addExerciseToSessions(exerciseId, sessionsId) {
  await knex('session_exercises')
    .del()
    .where({ exercise_id: exerciseId });

  const res = Promise.all(
    sessionsId.map(id => {
      return knex('session_exercises').insert({
        session_id: id,
        exercise_id: exerciseId,
      });
    }),
  );

  return res;
}

async function addExercisesToSession(sessionId, exercisesId) {
  await knex('session_exercises')
    .del()
    .where({ session_id: sessionId });

  const res = Promise.all(
    exercisesId.map(id => {
      return knex('session_exercises').insert({
        session_id: sessionId,
        exercise_id: id,
      });
    }),
  );

  return res;
}

export {
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
