import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Store, SCREENSIZE_ENUM } from '../../../Store';
import { ROUTES, goTo } from '../../../actions/goTo';
import logo from '../../../img/logo.png';

import { AppBar, Toolbar, Typography } from '../../../components/MUI';
import { SearchInput, IconButton } from '../../../components/Custom';
import NotificationModule from './NotificationModule';

import styles from './LoggedIn.module.css';
import useStyles from './useStyles';

export default function LoggedIn() {
  const classes = useStyles();
  const {
    state: { userInfo = {}, screenSize },
  } = useContext(Store);

  if (screenSize !== SCREENSIZE_ENUM.xs) {
    return (
      <div className={classes.grow}>
        <AppBar
          position="static"
          style={{ position: 'fixed', top: 0 }}
        >
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
              <NotificationModule />
              <IconButton
                color="inherit"
                icon="Settings"
                onClick={() => goTo(ROUTES.userSettings)}
              />
              <IconButton
                color="inherit"
                icon="AccountCircle"
                onClick={() =>
                  goTo(ROUTES.entity, {
                    id: userInfo.persons[0].entity_id,
                  })
                }
              />
              <IconButton
                color="inherit"
                icon="ShoppingCartOutlined"
                onClick={() =>
                  goTo(ROUTES.cart, {
                    id: userInfo.persons[0].entity_id,
                  })
                }
              />
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
  return (
    <div className={classes.grow}>
      <AppBar position="static" className={styles.appBar}>
        <Toolbar className="toolBar">
          <div className={styles.container}>
            <div className={styles.item1}>
              <Link to={ROUTES.home} className={styles.link}>
                <img src={logo} />
              </Link>
            </div>
            <div className={styles.item2}>
              <SearchInput apiRoute="/api/data/search/previous" />
            </div>
            <div className={styles.item3}>
              <IconButton
                color="inherit"
                icon="ShoppingCartOutlined"
                onClick={() =>
                  goTo(ROUTES.cart, {
                    id: userInfo.user_id,
                  })
                }
              />
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
