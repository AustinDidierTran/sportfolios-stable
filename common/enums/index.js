const ENTITIES_ROLE_ENUM = {
  ADMIN: 1,
  EDITOR: 2,
  VIEWER: 3,
};

const APP_ENUM = {
  FACEBOOK: 'Facebook',
  MESSENGER: 'Messenger',
  GOOGLE: 'Google',
  APPLE: 'Apple',
}

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

const COMPONENT_TYPE_ENUM = {
  SELECT: 'select',
  TEXTFIELD: 'textfield',
  MULTISELECT: 'multiselect',
  BUTTON: 'button',
  CHECKBOX: 'checkbox',
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
  ADD_PAYMENT_OPTION: 'add payment option',
  CART: 'cart',
  DELETE_ENTITY: 'delete entity',
  EDITABLE_GAME: 'editable game',
  EVENT_PAYMENT_OPTION: 'event payment option',
  EVENT_SETTINGS: 'event settings',
  EVENT: 'event',
  GAME: 'game',
  INVOICE: 'invoice',
  SCORE_SUGGESTION: 'score suggestion',
  SHOP: 'shop',
  TWO_TEAM_GAME_EDITABLE: 'twoTeamGameEditable',
  TWO_TEAM_GAME: 'twoTeamGame',
};

const FORM_DIALOG_TYPE_ENUM = {
  SUBMIT_SCORE: 'score',
  SUBMIT_SCORE_AND_SPIRIT: 'score and spirit',
  ENTER_EMAIL: 'email',
  PLAYER_ACCEPTATION: 'player acceptation',
};

const LANGUAGE_ENUM = {
  ENGLISH: 'en',
  FRANCAIS: 'fr',
};

const SELECT_ENUM = {
  ALL: 'all',
};

const GENDER_ENUM = {
  MALE: 'Male',
  FEMALE: 'Female',
  NOT_SPECIFIED: 'Other',
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

const STATUS_ENUM = {
  ACCEPTED: 'accepted',
  PENDING: 'pending',
  REFUSED: 'refused',
  SUCCESS: 201,
  FORBIDDEN: 403,
  ERROR: 404,
};

const PERSON_TRANSFER_STATUS_ENUM = {
  ACCEPTED: 'accepted',
  PENDING: 'pending',
  REFUSED: 'refused',
  CANCELED: 'canceled',
};

const FACEBOOK_STATUS_ENUM = {
  CONNECTED: 'connected',
  NOT_AUTHORIZED: 'not_authorized'
}

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

const SPIRIT_CATEGORY_ENUM = {
  RULES_KNOWLEDGE_AND_USE: 'rules_knowledge_and_use',
  FOULS_AND_BODY_CONTACT: 'fouls_and_body_contact',
  FAIR_MINDEDNESS: 'fair_mindedness',
  POSITIVE_ATTITUDE_AND_SELF_CONTROL:
    'positive_attitude_and_self_control',
  COMMUNICATION: 'communication',
};

const LOGIN_STATE_ENUM = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  FORGOT_PASSWORD: 'forgotPassword',
};

// Everything excluding roles
const GLOBAL_ENUM = {
  PERSON: 1,
  ORGANIZATION: 2,
  TEAM: 3,
  EVENT: 4,
  // All numbers under 20 are reserved for potentiel entities
  CART_ITEM: 'cart_item',
  CART: 'cart',
  EVENT_CREATOR: 'event_creator',
  MEMBERSHIP_DETAIL: 'membership_detail',
  MEMBERSHIP: 'membership',
  PAYMENT_OPTION: 'payment_option',
  PURCHASES: 'pruchases',
  RANKING_WITH_STATS: 'ranking_with_stats',
  RANKING: 'ranking',
  ROSTER_ITEM: 'roster_item',
  SALES: 'sales',
  SHOP_ITEM: 'shop_item',
  APP_ITEM: 'app_item'
};

const MILLIS_TIME_ENUM = {
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
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
const IMAGE_ENUM = {
  ULTIMATE_TOURNAMENT:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200716-u8zhq-8317ff33-3b04-49a1-afd3-420202cddf73',
};

const LOGO_ENUM = {
  LOGO:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-a58ea-8317ff33-3b04-49a1-afd3-420202cddf73',
  LOGO_256X256:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200811-vtd7h-f2a5f90b-d617-4926-baa9-4a3a16c5c112',
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
  CARD_TYPE_ENUM,
  COMPONENT_TYPE_ENUM,
  ENTITIES_ROLE_ENUM,
  GENDER_ENUM,
  GLOBAL_ENUM,
  IMAGE_ENUM,
  INVOICE_STATUS_ENUM,
  LANGUAGE_ENUM,
  LIST_ROW_TYPE_ENUM,
  LOGGER_ENUM,
  LOGIN_STATE_ENUM,
  LOGO_ENUM,
  MEMBERSHIP_LENGTH_ENUM,
  MEMBERSHIP_TYPE_ENUM,
  POSITION_ENUM,
  STATUS_ENUM,
  REJECTION_ENUM,
  ROSTER_ROLE_ENUM,
  SELECT_ENUM,
  SEVERITY_ENUM,
  SIZES_ENUM,
  SPIRIT_CATEGORY_ENUM,
  STATUS_ENUM,
  STRIPE_ERROR_ENUM,
  STRIPE_STATUS_ENUM,
  TAG_TYPE_ENUM,
  VIEW_ENUM,
  FORM_DIALOG_TYPE_ENUM,
  MILLIS_TIME_ENUM,
  PERSON_TRANSFER_STATUS_ENUM,
  FACEBOOK_STATUS_ENUM,
  APP_ENUM
};
