import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Store, SCREENSIZE_ENUM } from '../../../Store';
import logo from '../../../img/logo.png';
import CartIcon from '../../../components/Custom/Cart';

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
    state: { userInfo = {}, screenSize },
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
          <SearchInput apiRoute="/api/data/search/previous" />
          <div className={classes.grow} />
          <div className={styles.sectionDesktop}>
            <IconButton
              color="inherit"
              onClick={() =>
                goTo(ROUTES.entity, {
                  id: userInfo.persons[0].entity_id,
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
      <AppBar position="static" className={styles.appBar}>
        <Toolbar className="toolBar">
          <Link to={ROUTES.home} className={styles.link}>
            <img src={logo} />
          </Link>
          <div className={styles.right}>
            <div className={styles.search}>
              <SearchInput apiRoute="/api/data/search/previous" />
            </div>
            <div className={styles.cart}>
              <CartIcon id={userInfo.user_id} />
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
