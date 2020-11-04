import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  List,
  ListSubheader,
  Paper,
} from '../../../../components/MUI';
import NotificationFactory from '../../../../components/Custom/NotificationFactory';

import styles from './NotificationModule.module.css';
import { Typography } from '../../../../components/MUI/';

export default function NotificationList(props) {
  const { closeNotificationModule, notifications, open } = props;
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
        disablePadding
      >
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <NotificationFactory
              key={index}
              {...notification}
              closeNotificationModule={closeNotificationModule}
            />
          ))
        ) : (
          <>
            <Typography align="center" variant="body2" paragraph>
              <b>{t('no_notifications')}</b>
              <br />
              {t('no_notifications_message')}
            </Typography>
          </>
        )}
      </List>
    </Paper>
  ) : (
    <></>
  );
}
