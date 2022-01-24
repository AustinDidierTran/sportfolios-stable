import { Model } from 'objection';
import { personInfos } from './personInfos.js';

export class addresses extends Model {
  static get tableName() {
    return 'addresses';
  }

  static get relationMappings() {
    return {
      personInfos: {
        relation: Model.HasOneRelation,
        modelClass: personInfos,
        join: {
          from: 'addresses.id',
          to: 'personInfos.address_id',
        },
      },
    };
  }
}
