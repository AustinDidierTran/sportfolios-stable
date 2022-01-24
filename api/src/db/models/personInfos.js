import { Model } from 'objection';
import { addresses } from './addresses.js';
import { entitiesGeneralInfos } from './entitiesGeneralInfos.js';

export class personInfos extends Model {
  static get tableName() {
    return 'person_infos';
  }

  static get relationMappings() {
    return {
      addresses: {
        relation: Model.HasOneRelation,
        modelClass: addresses,
        join: {
          from: 'person_infos.address_id',
          to: 'addresses.id',
        },
      },
      entitiesGeneralInfos: {
        relation: Model.HasOneRelation,
        modelClass: entitiesGeneralInfos,
        join: {
          from: 'person_infos.id',
          to: 'entities_general_infos.infos_supp_id',
        },
      },
    };
  }
}
