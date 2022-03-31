import { Model } from 'objection';

export class notifications extends Model {
  static get tableName() {
    return 'notifications';
  }
}