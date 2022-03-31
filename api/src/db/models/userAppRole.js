import { Model } from 'objection';


export class userAppRole extends Model {
  static get tableName() {
    return 'user_app_role';
  }
  
  static get idColumn() {
    return 'user_id';
  }
}