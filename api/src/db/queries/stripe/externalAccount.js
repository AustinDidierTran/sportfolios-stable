import { CLIENT_BASE_URL } from '../../../../../conf.js';
// const stripeFactories = require('./factories');
// const { accountParamsFactory } = stripeFactories;
import stripeLib from 'stripe';
const stripe = stripeLib(process.env.STRIPE_SECRET_KEY);
import knex from '../../connection.js';

// const stripeEnums = require('./enums');
// const { BUSINESS_TYPE_ENUM, TEST_EXTERNAL_ACCOUNT } = stripeEnums;
import { stripeLogger } from '../../../server/utils/logger.js';

import { fillWithZeros } from '../../../../../common/utils/stringFormat.js';
import { getCreators } from '../entity.js';

const getStripeAccount = async (entityId) => {
  const [account] = await knex('stripe_accounts')
    .select('*')
    .where({ entity_id: entityId });
  return account;
};

const hasStripeAccount = async (entityId) => {
  const account = await getStripeAccount(entityId);

  if (account) {
    const completeAccount = await stripe.accounts.retrieve(
      account.account_id,
    );
    const tosAcceptance = completeAccount.tos_acceptance;
    if (
      !tosAcceptance.date ||
      !tosAcceptance.ip ||
      !tosAcceptance.user_agent
    ) {
      return false;
    }
    return true;
  }
  return false;
};

const hasStripeBankAccount = async (entityId) => {
  const account = await getStripeAccount(entityId);
  if (account) {
    const bankAccounts = await knex('bank_accounts')
      .select('*')
      .whereNull('deleted_at')
      .andWhere({
        account_id: account.account_id,
      });
    return bankAccounts.length ? true : false;
  }
  return false;
};
const getEventAccounts = async (eventId) => {
  const admins = await getCreators(eventId);
  const res = await Promise.all(
    admins.map(async (a) => ({
      hasBankAccount: await hasStripeBankAccount(a.id),
      ...a,
    })),
  );
  const res2 = res.filter((a) => a.hasBankAccount);
  return res2;
};

const getOrCreateStripeConnectedAccountId = async (entityId, ip) => {
  let account = await getStripeAccount(entityId);
  if (!account) {
    const account = await createStripeConnectedAccount({ ip }); // must return accountId
    const accountId = account.id;

    // Should store account inside DB
    await knex('stripe_accounts').insert({
      entity_id: entityId,
      account_id: accountId,
    });
    return accountId;
  }
  return account.account_id;
};

const getTaxes = async () => {
  const taxRates = await knex('tax_rates')
    .select('*')
    .whereNull('deleted_at')
    .andWhere({ active: true });
  return taxRates.map((t) => ({
    id: t.id,
    displayName: t.display_name,
    description: t.description,
    inclusive: t.inclusive,
    active: t.active,
    percentage: t.percentage,
  }));
};

// REF: https://stripe.com/docs/api/accounts/create?lang=node
const createStripeConnectedAccount = async (props) => {
  const {
    // business_type,
    // city,
    // country,
    // dob,
    // email,
    // first_name,
    // ip,
    // last_name,
    // line1,
    // postal_code,
    // state,
  } = props;

  const params = {
    requested_capabilities: ['card_payments', 'transfers'],
    type: 'custom',
  };
  // If we want to be able to create account from UI, use this factory
  // const params = accountParamsFactory({
  //   business_type,
  //   city,
  //   country,
  //   dob,
  //   email,
  //   external_account: TEST_EXTERNAL_ACCOUNT.PAYOUT_SUCCEED,
  //   first_name,
  //   ip,
  //   last_name,
  //   line1,
  //   postal_code,
  //   state,
  // });

  return stripe.account.create(params);
};

const createAccountLink2 = async (accountId) => {
  const params = {
    account: accountId,
    failure_url: `${CLIENT_BASE_URL}/profile`,
    success_url: `${CLIENT_BASE_URL}`,
    type: 'custom_account_verification',
    collect: 'eventually_due',
  };
  return stripe.accountLinks.create(params);
};

const createAccountLink = async (props) => {
  const { ip, entityId } = props;
  const accountId = await getOrCreateStripeConnectedAccountId(
    entityId,
    ip,
  );
  const params = {
    account: accountId,
    failure_url: `${CLIENT_BASE_URL}/${entityId}?tab=settings`,
    success_url: `${CLIENT_BASE_URL}/page/addBankAccount?entityId=${entityId}`,
    type: 'custom_account_verification',
    collect: 'eventually_due',
  };
  return stripe.accountLinks.create(params);
};

const createExternalAccount = async (body, ip) => {
  const {
    entityId,
    accountHolderName,
    country,
    currency,
    transitNumber,
    institutionNumber,
    accountNumber,
  } = body;

  const accountId = await getOrCreateStripeConnectedAccountId(
    entityId,
    ip,
  );

  const routingNumber = `${fillWithZeros(
    transitNumber,
    5,
  )}-${fillWithZeros(institutionNumber, 3)}`;

  const params = {
    bank_account: {
      country: country,
      currency: currency,
      account_holder_name: accountHolderName,
      account_holder_type: 'company',
      routing_number: routingNumber,
      account_number: accountNumber,
    },
  };
  let token;
  token = await stripe.tokens.create(params);
  const account = await stripe.accounts.createExternalAccount(
    accountId,
    {
      external_account: token.id,
    },
  );

  await knex('bank_accounts')
    .update({
      is_default: false,
    })
    .where({ account_id: accountId });

  const [bankAccount] = await knex('bank_accounts')
    .insert({
      account_id: accountId,
      bank_account_id: account.id,
      last4: account.last4,
      is_default: true,
    })
    .returning('*');

  stripeLogger('External Account Created', account.id);
  return bankAccount;
};

export {
  createExternalAccount,
  createAccountLink,
  createAccountLink2,
  createStripeConnectedAccount,
  getEventAccounts,
  getOrCreateStripeConnectedAccountId,
  hasStripeAccount,
  hasStripeBankAccount,
  getTaxes,
};
