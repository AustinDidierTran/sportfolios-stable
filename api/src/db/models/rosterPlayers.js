import { Model } from 'objection';
import { eventRosters } from './eventRosters.js';
import { userEntityRole } from './userEntityRole.js';
import { entitiesGeneralInfos } from './entitiesGeneralInfos.js';

export class rosterPlayers extends Model {
  static get tableName() {
    return 'roster_players';
  }

  static get relationMappings() {
    return {
      eventRosters: {
        relation: Model.HasOneRelation,
        modelClass: eventRosters,
        join: {
          from: 'roster_players.roster_id',
          to: 'event_rosters.roster_id'
        }
      },
      userEntityRole: {
        relation: Model.HasOneRelation,
        modelClass: userEntityRole,
        join: {
          from: 'roster_players.person_id',
          to: 'user_entity_role.entity_id'
        }
      },
      entitiesGeneralInfos: {
        relation: Model.HasOneRelation,
        modelClass: entitiesGeneralInfos,
        join: {
          from: 'roster_players.person_id',
          to: 'entities_general_infos.entity_id',
        },
      },
    };
  }
}