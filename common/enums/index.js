const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const FIELD_GROUP_ENUM = {
  ADD_PAYMENT_OPTION: 'add payment option',
};

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
};

const PILL_TYPE_ENUM = {
  NOT_PAID: 'not paid',
  NOT_MEMBER: 'not member',
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

const PHASE_TYPE_ENUM = {
  CUSTOM: 'custom',
  POOL: 'pool',
  ELIMINATION_BRACKET: 'elimination bracket',
};

const COMPONENT_TYPE_ENUM = {
  LIST: 'list',
  SELECT: 'select',
  TEXTFIELD: 'textfield',
  MULTISELECT: 'multiselect',
  BUTTON: 'button',
  CHECKBOX: 'checkbox',
  LIST_ITEM: 'list item',
  PERSON_SEARCH_LIST: 'person search list',
  PERSON_ITEM: 'person item',
  EMPTY: 'empty',
};

const ROSTER_ROLE_ENUM = {
  CAPTAIN: 'captain',
  ASSISTANT_CAPTAIN: 'assistant-captain',
  COACH: 'coach',
  PLAYER: 'player',
  VIEWER: 'viewer',
};

const TAG_TYPE_ENUM = {
  ACCEPTED: 'accepted',
  ACCEPTED_FREE: 'accepted free',
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
const MEMBERSHIP_LENGTH_TYPE_ENUM = {
  FIXED: 'fixed',
  LENGTH: 'length',
};

const MEMBERSHIP_TYPE_ENUM = {
  ELITE: 1,
  COMPETITIVE: 2,
  RECREATIONAL: 3,
  JUNIOR: 4,
  NOT_SPECIFIED: 5,
};

const PHASE_STATUS_ENUM = {
  NOT_STARTED: 'not_started',
  STARTED: 'started',
  DONE: 'done',
};

const PLATEFORM_FEES = 0.059;
const PLATEFORM_FEES_FIX = 30;
const MIN_AMOUNT_FEES = 500;

const CARD_TYPE_ENUM = {
  CART: 'cart',
  CART_SUMMARY: 'cart summary',
  DELETE_ENTITY: 'delete entity',
  EDITABLE_GAME: 'editable game',
  EVENT_SETTINGS: 'event settings',
  EVENT: 'event',
  GAME: 'game',
  INVOICE: 'invoice',
  REPORT: 'report',
  SCORE_SUGGESTION: 'score suggestion',
  SHOP: 'shop',
  TWO_TEAM_GAME_EDITABLE: 'twoTeamGameEditable',
  TWO_TEAM_GAME_PROFILE: 'twoTeamGameProfile',
};

const TABS_ENUM = {
  ABOUT: 'about',
  CART: 'cart',
  EDIT_EVENTS: 'editEvents',
  EDIT_PERSON_INFOS: 'editPersonInfos',
  EDIT_RANKINGS: 'editRankings',
  EDIT_ROSTERS: 'editRosters',
  EDIT_SCHEDULE: 'editSchedule',
  EVENT_INFO: 'eventInfo',
  EVENTS: 'events',
  GENERAL: 'general',
  PURCHASES: 'purchases',
  RANKINGS: 'rankings',
  RESULTS: 'results',
  ROSTERS: 'roster',
  SCHEDULE: 'schedule',
  SETTINGS: 'settings',
  SHOP: 'shop',
};

const FORM_DIALOG_TYPE_ENUM = {
  SUBMIT_SCORE: 'score',
  SUBMIT_SCORE_AND_SPIRIT: 'score and spirit',
  ENTER_EMAIL: 'email',
  ADD_EVENT_PAYMENT_OPTION: 'add event payment option',
  EDIT_EVENT_PAYMENT_OPTION: 'edit event payment option',
  ADD_MEMBERSHIP: 'add membership',
  BECOME_MEMBER: 'become member',
  BECOME_MEMBER_COUPON: 'become member coupon',
  ADD_MEMBER: 'add member',
  EDIT_MEMBERSHIP: 'edit membership',
  MEMBERS_REPORT: 'members report',
  SALES_REPORT: 'sales_report',
  CREATE_TAX_RATE: 'create tax rate',
  ROSTER_PLAYER_OPTIONS: 'roster player options',
  EDIT_MEMBER_IMPORT: 'edit member import',
};

const HEADER_FLYOUT_TYPE_ENUM = {
  ACCOUNT: 'account',
  CLOSED: 'closed',
  CREATE: 'create',
  NOTIFICATIONS: 'notifications',
  PLUS: 'plus',
};

const REPORT_TYPE_ENUM = {
  MEMBERS: 'members',
  SALES: 'sales',
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
  DELETED: 'deleted',
  DRAFT: 'draft',
  FREE: 'free',
  OPEN: 'open',
  PAID: 'paid',
  REFUNDED: 'refunded',
  UNCOLLECTIBLE: 'uncollectible',
  VOID: 'void',
};

const COUPON_CODE_ENUM = {
  BECOME_MEMBER: 'become member',
};

const ROUTES_ENUM = {
  addBankAccount: '/page/addBankAccount',
  addPaymentMethod: '/page/addPaymentMethod',
  adminPanel: '/page/adminPanel',
  cart: '/page/cart',
  checkout: '/page/checkout',
  confirmationEmailSent: '/page/confirmationEmailSent/:email',
  confirmEmail: '/page/confirmEmail/:token',
  confirmEmailFailure: '/page/ConfirmEmailFailure',
  confirmEmailSuccess: '/page/confirmEmailSuccess',
  create: '/page/create',
  createOrganization: '/page/organization/create',
  createPerson: '/page/person/create',
  createTeam: '/page/team/create',
  entity: '/:id',
  entityNotFound: '/page/entityNotFound',
  eventRegistration: '/page/eventRegistration/:id',
  home: '/',
  importMembers: '/page/importMembers',
  login: '/page/login',
  membersList: '/page/membersList',
  menu: '/page/menu',
  mockEvent: '/page/mock/Event/:openTab',
  notifications: '/page/notifications',
  optionPayment: '/page/optionPayment/:id',
  orderProcessed: '/page/orderProcessed',
  organizationList: '/page/organizationList',
  privacyPolicy: '/page/privacy',
  productAddedToCart: '/page/productAddedToCart',
  recoveryEmail: '/page/recoveryEmail',
  registrationStatus: '/page/registrationStatus',
  createReport: '/page/createReport',
  sales: '/page/sales/:id',
  scheduleInteractiveTool: '/page/scheduleInteractiveTool/:id',
  scheduleManager: '/page/scheduleManager',
  search: '/page/search',
  signup: '/page/signup',
  shopDetails: '/page/shopDetails/:id/:stripePriceId',
  stripe: '/page/stripe',
  transferPerson: '/page/transferPerson/:token',
  transferPersonExpired: '/page/transferPersonExpired',
  userSettings: '/page/userSettings',
  redirectWithToken: '/page/redirect',
  rosterInviteLink: '/page/invite/roster/:token',
};

const STATUS_ENUM = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  ERROR: 404,
  METHOD_NOT_ALLOWED: 405,
  ACCEPTED: 'accepted',
  ACCEPTED_FREE: 'accepted free',
  ERROR_STRING: 'error',
  PENDING: 'pending',
  REFUSED: 'refused',
  SUCCESS_STRING: 'success',
};

const PERSON_TRANSFER_STATUS_ENUM = {
  ACCEPTED: 'accepted',
  PENDING: 'pending',
  REFUSED: 'refused',
  CANCELED: 'canceled',
};

const FACEBOOK_STATUS_ENUM = {
  CONNECTED: 'connected',
  NOT_AUTHORIZED: 'not_authorized',
};

const BASIC_CHATBOT_STATES = {
  NOT_LINKED: 'not_linked',
  HOME: 'home',
};

const SCORE_SUBMISSION_CHATBOT_STATES = {
  SCORE_SUBMISSION_REQUEST_SENT: 'score_submission_request_sent',
  AWAITING_SCORE_SUBMISSION: 'awaiting_score_submission',
  AWAITING_SCORE_SUBMISSION_CONFIRMATION:
    'awaiting_score_submission_confirmation',
  SPIRIT_SUBMISSION_REQUEST_SENT: 'spirit_submission_request_sent',
  AWAITING_SPIRIT_RULES: 'awaiting_spirit_rule',
  AWAITING_SPIRIT_FOULS: 'awaiting_spirit_fouls',
  AWAITING_SPIRIT_EQUITY: 'awaiting_spirit_equity',
  AWAITING_SPIRIT_SELF_CONTROL: 'awaiting_spirit_self_control',
  AWAITING_SPIRIT_COMMUNICATION: 'awaiting_spirit_communication',
  AWAITING_SPIRIT_CONFIRMATION: 'awaiting_spirit_confirmation',
  GAMES_AWAITING_SCORE_LIST: 'games_awaiting_score_list',
  AWAITING_ATTENDANCE: 'awaiting_attendance',
  OTHER_TEAM_SUBMITTED_A_SCORE: 'other_team_submitted_a_score',
};

const GAME_INFOS_CHATBOT_STATES = {
  NEXT_GAME_INFOS: 'next_games_infos',
};

const REJECTION_ENUM = {
  NO_REMAINING_SPOTS: 'no.no_remaining_spots',
  ALREADY_REGISTERED: 'already_registered',
  TOO_MANY_TEAMS: 'too_many_teams',
  LAST_TEAM_HIGHER_THAN_SPOTS: 'last_team_higher_than_spots',
  NO_PAYMENT_METHOD_SELECTED: 'no.no_payment_method_selected',
  NO_CART_ITEMS_SELECTED: 'no.no_cart_items_selected',
  CHECKOUT_ERROR: 'checkout_error',
  OTHER_GAMES_DEPENDS_ON_IT: 'other_games_depends_on_it',
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

const GLOBAL_ENUM = {
  PERSON: 1,
  ORGANIZATION: 2,
  TEAM: 3,
  EVENT: 4,
  GAME: 5,
  SESSION: 6,
};

const CART_ITEM = {
  MEMBERSHIP: 'membership',
  DONATION: 'donation',
  SHOP_ITEM: 'shop_item',
};

const SESSION_ENUM = {
  PRACTICE: 'practice',
};

const SOCKET_EVENT = {
  CONNECTED_USER: 'connectedUser',
  NOTIFICATIONS: 'notifications',
};

const NOTIFICATION_TYPE = {
  ADDED_TO_EVENT: 'added to event',
  ADDED_TO_TEAM: 'added to team',
  CART_ITEM_ADDED_PLAYER: 'cart item added player',
  EMAIL_CONFIRMATION: 'email confirmation',
  IMPORT_MEMBER_NON_EXISTING: 'import member non existing',
  IMPORT_MEMBER: 'import member',
  OTHER_TEAM_SUBMITTED_A_SCORE: 'other team submitted a score',
  PERSON_PENDING_REGISTRATION_TO_ADMIN:
    'person pending registration to admin',
  PERSON_REFUSED_REGISTRATION: 'person refused registration',
  PERSON_REGISTRATION_TO_ADMIN: 'person registration to admin',
  PERSON_REGISTRATION: 'person registration',
  RECOVERY_EMAIL: 'recovery email',
  REQUEST_TO_JOIN_TEAM: 'request to join team',
  SCORE_SUBMISSION_CONFLICT: 'score submission conflict',
  SCORE_SUBMISSION_REQUEST: 'score submission request',
  SEND_RECEIPT: 'send receipt',
  TEAM_PENDING_REGISTRATION_ADMIN: 'team pending registration admin',
  TEAM_REFUSED_REGISTRATION: 'team refused registration',
  TEAM_REGISTRATION_TO_ADMIN: 'team registration to admin',
  TEAM_REGISTRATION: 'team registration',
  TEAM_UNREGISTERED_AND_REFUNDED: 'team unregistered and refunded',
  TEAM_UNREGISTERED: 'team unregistered',
  TRANSFER_PERSON: 'transfer person',
};

const NOTIFICATION_ARRAY = [
  {
    type: 'added to event',
    email: true,
    chatbot: false,
    inApp: true,
  },
  {
    type: 'added to team',
    email: true,
    chatbot: false,
    inApp: true,
  },
  {
    type: 'request to join team',
    email: false,
    chatbot: false,
    inApp: true,
  },
  {
    type: 'other team submitted a score',
    email: false,
    chatbot: false,
    inApp: true,
  },
  {
    type: 'score submission conflict',
    email: false,
    chatbot: false,
    inApp: true,
  },
  {
    type: 'score submission request',
    email: false,
    chatbot: false,
    inApp: true,
  },
  {
    type: 'person registration',
    email: true,
    chatbot: false,
    inApp: false,
  },
  {
    type: 'team registration',
    email: true,
    chatbot: false,
    inApp: false,
  },
];

const NOTIFICATION_MEDIA = {
  EMAIL: 'email',
  CHATBOT: 'chatbot',
};

const LIST_ITEM_ENUM = {
  APP_ITEM: 'app item',
  BANK_ACCOUNT: 'bank account',
  CART_ITEM: 'cart item',
  CART: 'cart',
  CREATE_ENTITY: 'create entity',
  CREDIT_CARD: 'credit card',
  EVENT_CREATOR: 'event creator',
  EVENT_PAYMENT_OPTION: 'event_payment_option',
  MEMBER: 'member',
  MEMBERSHIP_DETAIL: 'membership detail',
  MEMBER_IMPORT: 'member_import',
  MEMBERSHIP_ORGANIZATION: 'membership organization',
  MEMBERSHIP: 'membership',
  MORE: 'more',
  PAYMENT_OPTION: 'payment option',
  PURCHASES: 'pruchases',
  RANKING_WITH_STATS: 'ranking with stats',
  RANKING: 'ranking',
  REPORT: 'report',
  ROSTER_ITEM: 'roster item',
  SALES: 'sales',
  SHOP_ITEM: 'shop item',
  AVATAR_TEXT_SKELETON: 'avatar and text',
  NOTIFICATION_SETTING: 'notification setting',
};

const MILLIS_TIME_ENUM = {
  ONE_MINUTE: 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
  ONE_MONTH: 31 * 24 * 60 * 60 * 1000,
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

const MESSENGER_MESSAGES_EN = {
  CONNECTION_SUCCESS: {
    text:
      "You have been signed up to Sportfolios' chatbot successfully! Come again after your next match to submit your scores",
    quick_replies: [
      {
        content_type: 'text',
        title: 'great! 🤩',
        payload: 'IGNORE',
      },
    ],
  },
  CONNECTION_ERROR: {
    text:
      'There was an error while linking your account, please try again later',
  },
  GET_STARTED_NO_REF: {
    text:
      'You now need to link your Sportfolios account, please follow the following link: https://sportfolios.app/page/userSettings',
  },
};

const EVENT_TYPE = {
  PLAYER: 'player',
  TEAM: 'team',
};

module.exports = {
  APP_ENUM,
  BASIC_CHATBOT_STATES,
  CARD_TYPE_ENUM,
  COMPONENT_TYPE_ENUM,
  ENTITIES_ROLE_ENUM,
  FIELD_GROUP_ENUM,
  FACEBOOK_STATUS_ENUM,
  FORM_DIALOG_TYPE_ENUM,
  GENDER_ENUM,
  GLOBAL_ENUM,
  CART_ITEM,
  SESSION_ENUM,
  HEADER_FLYOUT_TYPE_ENUM,
  IMAGE_ENUM,
  INVOICE_STATUS_ENUM,
  LANGUAGE_ENUM,
  LIST_ITEM_ENUM,
  LOGGER_ENUM,
  LOGIN_STATE_ENUM,
  MEMBERSHIP_LENGTH_ENUM,
  MEMBERSHIP_LENGTH_TYPE_ENUM,
  MEMBERSHIP_TYPE_ENUM,
  MESSENGER_MESSAGES_EN,
  MILLIS_TIME_ENUM,
  NOTIFICATION_ARRAY,
  NOTIFICATION_MEDIA,
  NOTIFICATION_TYPE,
  PERSON_TRANSFER_STATUS_ENUM,
  PHASE_STATUS_ENUM,
  POSITION_ENUM,
  COUPON_CODE_ENUM,
  REJECTION_ENUM,
  REPORT_TYPE_ENUM,
  ROUTES_ENUM,
  PILL_TYPE_ENUM,
  ROSTER_ROLE_ENUM,
  SCORE_SUBMISSION_CHATBOT_STATES,
  SELECT_ENUM,
  SEVERITY_ENUM,
  SIZES_ENUM,
  SOCKET_EVENT,
  SPIRIT_CATEGORY_ENUM,
  STATUS_ENUM,
  STRIPE_ERROR_ENUM,
  STRIPE_STATUS_ENUM,
  PLATEFORM_FEES,
  PLATEFORM_FEES_FIX,
  MIN_AMOUNT_FEES,
  TABS_ENUM,
  TAG_TYPE_ENUM,
  VIEW_ENUM,
  MONTH_NAMES,
  GAME_INFOS_CHATBOT_STATES,
  EVENT_TYPE,
  PHASE_TYPE_ENUM,
};
