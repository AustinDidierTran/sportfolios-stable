'use strict';

const { GLOBAL_ENUM } = require('../../../../common/enums');
const { addEntity } = require('../helpers/entity');
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
  const names = await knex('schedule_teams')
    .select('*')
    .where({ roster_id: null });

  names.forEach(async name => {
    const userId = '8317ff33-3b04-49a1-afd3-420202cddf73';
    const entity = await addEntity(
      {
        name: name.name,
        type: GLOBAL_ENUM.TEAM,
      },
      userId,
    );
    const [roster] = await knex('team_rosters')
      .insert({ team_id: entity.id })
      .returning('id');

    const res = await knex('schedule_teams')
      .update({ roster_id: roster })
      .where({ name: name.name })
      .returning('*');
  });
  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  version: 1,
};
