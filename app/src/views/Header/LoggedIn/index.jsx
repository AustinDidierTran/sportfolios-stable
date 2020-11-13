import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Store, SCREENSIZE_ENUM } from '../../../Store';
import { ROUTES, goTo } from '../../../actions/goTo';
import { LOGO_ENUM, SOCKET_EVENT } from '../../../../../common/enums';

import { AppBar, Toolbar, Typography } from '../../../components/MUI';
import { SearchInput, IconButton } from '../../../components/Custom';
import NotificationModule from './NotificationModule';

import styles from './LoggedIn.module.css';
import useStyles from './useStyles';
import CartIcon from '../../Cart/CartICon';

export default function LoggedIn(props) {
  const classes = useStyles();
  const {
    state: { userInfo = {}, screenSize, socket },
  } = useContext(Store);
  const { showBar = true } = props;
  socket.emit(SOCKET_EVENT.CONNECTED_USER, userInfo.user_id);
  if (screenSize !== SCREENSIZE_ENUM.xs) {
    {
      return showBar ? (
        <div className={classes.grow}>
          <AppBar position="static" className={styles.appBar}>
            <Toolbar>
              <Typography
                className={classes.title}
                variant="h6"
                noWrap
              >
                <Link to={'/'} className={classes.titleLink}>
                  Sportfolios
                </Link>
              </Typography>
              <SearchInput apiRoute="/api/data/search/previous" />
              <div className={classes.grow} />
              <div className={styles.sectionDesktop}>
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
                      id: userInfo.primaryPerson.entity_id,
                    })
                  }
                />
                <NotificationModule />
                <CartIcon />
              </div>
            </Toolbar>
          </AppBar>
        </div>
      ) : (
        <></>
      );
    }
  }
  // mobile here
  return (
    <div className={classes.grow}>
      <AppBar position="static" className={styles.appBar}>
        <Toolbar className="toolBar">
          <div className={styles.container}>
            <div className={styles.item1}>
              <Link to={ROUTES.home} className={styles.link}>
                <img
                  src={LOGO_ENUM.WHITE_ICON_180X180}
                  className={styles.img}
                />
              </Link>
            </div>
            <div className={styles.item2}>
              <SearchInput apiRoute="/api/data/search/previous" />
            </div>
            <div className={styles.item3}>
              <CartIcon />
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
