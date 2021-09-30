import { Model } from 'objection';
import { userEntityRole } from './userEntityRole.js';

export class userEmail extends Model {
  static get tableName() {
    return 'user_email';
  }
  static get idColumn() {
    return 'email';
  }
  static get relationMappings() {
    return {
      userEntityRole: {
        relation: Model.HasOneRelation,
        modelClass: userEntityRole,
        join: {
          from: 'user_email.user_id',
          to: 'user_entity_role.user_id'
        }
      },
    };
  }
}