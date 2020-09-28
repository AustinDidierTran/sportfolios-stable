import loadable from '@loadable/component';
import { useTranslation } from 'react-i18next';
import { ENTITIES_ROLE_ENUM } from '../Store';

const About = loadable(() => import('./About'));
const Cart = loadable(() => import('./Cart'));
const EventInfo = loadable(() => import('./EventInfo'));
const Events = loadable(() => import('./Events'));
const General = loadable(() => import('./General'));
const Settings = loadable(() => import('./Settings'));
const Purchases = loadable(() => import('./Purchases'));
const Shop = loadable(() => import('./Shop'));
const Rosters = loadable(() => import('./Rosters'));
const Schedule = loadable(() => import('./Schedule'));
const Results = loadable(() => import('./Results'));
const SwitchToAdmin = loadable(() => import('./SwitchToAdmin'));
const SwitchToUser = loadable(() => import('./SwitchToUser'));
const EditRankings = loadable(() => import('./EditRankings'));
const EditSchedule = loadable(() => import('./EditSchedule'));
const EditRosters = loadable(() => import('./EditRosters'));
const EditResults = loadable(() => import('./EditResults'));

export const TABS_ENUM = {
  ABOUT: 'about',
  CART: 'cart',
  EVENT_INFO: 'eventInfo',
  ROSTERS: 'roster',
  EVENTS: 'events',
  GENERAL: 'general',
  PURCHASES: 'purchases',
  SHOP: 'shop',
  SETTINGS: 'settings',
  SCHEDULE: 'schedule',
  RESULTS: 'results',
  SWITCH_TO_ADMIN: 'switchToAdmin',
  SWITCH_TO_USER: 'switchToUser',
  EDIT_SCHEDULE: 'editSchedule',
  EDIT_RANKINGS: 'editRankings',
  EDIT_ROSTERS: 'editRosters',
  EDIT_RESULTS: 'editResults',
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
    if (l === TABS_ENUM.RESULTS) {
      return [
        ...prev,
        {
          value: TABS_ENUM.RESULTS,
          component: Results,
          label: t('results'),
          icon: 'EmojiEvents',
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
    if (l === TABS_ENUM.SWITCH_TO_ADMIN) {
      if (
        [
          ENTITIES_ROLE_ENUM.ADMIN,
          ENTITIES_ROLE_ENUM.EDITOR,
        ].includes(role)
      ) {
        return [
          ...prev,
          {
            component: SwitchToAdmin,
            label: t('admin_view'),
            icon: 'Autorenew',
            value: TABS_ENUM.SWITCH_TO_ADMIN,
          },
        ];
      }
      return prev;
    }
    if (l === TABS_ENUM.SWITCH_TO_USER) {
      if (
        [
          ENTITIES_ROLE_ENUM.ADMIN,
          ENTITIES_ROLE_ENUM.EDITOR,
        ].includes(role)
      ) {
        return [
          ...prev,
          {
            component: SwitchToUser,
            label: t('user_view'),
            icon: 'Autorenew',
            value: TABS_ENUM.SWITCH_TO_USER,
          },
        ];
      }
      return prev;
    }
    if (l === TABS_ENUM.EDIT_SCHEDULE) {
      if (
        [
          ENTITIES_ROLE_ENUM.ADMIN,
          ENTITIES_ROLE_ENUM.EDITOR,
        ].includes(role)
      ) {
        return [
          ...prev,
          {
            component: EditSchedule,
            label: t('schedule'),
            icon: 'Assignment',
            value: TABS_ENUM.EDIT_SCHEDULE,
          },
        ];
      }
      return prev;
    }
    if (l === TABS_ENUM.EDIT_RANKINGS) {
      if (
        [
          ENTITIES_ROLE_ENUM.ADMIN,
          ENTITIES_ROLE_ENUM.EDITOR,
        ].includes(role)
      ) {
        return [
          ...prev,
          {
            component: EditRankings,
            label: t('rankings'),
            icon: 'FormatListNumbered',
            value: TABS_ENUM.EDIT_RANKINGS,
          },
        ];
      }
      return prev;
    }
    if (l === TABS_ENUM.EDIT_ROSTERS) {
      if (
        [
          ENTITIES_ROLE_ENUM.ADMIN,
          ENTITIES_ROLE_ENUM.EDITOR,
        ].includes(role)
      ) {
        return [
          ...prev,
          {
            component: EditRosters,
            label: t('rosters'),
            icon: 'Group',
            value: TABS_ENUM.EDIT_ROSTERS,
          },
        ];
      }
      return prev;
    }
    if (l === TABS_ENUM.EDIT_RESULTS) {
      if (
        [
          ENTITIES_ROLE_ENUM.ADMIN,
          ENTITIES_ROLE_ENUM.EDITOR,
        ].includes(role)
      ) {
        return [
          ...prev,
          {
            component: EditResults,
            label: t('results'),
            icon: 'EmojiEvents',
            value: TABS_ENUM.EDIT_RESULTS,
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
