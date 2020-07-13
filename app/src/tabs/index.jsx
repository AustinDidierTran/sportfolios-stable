import About from './About';
import EventInfo from './EventInfo';
import Events from './Events';
import General from './General';
import Settings from './Settings';
import Shop from './Shop';
import { useTranslation } from 'react-i18next';
import { ENTITIES_ROLE_ENUM } from '../Store';

export const TABS_ENUM = {
  ABOUT: 'about',
  EVENT_INFO: 'event info',
  EVENTS: 'events',
  GENERAL: 'general',
  SHOP: 'shop',
  SETTINGS: 'settings',
};

export default function Tabs(props) {
  const { t } = useTranslation();
  const { list, role } = props;

  return list.reduce((prev, l) => {
    if (l === TABS_ENUM.ABOUT) {
      return [
        ...prev,
        {
          value: TABS_ENUM.ABOUT,
          component: About,
          label: t('about'),
          icon: 'Info',
        },
      ];
    }
    if (l === TABS_ENUM.EVENT_INFO) {
      return [
        ...prev,
        {
          value: TABS_ENUM.EVENT_INFO,
          component: EventInfo,
          label: t('info'),
          icon: 'Info',
        },
      ];
    }
    if (l === TABS_ENUM.EVENTS) {
      return [
        ...prev,
        {
          value: TABS_ENUM.EVENTS,
          component: Events,
          label: t('events'),
          icon: 'Event',
        },
      ];
    }
    if (l === TABS_ENUM.GENERAL) {
      return [
        ...prev,
        {
          value: TABS_ENUM.GENERAL,
          component: General,
          label: t('general'),
          icon: 'Folder',
        },
      ];
    }
    if (l === TABS_ENUM.SETTINGS) {
      if (role === ENTITIES_ROLE_ENUM.VIEWER) {
        return prev;
      }
      return [
        ...prev,
        {
          component: Settings,
          label: t('settings'),
          icon: 'Settings',
          value: TABS_ENUM.SETTINGS,
        },
      ];
    }
    if (l === TABS_ENUM.SHOP) {
      return [
        ...prev,
        {
          value: TABS_ENUM.SHOP,
          component: Shop,
          label: t('shop'),
          icon: 'Store',
        },
      ];
    }
  }, []);
}
