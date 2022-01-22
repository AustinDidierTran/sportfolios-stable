import { Model } from 'objection';
import {stripePrice} from './stripePrice.js'

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
    };
  }
}