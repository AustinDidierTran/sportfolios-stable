import {
  PHASE_TYPE_ENUM,
  STATUS_ENUM,
  GLOBAL_ENUM,
} from '../../../../common/enums/index.js';
import knex from '../connection.js';
import { entities } from '../models/entities.js';

const getGameType = async gameId => {
  const [game] = await knex('games')
    .select('type')
    .leftJoin('phase', 'phase.id', '=', 'games.phase_id')
    .where('games.id', gameId);

  return game.type;
};

async function getPhaseInfo(phaseId) {
  const [phase] = await knex('phase')
    .select('type', 'name', 'status')
    .where({ id: phaseId });
  return phase;
}

async function getTeamByRosterId(id) {
  const [team] = await knex('team_rosters')
    .select('*')
    .leftJoin(
      'entities_general_infos',
      'entities_general_infos.entity_id',
      '=',
      'team_rosters.team_id',
    )
    .where({ id });

  return team;
}

async function updateGameTeamName(ranking) {
  let phaseId = null;

  if (ranking.current_phase) {
    phaseId = ranking.current_phase;
  } else {
    phaseId = ranking.phase_id;
  }
  const { type, name: phaseName, status } = await getPhaseInfo(
    phaseId,
  );

  let fullName = `${ranking.initial_position}. ${phaseName}`;

  if (ranking.roster_id) {
    const { name: teamName } = await getTeamByRosterId(
      ranking.roster_id,
    );
    if (type === PHASE_TYPE_ENUM.ELIMINATION_BRACKET) {
      fullName = `${ranking.initial_position}. ${teamName}`;
    } else if (status == PHASE_STATUS_ENUM.STARTED) {
      fullName = teamName;
    } else {
      fullName = `${ranking.initial_position}. ${phaseName} (${teamName})`;
    }
  }

  await knex('game_teams')
    .update({ name: fullName })
    .where({ ranking_id: ranking.ranking_id });
}

// Route when score and spirit has been added manually
/**
 *
 * @param {uuid} gameId
 * @param {[{ rosterId, score, spirit }]} rosters
 * @returns
 */
export const updateTeamGameScores = async (gameId, rosters) => {
  const type = await getGameType(gameId);

  //update Score
  const teams = [];
  await Promise.all(
    rosters.map(async roster => {
      const [t] = await knex('game_teams')
        .where({ game_id: gameId, roster_id: roster.rosterId })
        .update({ score: roster.score, spirit: roster.spirit })
        .returning('*');
      teams.push(t);
    }),
  );

  //get Positions
  let pos0 = 1;
  let pos1 = 1;

  if (teams[0].score > teams[1].score) {
    pos0 = 1;
    pos1 = 2;
  } else if (teams[0].score < teams[1].score) {
    pos0 = 2;
    pos1 = 1;
  }

  //update positions
  const [team0] = await knex('game_teams')
    .update({ position: pos0 })
    .where({ game_id: gameId, roster_id: teams[0].roster_id })
    .returning(['ranking_id', 'position', 'roster_id']);

  const [team1] = await knex('game_teams')
    .update({ position: pos1 })
    .where({ game_id: gameId, roster_id: teams[1].roster_id })
    .returning(['ranking_id', 'position', 'roster_id']);

  if (type === PHASE_TYPE_ENUM.ELIMINATION_BRACKET) {
    //get winner and loser positions
    const [t0] = await knex('elimination_bracket')
      .select('*')
      .where({ ranking_id: team0.ranking_id });

    const [t1] = await knex('elimination_bracket')
      .select('*')
      .where({ ranking_id: team1.ranking_id });

    if (t0 && t1) {
      const loserPos = Math.max(
        t0.initial_position,
        t1.initial_position,
      );
      const winnerPos = Math.min(
        t0.initial_position,
        t1.initial_position,
      );

      //update winner and loser position

      let posTeam0 = winnerPos;
      let posTeam1 = loserPos;

      if (team0.position > team1.position) {
        posTeam0 = loserPos;
        posTeam1 = winnerPos;
      }
      await knex('elimination_bracket')
        .update({
          final_position: posTeam0,
        })
        .where({
          ranking_id: team0.ranking_id,
        });
      await knex('phase_rankings')
        .update({
          final_position: posTeam0,
        })
        .where({
          roster_id: team0.roster_id,
          current_phase: t0.phase_id,
        });

      const [ranking0] = await knex('elimination_bracket')
        .update({
          roster_id: team0.roster_id,
        })
        .where({
          origin_step: t0.current_step,
          initial_position: posTeam0,
          phase_id: t0.phase_id,
        })
        .returning('*');

      await knex('elimination_bracket')
        .update({
          final_position: posTeam1,
        })
        .where({
          ranking_id: team1.ranking_id,
        });

      await knex('phase_rankings')
        .update({
          final_position: posTeam1,
        })
        .where({
          roster_id: team1.roster_id,
          current_phase: t1.phase_id,
        });

      const [ranking1] = await knex('elimination_bracket')
        .update({
          roster_id: team1.roster_id,
        })
        .where({
          origin_step: t1.current_step,
          initial_position: posTeam1,
          phase_id: t1.phase_id,
        })
        .returning('*');

      if (ranking0) {
        await knex('game_teams')
          .update({
            roster_id: ranking0.roster_id,
          })
          .where({
            ranking_id: ranking0.ranking_id,
          });

        await updateGameTeamName(ranking0);
      }

      if (ranking1) {
        await knex('game_teams')
          .update({
            roster_id: ranking1.roster_id,
          })
          .where({
            ranking_id: ranking1.ranking_id,
          });
        await updateGameTeamName(ranking1);
      }
    }
  }

  // update score suggestion status
  const allSuggestions = await knex('score_suggestion')
    .select('*')
    .where({ game_id: gameId });

  for (let suggestion of allSuggestions) {
    await knex('score_suggestion')
      .update({
        status: rosters.every(
          roster =>
            suggestion.score[roster.rosterId] === roster.score,
        )
          ? STATUS_ENUM.ACCEPTED
          : STATUS_ENUM.REFUSED,
      })
      .where({ id: suggestion.id });
  }

  return { gameId, rosters };

  // [SPO-56] This code has not been tested, so we don't want this. However, let's keep
  // this code in case of a refactoring!
  // // update score and spirit
  // await knex.transaction(trx => {
  //   const queries = rosters.map(({ rosterId, score, spirit }) => {
  //     const updateObj = {};

  //     if (score) {
  //       updateObj.score = score;
  //     }

  //     if (spirit) {
  //       updateObj.spirit = spirit;
  //     }

  //     return knex('game_teams')
  //       .where({
  //         game_id: gameId,
  //         roster_id: rosterId,
  //       })
  //       .update(updateObj);
  //   });

  //   return Promise.all(queries)
  //     .then(trx.commit)
  //     .catch(trx.rollback);
  // });

  // // update positions
  // const positions = rosters.map(r => ({
  //   rosterId: r.rosterId,
  //   score: r.score,
  //   position: 1,
  // }));

  // if (positions[0].score > positions[1].score) {
  //   positions[1].position = 2;
  // } else if (positions[0].score < positions[1].score) {
  //   positions[0].position = 2;
  // }

  // const newPositions = await Promise.all(
  //   positions.map(async ({ position, rosterId }) => {
  //     return knex('game_teams')
  //       .update({ position })
  //       .where({ game_id: gameId, roster_id: rosterId })
  //       .returning(['ranking_id', 'position', 'roster_id']);
  //   }),
  // );

  // const type = await getGameType(gameId);

  // if (type === PHASE_TYPE_ENUM.ELIMINATION_BRACKET) {
  //   //get winner and loser positions
  //   const teamSlots = await Promise.all(
  //     [0, 1].map(async p =>
  //       knex('elimination_bracket')
  //         .select(
  //           'initial_position AS initialPosition',
  //           'ranking_id AS rankingId',
  //           'phase_id AS phaseId',
  //         )
  //         .where({ ranking_id: newPositions[p].ranking_id }),
  //     ),
  //   );

  //   if (teamSlots.length !== 2) {
  //     break;
  //   }

  //   const teamInitialPositions = teamSlots.map(
  //     t => t.initialPosition,
  //   );

  //   const loserPos = Math.max(...teamInitialPositions);
  //   const winnerPos = Math.min(...teamInitialPositions);

  //   if (newPositions[0].position < newPosition[1].position) {
  //     newPositions[0].bracketPosition = winnerPos;
  //     newPositions[1].bracketPosition = loserPos;
  //   } else {
  //     newPositions[0].bracketPosition = loserPos;
  //     newPositions[1].bracketPosition = winnerPos;
  //   }
  //   await Promise.all(
  //     newPositions.map(async position => {
  //       await knex('elimination_bracket')
  //         .update({
  //           final_position: position.bracketPosition,
  //         })
  //         .where({ ranking_id: position.rankingId });
  //       await knex('phase_rankings')
  //         .update({ final_position: position.bracketPosition })
  //         .where({
  //           roster_id: position.rosterId,
  //           current_phase: teamSlots[0].phaseId,
  //         });
  //     }),
  //   );
  // }
};

export const isSpiritAlreadySubmmited = async (
  gameId,
  submitedByRoster,
  submittedForRoster,
) => {
  const [{ count }] = await knex('spirit_submission')
    .count()
    .where({
      game_id: gameId,
      submitted_by_roster: submitedByRoster,
      submitted_for_roster: submittedForRoster,
    });

  return count !== 0;
};

export const submitSpiritScore = async ({
  submittedByPerson,
  submittedByRoster,
  submittedForRoster,
  gameId,
  spiritScore,
  comment,
}) => {
  return knex('spirit_submission').insert({
    submitted_by_roster: submittedByRoster,
    submitted_by_person: submittedByPerson,
    submitted_for_roster: submittedForRoster,
    game_id: gameId,
    comment,
    spirit_score: spiritScore,
  });
};

export const updateGameSpirit = async ({
  submittedForRoster,
  gameId,
  spiritScore,
}) => {
  return knex('game_teams')
    .update({
      spirit: spiritScore,
    })
    .where({ game_id: gameId, roster_id: submittedForRoster });
};

export const createGame = async (
  eventId,
  phaseId,
  ticketLimit,
  trx = null,
) => {
  return await entities.query(trx).insertGraph({
    type: GLOBAL_ENUM.GAME,
    game: {
      phase_id: phaseId,
      event_id: eventId,
      ticket_limit: ticketLimit,
    },
  });
};

export const getGameFromEvent = async eventId => {
  const [{ id }] = await knex('games')
    .select('id')
    .where({ event_id: eventId });

  return id;
};

export const updateGameInfo = async (
  gameId,
  gameInfo,
  trx = null,
) => {
  // OLIVIER
  return await entities
    .query(trx)
    .update({
      name: gameInfo.name,
      description: gameInfo.description,
      ticketLimit: gameInfo.ticketLimit,
    })
    .where('id', gameId);
};
