import React, { useContext, useMemo } from 'react';
import {
  Badge,
  Divider,
  List,
  ListItemAvatar,
  makeStyles,
} from '@material-ui/core';
import { HEADER_FLYOUT_TYPE_ENUM } from '../../../../../../common/enums';
import { Avatar, Button, Icon } from '../../../../components/Custom';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
} from '../../../../components/MUI';
import { ACTION_ENUM, Store } from '../../../../Store';
import { getInitialsFromName } from '../../../../utils/stringFormats';
import { useTranslation } from 'react-i18next';

import styles from '../HeaderFlyout.module.css';
import { goTo, ROUTES } from '../../../../actions/goTo';

const useStyles = makeStyles({
  avatar: {
    width: '60px !important',
    height: '60px !important',
    fontSize: '24px',
  },
  noBorder: {
    border: 'none',
  },
});

export default function Plus() {
  const classes = useStyles();
  const {
    state: {
      userInfo = {},
      cart: { items },
    },
    dispatch,
  } = useContext(Store);
  const { t } = useTranslation();

  const photoUrl = useMemo(() => userInfo.primaryPerson?.photo_url, [
    userInfo.primaryPerson,
  ]);

  const nameObj = useMemo(
    () => ({
      name: userInfo.primaryPerson?.name,
      surname: userInfo.primaryPerson?.surname,
    }),
    [userInfo.primaryPerson],
  );

  const totalCartItems = useMemo(
    () => items.reduce((prev, item) => prev + item.quantity, 0),
    [items],
  );

  const handleItemClick = () => {
    dispatch({
      type: ACTION_ENUM.HEADER_FLYOUT,
      flyoutType: HEADER_FLYOUT_TYPE_ENUM.CLOSED,
    });
  };

  const handleViewProfileClick = () => {
    goTo(ROUTES.entity, { id: userInfo.primaryPerson.entity_id });
    handleItemClick();
  };
  const handleViewCartClick = () => {
    goTo(ROUTES.cart);
    handleItemClick();
  };
  const handleViewSettingsClick = () => {
    goTo(ROUTES.userSettings);
    handleItemClick();
  };
  const handleLogoutClick = () => {
    handleItemClick();
    dispatch({ type: ACTION_ENUM.LOGOUT });
  };

  const listItems = [
    {
      primary: t('cart'),
      icon: 'ShoppingCartOutlined',
      onClick: () => handleViewCartClick(),
      badgeContent: totalCartItems,
    },
    {
      primary: t('settings'),
      icon: 'Settings',
      onClick: () => handleViewSettingsClick(),
      badgeContent: 0,
    },
  ];

  return (
    <div className={styles.plusContainer}>
      <List>
        <ListItem
          className={styles.plusItem}
          button
          onClick={handleViewProfileClick}
        >
          <ListItemAvatar style={{ marginRight: '8px' }}>
            <Avatar
              className={
                photoUrl
                  ? [classes.avatar, classes.noBorder].join(' ')
                  : classes.avatar
              }
              photoUrl={photoUrl}
              initials={getInitialsFromName(nameObj)}
            />
          </ListItemAvatar>
          <ListItemText
            primary={`${nameObj.name} ${nameObj.surname}`}
            secondary={t('view_your_profile')}
          />
        </ListItem>

        <Divider className={styles.plusDivider} />

        {listItems.map((item, index) => (
          <ListItem
            key={index}
            className={styles.plusItem}
            button
            onClick={item.onClick}
          >
            <ListItemIcon>
              <Badge badgeContent={item.badgeContent} color="error">
                <Icon icon={item.icon} />
              </Badge>
            </ListItemIcon>
            <ListItemText primary={item.primary} />
          </ListItem>
        ))}

        <Divider className={styles.plusDivider} />

        <ListItem
          className={styles.plusItem}
          onClick={handleLogoutClick}
        >
          <Button
            className={styles.plusLogout}
            startIcon="Power"
            color="secondary"
          >
            {t('logout')}
          </Button>
        </ListItem>
      </List>
    </div>
  );
}
