import { Model } from 'objection';
import { eventRosters } from './eventRosters.js';
import { memberships } from './memberships.js';

export class rosterPlayersInfos extends Model {
  static get tableName() {
    return 'roster_players_infos';
  }

  static get relationMappings() {
    return {
      eventRosters: {
        relation: Model.HasManyRelation,
        modelClass: eventRosters,
        join: {
          from: 'roster_players_infos.roster_id',
          to: 'event_rosters.roster_id'
        }
      },
      memberships: {
        relation: Model.HasManyRelation,
        modelClass: memberships,
        join: {
          from: 'roster_players_infos.person_id',
          to: 'memberships.person_id'
        }
      }
    };
  }
}