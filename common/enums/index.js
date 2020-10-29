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
};

const CARD_TYPE_ENUM = {
  CART: 'cart',
  DELETE_ENTITY: 'delete entity',
  EDITABLE_GAME: 'editable game',
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
  ADD_EDIT_EVENT_PAYMENT_OPTION: 'add edit event payment option',
  ADD_MEMBERSHIP: 'add membership',
  BECOME_MEMBER: 'become member',
  ADD_MEMBER: 'add member',
  EDIT_MEMBERSHIP: 'edit membership',
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
};

const STATUS_ENUM = {
  ACCEPTED: 'accepted',
  ACCEPTED_FREE: 'accepted free',
  PENDING: 'pending',
  REFUSED: 'refused',
  SUCCESS: 201,
  FORBIDDEN: 403,
  ERROR: 404,
  ERROR_STRING: 'error',
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

const MESSENGER_PAYLOADS = {
  GET_STARTED: 'GET_STARTED',
  START_OVER: 'START_OVER',
  STOP: 'stop',
  IGNORE: 'IGNORE',
  MOCK: 'mock',
  YES: 'yes',
  NO: 'no',
  SPIRIT_RULES: 'sr',
  SPIRIT_FOUL: 'sf',
  SPIRIT_EQUITY: 'se',
  SPIRIT_SELF_CONTROL: 'ssc',
  SPIRIT_COMMUNICATION: 'sc',
};

const CHATBOT_STATES = {
  NOT_LINKED: 0,
  HOME: 1,
  SCORE_SUBMISSION_REQUEST_SENT: 2,
  AWAITING_SCORE_SUBMISSION: 3,
  AWAITING_SCORE_SUBMISSION_CONFIRMATION: 4,
  SPIRIT_SUBMISSION_REQUEST_SENT: 5,
  AWAITING_SPIRIT_RULES: 6,
  AWAITING_SPIRIT_FOULS: 7,
  AWAITING_SPIRIT_EQUITY: 8,
  AWAITING_SPIRIT_SELF_CONTROL: 9,
  AWAITING_SPIRIT_COMMUNICATION: 10,
  AWAITING_SPIRIT_CONFIRMATION: 11,
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
  MEMBERSHIP_DETAIL: 'membership_detail',
  MEMBERSHIP: 'membership',
  SHOP_ITEM: 'shop_item',
};

const LIST_ITEM_ENUM = {
  APP_ITEM: 'app item',
  CART_ITEM: 'cart item',
  CART: 'cart',
  EVENT_CREATOR: 'event creator',
  MEMBER: 'member',
  MEMBERSHIP_DETAIL: 'membership detail',
  MEMBERSHIP_ORGANIZATION: 'membership organization',
  MEMBERSHIP: 'membership',
  PAYMENT_OPTION: 'payment option',
  PURCHASES: 'pruchases',
  RANKING_WITH_STATS: 'ranking with stats',
  RANKING: 'ranking',
  ROSTER_ITEM: 'roster item',
  SALES: 'sales',
  SHOP_ITEM: 'shop item',
  EVENT_PAYMENT_OPTION: 'event_payment_option',
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

const MESSENGER_MESSAGES_FR = {
  CONNECTION_SUCCESS: {
    text:
      'Vous êtes maintenant inscrit au chatbot Sportfolios! Revenez après votre prochaine partie pour soumettre votre score facilement.',
    quick_replies: [
      {
        content_type: 'text',
        title: 'Génial 🤩',
        payload: MESSENGER_PAYLOADS.IGNORE,
      },
      {
        content_type: 'text',
        title: 'Simuler 🚀',
        payload: MESSENGER_PAYLOADS.MOCK,
      },
    ],
  },
  CONNECTION_ERROR: {
    text:
      'Une erreur est survenue en tentant de lier votre compte, veuillez réessayer plus tard',
  },
  GET_STARTED_NO_REF: {
    text:
      'Vous devez maintenant lier votre compte Sportfolios, veuillez suivre le lien suivant et connecter le chatbot: https://sportfolios.app/userSettings',
  },
  I_DONT_UNDERSTAND: {
    text:
      "Désolé, je ne peux pas encore prendre en compte votre message pour l'instant",
  },
  REQUEST_SCORE_SUBMISSION: {
    text:
      "Bonjour Austin-Didier, votre équipe vient tout juste d'affronter l'équipe A20. Désirez-vous soumettre votre pointage ici?",
    quick_replies: [
      {
        content_type: 'text',
        title: 'Oui',
        payload: MESSENGER_PAYLOADS.YES1,
      },
      {
        content_type: 'text',
        title: 'Non',
        payload: MESSENGER_PAYLOADS.NO,
      },
    ],
  },
  SCORE_SUBMITION_EXPLAINATION: {
    text:
      'Veuillez entrer le pointage de votre partie selon le format suivant: [votre pointage]-[leur pointage]. Par exemple, pour une victoire de 13 à 10 veuillez entrer 13-10',
  },
  SCORE_SUBMISSION_VICTORY: {
    text:
      'Vous avez remporté votre partie contre A20 par le pointage de 30 à 0, est-ce bien le cas? Veuillez répondre oui pour confirmer, non pour ressoumettre votre pointage',
    quick_replies: [
      {
        content_type: 'text',
        title: 'Oui',
        payload: MESSENGER_PAYLOADS.YES2,
      },
      {
        content_type: 'text',
        title: 'Non',
        payload: MESSENGER_PAYLOADS.NO,
      },
    ],
  },
  SCORE_CONFIRMED_VICTORY: {
    text:
      'Félicitation pour votre belle victoire! Désirez-vous également soumettre votre pointage spirit?',
    quick_replies: [
      {
        content_type: 'text',
        title: 'Oui',
        payload: MESSENGER_PAYLOADS.YES3,
      },
      {
        content_type: 'text',
        title: 'Non',
        payload: MESSENGER_PAYLOADS.NO,
      },
    ],
  },
  SPIRIT_RULES: {
    text:
      'Sur une échelle de 0 à 4, 0 étant mauvais, 2 étant la moyenne et 4 étant mémorable, à combien évalueriez-vous leur connaissance et application des réglements?',
    quick_replies: [
      {
        content_type: 'text',
        title: '1',
        payload: MESSENGER_PAYLOADS.SPIRIT_RULES,
      },
      {
        content_type: 'text',
        title: '2',
        payload: MESSENGER_PAYLOADS.SPIRIT_RULES,
      },
      {
        content_type: 'text',
        title: '3',
        payload: MESSENGER_PAYLOADS.SPIRIT_RULES,
      },
      {
        content_type: 'text',
        title: '4',
        payload: MESSENGER_PAYLOADS.SPIRIT_RULES,
      },
    ],
  },
  SPIRIT_FOUL: {
    text:
      'Selon la même échelle, à combien évalueriez-vous les fautes et les contacts?',
    quick_replies: [
      {
        content_type: 'text',
        title: '1',
        payload: MESSENGER_PAYLOADS.SPIRIT_FOUL,
      },
      {
        content_type: 'text',
        title: '2',
        payload: MESSENGER_PAYLOADS.SPIRIT_FOUL,
      },
      {
        content_type: 'text',
        title: '3',
        payload: MESSENGER_PAYLOADS.SPIRIT_FOUL,
      },
      {
        content_type: 'text',
        title: '4',
        payload: MESSENGER_PAYLOADS.SPIRIT_FOUL,
      },
    ],
  },
  SPIRIT_EQUITY: {
    text:
      "Selon la même échelle, à combien évalueriez-vous l'honnêteté et l'équité?",
    quick_replies: [
      {
        content_type: 'text',
        title: '1',
        payload: MESSENGER_PAYLOADS.SPIRIT_EQUITY,
      },
      {
        content_type: 'text',
        title: '2',
        payload: MESSENGER_PAYLOADS.SPIRIT_EQUITY,
      },
      {
        content_type: 'text',
        title: '3',
        payload: MESSENGER_PAYLOADS.SPIRIT_EQUITY,
      },
      {
        content_type: 'text',
        title: '4',
        payload: MESSENGER_PAYLOADS.SPIRIT_EQUITY,
      },
    ],
  },
  SPIRIT_SELF_CONTROL: {
    text:
      "Selon la même échelle, à combien évalueriez-vous l'attitude positive et la maîtrise de soi?",
    quick_replies: [
      {
        content_type: 'text',
        title: '1',
        payload: MESSENGER_PAYLOADS.SPIRIT_SELF_CONTROL,
      },
      {
        content_type: 'text',
        title: '2',
        payload: MESSENGER_PAYLOADS.SPIRIT_SELF_CONTROL,
      },
      {
        content_type: 'text',
        title: '3',
        payload: MESSENGER_PAYLOADS.SPIRIT_SELF_CONTROL,
      },
      {
        content_type: 'text',
        title: '4',
        payload: MESSENGER_PAYLOADS.SPIRIT_SELF_CONTROL,
      },
    ],
  },
  SPIRIT_COMMUNICATION: {
    text:
      'Selon la même échelle, à combien évalueriez-vous la communication?',
    quick_replies: [
      {
        content_type: 'text',
        title: '1',
        payload: MESSENGER_PAYLOADS.SPIRIT_COMMUNICATION,
      },
      {
        content_type: 'text',
        title: '2',
        payload: MESSENGER_PAYLOADS.SPIRIT_COMMUNICATION,
      },
      {
        content_type: 'text',
        title: '3',
        payload: MESSENGER_PAYLOADS.SPIRIT_COMMUNICATION,
      },
      {
        content_type: 'text',
        title: '4',
        payload: MESSENGER_PAYLOADS.SPIRIT_COMMUNICATION,
      },
    ],
  },
  SPIRIT_CONFIRMATION: {
    text:
      "Voici le sommaire de l'esprit sportif:\n\nConnaissance et application des réglements: 2/4\nFautes et contacts: 3/4\nHonnêteté et équité: 3/4\nAttitude positive et maîtrise de soi: 2/4\nCommunication: 2/4\n\nTotal: 12/20\n\nEst-ce que vous voulez confirmer l'envoi?",
    quick_replies: [
      {
        content_type: 'text',
        title: 'Oui',
        payload: MESSENGER_PAYLOADS.YES4,
      },
      {
        content_type: 'text',
        title: 'Non',
        payload: MESSENGER_PAYLOADS.NO,
      },
    ],
  },
  SUBMIT_CONFIRMATION: {
    text:
      'Le tout a été envoyé avec succès. Merci et à la prochaine!',
    quick_replies: [
      {
        content_type: 'text',
        title: 'Génial 🤩',
        payload: MESSENGER_PAYLOADS.IGNORE,
      },
      {
        content_type: 'text',
        title: 'Simuler 🚀',
        payload: MESSENGER_PAYLOADS.MOCK,
      },
    ],
  },
};

module.exports = {
  CARD_TYPE_ENUM,
  COMPONENT_TYPE_ENUM,
  ENTITIES_ROLE_ENUM,
  GENDER_ENUM,
  GLOBAL_ENUM,
  LIST_ITEM_ENUM,
  IMAGE_ENUM,
  INVOICE_STATUS_ENUM,
  LANGUAGE_ENUM,
  LOGGER_ENUM,
  LOGIN_STATE_ENUM,
  LOGO_ENUM,
  MEMBERSHIP_LENGTH_ENUM,
  MEMBERSHIP_TYPE_ENUM,
  POSITION_ENUM,
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
  APP_ENUM,
  MEMBERSHIP_LENGTH_TYPE_ENUM,
  MESSENGER_PAYLOADS,
  MESSENGER_MESSAGES_EN,
  MESSENGER_MESSAGES_FR,
  CHATBOT_STATES,
};
