import { PHASE_TYPE_ENUM } from '../../../../common/enums/index.js';
import knex from '../connection.js';

const getGameType = async gameId => {
  const [game] = await knex('games')
    .select('type')
    .leftJoin('phase', 'phase.id', '=', 'games.phase_id')
    .where('games.id', gameId);

  return game.type;
};

export const updateTeamGameScores = async (gameId, rosters) => {
  // update score and spirit
  await knex.transaction(trx => {
    const queries = rosters.map(({ rosterId, score, spirit }) => {
      const updateObj = {};

      if (score) {
        updateObj.score = score;
      }

      if (spirit) {
        updateObj.spirit = spirit;
      }

      return knex('game_teams')
        .where({
          game_id: gameId,
          roster_id: rosterId,
        })
        .update(updateObj);
    });

    return Promise.all(queries)
      .then(trx.commit)
      .catch(trx.rollback);
  });

  // update positions
  const positions = rosters.map(r => ({
    rosterId: r.rosterId,
    score: r.score,
    position: 1,
  }));

  if (positions[0].score > positions[1].score) {
    positions[1].position = 2;
  } else if (positions[0].score < positions[1].score) {
    positions[0].position = 2;
  }

  const newPositions = await Promise.all(
    positions.map(async ({ position, rosterId }) => {
      return knex('game_teams')
        .update({ position })
        .where({ game_id: gameId, roster_id: rosterId })
        .returning(['ranking_id', 'position', 'roster_id']);
    }),
  );

  const type = await getGameType(gameId);

  if (type === PHASE_TYPE_ENUM.ELIMINATION_BRACKET) {
    //get winner and loser positions
    const teamSlots = await Promise.all(
      [0, 1].map(async p =>
        knex('elimination_bracket')
          .select(
            'initial_position AS initialPosition',
            'ranking_id AS rankingId',
            'phase_id AS phaseId',
          )
          .where({ ranking_id: newPositions[p].ranking_id }),
      ),
    );

    if (teamSlots.length !== 2) {
      break;
    }

    const teamInitialPositions = teamSlots.map(
      t => t.initialPosition,
    );

    const loserPos = Math.max(...teamInitialPositions);
    const winnerPos = Math.min(...teamInitialPositions);

    if (newPositions[0].position < newPosition[1].position) {
      newPositions[0].bracketPosition = winnerPos;
      newPositions[1].bracketPosition = loserPos;
    } else {
      newPositions[0].bracketPosition = loserPos;
      newPositions[1].bracketPosition = winnerPos;
    }
    await Promise.all(
      newPositions.map(async position => {
        await knex('elimination_bracket')
          .update({
            final_position: position.bracketPosition,
          })
          .where({ ranking_id: position.rankingId });
        await knex('phase_rankings')
          .update({ final_position: position.bracketPosition })
          .where({
            roster_id: position.rosterId,
            current_phase: teamSlots[0].phaseId,
          });
      }),
    );
  }
};
