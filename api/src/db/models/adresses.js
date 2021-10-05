import { Model } from 'objection';
import { personInfos } from './personInfos.js';

export class adresses extends Model {
  static get tableName() {
    return 'adresses';
  }

  static get relationMappings() {
    return {
      personInfos: {
        relation: Model.HasOneRelation,
        modelClass: personInfos,
        join: {
          from: 'adresses.id',
          to: 'personInfos.address_id'
        }
      },
    };
  }
}