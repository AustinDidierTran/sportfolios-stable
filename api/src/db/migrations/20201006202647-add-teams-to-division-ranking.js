'use strict';
const knex = require('../connection');

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function(db) {
  const rosters = await knex('schedule_teams').select('*');
  const eventRosters = await knex('event_rosters').select(
    'roster_id',
  );
  const finalRosters = rosters.filter(roster => {
    return !eventRosters
      .map(r => r.roster_id)
      .includes(roster.roster_id);
  });

  finalRosters.map(async roster => {
    const [teamId] = await knex('team_rosters')
      .select('team_id')
      .where({ id: roster.roster_id });

    await knex('event_rosters').insert({
      roster_id: roster.roster_id,
      event_id: roster.event_id,
      team_id: teamId.team_id,
    });
    await knex('division_ranking')
      .insert({
        team_id: teamId.team_id,
        event_id: roster.event_id,
      })
      .whereNotExists({
        team_id: teamId.team_id,
        event_id: roster.event_id,
      });
  });
  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  version: 1,
};
