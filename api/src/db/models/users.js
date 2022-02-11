import { Model } from 'objection';

export class users extends Model {
  static get tableName() {
    return 'users';
  }
}