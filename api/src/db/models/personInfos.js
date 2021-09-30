import { Model } from 'objection';
import { adresses } from './adresses.js';
import { entitiesGeneralInfos } from './entitiesGeneralInfos.js';

export class personInfos extends Model {
  static get tableName() {
    return 'person_infos';
  }

  static get relationMappings() {
    return {
      adresses: {
        relation: Model.HasOneRelation,
        modelClass: adresses,
        join: {
          from: 'person_infos.address_id',
          to: 'adresses.id'
        }
      },
      entitiesGeneralInfos: {
        relation: Model.HasOneRelation,
        modelClass: entitiesGeneralInfos,
        join: {
          from: 'person_infos.id',
          to: 'entities_general_infos.infos_supp_id'
        }
      },
    };
  }
}