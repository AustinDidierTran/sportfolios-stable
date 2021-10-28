import { Model } from 'objection';
import { eventRosters } from './eventRosters.js';
import { entitiesGeneralInfos } from './entitiesGeneralInfos.js';
import { entitiesRole } from './entitiesRole.js';
import { eventsInfos } from './eventsInfos.js';
import { events } from './events.js';
import { games } from './games.js';
import { conversationMessages } from './conversationMessages.js';
import { conversationParticipants } from './conversationParticipants.js';

export class entities extends Model {
  static get tableName() {
    return 'entities';
  }

  static get relationMappings() {
    return {
      conversationMessages: {
        relation: Model.HasManyRelation,
        modelClass: conversationMessages,
        join: {
          from: 'entities.id',
          to: 'conversation_messages.sender_id',
        },
      },
      conversationParticipants: {
        relation: Model.HasManyRelation,
        modelClass: conversationParticipants,
        join: {
          from: 'entities_id',
          to: 'conversation_participants.participant_id',
        },
      },
      eventRosters: {
        relation: Model.HasOneRelation,
        modelClass: eventRosters,
        join: {
          from: 'entities.id',
          to: 'event_rosters.team_id',
        },
      },
      entitiesGeneralInfos: {
        relation: Model.HasOneRelation,
        modelClass: entitiesGeneralInfos,
        join: {
          from: 'entities.id',
          to: 'entities_general_infos.entity_id',
        },
      },
      entitiesRole: {
        relation: Model.HasOneRelation,
        modelClass: entitiesRole,
        join: {
          from: 'entities.id',
          to: 'entities_role.entity_id',
        },
      },
      eventsInfos: {
        relation: Model.HasOneRelation,
        modelClass: eventsInfos,
        join: {
          from: 'entities.id',
          to: 'events_infos.id',
        },
      },
      event: {
        relation: Model.HasOneRelation,
        modelClass: events,
        join: {
          from: 'entities.id',
          to: 'events.id',
        },
      },
      game: {
        relation: Model.HasOneRelation,
        modelClass: games,
        join: {
          from: 'entities.id',
          to: 'games.id',
        },
      },
    };
  }
}
