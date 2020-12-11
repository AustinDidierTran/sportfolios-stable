import React, { useContext, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Store, SCREENSIZE_ENUM, ACTION_ENUM } from '../../../Store';
import { ROUTES, goTo } from '../../../actions/goTo';
import {
  LOGO_ENUM,
  SOCKET_EVENT,
  HEADER_FLYOUT_TYPE_ENUM,
} from '../../../../../common/enums';

import { AppBar, Toolbar, Typography } from '../../../components/MUI';
import {
  IconButton,
  SearchInput,
  ProfileChip,
  HeaderFlyout,
} from '../../../components/Custom';
import NotificationModule from './NotificationModule';

import styles from './LoggedIn.module.css';
import useStyles from './useStyles';
import CartIcon from '../../Cart/CartICon';
import { useTranslation } from 'react-i18next';

export default function LoggedIn(props) {
  const {
    state: { userInfo = {}, screenSize, socket },
    dispatch,
  } = useContext(Store);
  const { showBar = true } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  socket.emit(SOCKET_EVENT.CONNECTED_USER, userInfo.user_id);

  const photoUrl = useMemo(() => userInfo.primaryPerson?.photo_url, [
    userInfo.primaryPerson,
  ]);
  const nameObj = useMemo(() => {
    return {
      name: userInfo.primaryPerson?.name,
      surname: userInfo.primaryPerson?.surname,
    };
  }, [userInfo.primaryPerson]);

  const handleCreateClick = () => {
    dispatch({
      type: ACTION_ENUM.HEADER_FLYOUT,
      flyoutType: HEADER_FLYOUT_TYPE_ENUM.CREATE,
    });
  };
  const handleNotificationClick = () => {
    dispatch({
      type: ACTION_ENUM.HEADER_FLYOUT,
      flyoutType: HEADER_FLYOUT_TYPE_ENUM.NOTIFICATIONS,
    });
  };
  const handlePlusClick = () => {
    dispatch({
      type: ACTION_ENUM.HEADER_FLYOUT,
      flyoutType: HEADER_FLYOUT_TYPE_ENUM.PLUS,
    });
  };

  const refCreateEntity = useRef(null);
  const refNotifications = useRef(null);
  const refPlus = useRef(null);

  if (screenSize !== SCREENSIZE_ENUM.xs) {
    {
      return showBar ? (
        <div className={classes.grow}>
          <AppBar position="static" className={styles.appBar}>
            <Toolbar className={styles.toolbarDesktop}>
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
                <ProfileChip
                  photoUrl={photoUrl}
                  nameObj={nameObj}
                  entityId={userInfo.primaryPerson?.entity_id}
                />
                <div ref={refCreateEntity}>
                  <IconButton
                    className={styles.iconButton}
                    icon="Add"
                    size="medium"
                    onClick={handleCreateClick}
                    style={{ color: 'white' }}
                    tooltip={t('create')}
                  />
                </div>
                <div ref={refNotifications}>
                  <NotificationModule
                    className={styles.iconButton}
                    onClick={handleNotificationClick}
                  />
                </div>
                <div ref={refPlus}>
                  <IconButton
                    className={styles.iconButton}
                    icon="ArrowDropDown"
                    size="medium"
                    onClick={handlePlusClick}
                    style={{ color: 'white' }}
                    tooltip={t('plus')}
                  />
                </div>
                <HeaderFlyout
                  refCreateEntity={refCreateEntity}
                  refNotifications={refNotifications}
                  refPlus={refPlus}
                />

                {/*<IconButton
                  color="inherit"
                  icon="Settings"
                  onClick={() => goTo(ROUTES.userSettings)}
                />
                <CartIcon />*/}
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
            <div>
              <SearchInput apiRoute="/api/data/search/previous" />
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
