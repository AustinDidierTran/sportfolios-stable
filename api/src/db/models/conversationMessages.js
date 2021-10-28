import { Model } from 'objection';
import { conversations } from './conversations.js';
import { entitiesGeneralInfos } from './entitiesGeneralInfos.js';

export class conversationMessages extends Model {
  static get tableName() {
    return 'conversation_messages';
  }

  static get relationMappings() {
    return {
      conversations: {
        relation: Model.HasOneRelation,
        modelClass: conversations,
        join: {
          from: 'conversation_messages.conversation_id',
          to: 'conversations.id',
        },
      },
      entitiesGeneralInfos: {
        relation: Model.HasOneRelation,
        modelClass: entitiesGeneralInfos,
        join: {
          from: 'conversation_messages.sender_id',
          to: 'entities_general_infos.entity_id',
        },
      },
    };
  }
}
