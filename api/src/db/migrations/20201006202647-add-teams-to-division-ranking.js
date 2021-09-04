'use strict';
import knex from '../connection.js';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
export function setup(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
}

export async function up(db) {
  return null;
}

export function down(db) {
  return null;
}

export var _meta = {
  version: 1,
};
