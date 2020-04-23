import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import api from '../../../actions/api';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationList from './NotificationList';

import styles from './NotificationModule.module.css';

import { Badge, IconButton } from '../../../components/MUI';
import { useEffect } from 'react';

export default function NotificationModule() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const toggleNotification = () => setOpen(!open);

  const closeNotificationModule = () => setOpen(false);

  const unreadNotificationsCount = useMemo(
    () =>
      (notifications &&
        notifications.filter(n => !n.seen_at).length) ||
      0,
    [notifications],
  );

  const initializeNotifications = async () => {
    const { data } = await api('/api/notifications/all');
    setNotifications(data);
  };

  useEffect(() => {
    initializeNotifications();
  }, []);

  return (
    <div className={styles.root}>
      <IconButton
        aria-label={`show ${unreadNotificationsCount} new notifications`}
        color="inherit"
        onClick={toggleNotification}
      >
        {unreadNotificationsCount ? (
          <Badge
            badgeContent={unreadNotificationsCount}
            color="secondary"
          >
            <NotificationsIcon />
          </Badge>
        ) : (
          <NotificationsIcon />
        )}
      </IconButton>
      <NotificationList
        closeNotificationModule={closeNotificationModule}
        open={open}
        notifications={notifications}
      />
    </div>
  );
}
