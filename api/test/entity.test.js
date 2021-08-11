import {
  addEntity,
  addPhase,
  getGames,
  getPhaseRankingWithPhase,
} from '../src/db/queries/entity';
process.env.NODE_ENV = 'test';
const {
  PHASE_TYPE_ENUM,
  GLOBAL_ENUM,
  EVENT_TYPE,
} = require('../../common/enums');
const knex = require('../src/db/connection');

describe('ValidateEliminationBracket', () => {
  afterAll(async done => {
    // Closing the DB connection allows Jest to exit successfully.
    knex.destroy();
    done();
  });

  let user;
  beforeAll(async done => {
    const [res] = await knex('users').select('id');
    user = res;
    done();
  });

  const phaseTwoName = '2teamTournament';
  const phaseFourName = '4teamTournament';
  const one = 1;
  const two = 2;
  const three = 3;
  const four = 4;
  const firstTeamName = '1. ';
  const secondTeamName = '2. ';
  const thirdTeamName = '3. ';
  const fourthTeamName = '4. ';
  const twoSpots = 2;
  const fourSpots = 4;
  it('should return 2 teams', async done => {
    const data = await addEntity(
      {
        name: 'test',
        type: GLOBAL_ENUM.EVENT,
        maximumSpots: twoSpots,
        startDate: '2020-01-01',
        endDate: '2030-01-01',
        eventType: EVENT_TYPE.TEAM,
      },
      user.id,
    );

    const newPhase = await addPhase(
      phaseTwoName,
      twoSpots,
      data.id,
      PHASE_TYPE_ENUM.ELIMINATION_BRACKET,
    );

    const tournamentGame = await getGames(newPhase.event_id);
    const getFirstTeamRanking = await getPhaseRankingWithPhase(
      tournamentGame[0].positions[0].rankingId,
    );
    const getSecondTeamRanking = await getPhaseRankingWithPhase(
      tournamentGame[0].positions[1].rankingId,
    );

    expect(newPhase.spots).toBe(twoSpots);
    expect(newPhase.type).toBe(PHASE_TYPE_ENUM.ELIMINATION_BRACKET);

    expect(tournamentGame.length).toBe(one);
    expect(tournamentGame[0].positions[0].game_id).toBe(
      tournamentGame[0].positions[1].game_id,
    );
    expect(tournamentGame[0].positions[0].name).toBe(
      firstTeamName + phaseTwoName,
    );
    expect(tournamentGame[0].positions[1].name).toBe(
      secondTeamName + phaseTwoName,
    );

    expect(getFirstTeamRanking.initial_position).toBe(one);
    expect(getSecondTeamRanking.initial_position).toBe(two);
    done();
  });

  it('should return 4 teams', async done => {
    const data = await addEntity(
      {
        name: 'test',
        type: GLOBAL_ENUM.EVENT,
        maximumSpots: fourSpots,
        startDate: '2020-01-01',
        endDate: '2030-01-01',
        eventType: EVENT_TYPE.TEAM,
      },
      user.id,
    );

    const newPhase = await addPhase(
      phaseFourName,
      fourSpots,
      data.id,
      PHASE_TYPE_ENUM.ELIMINATION_BRACKET,
    );

    const tournamentGame = await getGames(newPhase.event_id);
    const getFirstTeamRanking = await getPhaseRankingWithPhase(
      tournamentGame[0].positions[0].rankingId,
    );
    const getFourthTeamRanking = await getPhaseRankingWithPhase(
      tournamentGame[0].positions[1].rankingId,
    );
    const getSecondTeamRanking = await getPhaseRankingWithPhase(
      tournamentGame[1].positions[0].rankingId,
    );
    const getThirdTeamRanking = await getPhaseRankingWithPhase(
      tournamentGame[1].positions[1].rankingId,
    );

    const getFifthTeamRanking = await getPhaseRankingWithPhase(
      tournamentGame[2].positions[0].rankingId,
    );
    const getSixthTeamRanking = await getPhaseRankingWithPhase(
      tournamentGame[2].positions[1].rankingId,
    );
    const getSeventhTeamRanking = await getPhaseRankingWithPhase(
      tournamentGame[3].positions[0].rankingId,
    );
    const getEigthTeamRanking = await getPhaseRankingWithPhase(
      tournamentGame[3].positions[1].rankingId,
    );

    expect(newPhase.spots).toBe(four);
    expect(newPhase.type).toBe(PHASE_TYPE_ENUM.ELIMINATION_BRACKET);

    expect(tournamentGame.length).toBe(four);

    expect(tournamentGame[0].positions[0].game_id).toBe(
      tournamentGame[0].positions[1].game_id,
    );
    expect(tournamentGame[1].positions[0].game_id).toBe(
      tournamentGame[1].positions[1].game_id,
    );
    expect(tournamentGame[2].positions[0].game_id).toBe(
      tournamentGame[2].positions[1].game_id,
    );
    expect(tournamentGame[3].positions[0].game_id).toBe(
      tournamentGame[3].positions[1].game_id,
    );

    expect(tournamentGame[0].positions[0].name).toBe(
      firstTeamName + phaseFourName,
    );
    expect(tournamentGame[0].positions[1].name).toBe(
      fourthTeamName + phaseFourName,
    );
    expect(tournamentGame[1].positions[0].name).toBe(
      secondTeamName + phaseFourName,
    );
    expect(tournamentGame[1].positions[1].name).toBe(
      thirdTeamName + phaseFourName,
    );
    //1v4, 2v3 after 1v2, 3v4
    expect(getFirstTeamRanking.initial_position).toBe(one);
    expect(getSecondTeamRanking.initial_position).toBe(two);
    expect(getThirdTeamRanking.initial_position).toBe(three);
    expect(getFourthTeamRanking.initial_position).toBe(four);

    expect(getFifthTeamRanking.initial_position).toBe(one);
    expect(getSixthTeamRanking.initial_position).toBe(two);
    expect(getSeventhTeamRanking.initial_position).toBe(three);
    expect(getEigthTeamRanking.initial_position).toBe(four);
    done();
  });
});
