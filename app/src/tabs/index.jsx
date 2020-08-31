import About from './About';
import Cart from './Cart';
import EventInfo from './EventInfo';
import Events from './Events';
import General from './General';
import Settings from './Settings';
import Purchases from './Purchases';
import Shop from './Shop';
import Rosters from './Rosters';
import Schedule from './Schedule';
import { useTranslation } from 'react-i18next';
import { ENTITIES_ROLE_ENUM } from '../Store';

export const TABS_ENUM = {
  ABOUT: 'about',
  CART: 'cart',
  EVENT_INFO: 'event info',
  ROSTERS: 'roster',
  EVENTS: 'events',
  GENERAL: 'general',
  PURCHASES: 'purchases',
  SHOP: 'shop',
  SETTINGS: 'settings',
  SCHEDULE: 'schedule',
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
    if (l === TABS_ENUM.CART) {
      return [
        ...prev,
        {
          value: TABS_ENUM.CART,
          component: Cart,
          label: t('cart'),
          icon: 'ShoppingCartOutlined',
        },
      ];
    }
    if (l === TABS_ENUM.PURCHASES) {
      return [
        ...prev,
        {
          value: TABS_ENUM.PURCHASES,
          component: Purchases,
          label: t('purchases'),
          icon: 'Store',
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
    if (l === TABS_ENUM.ROSTERS) {
      return [
        ...prev,
        {
          value: TABS_ENUM.ROSTERS,
          component: Rosters,
          label: t('rosters'),
          icon: 'Group',
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
    if (l === TABS_ENUM.SCHEDULE) {
      return [
        ...prev,
        {
          value: TABS_ENUM.SCHEDULE,
          component: Schedule,
          label: t('schedule'),
          icon: 'Assignment',
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
      if (
        [
          ENTITIES_ROLE_ENUM.ADMIN,
          ENTITIES_ROLE_ENUM.EDITOR,
        ].includes(role)
      ) {
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
      return prev;
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
