const ENTITIES_ROLE_ENUM = {
  ADMIN: 1,
  EDITOR: 2,
  VIEWER: 3,
};

const SIZES_ENUM = {
  XXXS: '3x-small',
  XXS: '2x-small',
  XS: 'x-small',
  SM: 'small',
  M: 'medium',
  L: 'large',
  XL: 'x-large',
  XXL: '2x-large',
  XXXL: '3x-large',
};

const ROSTER_ROLE_ENUM = {
  CAPTAIN: 'captain',
  PLAYER: 'player',
  VIEWER: 'viewer',
};

const LIST_ROW_TYPE_ENUM = {
  PERSON: 1,
  ORGANIZATION: 2,
  TEAM: 3,
  MEMBERSHIP: 4,
  MEMBERSHIP_DETAIL: 5,
  RANKING: 6,
};

const TAG_TYPE_ENUM = {
  ACCEPTED: 'accepted',
  PENDING: 'pending',
  REGISTERED: 'registered',
  UNREGISTERED: 'unregistered',
  DEFAULT: 'default',
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
  SHOP: 'shop',
  CART: 'cart',
  GAME: 'game',
  INVOICE: 'invoice',
  DELETE_ENTITY: 'delete entity',
  ADD_PAYMENT_OPTION: 'add payment option',
  EVENT_PAYMENT_OPTION: 'event payment option',
  EVENT_SETTINGS: 'event settings',
};

const INVOICE_STATUS_ENUM = {
  DRAFT: 'draft',
  DELETED: 'deleted',
  OPEN: 'open',
  PAID: 'paid',
  REFUNDED: 'refunded',
  UNCOLLECTIBLE: 'uncollectible',
  VOID: 'void',
};

const REGISTRATION_STATUS_ENUM = {
  ACCEPTED: 'accepted',
  PENDING: 'pending',
  REFUSED: 'refused',
};

const REJECTION_ENUM = {
  NO_REMAINING_SPOTS: 'no_remaining_spots',
};

const VIEW_ENUM = {
  MENU: 'menu',
  HOME: '',
  CART: 'cart',
  ORGANIZATION_LIST: 'organizationList',
};

const POSITION_ENUM = {
  BOTTOM: 'bottom',
  TOP: 'top',
  CENTER: 'center',
  LEFT: 'left',
  RIGHT: 'right',
};
const SEVERITY_ENUM = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
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
  SHOP_ITEM: 26,
  PURCHASES: 27,
};

const LOGGER_ENUM = {
  STRIPE: '[STRIPE]',
};

const STRIPE_STATUS_ENUM = {
  DONE: 'done',
  NOT_DONE: 'not done',
};

const STRIPE_ERROR_ENUM = {
  CHARGE_ALREADY_REFUNDED: 'charge_already_refunded',
};

const LOGO_ENUM = {
  LOGO:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-a58ea-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-pldn3-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_57X57:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-r4zcx-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_72X72:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-tnlv3-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_76X76:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-tnlv3-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_114X114:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-lkee6-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_120X120:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-yqd7g-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_144X144:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-e0ybp-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_152X152:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-lgc7l-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_180X180:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-3yzkf-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_ICON_57X57:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-rbjvk-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_ICON_72X72:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-v1upk-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_ICON_76X76:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-35snn-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_ICON_114X114:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-fnes3-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_ICON_120X120:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-j4x5y-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_ICON_144X144:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-3yog5-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_ICON_152X152:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-vefl9-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_ICON_180X180:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-klr71-8317ff33-3b04-49a1-afd3-420202cddf73',
};

module.exports = {
  REJECTION_ENUM,
  SIZES_ENUM,
  REGISTRATION_STATUS_ENUM,
  CARD_TYPE_ENUM,
  ENTITIES_ROLE_ENUM,
  GLOBAL_ENUM,
  INVOICE_STATUS_ENUM,
  LIST_ROW_TYPE_ENUM,
  LOGGER_ENUM,
  MEMBERSHIP_LENGTH_ENUM,
  MEMBERSHIP_TYPE_ENUM,
  LOGO_ENUM,
  STRIPE_ERROR_ENUM,
  STRIPE_STATUS_ENUM,
  VIEW_ENUM,
  TAG_TYPE_ENUM,
  ROSTER_ROLE_ENUM,
  POSITION_ENUM,
  SEVERITY_ENUM,
};
