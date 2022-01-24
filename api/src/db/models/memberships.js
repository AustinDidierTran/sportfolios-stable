import { Model } from 'objection';
import { entityMemberships } from './entityMemberships';
import { entitiesGeneralInfos } from './entitiesGeneralInfos';
import { personInfos } from './personInfos';
import { rosterPlayersInfos } from './rosterPlayersInfos.js';
import { userEntityRole } from './userEntityRole';

export class memberships extends Model {
  static get tableName() {
    return 'memberships';
  }
  static get relationMappings() {
    return {
      entityMembership: {
        relation: Model.HasOneRelation,
        modelClass: entityMemberships,
        join: {
          from: 'memberships.membership_id',
          to: 'entity_memberships.id',
        },
      },
      personGeneralInfos: {
        relation: Model.HasOneRelation,
        modelClass: entitiesGeneralInfos,
        join: {
          from: 'memberships.person_id',
          to: 'entities_general_infos.entity_id',
        },
      },
      personInfos: {
        relation: Model.HasOneRelation,
        modelClass: personInfos,
        join: {
          from: 'memberships.infos_supp_id',
          to: 'person_infos.id',
        },
      },
      rosterPlayersInfos: {
        relation: Model.HasOneRelation,
        modelClass: rosterPlayersInfos,
        join: {
          from: 'memberships.person_id',
          to: 'roster_players_infos.person_id',
        },
      },
      userEntityRole: {
        relation: Model.HasOneRelation,
        modelClass: userEntityRole,
        join: {
          from: 'memberships.person_id',
          to: 'user_entity_role.entity_id',
        },
      },
    };
  }
}
