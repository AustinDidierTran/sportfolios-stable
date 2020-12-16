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

const PLATEFORM_FEES = 0.05;
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
  TWO_TEAM_GAME: 'twoTeamGame',
  TWO_TEAM_GAME_PROFILE: 'twoTeamGameProfile',
};

const TABS_ENUM = {
  ABOUT: 'about',
  CART: 'cart',
  EDIT_EVENTS: 'editEvents',
  EDIT_PERSON_INFOS: 'editPersonInfos',
  EDIT_RANKINGS: 'editRankings',
  EDIT_RESULTS: 'editResults',
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
  DRAFT: 'draft',
  DELETED: 'deleted',
  FREE: 'free',
  OPEN: 'open',
  PAID: 'paid',
  REFUNDED: 'refunded',
  UNCOLLECTIBLE: 'uncollectible',
  VOID: 'void',
  FREE: 'free',
};

const COUPON_CODE_ENUM = {
  BECOME_MEMBER: 'become member',
};

const ROUTES_ENUM = {
  addBankAccount: '/addBankAccount',
  addPaymentMethod: '/addPaymentMethod',
  adminPanel: '/adminPanel',
  cart: '/cart',
  checkout: '/checkout',
  confirmationEmailSent: '/confirmationEmailSent/:email',
  confirmEmail: '/confirmEmail/:token',
  confirmEmailFailure: '/ConfirmEmailFailure',
  confirmEmailSuccess: '/confirmEmailSuccess',
  create: '/create',
  createOrganization: '/organization/create',
  createPerson: '/person/create',
  createTeam: '/team/create',
  entity: '/:id',
  entityNotFound: '/entityNotFound',
  eventRegistration: '/eventRegistration/:id',
  home: '/',
  importMembers: '/importMembers',
  login: '/login',
  membersList: '/membersList',
  menu: '/menu',
  mockEvent: '/mock/Event/:openTab',
  notifications: '/notifications',
  orderProcessed: '/orderProcessed',
  organizationList: '/organizationList',
  privacyPolicy: '/privacy',
  productAddedToCart: '/productAddedToCart',
  recoveryEmail: '/recoveryEmail',
  registrationStatus: '/registrationStatus',
  createReport: '/createReport',
  sales: '/sales/:id',
  scheduleInteractiveTool: '/scheduleInteractiveTool/:id',
  scheduleManager: '/scheduleManager',
  search: '/search',
  shopDetails: '/shopDetails/:id/:stripePriceId',
  stripe: '/stripe',
  transferPerson: '/transferPerson/:token',
  transferPersonExpired: '/transferPersonExpired',
  userSettings: '/userSettings',
  redirectWithToken: '/redirect',
  rosterInviteLink: '/invite/roster/:token',
};

const STATUS_ENUM = {
  ACCEPTED: 'accepted',
  ACCEPTED_FREE: 'accepted free',
  PENDING: 'pending',
  REFUSED: 'refused',
  SUCCESS: 201,
  FORBIDDEN: 403,
  ERROR: 404,
  METHOD_NOT_ALLOWED: 405,
  ERROR_STRING: 'error',
  SUCCESS_STRING: 'success',
  UNAUTHORIZED: 401,
};

const PLAYER_ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
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
  NO_REMAINING_SPOTS: 'no_remaining_spots',
  ALREADY_REGISTERED: 'already_registered',
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
  MEMBERSHIP: 'membership',
  SHOP_ITEM: 'shop_item',
};

const SOCKET_EVENT = {
  CONNECTED_USER: 'connectedUser',
  NOTIFICATIONS: 'notifications',
};

const NOTIFICATION_TYPE = {
  ADDED_TO_ROSTER: 'added to roster',
  SCORE_SUBMISSION_CONFLICT: 'score submission conflict',
  SCORE_SUBMISSION_REQUEST: 'score submission request',
  OTHER_TEAM_SUBMITTED_A_SCORE: 'other team submitted a score',
};

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

const MESSENGER_MESSAGES_EN = {
  CONNECTION_SUCCESS: {
    text:
      "You have been sign up to Sportfolios' chatbot successfuly! Come again after your next match to submit your scores",
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
      'You now need to link your Sportfolios account, please follow the following link: https://sportfolios.app/userSettings',
  },
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
  HEADER_FLYOUT_TYPE_ENUM,
  IMAGE_ENUM,
  INVOICE_STATUS_ENUM,
  LANGUAGE_ENUM,
  LIST_ITEM_ENUM,
  LOGGER_ENUM,
  LOGIN_STATE_ENUM,
  LOGO_ENUM,
  MEMBERSHIP_LENGTH_ENUM,
  MEMBERSHIP_LENGTH_TYPE_ENUM,
  MEMBERSHIP_TYPE_ENUM,
  MESSENGER_MESSAGES_EN,
  MILLIS_TIME_ENUM,
  NOTIFICATION_MEDIA,
  NOTIFICATION_TYPE,
  PERSON_TRANSFER_STATUS_ENUM,
  POSITION_ENUM,
  COUPON_CODE_ENUM,
  REJECTION_ENUM,
  REPORT_TYPE_ENUM,
  ROUTES_ENUM,
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
  TABS_ENUM,
  TAG_TYPE_ENUM,
  VIEW_ENUM,
  PLAYER_ATTENDANCE_STATUS,
  MONTH_NAMES,
  GAME_INFOS_CHATBOT_STATES,
};
