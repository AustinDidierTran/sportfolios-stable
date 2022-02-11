import { Model } from 'objection';
import {stripePrice} from './stripePrice.js'
import {entities} from './entities.js'
import {memberships} from './memberships.js'

export class cartItems extends Model {
  static get tableName() {
    return 'cart_items';
  }
  static get relationMappings() {
    return {
      stripePrice: {
        relation: Model.HasOneRelation,
        modelClass: stripePrice,
        join: {
          from: 'cart_items.stripe_price_id',
          to: 'stripe_price.stripe_price_id'
        }
      },
      personEntity: {
        relation: Model.HasOneRelation,
        modelClass: entities,
        join: {
          from: 'cart_items.person_id',
          to: 'entities.id'
        }
      },
      personMemberships: {
        relation: Model.HasManyRelation,
        modelClass: memberships,
        join: {
          from: 'cart_items.person_id',
          to: 'memberships.person_id'
        }
      },
    };
  }
}