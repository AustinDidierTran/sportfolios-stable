import { Model } from 'objection';
import { entities } from './entities.js';
import { phase } from './phase.js';
import { games } from './games.js';
import { eventsInfos } from './eventsInfos.js';

export class events extends Model {
  static get tableName() {
    return 'events';
  }

  static get relationMappings() {
    return {
      entities: {
        relation: Model.HasOneRelation,
        modelClass: entities,
        join: {
          from: 'events.id',
          to: 'entities.id'
        }
      },
      phases: {
        relation: Model.HasManyRelation,
        modelClass: phase,
        join: {
          from: 'events.id',
          to: 'phase.event_id'
        }
      },
      games: {
        relation: Model.HasManyRelation,
        modelClass: games,
        join: {
          from: 'events.id',
          to: 'games.event_id'
        }
      },
      eventsInfos: {
        relation: Model.HasOneRelation,
        modelClass: eventsInfos,
        join: {
          from: 'events.id',
          to: 'events_infos.id'
        }
      },
    };
  }
}