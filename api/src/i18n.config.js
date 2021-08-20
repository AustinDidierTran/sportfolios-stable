import i18n from 'i18n';
import path from 'path';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

i18n.configure({
  useSuspense: true,
  locales: ['en', 'fr'],
  defaultLocale: 'fr',
  directory: path.join(__dirname, '/server/locales'),
  objectNotation: true,
  api: {
    __: 'translate',
    __n: 'translateN',
  },
});

export default i18n;
