import knex from '../connection.js';
import { GLOBAL_ENUM } from '../../../../common/enums/index.js';
import { personAllInfos } from '../models/personAllInfos.js';

import { userPrimaryPerson } from '../models/userPrimaryPerson.js';

export const getPrimaryPersonFromUserId = async userId => {
  return userPrimaryPerson
    .query()
    .withGraphJoined('[entitiesGeneralInfos]')
    .where('user_primary_person.user_id', userId);
};

/** Legacy code starts here */

export const getAllPeopleWithAdmins = async (
  limit = 10,
  page = 1,
  query = '',
) => {
  const people = await knex
    .select(
      'entities.id',
      'entities_general_infos.name',
      'entities_general_infos.surname',
      'entities_general_infos.photo_url',
      'entities.deleted_at',
    )
    .from(
      knex
        .select(
          'entity_id',
          'name',
          'surname',
          'photo_url',
          knex.raw(
            "string_agg(entities_general_infos.name || ' ' || entities_general_infos.surname, ' ') AS complete_name",
          ),
        )
        .from('entities_general_infos')
        .groupBy('entity_id', 'name', 'surname', 'photo_url')
        .as('entities_general_infos'),
    )
    .leftJoin(
      'entities',
      'entities_general_infos.entity_id',
      '=',
      'entities.id',
    )
    .where('entities.type', GLOBAL_ENUM.PERSON)
    .andWhere('entities_general_infos.complete_name', 'ILIKE', `%${query}%`)
    .limit(limit)
    .offset(limit * Math.max(0, page - 1));

  const [{ count }] = await knex('entities')
    .count('*')
    .where('type', GLOBAL_ENUM.PERSON);

  return {
    count: Number(count),
    people: people.map(r => ({
      id: r.id,
      name: r.name,
      surname: r.surname,
      photoUrl: r.photo_url,
      deletedAt: r.deleted_at,
    })),
  };
};

export const restorePersonById = id => {
  return knex('entities')
    .update('deleted_at', null)
    .where({ id });
};

export const deletePersonById = id => {
  return knex('entities')
    .del()
    .where({ id });
};

export const getPersonAllInfos = async personId => {
  return await personAllInfos
    .query()
    .withGraphJoined('[userEntityRole.[userEmail,user]]')
    .where('person_all_infos.id', personId);
};
