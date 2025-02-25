import knex from '../../db/connection.js';
import stripeLib from 'stripe';
const stripe = stripeLib(process.env.STRIPE_SECRET_KEY);
import moment from 'moment';

function createSport(sport) {
  return knex('sports')
    .insert({
      name: sport.name,
      score_type: sport.scoreType,
    })
    .returning(['id', 'name']);
}

async function createTaxRate(body) {
  const { displayName, description, percentage, inclusive } = body;

  const taxRate = await stripe.taxRates.create({
    display_name: displayName,
    description: description,
    percentage: percentage,
    inclusive: inclusive,
  });

  const [res] = await knex('tax_rates')
    .insert({
      id: taxRate.id,
      display_name: displayName,
      description,
      inclusive,
      percentage,
      active: true,
    })
    .returning('*');
  return res;
}
async function addEmailLandingPage(body) {
  const { email } = body;
  const [res] = await knex('landing_page_emails')
    .insert({
      email,
    })
    .returning('*');
  return res;
}

async function updateActiveStatusTaxRate(body) {
  const { taxRateId, active } = body;
  await stripe.taxRates.update(taxRateId, { active });
  return knex('tax_rates')
    .update({ active })
    .where({ id: taxRateId });
}

async function getEmailsLandingPage() {
  const res = await knex('landing_page_emails').select('email');
  return res.map(r => r.email);
}

async function deleteTaxRate(body) {
  const { taxRateId } = body;
  return knex('tax_rates')
    .update({ deleted_at: new Date() })
    .where({ id: taxRateId });
}

async function deleteEntities(body) {
  const { entityId } = body;
  return knex('entities')
    .where({ id: entityId })
    .del();
}

async function deleteEmailLandingPage(body) {
  const { email } = body;
  return knex('landing_page_emails')
    .where({ email })
    .del();
}

function getAllSports() {
  return knex('sports')
    .select('*')
    .orderBy('score_type', 'asc')
    .orderBy('name', 'asc');
}

async function getAllUsersAndSecond(limitNumber) {
  const primaryUser = await knex
    .select(
      knex.raw(
        'user_primary_person.user_id, user_primary_person.primary_person, entities_general_infos.photo_url, array_agg(user_email.email ORDER BY user_email.email) AS emails, entities_general_infos.name, entities_general_infos.surname, user_app_role.app_role',
      ),
    )
    .from('user_primary_person')
    .leftJoin(
      'user_email',
      'user_primary_person.user_id',
      '=',
      'user_email.user_id',
    )
    .leftJoin(
      'entities_general_infos',
      'user_primary_person.primary_person',
      '=',
      'entities_general_infos.entity_id',
    )
    .leftJoin(
      'user_app_role',
      'user_primary_person.user_id',
      '=',
      'user_app_role.user_id',
    )
    .leftJoin(
      'entities',
      'user_primary_person.primary_person',
      '=',
      'entities.id',
    )
    .whereNull('entities.deleted_at')
    .groupBy(
      'user_primary_person.user_id',
      'user_primary_person.primary_person',
      'entities_general_infos.name',
      'entities_general_infos.surname',
      'user_app_role.app_role',
      'entities_general_infos.photo_url',
    )
    .orderBy('entities_general_infos.name', 'asc')
    .limit(limitNumber);
  return Promise.all(
    primaryUser.map(async user => {
      const secondAccount = await knex
        .select(
          'user_entity_role.entity_id',
          'entities_general_infos.name',
          'entities_general_infos.surname',
          'entities_general_infos.photo_url',
        )
        .from('user_entity_role')
        .leftJoin(
          'entities_general_infos',
          'user_entity_role.entity_id',
          '=',
          'entities_general_infos.entity_id',
        )
        .leftJoin(
          'entities',
          'user_entity_role.entity_id',
          '=',
          'entities.id',
        )
        .whereRaw(
          `entities.deleted_at is null and user_entity_role.user_id = '${user.user_id}' AND user_entity_role.entity_id NOT IN (select primary_person from user_primary_person WHERE user_primary_person.primary_person is not null)`,
        );
      return {
        id: user.user_id,
        entityId: user.primary_person,
        emails: user.emails,
        name: user.name,
        surname: user.surname,
        role: user.app_role,
        photoUrl: user.photo_url,
        secondAccount: secondAccount,
      };
    }),
  );
}

async function updateUserRole(userId, newRole) {
  return knex('user_app_role')
    .insert({ user_id: userId, app_role: newRole })
    .onConflict('user_id')
    .merge();
}
async function getAllNewsLetterSubscriptions() {
  const users = await getAllUsersAndSecond();
  const res = await Promise.all(
    users.map(async u => {
      const [{ is_subscribed: subscription }] = await knex(
        'user_email',
      )
        .select('is_subscribed')
        .where({ user_id: u.id });

      if (subscription) {
        return { ...u, subscription: subscription };
      } else {
        return;
      }
    }),
  );
  return res.filter(r => r !== undefined);
}

function updateSport(id, sport) {
  const updateObject = {};

  if (sport.name) {
    updateObject.name = sport.name;
  }

  if (sport.scoreType || sport.scoreType === 0) {
    updateObject.score_type = sport.scoreType;
  }

  return knex('sports')
    .update(updateObject)
    .where({ id, deleted_at: null })
    .returning('*');
}

async function getAllTaxRates() {
  const res = await knex('tax_rates')
    .select('*')
    .whereNull('deleted_at');
  const sorted = res.sort(
    (a, b) => moment(b.created_at) - moment(a.created_at),
  );
  return sorted;
}

const getUsersByFilter = async (offset, filter = '') => {
  const primaryUser = await knex
    .select(
      knex.raw(
        'user_primary_person.user_id, user_primary_person.primary_person, entities_general_infos.photo_url, array_agg(user_email.email ORDER BY user_email.email) AS emails, entities_general_infos.name, entities_general_infos.surname, user_app_role.app_role',
      ),
    )
    .from('user_primary_person')
    .leftJoin(
      'user_email',
      'user_primary_person.user_id',
      '=',
      'user_email.user_id',
    )
    .leftJoin(
      'entities_general_infos',
      'user_primary_person.primary_person',
      '=',
      'entities_general_infos.entity_id',
    )
    .leftJoin(
      'user_app_role',
      'user_primary_person.user_id',
      '=',
      'user_app_role.user_id',
    )
    .leftJoin(
      'entities',
      'user_primary_person.primary_person',
      '=',
      'entities.id',
    )
    .whereNull('entities.deleted_at')
    .andWhereRaw(`CONCAT(entities_general_infos.name, ' ', entities_general_infos.surname) ILIKE '%${filter}%'`)
    .groupBy(
      'user_primary_person.user_id',
      'user_primary_person.primary_person',
      'entities_general_infos.name',
      'entities_general_infos.surname',
      'user_app_role.app_role',
      'entities_general_infos.photo_url',
    )
    .orderBy('entities_general_infos.name', 'asc')
    .offset(offset)
    .limit(10);
  return primaryUser;
}

const getSecondAccount = async (userId) => {
  return await knex
    .select(
      'user_entity_role.entity_id',
      'entities_general_infos.name',
      'entities_general_infos.surname',
      'entities_general_infos.photo_url',
    )
    .from('user_entity_role')
    .leftJoin(
      'entities_general_infos',
      'user_entity_role.entity_id',
      '=',
      'entities_general_infos.entity_id',
    )
    .leftJoin(
      'entities',
      'user_entity_role.entity_id',
      '=',
      'entities.id',
    )
    .whereRaw(
      `entities.deleted_at is null and user_entity_role.user_id = '${userId}' AND user_entity_role.entity_id NOT IN (select primary_person from user_primary_person WHERE user_primary_person.primary_person is not null)`,
    );
}

export {
  addEmailLandingPage,
  createSport,
  createTaxRate,
  getAllNewsLetterSubscriptions,
  getAllSports,
  getAllTaxRates,
  getEmailsLandingPage,
  updateActiveStatusTaxRate,
  updateSport,
  deleteEmailLandingPage,
  deleteTaxRate,
  deleteEntities,
  updateUserRole,
  getUsersByFilter,
  getSecondAccount
};
