import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ACTION_ENUM, Store } from '../../../Store';
import APP_ROLES from '../../App/appRoles';

import {
  AppBar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '../../../components/MUI';

import {
  NotificationModule,
  SearchInput,
} from '../../../components/Custom';

// Material ui icons
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import { formatRoute, ROUTES } from '../../../actions/goTo';

import useStyles from './useStyles';
import api from '../../../actions/api';
import { useMemo } from 'react';

export default function LoggedIn() {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    state: { userInfo },
    dispatch,
  } = useContext(Store);

  const isAdmin =
    userInfo && userInfo.app_role === APP_ROLES.APP_ADMIN;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Link
        style={{ color: 'black', textDecoration: 'none' }}
        to={formatRoute(ROUTES.profile, {
          id: userInfo && userInfo.user_id,
        })}
      >
        <MenuItem>{t('profile')}</MenuItem>
      </Link>
      <Link
        style={{ color: 'black', textDecoration: 'none' }}
        to={formatRoute(ROUTES.userSettings)}
      >
        <MenuItem>{t('user_settings')}</MenuItem>
      </Link>
      {isAdmin ? (
        <Link
          style={{ color: 'black', textDecoration: 'none' }}
          to={formatRoute(ROUTES.adminPanel)}
        >
          <MenuItem>{t('admin_panel')}</MenuItem>
        </Link>
      ) : (
        <></>
      )}
      <MenuItem
        onClick={() => dispatch({ type: ACTION_ENUM.LOGOUT })}
      >
        {t('logout')}
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static" style={{ position: 'fixed', top: 0 }}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            <Link to={'/'} className={classes.titleLink}>
              {' '}
              Sportfolios
            </Link>
          </Typography>
          <SearchInput />
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <NotificationModule />
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  );
}
