import knex from '../connection.js';
import { entities } from '../models/entities.js';

import { ENTITIES_ROLE_ENUM } from '../../../../common/enums/index.js';

import { entities } from '../models/entities.js';

const findRole = async (entityId, lookedFor, role, cpt) => {
  if (cpt > 5) {
    return ENTITIES_ROLE_ENUM.VIEWER;
  }
  const entities = await knex('entities_role')
    .select('*')
    .leftJoin('entities', 'entities.id', '=', 'entities_role.entity_id')
    .whereNull('entities.deleted_at')
    .where({ entity_id_admin: entityId });

  const roles = await Promise.all(
    entities.map(async entity => {
      const maxRole = Math.max(entity.role, role);
      if (entity.entity_id === lookedFor) {
        return maxRole;
      } else {
        return findRole(entity.entity_id, lookedFor, maxRole, cpt + 1);
      }
    }),
  );

  return Math.min(...roles, ENTITIES_ROLE_ENUM.VIEWER);
};

async function getEntityRole(entityId, userId) {
  if (!userId) {
    return ENTITIES_ROLE_ENUM.VIEWER;
  }
  const entities = await knex('user_entity_role')
    .select('*')
    .leftJoin('entities', 'entities.id', '=', 'user_entity_role.entity_id')
    .whereNull('entities.deleted_at')
    .where({ user_id: userId });
  const roles = await Promise.all(
    entities.map(async entity => {
      if (entity.entity_id === entityId) {
        return entity.role;
      } else {
        return findRole(entity.entity_id, entityId, entity.role, 0);
      }
    }),
  );
  return Math.min(...roles);
}

export const getEntities = async (id, userId) => {
  const ids = Array.isArray(id) ? id : [id];
  const entities = await knex('entities')
    .select(
      'entities.id',
      'type',
      'name',
      'city',
      'surname',
      'verified_at',
      'photo_url',
      'description',
      'quick_description',
    )
    .leftJoin(
      'entities_general_infos',
      'entities.id',
      '=',
      'entities_general_infos.entity_id',
    )
    .leftJoin(
      'person_infos',
      'entities_general_infos.infos_supp_id',
      '=',
      'person_infos.id',
    )
    .leftJoin('addresses', 'addresses.id', '=', 'person_infos.address_id')
    .whereIn('entities.id', ids);

  const memberCounts = (
    await Promise.all(
      ids.map(async organizationId => {
        const [{ count: memberCount }] = await knex('memberships')
          .count('*')
          .where({ organization_id: organizationId })
          .andWhere('created_at', '<', 'now()')
          .andWhere('expiration_date', '>', 'now()');

        return {
          organizationId,
          memberCount,
        };
      }),
    )
  ).reduce(
    (prev, curr) => ({
      ...prev,
      [curr.organizationId]: curr.memberCount,
    }),
    {},
  );

  let role = -1;
  if (userId !== -1) {
    role = await getEntityRole(id, userId);
  }

  return entities.map(entity => ({
    basicInfos: {
      description: entity.description,
      id: entity.id,
      city: entity.city,
      type: entity.type,
      name: entity.name,
      verifiedAt: entity.verified_at,
      quickDescription: entity.quick_description,
      surname: entity.surname,
      photoUrl: entity.photo_url,
      role,
      numberOfMembers: memberCounts[entity.id],
    },
  }));
};

export const deleteEventById = async (entity_id) => {
  return await entities
    .query()
    .delete()
    .where({
      'id': entity_id,
    });
}

export const restoreEventById = async (entity_id) => {
  return await entities
    .query()
    .patch({
      deleted_at: null
    })    
    .where({
      'id': entity_id
    });
}

export const insertEntity = async body => {
  const { type } = body;

  const entity = await entities
    .query()
    .insert({ type })
    .returning('*');

  return {
    id: entity.id,
    type: entity.type,
  };
};
