import React, { useRef, useEffect, useState } from 'react';
import api from '../../../../actions/api';
import NotificationList from './NotificationList';

import styles from './NotificationModule.module.css';
import { IconButton } from '../../../../components/Custom';
import { Badge } from '../../../../components/MUI';
import { STATUS_ENUM } from '../../../../../../common/enums';

export default function NotificationModule() {
  const [open, setOpen] = useState(false);
  const [
    unreadNotificationsCount,
    setUnreadNotificationCount,
  ] = useState(0);

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

  const toggleNotification = () => {
    api('/api/notifications/see', {
      method: 'PUT',
    });
    setOpen(!open);
  };

  const closeNotificationModule = () => setOpen(false);

  const getNotificationCount = async () => {
    const res = await api('/api/notifications/unseenCount');
    if (res.status == STATUS_ENUM.SUCCESS_STRING) {
      setUnreadNotificationCount(Number(res.data));
    }
  };

  useEffect(() => {
    getNotificationCount();
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
      <div className={styles.module}>
        <NotificationList
          closeNotificationModule={closeNotificationModule}
          open={open}
        />
      </div>
    </div>
  );
}
