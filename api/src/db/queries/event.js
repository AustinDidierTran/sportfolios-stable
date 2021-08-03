const knex = require('../connection');

async function getEventPaymentOption(stripePriceId) {
  let [option] = await knex('event_payment_options')
    .select('*')
    .where({ team_stripe_price_id: stripePriceId });
  if (option) {
    return option;
  }

  [option] = await knex('event_payment_options')
    .select('*')
    .where({ individual_stripe_price_id: stripePriceId });
  return option;
}

module.exports = {
  getEventPaymentOption,
};
