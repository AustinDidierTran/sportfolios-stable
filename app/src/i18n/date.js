import moment from 'moment';

const date = {
  /**
   * Load library, setting its initial locale
   *
   * @param {string} locale
   * @return Promise
   */
  init(locale) {
    // moment defaults to English and will throw an
    // error if we attempt to explicitly import 'en'
    if (locale === 'en') {
      return Promise.resolve();
    }

    // we load moment's l10n dynamically based on the
    // given locale, so that we don't have to statically
    // load all supported locales at the top of the
    // file
    return new Promise((resolve, reject) => {
      import(`moment/locale/${locale}`)
        .then(() => {
          moment.locale(locale);
          resolve();
        })
        .catch(err => reject(err));
    });
  },

  /**
   * @param {Date} date
   * @param {string} format
   * @return {string}
   */
  format(date, format) {
    return moment(date).format(format);
  },
};

export default date;
