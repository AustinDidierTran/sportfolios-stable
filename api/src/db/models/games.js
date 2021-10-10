import { Model } from 'objection';
import { events } from './events.js';
import { entities } from './entities.js';

export class games extends Model {
  static get tableName() {
    return 'games';
  }

  static get relationMappings() {
    return {
      event: {
        relation: Model.HasOneRelation,
        modelClass: events,
        join: {
          from: 'games.event_id',
          to: 'events.id',
        },
      },
      entity: {
        relation: Model.HasOneRelation,
        modelClass: entities,
        join: {
          from: 'games.id',
          to: 'entities.id',
        },
      },
    };
  }
}
