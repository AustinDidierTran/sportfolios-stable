const i18n = require('i18n'),
  path = require('path');

i18n.configure({
  locales: ['en_US', 'fr_FR', 'fr_CA'],
  defaultLocale: 'fr_CA',
  directory: path.join(__dirname, '/server/locales'),
  objectNotation: true,
  api: {
    __: 'translate',
    __n: 'translateN',
  },
});

module.exports = i18n;
