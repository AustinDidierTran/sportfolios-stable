import About from './About';
import Events from './Events';
import General from './General';
import Settings from './Settings';
import Shop from './Shop';
import { useTranslation } from 'react-i18next';

export const TABS_ENUM = {
  ABOUT: 'about',
  EVENTS: 'events',
  GENERAL: 'general',
  SHOP: 'shop',
  SETTINGS: 'settings',
};

export default function Tabs(props) {
  const { t } = useTranslation();
  const { list } = props;

  return list.map(l => {
    if (l === TABS_ENUM.ABOUT) {
      return {
        value: TABS_ENUM.ABOUT,
        component: About,
        label: t('about'),
        icon: 'Info',
      };
    }
    if (l === TABS_ENUM.EVENTS) {
      return {
        value: TABS_ENUM.EVENTS,
        component: Events,
        label: t('events'),
        icon: 'Event',
      };
    }
    if (l === TABS_ENUM.GENERAL) {
      return {
        value: TABS_ENUM.GENERAL,
        component: General,
        label: t('general'),
        icon: 'Folder',
      };
    }
    if (l === TABS_ENUM.SETTINGS) {
      return {
        value: TABS_ENUM.SETTINGS,
        component: Settings,
        label: t('settings'),
        icon: 'Settings',
      };
    }
    if (l === TABS_ENUM.SHOP) {
      return {
        value: TABS_ENUM.SHOP,
        component: Shop,
        label: t('shop'),
        icon: 'Store',
      };
    }
  });
}
