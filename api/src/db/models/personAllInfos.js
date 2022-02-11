import { Model } from 'objection';
import { userEntityRole } from './userEntityRole.js';

export class personAllInfos extends Model {
  static get tableName() {
    return 'person_all_infos';
  }

  static get relationMappings() {
    return {
      userEntityRole: {
        relation: Model.HasOneRelation,
        modelClass: userEntityRole,
        join: {
          from: 'person_all_infos.id',
          to: 'user_entity_role.entity_id'
        }
      },
    };
  }
}