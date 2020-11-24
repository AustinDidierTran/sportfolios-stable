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

function getAllSports() {
  return knex('sports')
    .select('*')
    .orderBy('score_type', 'asc')
    .orderBy('name', 'asc');
}

function getAllUsers() {
  return knex
    .select(
      knex.raw(
        'users.id, array_agg(user_email.email ORDER BY user_email.email) AS emails, entities_name.name, entities_name.surname, user_app_role.app_role',
      ),
    )
    .from('users')
    .leftJoin('user_email', 'users.id', '=', 'user_email.user_id')
    .leftJoin(
      'user_entity_role',
      'user_entity_role.user_id',
      '=',
      'users.id',
    )
    .leftJoin(
      'entities',
      'entities.id',
      '=',
      'user_entity_role.entity_id',
    )
    .leftJoin(
      'entities_name',
      'entities.id',
      '=',
      'entities_name.entity_id',
    )
    .leftJoin(
      'user_app_role',
      'users.id',
      '=',
      'user_app_role.user_id',
    )
    .groupBy(
      'users.id',
      'entities_name.name',
      'entities_name.surname',
      'user_app_role.app_role',
    );
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
  getAllUsers,
  getAllTaxRates,
  updateActiveStatusTaxRate,
  updateSport,
  deleteTaxRate,
};
