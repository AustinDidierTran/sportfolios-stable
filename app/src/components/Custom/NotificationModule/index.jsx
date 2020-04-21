import React, { useMemo, useState } from 'react';

import api from '../../../actions/api';
import NotificationsIcon from '@material-ui/icons/Notifications';

import styles from './NotificationModule.module.css';

import {
  Badge,
  IconButton,
  List,
  Paper,
} from '../../../components/MUI';
import { useEffect } from 'react';

export default function NotificationModule(props) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const toggleNotification = () => setOpen(!open);

  const unreadNotificationsCount = useMemo(
    () => notifications.filter(n => !n.seen_at).length,
    [notifications],
  );

  // const listItems = useMemo(() => notifications.map({}), [
  //   notifications,
  // ]);

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
      <Paper className={styles.paper}>
        <List></List>
      </Paper>
    </div>
  );
}
