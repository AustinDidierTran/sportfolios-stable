import loadable from '@loadable/component';
import { useTranslation } from 'react-i18next';
import { TABS_ENUM } from '../../../common/enums';
import { ENTITIES_ROLE_ENUM } from '../Store';

const About = loadable(() => import('./About'));
const Cart = loadable(() => import('./Cart'));
const EditPersonInfos = loadable(() => import('./EditPersonInfos'));
const EditRankings = loadable(() => import('./EditRankings'));
const EditResults = loadable(() => import('./EditResults'));
const EditRosters = loadable(() => import('./EditRosters'));
const EditSchedule = loadable(() => import('./EditSchedule'));
const EventInfo = loadable(() => import('./EventInfo'));
const Events = loadable(() => import('./Events'));
const General = loadable(() => import('./General'));
const Purchases = loadable(() => import('./Purchases'));
const Rankings = loadable(() => import('./Rankings'));
const Results = loadable(() => import('./Results'));
const Rosters = loadable(() => import('./Rosters'));
const Schedule = loadable(() => import('./Schedule'));
const Settings = loadable(() => import('./Settings'));
const Shop = loadable(() => import('./Shop'));
const EditEvents = loadable(() => import('./EditEvents'));

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
    if (l === TABS_ENUM.RANKINGS) {
      return [
        ...prev,
        {
          value: TABS_ENUM.RANKINGS,
          component: Rankings,
          label: t('rankings'),
          icon: 'FormatListNumbered',
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
    if (l === TABS_ENUM.EDIT_PERSON_INFOS) {
      if (
        [
          ENTITIES_ROLE_ENUM.ADMIN,
          ENTITIES_ROLE_ENUM.EDITOR,
        ].includes(role)
      ) {
        return [
          ...prev,
          {
            component: EditPersonInfos,
            label: t('edit_infos'),
            icon: 'Edit',
            value: TABS_ENUM.EDIT_PERSON_INFOS,
          },
        ];
      }
      return prev;
    }
    if (l === TABS_ENUM.EDIT_EVENTS) {
      if (
        [
          ENTITIES_ROLE_ENUM.ADMIN,
          ENTITIES_ROLE_ENUM.EDITOR,
        ].includes(role)
      ) {
        return [
          ...prev,
          {
            component: EditEvents,
            label: t('events'),
            icon: 'Event',
            value: TABS_ENUM.EDIT_EVENTS,
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
