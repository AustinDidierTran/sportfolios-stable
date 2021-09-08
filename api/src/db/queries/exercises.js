import knex from '../connection.js';

const getTeamExercisesByTeamId = async (teamId) => {
  return await knex('team_exercises')
    .select('exercises.*')
    .where({ team_id: teamId })
    .join('exercises', 'team_exercises.exercise_id', '=', 'exercises.id');
}

const getSessionExercisesBySessionId = async (sessionId) => {
  return await knex('session_exercises')
    .select('exercises.*')
    .where({ session_id: sessionId })
    .join('exercises', 'session_exercises.exercise_id', '=', 'exercises.id');
}

export {
  getTeamExercisesByTeamId,
  getSessionExercisesBySessionId
};