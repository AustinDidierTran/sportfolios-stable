const knex = require('../connection');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const moment = require('moment');

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

async function updateActiveStatusTaxRate(body) {
  const { taxRateId, active } = body;
  await stripe.taxRates.update(taxRateId, { active });
  return knex('tax_rates')
    .update({ active })
    .where({ id: taxRateId });
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
function getAllSports() {
  return knex('sports')
    .select('*')
    .orderBy('score_type', 'asc')
    .orderBy('name', 'asc');
}

async function getAllUsersAndSecond() {
  const primaryUser = await knex
    .select(
      knex.raw(
        'user_primary_person.user_id, user_primary_person.primary_person, entities_photo.photo_url, array_agg(user_email.email ORDER BY user_email.email) AS emails, entities_name.name, entities_name.surname, user_app_role.app_role',
      ),
    )
    .from('user_primary_person')
    .leftJoin('user_email', 'user_primary_person.user_id', '=', 'user_email.user_id')
    .leftJoin(
      'entities_name',
      'user_primary_person.primary_person',
      '=',
      'entities_name.entity_id',
    )
    .leftJoin(
      'user_app_role',
      'user_primary_person.user_id',
      '=',
      'user_app_role.user_id',
    )
    .leftJoin(
      'entities_photo',
      'user_primary_person.primary_person',
      '=',
      'entities_photo.entity_id'
    ).leftJoin(
      'entities',
      'user_primary_person.primary_person',
      '=',
      'entities.id',
    ).whereNull(
      'entities.deleted_at'
    )
    .groupBy(
      'user_primary_person.user_id',
      'user_primary_person.primary_person',
      'entities_name.name',
      'entities_name.surname',
      'user_app_role.app_role',
      'entities_photo.photo_url'
    ).orderBy(
      'entities_name.name', 'asc'
    )
    ;
  return Promise.all(
    primaryUser.map(async user => {
      const secondAccount = await knex
        .select(
          'user_entity_role.entity_id',
          'entities_name.name',
          'entities_name.surname',
          'entities_photo.photo_url',
        )
        .from('user_entity_role')
        .leftJoin(
          'entities_name',
          'user_entity_role.entity_id',
          '=',
          'entities_name.entity_id',
        )
        .leftJoin(
          'entities_photo',
          'user_entity_role.entity_id',
          '=',
          'entities_photo.entity_id'
        ).leftJoin(
          'entities',
          'user_entity_role.entity_id',
          '=',
          'entities.id'
        )
        .whereRaw(`entities.deleted_at is null and user_entity_role.user_id = '${user.user_id}' AND user_entity_role.entity_id NOT IN (select primary_person from user_primary_person WHERE user_primary_person.primary_person is not null)`);
      return {
        id: user.user_id,
        entityId: user.primary_person,
        emails: user.emails,
        name: user.name,
        surname: user.surname,
        role: user.app_role,
        photoUrl: user.photo_url,
        secondAccount: secondAccount,
      }
    }),
  )
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

module.exports = {
  createSport,
  createTaxRate,
  getAllSports,
  getAllUsersAndSecond,
  getAllTaxRates,
  updateActiveStatusTaxRate,
  updateSport,
  deleteTaxRate,
  deleteEntities,
};
