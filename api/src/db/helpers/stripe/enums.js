const BUSINESS_TYPE_ENUM = {
  COMPANY: 'company',
  GOVERNMENT_ENTITY: 'government_entity',
  INDIVIDUAL: 'individual',
  NON_PROFIT: 'non_profit',
};

const TEST_EXTERNAL_ACCOUNT = {
  CA: {
    PAYOUT_SUCCEED: {
      object: 'bank_account',
      country: 'CA',
      currency: 'CAD',
      routing_number: '11000-000',
      account_number: '000123456789',
    },
    NO_ACCOUNT: {
      object: 'bank_account',
      country: 'CA',
      currency: 'CAD',
      routing_number: '11000-000',
      account_number: '000111111116',
    },
    ACCOUNT_CLOSED: {
      object: 'bank_account',
      country: 'CA',
      currency: 'CAD',
      routing_number: '11000-000',
      account_number: '000111111113',
    },
    INSUFFICIENT_FUNDS: {
      object: 'bank_account',
      country: 'CA',
      currency: 'CAD',
      routing_number: '11000-000',
      account_number: '000222222227',
    },
    DEBIT_NOT_AUTHORIZED: {
      object: 'bank_account',
      country: 'CA',
      currency: 'CAD',
      routing_number: '11000-000',
      account_number: '000333333335',
    },
    INVALID_CURRENCY: {
      object: 'bank_account',
      country: 'CA',
      currency: 'CAD',
      routing_number: '11000-000',
      account_number: '000444444440',
    },
  },
};

module.exports = { BUSINESS_TYPE_ENUM, TEST_EXTERNAL_ACCOUNT };
