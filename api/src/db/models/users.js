import { Model } from 'objection';
import { userEmail } from './userEmail.js';
import { userEntityRole } from './userEntityRole.js';
import { userPrimaryPerson } from './userPrimaryPerson.js';
import { userAppRole } from './userAppRole.js';
import { notifications } from './notifications.js';


export class users extends Model {
  static get tableName() {
    return 'users';
  }
  
  static get relationMappings() {
    return {
        userPrimaryPerson: {
        relation: Model.HasOneRelation,
        modelClass: userPrimaryPerson,
        join: {
          from: 'users.id',
          to: 'user_primary_person.user_id'
        }
      },
      userEmail: {
        relation: Model.HasOneRelation,
        modelClass: userEmail,
        join: {
          from: 'users.id',
          to: 'user_email.user_id'
        }
      },
      userEntityRole: {
        relation: Model.HasManyRelation,
        modelClass: userEntityRole,
        join: {
          from: 'users.id',
          to: 'user_entity_role.user_id'
        }
      },
      userAppRole:{
        relation: Model.HasOneRelation,
        modelClass: userAppRole,
        join: {
          from: 'users.id',
          to: 'user_app_role.user_id'
        }
      },
      notifications: {
        relation: Model.HasManyRelation,
        modelClass: notifications,
        join: {
          from: 'users.id',
          to: 'notifications.user_id'
        }
      }
    };
  }
}