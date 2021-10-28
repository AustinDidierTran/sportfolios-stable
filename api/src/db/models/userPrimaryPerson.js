import { Model } from 'objection';
import { stripeInvoiceItem } from './stripeInvoiceItem.js';
import { entitiesGeneralInfos } from './entitiesGeneralInfos.js';

export class userPrimaryPerson extends Model {
  static get tableName() {
    return 'user_primary_person';
  }
  static get idColumn() {
    return 'user_id';
  }
  static get relationMappings() {
    return {
      stripeInvoiceItem: {
        relation: Model.HasManyRelation,
        modelClass: stripeInvoiceItem,
        join: {
          from: 'user_primary_person.user_id',
          to: 'stripe_invoice_item.user_id'
        }
      },
      entitiesGeneralInfos: {
        relation: Model.HasOneRelation,
        modelClass: entitiesGeneralInfos,
        join: {
          from: 'user_primary_person.primary_person',
          to: 'entities_general_infos.entity_id'
        }
      },
    };
  }
}