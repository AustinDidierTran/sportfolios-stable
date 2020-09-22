import React, { useContext, useMemo, useState } from 'react';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import styles from './BottomNavigation.module.css';
import { Icon } from '../../Custom';
import { Badge } from '../../MUI';

import { OptimizelyFeature } from '@optimizely/react-sdk';
import { FEATURE_FLAGS } from '../../../../../common/flags';

import { useTranslation } from 'react-i18next';

import { ROUTES, goTo } from '../../../actions/goTo';
import { Store, SCREENSIZE_ENUM } from '../../../Store';

const TABS_ENUM = {
  HOME: 'home',
  PROFILE: 'profile',
  NOTIFICATIONS: 'notifications',
  MENU: 'menu',
};

export default function CustomBottomNavigation() {
  const { t } = useTranslation();
  const {
    state: { screenSize, userInfo },
  } = useContext(Store);

  const [value, setValue] = useState(null);

  const routeEnum = {
    [TABS_ENUM.HOME]: [ROUTES.home],
    [TABS_ENUM.PROFILE]: [
      ROUTES.entity,
      {
        id:
          userInfo &&
          userInfo.persons &&
          userInfo.persons[0].entity_id,
      },
    ],
    [TABS_ENUM.NOTIFICATIONS]: [ROUTES.notifications],
    [TABS_ENUM.MENU]: [ROUTES.menu],
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    goTo(...routeEnum[newValue]);
  };

  const displayNav = useMemo(
    () =>
      screenSize === SCREENSIZE_ENUM.xs &&
      Boolean(userInfo && userInfo.user_id),
    [screenSize, userInfo && userInfo.user_id],
  );

  return displayNav ? (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      className={styles.bottomnavigation}
    >
      <BottomNavigationAction
        label={t('home')}
        value={TABS_ENUM.HOME}
        icon={<Icon icon="Home" />}
      />
      <BottomNavigationAction
        label={t('profile')}
        value={TABS_ENUM.PROFILE}
        icon={<Icon icon="Person" />}
      />
      <OptimizelyFeature feature={FEATURE_FLAGS.NOTIFICATIONS}>
        {enabled =>
          enabled ? (
            <BottomNavigationAction
              label={t('notifications')}
              value={TABS_ENUM.NOTIFICATIONS}
              icon={
                <Badge badgeContent="2" color="secondary">
                  <Icon icon="Notifications" />
                </Badge>
              }
            />
          ) : (
            <></>
          )
        }
      </OptimizelyFeature>
      <BottomNavigationAction
        label={t('menu')}
        value={TABS_ENUM.MENU}
        icon={<Icon icon="Menu" />}
      />
    </BottomNavigation>
  ) : (
    <></>
  );
}
