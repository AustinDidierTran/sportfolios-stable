import { Model } from 'objection';
import { eventRosters } from './eventRosters.js';
import { entitiesGeneralInfos } from './entitiesGeneralInfos.js';
import { entitiesRole } from './entitiesRole.js';
import { eventsInfos } from './eventsInfos.js';

export class entities extends Model {
  static get tableName() {
    return 'entities';
  }

  static get relationMappings() {
    return {
      eventRosters: {
        relation: Model.HasOneRelation,
        modelClass: eventRosters,
        join: {
          from: 'entities.id',
          to: 'event_rosters.team_id'
        }
      },
      entitiesGeneralInfos: {
        relation: Model.HasOneRelation,
        modelClass: entitiesGeneralInfos,
        join: {
          from: 'entities.id',
          to: 'entities_general_infos.entity_id'
        }
      },
      entitiesRole: {
        relation: Model.HasOneRelation,
        modelClass: entitiesRole,
        join: {
          from: 'entities.id',
          to: 'entities_role.entity_id'
        }
      },
      eventsInfos: {
        relation: Model.HasOneRelation,
        modelClass: eventsInfos,
        join: {
          from: 'entities.id',
          to: 'events_infos.id'
        }
      }
    };
  }
}