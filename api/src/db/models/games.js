import { Model } from 'objection';
import { gameTeams } from './gameTeams.js';
import { phase } from './phase.js'
import { events } from './events.js';
import { entities } from './entities.js';
import { eventTicketOptions } from './eventTicketOptions.js';

export class games extends Model {
  static get tableName() {
    return 'games';
  }

  static get relationMappings() {
    return {
      phase: {
        relation: Model.HasOneRelation,
        modelClass: phase,
        join: {
          from: 'games.phase_id',
          to: 'phase.id'
        }
      },
      gameTeams: {
        relation: Model.HasManyRelation,
        modelClass: gameTeams,
        join: {
          from: 'games.id',
          to: 'game_teams.game_id'
        }
      },
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
      eventTicketOptions: {
        relation: Model.HasManyRelation,
        modelClass: eventTicketOptions,
        join: {
          from: 'games.id',
          to: 'event_ticket_options.game_id'
        }
      }
    };
  }
}
