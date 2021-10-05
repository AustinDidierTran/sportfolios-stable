import { Model } from 'objection';
import { eventRosters } from './eventRosters.js';

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
      }
    };
  }
}