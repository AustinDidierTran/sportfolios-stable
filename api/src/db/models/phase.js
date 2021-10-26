import { Model } from 'objection';
import { events } from './events.js';
import { games } from './games.js';
import { phaseRankings } from './phaseRankings.js';

export class phase extends Model {
  static get tableName() {
    return 'phase';
  }

  static get relationMappings() {
    return {
      event: {
        relation: Model.HasOneRelation,
        modelClass: events,
        join: {
          from: 'phase.event_id',
          to: 'events.id'
        }
      },
      phaseRankings: {
        relation: Model.HasManyRelation,
        modelClass: phaseRankings,
        join: {
          from: 'phase.id',
          to: 'phase_rankings.current_phase'
        }
      },
      games: {
        relation: Model.HasManyRelation,
        modelClass: games,
        join: {
          from: 'phase.id',
          to: 'games.phase_id'
        }
      },
    };
  }
}