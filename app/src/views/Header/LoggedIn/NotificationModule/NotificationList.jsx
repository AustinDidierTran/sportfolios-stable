import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  List,
  ListSubheader,
  Paper,
} from '../../../../components/MUI';
import NotificationFactory from '../../../../components/Custom/NotificationFactory';

import styles from './NotificationModule.module.css';

export default function NotificationList(props) {
  const { closeNotificationModule, open, notifications } = props;
  const { t } = useTranslation();

  return open ? (
    <Paper className={styles.paper}>
      <List
        subheader={
          <ListSubheader
            component="div"
            id="notification-list-subheader"
          >
            {t('notifications')}
          </ListSubheader>
        }
        disablePadding={true}
      >
        {notifications.map((notification, index) => (
          <NotificationFactory
            key={index}
            {...notification}
            closeNotificationModule={closeNotificationModule}
          />
        ))}
      </List>
    </Paper>
  ) : (
    <></>
  );
}
