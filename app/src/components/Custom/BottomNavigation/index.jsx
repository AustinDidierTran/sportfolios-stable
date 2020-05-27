import React, { useContext, useEffect, useState } from 'react';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import styles from './BottomNavigation.module.css';
import { Icon } from '../../Custom';
import { Badge } from '../../MUI';

import { ROUTES, goTo } from '../../../actions/goTo';
import { Store } from '../../../Store';

const TABS_ENUM = {
  HOME: 'home',
  PROFILE: 'profile',
  NOTIFICATIONS: 'notifications',
  SETTINGS: 'settings',
};

export default function CustomBottomNavigation(props) {
  const {
    state: { userInfo },
  } = useContext(Store);

  const [value, setValue] = useState(null);

  const routeEnum = {
    [TABS_ENUM.HOME]: [ROUTES.home],
    [TABS_ENUM.PROFILE]: [
      ROUTES.profile,
      { id: userInfo && userInfo.user_id },
    ],
    [TABS_ENUM.NOTIFICATIONS]: [ROUTES.notifications],
    [TABS_ENUM.SETTINGS]: [ROUTES.userSettings],
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    goTo(...routeEnum[newValue]);
  };

  const [displayNav, setDisplayNav] = useState(false);

  const handleResize = () => {
    setDisplayNav(Boolean(window.innerWidth < 768));
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [window.innerWidth]);

  return displayNav ? (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      className={styles.bottomnavigation}
    >
      <BottomNavigationAction
        label="Home"
        value={TABS_ENUM.HOME}
        icon={<Icon icon="Home" />}
      />
      <BottomNavigationAction
        label="Profile"
        value={TABS_ENUM.PROFILE}
        icon={<Icon icon="Person" />}
      />
      <BottomNavigationAction
        label="Notifications"
        value={TABS_ENUM.NOTIFICATIONS}
        icon={
          <Badge badgeContent="2" color="secondary">
            <Icon icon="Notifications" />
          </Badge>
        }
      />
      <BottomNavigationAction
        label="Settings"
        value={TABS_ENUM.SETTINGS}
        icon={<Icon icon="Settings" />}
      />
    </BottomNavigation>
  ) : (
    <></>
  );
}
