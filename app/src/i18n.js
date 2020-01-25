import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(LanguageDetector).init({
  resources: {
    en: {
      translations: {
        forgot_password: 'Forgot Password?',
        login: 'Login',
        no_account_signup: "Don't have an account? Signup!",
        password: 'Password',
        search: 'Search...',
        signup: 'Signup',

        username: 'Username',
      },
    },
    fr: {
      translations: {
        forgot_password: 'Mot de passe oublié?',
        login: 'Connexion',
        no_account_signup: 'Pas de compte? Inscrivez-vous!',
        password: 'Mot de passe',
        search: 'Rechercher...',
        signup: "S'enregistrer",
        username: "Nom d'utilisateur",
      },
    },
  },
  fallbackLng: 'en',
  debug: true,
  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ',',
  },

  react: {
    wait: true,
  },
});

export default i18n;
