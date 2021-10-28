import { Model } from 'objection';

export class cartItems extends Model {
  static get tableName() {
    return 'cart_items';
  }
}