import React, { useRef, useMemo, useEffect, useState } from 'react';
import api from '../../../../actions/api';
import NotificationList from './NotificationList';

import styles from './NotificationModule.module.css';
import { IconButton } from '../../../../components/Custom';
import { Badge } from '../../../../components/MUI';

export default function NotificationModule() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const node = useRef();

  const handleClick = e => {
    if (!node || !node.current || !node.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

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
    <div className={styles.root} ref={node}>
      <Badge badgeContent={unreadNotificationsCount} color="error">
        <IconButton
          aria-label={`show ${unreadNotificationsCount} new notifications`}
          color="inherit"
          onClick={toggleNotification}
          icon="Notifications"
        />
      </Badge>
      <NotificationList
        closeNotificationModule={closeNotificationModule}
        open={open}
        notifications={notifications}
      />
    </div>
  );
}
