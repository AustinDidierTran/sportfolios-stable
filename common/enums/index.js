const ENTITIES_ROLE_ENUM = {
  ADMIN: 1,
  EDITOR: 2,
  VIEWER: 3,
};

const LIST_ROW_TYPE_ENUM = {
  PERSON: 1,
  ORGANIZATION: 2,
  TEAM: 3,
  MEMBERSHIP: 4,
  MEMBERSHIP_DETAIL: 5,
};

const MEMBERSHIP_LENGTH_ENUM = {
  ONE_MONTH: 1,
  SIX_MONTH: 2,
  ONE_YEAR: 3,
};

const MEMBERSHIP_TYPE_ENUM = {
  ELITE: 1,
  COMPETITIVE: 2,
  RECREATIONAL: 3,
};

const CARD_TYPE_ENUM = {
  SHOP: 1,
  CART: 2,
  INVOICE: 3,
  DELETE_ENTITY: 4,
  ADD_PAYMENT_OPTION: 5,
  EVENT_PAYMENT_OPTION: 6,
  EVENT_SETTINGS: 7,
};

const INVOICE_STATUS_ENUM = {
  DRAFT: 'draft',
  DELETED: 'deleted',
  OPEN: 'open',
  PAID: 'paid',
  UNCOLLECTIBLE: 'uncollectible',
  VOID: 'void',
};

const REGISTRATION_STATUS_ENUM = {
  ACCEPTED: 'accepted',
  PENDING: 'pending',
  REFUSED: 'refused',
};

const VIEW_ENUM = {
  MENU: 'menu',
  HOME: '',
  CART: 'cart',
  ORGANIZATION_LIST: 'organizationList',
};

// Everything excluding roles
const GLOBAL_ENUM = {
  PERSON: 1,
  ORGANIZATION: 2,
  TEAM: 3,
  EVENT: 4,
  // All numbers under 20 are reserved for potentiel entities
  MEMBERSHIP: 20,
  MEMBERSHIP_DETAIL: 21,
  CART_ITEM: 22,
  EVENT_CREATOR: 23,
  PAYMENT_OPTION: 24,
  ROSTER_ITEM: 25,
};

const LOGGER_ENUM = {
  STRIPE: '[STRIPE]',
};

const STRIPE_STATUS_ENUM = {
  DONE: 'done',
  NOT_DONE: 'not done',
};

module.exports = {
  REGISTRATION_STATUS_ENUM,
  CARD_TYPE_ENUM,
  ENTITIES_ROLE_ENUM,
  GLOBAL_ENUM,
  INVOICE_STATUS_ENUM,
  LIST_ROW_TYPE_ENUM,
  LOGGER_ENUM,
  MEMBERSHIP_LENGTH_ENUM,
  MEMBERSHIP_TYPE_ENUM,
  STRIPE_STATUS_ENUM,
  VIEW_ENUM,
};
