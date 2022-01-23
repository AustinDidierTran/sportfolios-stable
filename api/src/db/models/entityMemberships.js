import { Model } from 'objection';

export class entityMemberships extends Model {
  static get tableName() {
    return 'entity_memberships';
  }
}
