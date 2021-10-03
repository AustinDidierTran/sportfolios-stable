import { Model } from 'objection';
import { eventRosters } from './eventRosters.js';
import { entities } from './entities.js';
import { entitiesGeneralInfos } from './entitiesGeneralInfos.js';

export class eventsInfos extends Model {
  static get tableName() {
    return 'events_infos';
  }

  static get relationMappings() {
    return {
      eventRosters: {
        relation: Model.HasOneRelation,
        modelClass: eventRosters,
        join: {
          from: 'events_infos.id',
          to: 'event_rosters.event_id'
        }
      },
      entities: {
        relation: Model.HasOneRelation,
        modelClass: entities,
        join: {
          from: 'events_infos.id',
          to: 'entities.id'
        }
      },
      creatorEntities: {
        relation: Model.HasOneRelation,
        modelClass: entities,
        join: {
          from: 'events_infos.creator_id',
          to: 'entities.id'
        }
      },
    };
  }
}