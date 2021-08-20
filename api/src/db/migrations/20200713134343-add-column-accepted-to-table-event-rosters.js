'use strict';

var dbm;
var type;
var seed;
import fs from 'fs';
import path from 'path';
var Promise;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
export function setup(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
  Promise = options.Promise;
}

export function up(db) {
  var filePath = path.join(__dirname, 'sqls', '20200713134343-add-column-accepted-to-table-event-rosters-up.sql');
  return new Promise( function( resolve, reject ) {
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
      if (err) return reject(err);
      console.log('received data: ' + data);

      resolve(data);
    });
  })
  .then(function(data) {
    return db.runSql(data);
  });
}

export function down(db) {
  var filePath = path.join(__dirname, 'sqls', '20200713134343-add-column-accepted-to-table-event-rosters-down.sql');
  return new Promise( function( resolve, reject ) {
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
      if (err) return reject(err);
      console.log('received data: ' + data);

      resolve(data);
    });
  })
  .then(function(data) {
    return db.runSql(data);
  });
}

export var _meta = {
  "version": 1
};
