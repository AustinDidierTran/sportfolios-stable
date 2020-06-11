import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Store, SCREENSIZE_ENUM } from '../../../Store';
import logo from '../../../img/logo.png';

import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
} from '../../../components/MUI';

import { SearchInput } from '../../../components/Custom';
import NotificationModule from './NotificationModule';

// Material ui icons
import AccountCircle from '@material-ui/icons/AccountCircle';
import Settings from '@material-ui/icons/Settings';

import { ROUTES, goTo } from '../../../actions/goTo';

import styles from './LoggedIn.module.css';

import useStyles from './useStyles';

export default function LoggedIn() {
  const classes = useStyles();
  const {
    state: { userInfo, screenSize },
  } = useContext(Store);

  return screenSize !== SCREENSIZE_ENUM.xs ? (
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
          <div className={styles.sectionDesktop}>
            <IconButton
              color="inherit"
              onClick={() =>
                goTo(ROUTES.entity, {
                  id: userInfo.id,
                })
              }
            >
              <AccountCircle />
            </IconButton>
            <NotificationModule />
            <IconButton
              color="inherit"
              onClick={() => goTo(ROUTES.userSettings)}
            >
              <Settings />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  ) : (
    <div className={classes.grow}>
      <AppBar position="static" style={{ position: 'fixed', top: 0 }}>
        <Toolbar
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Link to={ROUTES.home} style={{ marginRight: '16px' }}>
            <img src={logo} />
          </Link>

          <div style={{ flex: '1 0 100px' }}>
            <SearchInput />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
