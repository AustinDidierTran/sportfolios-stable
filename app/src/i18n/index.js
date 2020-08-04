import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './en';
import fr from './fr';
import moment from 'moment';

i18n.use(LanguageDetector).init({
  resources: {
    en,
    fr,
  },
  fallbackLng: 'en',
  debug: true,
  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',
  keySeparator: '.', // we use content as keys
  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ',',
    format: function(value, format, lng) {
      if (moment.isMoment(value)) {
        return moment(value)
          .locale(lng)
          .format(format);
      }
      return value;
    },
  },

  react: {
    wait: true,
  },
});

export default i18n;
