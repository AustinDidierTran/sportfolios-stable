import { Model } from 'objection';

export class membersNumber extends Model {
  static get tableName() {
    return 'members_number';
  }
  
  static get idColumn() {
    return ['organization_id', 'person_id'];
  }
}
