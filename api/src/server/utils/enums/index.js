const i18nbackEnd = require('../../../i18n.config');
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
  NEXT_GAME: 'next_game',
};
const MESSENGER_QUICK_REPLIES = {
  CONFIRMATION: [
    {
      content_type: 'text',
      title: i18nbackEnd.__('quick_replies.yes'),
      payload: MESSENGER_PAYLOADS.YES,
    },
    {
      content_type: 'text',
      title: i18nbackEnd.__('quick_replies.no'),
      payload: MESSENGER_PAYLOADS.NO,
    },
  ],
  SPIRIT: [
    {
      content_type: 'text',
      title: '0',
      payload: '0',
    },
    {
      content_type: 'text',
      title: '1',
      payload: '1',
    },
    {
      content_type: 'text',
      title: '2',
      payload: '2',
    },
    {
      content_type: 'text',
      title: '3',
      payload: '3',
    },
    {
      content_type: 'text',
      title: '4',
      payload: '4',
    },
  ],
  MENU_ACTIONS: [
    {
      content_type: 'text',
      title: i18nbackEnd.__('quick_replies.next_game'),
      payload: MESSENGER_PAYLOADS.NEXT_GAME,
    },
    {
      content_type: 'text',
      title: i18nbackEnd.__('quick_replies.mock'),
      payload: MESSENGER_PAYLOADS.MOCK,
    },
  ],
};

module.exports = {
  MESSENGER_QUICK_REPLIES,
  MESSENGER_PAYLOADS,
};
